export const dayOneScript = [
  // ── EVENING ──────────────────────────────────────────────
  {
    type: 'background',
    image: '/src/assets/images/backgrounds/house-evening.png',
    transition: 'crossfade',
    duration: 1200
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{playerName}} steps inside as the last light fades behind the hill.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'There is unpacking to do. Tea to make. A house to learn the sounds of.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'It is quiet in the nicest possible way.',
    style: 'narration'
  },

  // ── NIGHT TRANSITION ─────────────────────────────────────
  {
    type: 'nightFade',
    holdMs: 1800
  },
  {
    type: 'titleCard',
    lines: [
      'That night, {{playerName}} slept better than expected.',
      'Something about the cherry blossom air, perhaps.'
    ]
  },

  // ── DAWN ─────────────────────────────────────────────────
  {
    type: 'background',
    image: '/src/assets/images/backgrounds/house-dawn.png',
    transition: 'crossfade',
    duration: 1400
  },
  {
    type: 'dayCard',
    label: 'Day 1'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Morning arrived soft and unhurried.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The cherry blossom tree outside the window was already busy dropping petals onto the porch.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'A good day for a walk.',
    style: 'narration'
  },

  // ── RIVERSIDE PATH ────────────────────────────────────────
  {
    type: 'background',
    image: '/src/assets/images/backgrounds/riverside-path.jpeg',
    transition: 'crossfade',
    duration: 1200
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{townName}} was even lovelier on foot.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The riverside path wound gently along the stream, stone lanterns still glowing faintly in the morning mist.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Marigold was right. This was a good place.',
    style: 'narration'
  },

  // ── DISCOVERY ─────────────────────────────────────────────
  {
    type: 'background',
    image: '/src/assets/images/backgrounds/riverside-bridge-close.png',
    transition: 'crossfade',
    duration: 1000
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Near the old bridge, something caught {{playerName}}\'s eye.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'A shape, half-hidden in the mud at the water\'s edge.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'It was moving.',
    style: 'narration'
  },

  // ── MUDDY SHAPE ───────────────────────────────────────────
  {
    type: 'background',
    image: '/src/assets/images/items/muddy-shape.png',
    transition: 'crossfade',
    duration: 800
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Two small eyes blinked up from the mud.',
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
    text: 'Whatever it was, it needed help.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{playerName}} reached down.',
    style: 'narration'
  },

  // ── HAND OFF ──────────────────────────────────────────────
  {
    type: 'end',
    next: 'washInteraction'
  },

  // ── POST REVEAL ───────────────────────────────────────────
  {
    id: 'postReveal',
    type: 'background',
    image: '/src/assets/images/backgrounds/riverside-bridge-close.png',
    transition: 'none'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'A husky.',
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
    text: 'Bright eyes, muddy paws, and a tail that had already decided everything was going to be fine.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'They looked up at {{playerName}} like they had been waiting specifically for them.',
    style: 'narration'
  },
  {
    type: 'pause',
    ms: 500
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'They needed a name.',
    style: 'narration'
  },

  // ── NAMING ────────────────────────────────────────────────
  {
    type: 'nameInput',
    placeholder: 'name your husky...',
    saveAs: 'firstPetName',
    targetEntity: 'firstPet'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{firstPetName}}.',
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
    text: 'The husky\'s tail wagged once, firmly, as if to say: yes. That one.',
    style: 'narration'
  },

  // ── WALK HOME ─────────────────────────────────────────────
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{playerName}} gathered them up carefully and started back up the hill.',
    style: 'narration'
  },
  {
    type: 'background',
    image: '/src/assets/images/backgrounds/house-dawn.png',
    transition: 'crossfade',
    duration: 1200
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The house on the hill had been quiet since {{playerName}} arrived.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'It didn\'t feel quiet anymore.',
    style: 'narration'
  },

  // ── INTERIOR ──────────────────────────────────────────────
  {
    type: 'background',
    image: '/src/assets/images/backgrounds/house-interior.png',
    transition: 'crossfade',
    duration: 1000
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{firstPetName}} explored every corner, sniffed every surface, and then sat down in the middle of the rug looking very satisfied.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'It had been a big day for both of them.',
    style: 'narration'
  },

  // ── PETTING INTERACTION ───────────────────────────────────
  {
    id: 'petting',
    type: 'pettingInteraction',
    petName: '{{firstPetName}}',
    spriteKey: 'husky',
    requiredPets: 3,
    promptText: 'Give {{firstPetName}} some pets before bed.',
    completionText: '{{firstPetName}} leaned into {{playerName}}\'s hand and let out a long, contented sigh.'
  },

  // ── TUCK IN PROMPT ────────────────────────────────────────
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Time for bed.',
    style: 'narration'
  },
  {
    id: 'tuckIn',
    type: 'tuckInInteraction',
    petName: '{{firstPetName}}',
    spriteKey: 'husky',
    bedTarget: 'dogBed',
    promptText: 'Drag {{firstPetName}} to the bed to help them settle in.',
    confirmText: 'Good night, {{firstPetName}}.',
  },

  // ── LIGHTS DOWN ───────────────────────────────────────────
  {
    type: 'lightsDown',
    duration: 1600
  },
  {
    type: 'titleCard',
    lines: [
      'Day 1.',
      'A good beginning.'
    ]
  },
  {
    type: 'nightFade',
    holdMs: 1200
  },

  // ── END OF DAY 1 ─────────────────────────────────────────
  {
    type: 'end',
    next: 'dayTwoMorning'
  }
];
