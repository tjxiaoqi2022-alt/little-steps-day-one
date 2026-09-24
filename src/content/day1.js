import { actions, phonics, pick } from './library.js';

const commandIds = ['stand', 'sit', 'look'];
const soundIds = ['s', 'a'];

export default {
  id: 'day-1', number: 1, title: 'Day 1', greeting: 'Hello, little explorer!', theme: 'sunny',
  commands: pick(actions, commandIds),
  phonics: pick(phonics, soundIds),
  sections: [
    { id: 'moves', type: 'watch', navLabel: 'Move', commands: commandIds, title: 'Let’s move!', prompt: 'Listen. Watch. Your turn!' },
    { id: 'listen', type: 'quiz', navLabel: 'Listen', commands: commandIds, order: ['stand', 'look', 'sit'], title: 'Listen and tap' },
    { id: 'sounds', type: 'phonics', navLabel: 'Sounds', letters: soundIds, order: ['s', 'a', 'a', 's'], title: 'Tap a sound' },
    { id: 'story', type: 'story', navLabel: 'Story', title: 'A little morning', pages: [
      { ...actions.stand, scene: 'sunrise' },
      { ...actions.look, scene: 'window' },
      { ...actions.sit, scene: 'nest' },
    ] },
  ],
  completion: { title: 'Great job!', commands: commandIds, sounds: soundIds },
};
