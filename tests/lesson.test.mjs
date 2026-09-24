import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { makeChoices } from '../src/lesson.js';
import { courses, getNextCourse } from '../src/content/index.js';
import { completeCourse, isCourseUnlocked, loadProgress, PROGRESS_KEY, saveProgress } from '../src/progress.js';

const assetPath = value => new URL(`../public${value}`, import.meta.url);

test('course registry stays ordered and computes the next lesson', () => {
  assert.deepEqual(courses.map(course => course.id), ['day-1', 'day-2']);
  assert.equal(getNextCourse('day-1')?.id, 'day-2');
  assert.equal(getNextCourse('day-2'), null);
});

test('every course section references known content and bundled audio', () => {
  for (const course of courses) {
    const commandIds = new Set(course.commands.map(item => item.id));
    const soundIds = new Set(course.phonics.map(item => item.id));
    for (const item of [...course.commands, ...course.phonics]) {
      for (const key of ['image', 'audio']) if (item[key]) {
        assert.ok(existsSync(assetPath(item[key])), `Missing ${item[key]}`);
        assert.ok(statSync(assetPath(item[key])).size > 1000, `Empty asset ${item[key]}`);
      }
    }
    for (const section of course.sections) {
      for (const id of section.commands || []) assert.ok(commandIds.has(id), `${course.id}: unknown command ${id}`);
      for (const id of section.letters || []) assert.ok(soundIds.has(id), `${course.id}: unknown sound ${id}`);
      for (const id of section.order || []) assert.ok(commandIds.has(id) || soundIds.has(id), `${course.id}: unknown answer ${id}`);
      for (const page of section.pages || []) assert.ok(existsSync(assetPath(page.audio)), `Missing story audio ${page.audio}`);
      for (const word of section.words || []) {
        assert.ok(existsSync(assetPath(word.audio)), `Missing word audio ${word.audio}`);
        for (const id of word.letters) assert.ok(soundIds.has(id), `${course.id}: unknown blend sound ${id}`);
      }
      if (section.audio) assert.ok(existsSync(assetPath(section.audio)), `Missing section audio ${section.audio}`);
    }
  }
  assert.deepEqual(courses[0].commands.map(item => item.id), ['stand', 'sit', 'look']);
  assert.deepEqual(courses[0].phonics.map(item => item.letter), ['s', 'a']);
  assert.ok(!courses[0].sections.some(section => section.type === 'blending'));
  assert.deepEqual(courses[1].phonics.map(item => item.letter), ['s', 'a', 't']);
  assert.ok(courses[1].sections.some(section => section.type === 'blending'));
});

test('command quizzes include the answer with unique choices', () => {
  for (const course of courses) for (const section of course.sections.filter(item => item.type === 'quiz')) {
    const pool = section.commands.map(id => course.commands.find(item => item.id === id));
    section.order.forEach((id, index) => {
      const options = makeChoices(pool, id, index);
      assert.equal(new Set(options.map(item => item.id)).size, options.length);
      assert.ok(options.some(item => item.id === id));
      assert.ok(options.length <= 3);
    });
  }
});

test('completion persists and unlocks the next course after refresh', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  let progress = loadProgress(storage);
  assert.equal(isCourseUnlocked(courses, 1, progress), false);
  progress = saveProgress(completeCourse(progress, 'day-1'), storage);
  assert.ok(values.has(PROGRESS_KEY));
  const refreshed = loadProgress(storage);
  assert.ok(refreshed.completedDays.includes('day-1'));
  assert.equal(isCourseUnlocked(courses, 1, refreshed), true);
});
