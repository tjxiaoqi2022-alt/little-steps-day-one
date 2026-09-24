import { asset } from '../asset.js';

export default {
  id: 'day-1', number: 1, greeting: 'Hello, little explorer!',
  commands: [
    { id: 'stand', text: 'Stand up!', image: asset('images/actions.webp'), frame: '0% 0%', audio: asset('audio/stand.mp3') },
    { id: 'sit', text: 'Sit down!', image: asset('images/actions.webp'), frame: '100% 0%', audio: asset('audio/sit.mp3') },
    { id: 'come', text: 'Come here!', image: asset('images/actions.webp'), frame: '0% 50%', audio: asset('audio/come.mp3') },
    { id: 'look', text: 'Look!', image: asset('images/actions.webp'), frame: '100% 50%', audio: asset('audio/look.mp3') },
    { id: 'listen', text: 'Listen!', image: asset('images/actions.webp'), frame: '0% 100%', audio: asset('audio/listen.mp3') },
  ],
  phonics: [
    { id: 's', letter: 'S', sound: '/s/', audio: asset('audio/s.mp3'), color: 'blue' },
    { id: 'a', letter: 'A', sound: '/æ/', audio: asset('audio/a.mp3'), color: 'orange' },
  ],
  listeningOrder: ['stand', 'look', 'sit', 'listen', 'come'],
  phonicsOrder: ['s', 'a', 'a', 's'],
  playSequence: ['s', 'a'],
  story: [
    { text: 'Look!', image: asset('images/actions.webp'), frame: '100% 50%', audio: asset('audio/look.mp3') },
    { text: 'Come here!', image: asset('images/actions.webp'), frame: '0% 50%', audio: asset('audio/come.mp3') },
    { text: 'Sit down!', image: asset('images/actions.webp'), frame: '100% 0%', audio: asset('audio/sit.mp3') },
  ],
};

