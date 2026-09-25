import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Volume2, Star, Check, Ear, Sparkles } from 'lucide-react';
import { makeChoices } from './lesson.js';
import { asset } from './asset.js';

const byIds = (items, ids) => ids.map(id => items.find(item => item.id === id)).filter(Boolean);

export function Art({ item, className = '' }) {
  const scene = item.scene ? `scene-${item.scene}` : '';
  return item.frame ? <div className={`art ${scene} ${className}`} role="img" aria-label={item.alt || item.text} style={{ backgroundImage: `url(${item.image})`, backgroundPosition: item.frame }}/>
    : <img className={`art image ${scene} ${className}`} src={item.image} alt={item.alt || item.text}/>;
}

export function Next({ onClick, disabled, children = 'Next' }) {
  return <button className="primary" onClick={onClick} disabled={disabled}>{children}<ArrowRight size={23}/></button>;
}

function Dots({ total, current }) {
  return <div className="dots" aria-label={`Item ${current + 1} of ${total}`}>{Array.from({ length: total }, (_, index) => <span key={index} className={index === current ? 'active' : index < current ? 'done' : ''}/>)}</div>;
}

export function Sound({ onClick, playing, label = 'Listen', disabled = false }) {
  return <button className={`sound-button ${playing ? 'playing' : ''}`} onClick={onClick} disabled={disabled} aria-label={playing ? `Replay ${label}` : label}><Volume2 size={27}/><span>{playing ? 'Playing…' : label}</span></button>;
}

export function Heading({ eyebrow, title, children }) {
  return <div className="heading">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{children && <p>{children}</p>}</div>;
}

function Feedback({ status }) {
  return <div className={`feedback ${status}`} role="status" aria-live="polite">{status === 'correct' ? <><Check/>Great!</> : status === 'retry' ? <><Ear/>Let’s listen again.</> : <>&nbsp;</>}</div>;
}

export function HelloAgain({ section, course, audio, onDone }) {
  const [heard, setHeard] = useState(false);
  return <><Heading title={section.title}/><section className="hello-again-card">
    <Art item={{ image: asset('images/actions.webp'), frame: '100% 100%', alt: 'The Little Steps chick says hello again' }} className={audio.playing ? 'wiggle' : ''}/>
    <div className="hello-bubbles"><strong>{section.title}</strong>{section.lines.map(line => <span key={line}>{line}</span>)}</div>
    <Sound label="Listen" playing={audio.playing} onClick={async () => { if (await audio.play(section)) setHeard(true); }}/>
  </section><div className="center-next"><Next disabled={!heard} onClick={onDone}>Let’s go!</Next></div></>;
}

export function Watch({ course, section, audio, onDone }) {
  const items = byIds(course.commands, section.commands);
  const [index, setIndex] = useState(0);
  const [heard, setHeard] = useState(false);
  const item = items[index];
  const revealed = !section.revealOnHear || heard;
  return <><Heading title={section.title}>{section.prompt}</Heading>
    <section className={`watch-card ${revealed ? '' : 'waiting-to-reveal'}`}><div className="picture-wrap"><span className="card-number">{index + 1}</span>{revealed ? <Art item={item} className={audio.playing ? 'wiggle' : ''}/> : <Ear className="waiting-ear"/>}<span className="picture-star" aria-hidden="true">✦</span></div>
    <div className="watch-copy"><span className="mini-label">YOUR TURN!</span>{revealed && <h2>{item.text}</h2>}<Sound playing={audio.playing} label={heard ? 'Listen again' : 'Listen'} onClick={async () => { if (await audio.play(item)) setHeard(true); }}/><p className="action-note">Move with me <Sparkles size={17}/></p></div></section>
    <div className="lesson-bottom"><button className="back-button" disabled={index === 0} onClick={() => { audio.stop(); setHeard(false); setIndex(index - 1); }}><ArrowLeft/>Back</button><Dots total={items.length} current={index}/><Next disabled={!heard} onClick={() => { audio.stop(); if (index + 1 === items.length) onDone(); else { setIndex(index + 1); setHeard(false); } }}/></div></>;
}

export function Quiz({ course, section, audio, onDone }) {
  const phonicsMode = section.kind === 'phonics';
  const pool = byIds(phonicsMode ? course.phonics : course.commands, phonicsMode ? section.letters : section.commands);
  const [index, setIndex] = useState(0);
  const [heard, setHeard] = useState(false);
  const [status, setStatus] = useState('');
  const [wrong, setWrong] = useState(null);
  const answer = pool.find(item => item.id === section.order[index]);
  const choices = useMemo(() => phonicsMode ? pool : makeChoices(pool, answer.id, index), [pool, answer.id, index, phonicsMode]);
  function choose(id) {
    if (!heard || status === 'correct') return;
    if (id === answer.id) { setStatus('correct'); setWrong(null); audio.play({ audio: asset('audio/great.mp3'), text: 'Great!' }); }
    else { setStatus('retry'); setWrong(id); audio.play(answer); }
  }
  return <><Heading title={section.title || (phonicsMode ? 'Which sound?' : 'Listen and tap')}/>
    <Sound label="Play sound" playing={audio.playing} onClick={async () => { if (await audio.play(answer)) setHeard(true); }}/>
    <div className={`choices ${phonicsMode ? 'letters' : ''}`}>{choices.map((item, choiceIndex) => <button key={item.id} aria-label={phonicsMode ? `Letter ${item.letter}` : `Picture ${choiceIndex + 1}`} className={`choice ${item.color || ''} ${status === 'correct' && item.id === answer.id ? 'chosen' : ''} ${wrong === item.id ? 'try-again' : ''}`} disabled={!heard || status === 'correct'} onClick={() => choose(item.id)}>
      {phonicsMode ? <span className="big-letter">{item.letter}</span> : <><Art item={item}/><span className="choice-number" aria-hidden="true">{choiceIndex + 1}</span></>}{status === 'correct' && item.id === answer.id && <span className="correct-badge"><Check/></span>}
    </button>)}</div><Feedback status={status}/><div className="quiz-bottom"><Dots total={section.order.length} current={index}/><Next disabled={status !== 'correct'} onClick={() => { audio.stop(); if (index + 1 === section.order.length) onDone(); else { setIndex(index + 1); setHeard(false); setStatus(''); setWrong(null); } }}/></div></>;
}

export function QuickReview({ course, section, audio, onDone }) {
  const items = byIds(course.commands, section.commands);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [letterTime, setLetterTime] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  if (letterTime) return <Quiz course={course} section={{ kind: 'phonics', title: 'Find the sound', letters: section.letters, order: section.order }} audio={audio} onDone={onDone}/>;
  const item = items[index];
  async function hear() {
    clearTimeout(timer.current); setReady(false);
    if (await audio.play(item)) timer.current = setTimeout(() => setReady(true), 2200);
  }
  return <><Heading title={section.title}/><section className="review-card"><Art item={item} className={audio.playing ? 'wiggle' : ''}/><Sound label="Listen" playing={audio.playing} onClick={hear}/><span className={`your-turn ${ready ? 'show' : ''}`}>Your turn!</span></section>
    <div className="lesson-bottom"><span/><Dots total={items.length + 1} current={index}/><Next disabled={!ready} onClick={() => { clearTimeout(timer.current); if (index + 1 === items.length) setLetterTime(true); else { setIndex(index + 1); setReady(false); } }}>I did it!</Next></div></>;
}

export function Phonics({ course, section, audio, onDone }) {
  const items = byIds(course.phonics, section.letters);
  const [practice, setPractice] = useState(false);
  const [heard, setHeard] = useState([]);
  const [active, setActive] = useState(null);
  if (practice) return <Quiz course={course} section={{ kind: 'phonics', title: 'Listen. Tap the letter.', letters: section.letters, order: section.order }} audio={audio} onDone={onDone}/>;
  return <><Heading title={section.title}/><div className={`choices letters explore count-${items.length}`}>{items.map(item => <button key={item.id} className={`choice ${item.color} ${active === item.id && audio.playing ? 'wiggle' : ''}`} aria-label={`Hear the sound for ${item.letter}`} onClick={async () => { setActive(item.id); if (await audio.play(item)) setHeard(previous => [...new Set([...previous, item.id])]); }}>
    {section.focus === item.id && <span className="new-sound">NEW</span>}<span className="phonics-kind">LETTER</span><span className="big-letter">{item.letter}</span><span className="phoneme">SOUND <strong>{item.sound}</strong></span><span className="letter-sound"><Volume2/>{heard.includes(item.id) ? <Check/> : 'Tap to hear'}</span>
  </button>)}</div><div className="center-next"><Next disabled={heard.length < items.length} onClick={() => { audio.stop(); setPractice(true); }}>Let’s try!</Next></div></>;
}

export function Blending({ course, section, audio, onDone }) {
  const [index, setIndex] = useState(0);
  const [merging, setMerging] = useState(false);
  const [finished, setFinished] = useState(false);
  const word = section.words[index];
  const letters = byIds(course.phonics, word.letters);
  async function blend() {
    if (merging) return;
    setMerging(true); setFinished(false);
    for (const letter of letters) if (!(await audio.play(letter))) { setMerging(false); return; }
    if (await audio.play(word)) setFinished(true);
    setMerging(false);
  }
  return <><Heading title={section.title}/><div className={`blend-card ${merging ? 'merging' : ''} ${finished ? 'merged' : ''}`}>
    <div className="blend-letters">{letters.map((letter, letterIndex) => <button key={`${letter.id}-${letterIndex}`} className={`blend-letter ${letter.color}`} onClick={() => audio.play(letter)} aria-label={`Hear ${letter.letter}`}>{letter.letter}<Volume2/></button>)}</div>
    <button className="blend-button" onClick={blend} disabled={merging}><span className="blend-arrow">→</span>{merging ? 'Listen…' : 'Slide the sounds'}</button>
    <div className={`whole-word ${finished ? 'show' : ''}`}>{word.text}<button aria-label={`Hear ${word.text}`} onClick={() => audio.play(word)}><Volume2/></button></div>
  </div><div className="lesson-bottom"><span/><Dots total={section.words.length} current={index}/><Next disabled={!finished} onClick={() => { audio.stop(); if (index + 1 === section.words.length) onDone(); else { setIndex(index + 1); setFinished(false); } }}/></div></>;
}

export function Story({ section, audio, onDone }) {
  const [page, setPage] = useState(0);
  const item = section.pages[page];
  return <><Heading title={section.title}/><section className={`story-card ${item.scene ? `story-${item.scene}` : ''}`}><span className="story-page">{page + 1} / {section.pages.length}</span><Art item={item} className={audio.playing ? 'wiggle' : ''}/><div className="story-caption"><h2>{item.text}</h2><Sound label="Read to me" playing={audio.playing} onClick={() => audio.play(item)}/></div></section>
    <div className="lesson-bottom"><button className="back-button" disabled={page === 0} onClick={() => { audio.stop(); setPage(page - 1); }}><ArrowLeft/>Back</button><Dots total={section.pages.length} current={page}/><Next onClick={() => { audio.stop(); if (page + 1 === section.pages.length) onDone(); else setPage(page + 1); }}>{page + 1 === section.pages.length ? 'Finish!' : 'Next'}</Next></div></>;
}

export function Activity(props) {
  switch (props.section.type) {
    case 'hello': return <HelloAgain {...props}/>;
    case 'review': return <QuickReview {...props}/>;
    case 'watch': return <Watch {...props}/>;
    case 'quiz': return <Quiz {...props}/>;
    case 'phonics': return <Phonics {...props}/>;
    case 'play': return <Quiz {...props}/>;
    case 'blending': return <Blending {...props}/>;
    case 'story': return <Story {...props}/>;
    default: return null;
  }
}
