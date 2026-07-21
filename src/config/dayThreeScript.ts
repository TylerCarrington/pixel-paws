export const dayThreeScript = [
  {
    id: 'day3Morning',
    type: 'background',
    image: './src/assets/images/backgrounds/house-evening.png', // Updated background image
    transition: 'crossfade',
    duration: 1400
  },
  {
    type: 'dayCard',
    label: 'Day 3'
  },
  {
    id: 'overnight',
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The decision had made itself overnight.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{playerName}} was opening a shelter.',
    style: 'narration'
  },
  {
    type: 'pause',
    ms: 700
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The phone rang three times that morning before breakfast.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Word traveled fast in {{townName}}.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'By mid-morning, {{playerName}} had pinned up a simple board by the door — a place to track the calls, the tips, the animals that needed help.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The Morning Board, they decided to call it.',
    style: 'narration'
  },
  {
    type: 'pause',
    ms: 600
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'It was already full.',
    style: 'narration'
  },
  {
    type: 'end',
    next: 'morningBoardIntro'
  }
];
