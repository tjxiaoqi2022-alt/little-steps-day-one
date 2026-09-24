import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Volume2, Star, Check, Ear, Sparkles } from 'lucide-react';
import { makeChoices } from './lesson';
import { asset } from './asset';

export function Art({ item, className = '' }) {
  return item.frame ? <div className={`art ${className}`} role="img" aria-label={item.alt || item.text} style={{ backgroundImage: `url(${item.image})`, backgroundPosition: item.frame }}/>
    : <img className={`art image ${className}`} src={item.image} alt={item.alt || item.text}/>;
}
export function Next({ onClick, disabled, children = 'Next' }) {
  return <button className="primary" onClick={onClick} disabled={disabled}>{children}<ArrowRight size={23}/></button>;
}
function Dots({ total, current }) {
  return <div className="dots" aria-label={`Item ${current + 1} of ${total}`}>{Array.from({ length: total }, (_, i) => <span key={i} className={i === current ? 'active' : i < current ? 'done' : ''}/>)}</div>;
}
function Sound({ onClick, playing, label = 'Listen', disabled = false }) {
  return <button className={`sound-button ${playing ? 'playing' : ''}`} onClick={onClick} disabled={disabled} aria-label={playing ? `Replay ${label}` : label}><Volume2 size={27}/><span>{playing ? 'Playing…' : label}</span></button>;
}
export function Heading({ eyebrow, title, children }) {
  return <div className="heading"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{children && <p>{children}</p>}</div>;
}
function Feedback({ status }) {
  return <div className={`feedback ${status}`} role="status" aria-live="polite">{status === 'correct' ? <><Check/>You got it!</> : status === 'retry' ? <><Ear/>Let’s listen again. Try another!</> : <>&nbsp;</>}</div>;
}

export function Watch({ course, audio, onDone }) {
  const [index, setIndex] = useState(0);
  const [heard, setHeard] = useState(false);
  const item = course.commands[index];
  return <><Heading eyebrow="WATCH & MOVE" title="Let’s move together!">Listen. Watch. Your turn!</Heading>
    <section className="watch-card"><div className="picture-wrap"><span className="card-number">{String(index + 1).padStart(2, '0')}</span><Art item={item} className={audio.playing ? 'wiggle' : ''}/><span className="picture-star" aria-hidden="true">✦</span></div>
    <div className="watch-copy"><span className="mini-label">YOUR TURN!</span><h2>{item.text}</h2><Sound playing={audio.playing} label="Tap to listen" onClick={async () => { if (await audio.play(item)) setHeard(true); }}/><p className="action-note">Move with me <Sparkles size={17}/></p></div></section>
    <div className="lesson-bottom"><button className="back-button" disabled={index === 0} onClick={() => { audio.stop(); setHeard(false); setIndex(index - 1); }}><ArrowLeft/>Back</button><Dots total={course.commands.length} current={index}/><Next disabled={!heard} onClick={() => { audio.stop(); if (index + 1 === course.commands.length) onDone(); else { setIndex(index + 1); setHeard(false); } }}/></div></>;
}

export function Quiz({ course, audio, onDone, kind = 'commands' }) {
  const [index, setIndex] = useState(0);
  const [heard, setHeard] = useState(false);
  const [status, setStatus] = useState('');
  const [wrong, setWrong] = useState(null);
  const pool = kind === 'commands' ? course.commands : course.phonics;
  const order = kind === 'commands' ? course.listeningOrder : course.phonicsOrder;
  const answer = pool.find(item => item.id === order[index]);
  const choices = React.useMemo(() => kind === 'commands' ? makeChoices(pool, answer.id, index) : pool, [pool, answer.id, index, kind]);
  function choose(id) {
    if (!heard || status === 'correct') return;
    if (id === answer.id) { setStatus('correct'); setWrong(null); audio.play({ audio: asset('audio/great.mp3'), text: 'Great job!' }); }
    else { setStatus('retry'); setWrong(id); audio.play(answer); }
  }
  return <><Heading eyebrow={kind === 'commands' ? 'LISTEN & CHOOSE' : 'FIND THE SOUND'} title={kind === 'commands' ? 'What can you hear?' : 'Which letter?'}>Listen, then tap {kind === 'commands' ? 'a picture' : 'a letter'}.</Heading>
    <Sound label="Play sound" playing={audio.playing} onClick={async () => { if (await audio.play(answer)) setHeard(true); }}/>
    <div className={`choices ${kind === 'commands' ? '' : 'letters'}`}>{choices.map((item, i) => <button key={item.id} aria-label={kind === 'commands' ? item.text : `Letter ${item.letter}`} className={`choice ${item.color || ''} ${status === 'correct' && item.id === answer.id ? 'chosen' : ''} ${wrong === item.id ? 'try-again' : ''}`} disabled={!heard || status === 'correct'} onClick={() => choose(item.id)}>
      {kind === 'commands' ? <><Art item={item}/><span className="choice-number" aria-hidden="true">{i + 1}</span></> : <span className="big-letter">{item.letter}</span>}{status === 'correct' && item.id === answer.id && <span className="correct-badge"><Check/></span>}
    </button>)}</div><Feedback status={status}/><div className="quiz-bottom"><Dots total={order.length} current={index}/><Next disabled={status !== 'correct'} onClick={() => { audio.stop(); if (index + 1 === order.length) onDone(); else { setIndex(index + 1); setHeard(false); setStatus(''); setWrong(null); } }}/></div></>;
}

export function Phonics({ course, audio, onDone }) {
  const [practice, setPractice] = useState(false);
  const [heard, setHeard] = useState([]);
  const [active, setActive] = useState(null);
  if (practice) return <Quiz course={course} audio={audio} onDone={onDone} kind="phonics"/>;
  return <><Heading eyebrow="LITTLE LETTERS, NEW SOUNDS" title="Meet two sounds!">Tap a letter. Listen closely.</Heading>
    <div className="choices letters explore">{course.phonics.map(item => <button key={item.id} className={`choice ${item.color} ${active === item.id && audio.playing ? 'wiggle' : ''}`} aria-label={`Hear the sound for ${item.letter}`} onClick={async () => { setActive(item.id); if (await audio.play(item)) setHeard(previous => [...new Set([...previous, item.id])]); }}><span className="big-letter">{item.letter}</span><span className="letter-sound"><Volume2/>{heard.includes(item.id) ? <Check/> : 'Tap me!'}</span></button>)}</div>
    <div className="center-next"><Next disabled={heard.length < course.phonics.length} onClick={() => { audio.stop(); setPractice(true); }}>Let’s try!</Next></div></>;
}

export function Play({ course, audio, onDone }) {
  const [position, setPosition] = useState(0);
  const [heard, setHeard] = useState(false);
  const [status, setStatus] = useState('');
  const finished = position === course.playSequence.length;
  const item = course.phonics.find(p => p.id === course.playSequence[position]);
  function choose(id) {
    if (!heard || finished) return;
    if (id === item.id) {
      setPosition(position + 1); setHeard(false); setStatus('correct');
      audio.play({ audio: asset('audio/great.mp3'), text: 'Great job!' });
    } else { setStatus('retry'); audio.play(item); }
  }
  return <><Heading eyebrow="SOUND PLAY" title={finished ? 'A perfect pair!' : 'Make a sound pair!'}>{finished ? 'Two sounds. You found them!' : 'Listen. Find a letter. Fill a space.'}</Heading>
    <div className="sound-trail">{course.playSequence.map((id, i) => <React.Fragment key={i}>{i > 0 && <span className="plus">+</span>}<span className={`sound-slot ${i < position ? 'filled' : ''} ${i === position ? 'waiting' : ''}`}>{i < position ? course.phonics.find(p => p.id === id).letter : <Star/>}</span></React.Fragment>)}</div>
    {!finished ? <><Sound label="Play sound" playing={audio.playing} onClick={async () => { if (await audio.play(item)) setHeard(true); }}/><div className="choices letters compact">{course.phonics.map(p => <button className={`choice ${p.color}`} key={p.id} aria-label={`Letter ${p.letter}`} disabled={!heard} onClick={() => choose(p.id)}><span className="big-letter">{p.letter}</span></button>)}</div><Feedback status={status}/></> : <><div className="celebrate-stars" aria-hidden="true">✦ ★ ✦</div><Sound label="Hear the pair" playing={audio.playing} onClick={async () => { for (const id of course.playSequence) { if (!(await audio.play(course.phonics.find(p => p.id === id)))) break; } }}/><div className="center-next"><Next onClick={() => { audio.stop(); onDone(); }}>Story time!</Next></div></>}
  </>;
}

export function Story({ course, audio, onDone }) {
  const [page, setPage] = useState(0);
  const item = course.story[page];
  return <><Heading eyebrow="STORY TIME" title="A little adventure"/>
    <section className="story-card"><span className="story-page">{page + 1} / {course.story.length}</span><Art item={item} className={audio.playing ? 'wiggle' : ''}/><div className="story-caption"><h2>{item.text}</h2><Sound label="Read to me" playing={audio.playing} onClick={() => audio.play(item)}/></div></section>
    <div className="lesson-bottom"><button className="back-button" disabled={page === 0} onClick={() => { audio.stop(); setPage(page - 1); }}><ArrowLeft/>Back</button><Dots total={course.story.length} current={page}/><Next onClick={() => { audio.stop(); if (page + 1 === course.story.length) onDone(); else setPage(page + 1); }}>{page + 1 === course.story.length ? 'Finish!' : 'Next'}</Next></div></>;
}
