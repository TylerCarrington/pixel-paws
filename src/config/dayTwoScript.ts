export const dayTwoScript = [
  // ── MORNING CALL ──────────────────────────────────────────
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The call came in just after breakfast.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Someone in town — {{playerName}} didn\'t catch their name — had heard about the husky from yesterday.',
    style: 'narration'
  },
  {
    type: 'pause',
    ms: 500
  },
  {
    type: 'dialogue',
    speaker: 'Caller',
    portrait: null,
    text: 'I heard you helped that dog by the river. There\'s another one — in the park near the fountain. It won\'t come to anyone.',
    style: 'phone'
  },
  {
    type: 'dialogue',
    speaker: 'Caller',
    portrait: null,
    text: 'Thought you might know what to do.',
    style: 'phone'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{playerName}} was already reaching for their shoes.',
    style: 'narration'
  },
  {
    type: 'end',
    next: 'parkScene'
  },

  // ── PARK SCENE ────────────────────────────────────────────
  {
    id: 'parkScene',
    type: 'background',
    image: './src/assets/images/backgrounds/park-fountain.png',
    transition: 'crossfade',
    duration: 1200
  },
  {
    type: 'bushSearch',
    promptText: 'The dog is hiding somewhere in the park. Search the bushes.',
  },

  // ── DISCOVERY ─────────────────────────────────────────────
  {
    id: 'discovery',
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The dog was small and sturdy with ears far too large for their head.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'A corgi. Nervous but not aggressive. Just... waiting for someone to be kind.',
    style: 'narration'
  },
  {
    id: 'petting',
    type: 'pettingInteraction',
    petName: 'the corgi',
    spriteKey: 'corgi',
    requiredPets: 3,
    promptText: 'Give the corgi some reassuring pets.',
    completionText: 'The corgi\'s tail started wagging. A good sign.'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'They needed a name, too.',
    style: 'narration'
  },
  {
    type: 'nameInput',
    placeholder: 'name your corgi...',
    saveAs: 'secondPetName',
    targetEntity: 'secondPet'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{secondPetName}}.',
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
    text: '{{secondPetName}} barked once, short and firm. Agreed.',
    style: 'narration'
  },
  {
    type: 'end',
    next: 'shelterDecision'
  },

  // ── SHELTER DECISION (EVENING) ────────────────────────────
  {
    id: 'shelterDecision',
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{playerName}} walked {{secondPetName}} home slowly, thinking.',
    style: 'narration'
  },
  {
    type: 'background',
    image: './src/assets/images/backgrounds/house-dawn.png',
    transition: 'crossfade',
    duration: 1000
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Two animals in two days.',
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
    text: 'If this kept up, the spare room wasn\'t going to be enough.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Maybe... maybe this was supposed to be more than just helping strays when they turned up.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Maybe the town needed a real shelter.',
    style: 'narration'
  },
  {
    type: 'pause',
    ms: 800
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'But that was tomorrow\'s problem. Tonight, {{secondPetName}} needed a place to sleep.',
    style: 'narration'
  },
  {
    type: 'end',
    next: 'spareRoomScene'
  },

  // ── SPARE ROOM SCENE ─────────────────────────────────────
  {
    id: 'spareRoomScene',
    type: 'background',
    image: './src/assets/images/backgrounds/spare-room.png',
    transition: 'crossfade',
    duration: 1000
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The spare room would do for tonight.',
    style: 'narration'
  },
  {
    type: 'dragTuckIn',
    petName: '{{secondPetName}}',
    spriteKey: 'corgi',
    bedAssetKey: 'petBed',
    bedTargetPosition: { top: '60%', left: '42%' },
    promptText: 'Help {{secondPetName}} settle into bed.',
  },

  // ── BACK TO MAIN BEDROOM ─────────────────────────────────
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{secondPetName}} was asleep almost immediately.',
    style: 'narration'
  },
  {
    type: 'background',
    image: './src/assets/images/backgrounds/house-interior.png',
    transition: 'crossfade',
    duration: 1000
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{firstPetName}} was waiting patiently in the main room.',
    style: 'narration'
  },
  {
    id: 'day2Petting',
    type: 'pettingInteraction',
    petName: '{{firstPetName}}',
    spriteKey: 'husky',
    requiredPets: 3,
    promptText: 'Give {{firstPetName}} some goodnight pets.',
    completionText: '{{firstPetName}}\'s tail thumped against the floor. All was well.'
  },
  {
    id: 'day2TuckIn',
    type: 'tuckInInteraction',
    petName: '{{firstPetName}}',
    spriteKey: 'husky',
    bedTarget: 'dogBed',
    promptText: 'Time for {{firstPetName}} to sleep.',
    confirmText: 'Help {{firstPetName}} settle into bed.'
  },
  {
    type: 'lightsDown',
    duration: 1600
  },
  {
    type: 'titleCard',
    lines: [
      'Day 2.',
      '{{playerName}} went to sleep thinking about spare rooms and second chances.'
    ]
  },
  {
    type: 'nightFade',
    holdMs: 1400
  },
  {
    type: 'end',
    next: 'dayThreeMorning'
  }
];
