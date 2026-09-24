import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { makeChoices } from '../src/lesson.js';
import course from '../src/content/day1.js';

test('every listening round has three unique options including the correct picture', () => {
  const positions = new Set();
  course.listeningOrder.forEach((id, index) => {
    const options = makeChoices(course.commands, id, index);
    assert.equal(options.length, 3); assert.equal(new Set(options.map(c => c.id)).size, 3);
    assert.equal(options.filter(c => c.id === id).length, 1);
    positions.add(options.findIndex(c => c.id === id));
  });
  assert.equal(positions.size, 3);
});
test('all course references resolve to bundled, nonempty assets and known letters', () => {
  for (const item of [...course.commands, ...course.phonics, ...course.story]) {
    for (const key of ['image', 'audio']) if (item[key]) {
      const path = new URL(`../public${item[key]}`, import.meta.url);
      assert.ok(existsSync(path), `Missing ${item[key]}`);
      assert.ok(statSync(path).size > 1000, `Empty asset ${item[key]}`);
    }
  }
  for (const id of [...course.phonicsOrder, ...course.playSequence]) assert.ok(course.phonics.some(p => p.id === id));
  assert.deepEqual(course.phonics.map(p => p.sound), ['/s/', '/æ/']);
});
