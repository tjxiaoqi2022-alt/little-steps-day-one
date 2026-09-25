import { actions, phonics, pick } from './library.js';

const commandIds = ['stand', 'sit', 'come', 'look', 'listen'];
const soundIds = ['s', 'a'];

export default {
  id: 'day-1', number: 1, title: 'Day 1', greeting: 'Hello, little explorer!', theme: 'sunny',
  commands: pick(actions, commandIds),
  phonics: pick(phonics, soundIds),
  sections: [
    { id: 'watch', type: 'watch', navLabel: 'Watch', commands: commandIds, title: 'Watch and move', prompt: 'Listen. Watch. Your turn!' },
    { id: 'listen', type: 'quiz', navLabel: 'Listen', commands: commandIds, order: ['stand', 'sit', 'come', 'look', 'listen'], title: 'Listen and tap' },
    { id: 'phonics', type: 'phonics', navLabel: 'Phonics', letters: soundIds, order: ['s', 'a'], title: 'Meet two sounds' },
    { id: 'play', type: 'play', kind: 'phonics', navLabel: 'Play', letters: soundIds, order: ['s', 'a', 'a', 's'], title: 'Listen. Tap the letter.' },
    { id: 'story', type: 'story', navLabel: 'Story', title: 'A little morning', pages: [
      { ...actions.stand, scene: 'sunrise' },
      { ...actions.come, scene: 'path' },
      { ...actions.sit, scene: 'nest' },
    ] },
  ],
  completion: { title: 'Great job!', commands: commandIds, sounds: soundIds },
};
