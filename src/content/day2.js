import { asset } from '../asset.js';
import { actions, phonics, pick } from './library.js';

const allCommands = ['stand', 'sit', 'look', 'come', 'listen'];
const allSounds = ['s', 'a', 't'];

export default {
  id: 'day-2', number: 2, title: 'Day 2', greeting: 'Ready for Day 2?', theme: 'meadow',
  commands: pick(actions, allCommands),
  phonics: pick(phonics, allSounds),
  sections: [
    { id: 'hello', type: 'hello', navLabel: 'Hello', title: 'Hello again!', lines: ['Ready?', 'Let’s go!'], audio: asset('audio/day2-hello.wav') },
    { id: 'review', type: 'review', navLabel: 'Review', title: 'Quick review', commands: ['stand', 'sit', 'look'], letters: ['s', 'a'], order: ['s', 'a'] },
    { id: 'new-moves', type: 'watch', navLabel: 'Move', commands: ['come', 'listen'], title: 'New moves', prompt: 'Listen. Then move!', revealOnHear: true },
    { id: 'sounds', type: 'phonics', navLabel: 'Sounds', letters: allSounds, order: ['t', 's', 'a', 't'], focus: 't', title: 'A new sound' },
    { id: 'blend', type: 'blending', navLabel: 'Blend', title: 'Sounds come together', words: [
      { id: 'at', letters: ['a', 't'], text: 'at', audio: asset('audio/at.wav') },
      { id: 'sat', letters: ['s', 'a', 't'], text: 'sat', audio: asset('audio/sat.wav') },
    ] },
    { id: 'listen-play', type: 'quiz', navLabel: 'Play', commands: allCommands, order: ['come', 'stand', 'listen', 'look', 'sit'], title: 'Listen and play' },
    { id: 'story', type: 'story', navLabel: 'Story', title: 'A friend is calling', pages: [
      { ...actions.look, scene: 'forest' },
      { ...actions.come, scene: 'path' },
      { ...actions.sit, scene: 'picnic' },
      { ...actions.listen, scene: 'music' },
    ] },
  ],
  completion: { title: 'Day 2 complete!', commands: allCommands, sounds: ['t'], words: ['at', 'sat'] },
};
