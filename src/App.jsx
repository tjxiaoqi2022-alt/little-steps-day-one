import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Star, Check, Eye, Ear, BookOpen, Gamepad2, RotateCcw, Home, Music2 } from 'lucide-react';
import { currentCourse as course } from './content';
import { asset } from './asset';
import { useAudio } from './audio';
import { Art, Next, Heading, Watch, Quiz, Phonics, Play, Story } from './activities';

const stages = [
  { name: 'Watch', icon: Eye }, { name: 'Listen', icon: Ear },
  { name: 'Phonics', icon: Music2 }, { name: 'Play', icon: Gamepad2 }, { name: 'Story', icon: BookOpen },
];

export default function App() {
  const [stage, setStage] = useState(-1);
  const [completed, setCompleted] = useState([]);
  const audio = useAudio();
  const state = useRef({ stage, completed }); state.current = { stage, completed };
  const titleRef = useRef(null);
  useEffect(() => { titleRef.current?.focus(); }, [stage]);
  useEffect(() => {
    if (!document.modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    try { Promise.resolve(document.modelContext.registerTool({ name: 'read_lesson_progress', description: 'Read the current lesson stage and completed activities.', annotations: { readOnlyHint: true }, inputSchema: { type: 'object', properties: {}, additionalProperties: false }, execute(input) { if (!input || typeof input !== 'object' || Object.keys(input).length) throw new Error('Expected an empty object'); return { course: course.id, stage: state.current.stage === -1 ? 'welcome' : state.current.stage === 5 ? 'complete' : stages[state.current.stage].name, completed: state.current.completed.map(i => stages[i].name) }; } }, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Optional browser capability. */ }
    return () => lifecycle.abort();
  }, []);
  function navigate(next) { audio.stop(); setStage(next); }
  function complete() { setCompleted(previous => [...new Set([...previous, stage])]); navigate(stage + 1); }
  function restart() { setCompleted([]); navigate(-1); }
  const props = { course, audio, onDone: complete };
  return <div className={`app ${stage === -1 ? 'home-screen' : ''}`}><header className="brand"><span className="brand-icon"><Sparkles size={25}/></span>little steps<span className="day-badge">DAY {course.number}</span>{stage >= 0 && <button className="home-button" aria-label="Return to welcome" onClick={() => navigate(-1)}><Home size={22}/></button>}</header>
    {stage >= 0 && stage < stages.length && <nav className="journey" aria-label="Lesson activities">{stages.map(({ name, icon: Icon }, i) => <button key={name} className={`step ${stage === i ? 'current' : ''} ${completed.includes(i) ? 'complete' : ''}`} disabled={i > (completed.length ? Math.max(...completed) + 1 : 0)} onClick={() => navigate(i)} aria-current={stage === i ? 'step' : undefined}><span className="step-icon">{completed.includes(i) && i !== stage ? <Check size={21}/> : <Icon size={21}/>}</span><span>{name}</span></button>)}</nav>}
    <main className={stage === -1 ? 'welcome' : 'lesson'} ref={titleRef} tabIndex={-1} key={stage}>
      {stage === -1 && <><h1>{course.greeting}</h1><Art item={{ image: asset('images/actions.webp'), frame: '100% 100%', alt: 'A friendly chick waving hello' }} className="hello-art"/><Next onClick={() => navigate(0)}>Let’s go!</Next><div className="welcome-dots" aria-hidden="true"><Star/><Star/><Star/></div></>}
      {stage === 0 && <Watch {...props}/>}{stage === 1 && <Quiz {...props}/>}{stage === 2 && <Phonics {...props}/>}{stage === 3 && <Play {...props}/>}{stage === 4 && <Story {...props}/>}
      {stage === 5 && <div className="finish"><div className="trophy" aria-hidden="true"><Star fill="currentColor" size={66}/></div><Heading eyebrow={`DAY ${course.number} COMPLETE`} title="You did it!">A big high five for you!</Heading><div className="earned-letters">{course.phonics.map(p => <span key={p.id}>{p.letter}<Check size={18}/></span>)}</div><div className="checklist">{stages.map(({ name }) => <span key={name}><Check size={20}/>{name}</span>)}</div><div className="command-summary">{course.commands.map(c => <span key={c.id}><Check size={16}/>{c.text}</span>)}</div><button className="primary" onClick={restart}><RotateCcw size={22}/>Play again</button></div>}
    </main>{audio.error && <div className="audio-error" role="alert">Sound didn’t play. Tap the speaker to try again.</div>}
    {stage >= 0 && <footer><span><Star size={15}/>Every little step counts.</span><a href={asset('credits.html')} target="_blank" rel="noreferrer">Credits</a></footer>}
  </div>;
}

