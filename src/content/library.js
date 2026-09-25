import { asset } from '../asset.js';

const sprite = asset('images/actions.webp');

export const actions = {
  stand: { id: 'stand', text: 'Stand up!', image: sprite, frame: '0% 0%', audio: asset('audio/stand.mp3') },
  sit: { id: 'sit', text: 'Sit down!', image: sprite, frame: '100% 0%', audio: asset('audio/sit.mp3') },
  come: { id: 'come', text: 'Come here!', image: sprite, frame: '0% 50%', audio: asset('audio/come.mp3') },
  look: { id: 'look', text: 'Look!', image: sprite, frame: '100% 50%', audio: asset('audio/look.mp3') },
  listen: { id: 'listen', text: 'Listen!', image: sprite, frame: '0% 100%', audio: asset('audio/listen.mp3') },
};

export const phonics = {
  s: { id: 's', letter: 's', sound: '/s/', audio: asset('audio/s.wav'), color: 'blue' },
  a: { id: 'a', letter: 'a', sound: '/æ/', audio: asset('audio/a.mp3'), color: 'orange' },
  t: { id: 't', letter: 't', sound: '/t/', audio: asset('audio/t.mp3'), color: 'green' },
};

export const pick = (library, ids) => ids.map(id => library[id]);
