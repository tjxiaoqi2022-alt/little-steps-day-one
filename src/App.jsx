import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Star, Check, Ear, BookOpen, Gamepad2, RotateCcw, Home, Music2, Footprints, LockKeyhole } from 'lucide-react';
import { courses, getCourse, getNextCourse } from './content/index.js';
import { asset } from './asset.js';
import { useAudio } from './audio.js';
import { Art, Next, Heading, Activity } from './activities.jsx';
import { completeCourse, isCompleted, isCourseUnlocked, loadProgress, recommendedCourse, saveProgress } from './progress.js';

const sectionIcons = { hello: Sparkles, review: RotateCcw, watch: Footprints, quiz: Ear, phonics: Music2, blending: Gamepad2, story: BookOpen };
const routeId = () => new URLSearchParams(window.location.search).get('day');

function LessonsHome({ progress, onSelect }) {
  const recommended = recommendedCourse(courses, progress);
  return <main className="lessons-home">
    <div className="home-hero"><span className="eyebrow">LITTLE STEPS</span><h1>Choose a lesson</h1><p>One happy step at a time.</p></div>
    <div className="lesson-grid">{courses.map((course, index) => {
      const done = isCompleted(progress, course.id);
      const unlocked = isCourseUnlocked(courses, index, progress);
      const next = recommended?.id === course.id && !done;
      return <button key={course.id} className={`lesson-card theme-${course.theme} ${done ? 'done' : ''}`} disabled={!unlocked} onClick={() => onSelect(course.id)}>
        <span className="lesson-number">{done ? <Check/> : unlocked ? <Star/> : <LockKeyhole/>}</span>
        <span className="lesson-day">Day {course.number}</span>
        <span className="lesson-status">{done ? 'Complete!' : next ? 'Next lesson' : unlocked ? 'Ready' : 'Finish Day 1 first'}</span>
      </button>;
    })}</div>
    <Art item={{ image: asset('images/actions.webp'), frame: '100% 100%', alt: 'A friendly chick waving' }} className="lessons-mascot"/>
  </main>;
}

function Finish({ course, progress, onReplay, onLessons, onNext }) {
  const nextCourse = getNextCourse(course.id);
  const commandNames = course.completion.commands.map(id => course.commands.find(item => item.id === id)?.text).filter(Boolean);
  return <div className="finish">
    <div className="trophy" aria-hidden="true"><Star fill="currentColor" size={66}/></div>
    <Heading title={course.completion.title}>Great job!</Heading>
    <div className="reward-row">
      {course.completion.sounds.map(id => <span className="reward-chip sound-reward" key={id}>{course.phonics.find(item => item.id === id)?.letter}<Check/></span>)}
      {course.completion.words?.map(word => <span className="reward-chip word-reward" key={word}>{word}<Star/></span>)}
    </div>
    <div className="command-summary">{commandNames.map(text => <span key={text}><Check size={18}/>{text}</span>)}</div>
    <div className="finish-actions">
      {nextCourse && <button className="primary" onClick={() => onNext(nextCourse.id)}>Continue to Day {nextCourse.number}</button>}
      <button className="secondary" onClick={onReplay}><RotateCcw/>Play Day {course.number} again</button>
      <button className="text-button" onClick={onLessons}><Home/>Back to Lessons</button>
    </div>
  </div>;
}

export default function App() {
  const [courseId, setCourseId] = useState(routeId);
  const [stage, setStage] = useState(-1);
  const [completed, setCompleted] = useState([]);
  const [progress, setProgress] = useState(loadProgress);
  const audio = useAudio();
  const titleRef = useRef(null);
  const requestedCourse = getCourse(courseId);
  const courseIndex = courses.findIndex(item => item.id === courseId);
  const course = requestedCourse && isCourseUnlocked(courses, courseIndex, progress) ? requestedCourse : null;
  const section = course && stage >= 0 && stage < course.sections.length ? course.sections[stage] : null;
  const state = useRef({ course, stage, completed });
  state.current = { course, stage, completed };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    titleRef.current?.focus({ preventScroll: true });
  }, [courseId, stage]);
  useEffect(() => {
    const onPop = () => { audio.stop(); setCourseId(routeId()); setStage(-1); setCompleted([]); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [audio.stop]);
  useEffect(() => {
    document.title = course ? `Little Steps — Day ${course.number}` : 'Little Steps — Lessons';
  }, [course]);
  useEffect(() => {
    if (!document.modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    try { Promise.resolve(document.modelContext.registerTool({ name: 'read_lesson_progress', description: 'Read the current lesson and saved completion progress.', annotations: { readOnlyHint: true }, inputSchema: { type: 'object', properties: {}, additionalProperties: false }, execute(input) { if (!input || typeof input !== 'object' || Object.keys(input).length) throw new Error('Expected an empty object'); const value = state.current; return { course: value.course?.id || 'lessons', stage: value.stage, completedSections: value.completed }; } }, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Optional browser capability. */ }
    return () => lifecycle.abort();
  }, []);

  function setRoute(id) {
    const url = id ? `${window.location.pathname}?day=${id}` : window.location.pathname;
    window.history.pushState({}, '', url);
    setCourseId(id); setStage(-1); setCompleted([]); audio.stop();
  }
  function selectCourse(id) {
    const index = courses.findIndex(item => item.id === id);
    if (!isCourseUnlocked(courses, index, progress)) return;
    const next = saveProgress({ ...progress, lastCourse: id });
    setProgress(next); setRoute(id);
  }
  function completeSection() {
    setCompleted(previous => [...new Set([...previous, stage])]);
    audio.stop();
    if (stage + 1 === course.sections.length) {
      const next = saveProgress(completeCourse(progress, course.id));
      setProgress(next); setStage(course.sections.length);
    } else setStage(stage + 1);
  }
  function restart() { audio.stop(); setCompleted([]); setStage(-1); }

  return <div className={`app ${course ? `theme-${course.theme}` : 'home-screen'}`}>
    <header className="brand"><span className="brand-icon"><Sparkles size={25}/></span>little steps{course && <><span className="day-badge">DAY {course.number}</span><button className="home-button" aria-label="Back to Lessons" onClick={() => setRoute(null)}><Home size={22}/></button></>}</header>
    {!course && <LessonsHome progress={progress} onSelect={selectCourse}/>}
    {course && stage >= 0 && stage < course.sections.length && <nav className="journey" aria-label="Lesson progress">{course.sections.map((item, index) => { const Icon = sectionIcons[item.type] || Star; return <span key={item.id} className={`step ${stage === index ? 'current' : ''} ${completed.includes(index) ? 'complete' : ''}`} aria-label={item.navLabel} aria-current={stage === index ? 'step' : undefined}>{completed.includes(index) ? <Check/> : <Icon/>}</span>; })}</nav>}
    {course && <main className={stage === -1 ? 'welcome' : 'lesson'} ref={titleRef} tabIndex={-1} key={`${course.id}-${stage}`}>
      {stage === -1 && <><span className="eyebrow">DAY {course.number}</span><h1>{course.greeting}</h1><Art item={{ image: asset('images/actions.webp'), frame: '100% 100%', alt: 'A friendly chick waving hello' }} className="hello-art"/><Next onClick={() => setStage(0)}>Let’s go!</Next><div className="welcome-dots" aria-hidden="true"><Star/><Star/><Star/></div></>}
      {section && <Activity key={section.id} course={course} section={section} audio={audio} onDone={completeSection}/>}
      {stage === course.sections.length && <Finish course={course} progress={progress} onReplay={restart} onLessons={() => setRoute(null)} onNext={selectCourse}/>}
    </main>}
    {audio.error && <div className="audio-error" role="alert">Sound didn’t play. Tap the speaker to try again.</div>}
    {course && stage >= 0 && <footer><span><Star size={15}/>Every little step counts.</span><a href={asset('credits.html')} target="_blank" rel="noreferrer">Credits</a></footer>}
  </div>;
}
