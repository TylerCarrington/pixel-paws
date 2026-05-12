# Story Progression: Day 2 & Day 3

## Overview

This document covers three major story moments:
- **Day 2 Morning:** The second animal call, park discovery, corgi rescue, naming, and the decision to open a shelter
- **Day 2 Evening:** Tucking in the corgi in the spare room, then returning to the husky in the main bedroom
- **Day 3 Morning:** Introduction to the Morning Board system that will govern all future mornings

Each phase builds on the emotional momentum of Day 1 while introducing new mechanics naturally through story.

---

# Phase 1: Day 2 Morning — The Second Call

## Current state
An incoming call appears with an "Answer" button. This is working well and should be preserved.

## After clicking "Answer" — replace the current dialogue

The current dialogue feels too transactional and breaks the warm tone established on Day 1. Replace it with this sequence:

### New call dialogue script

```js
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
}
```

### New dialogue style: `phone`

Add this style variant to the dialogue panel renderer. When `style: 'phone'`:
- Display the speaker name in small text above the dialogue line (same styling as the existing speaker name, color `--speaker-name-color`)
- Do not show a portrait (even if one is specified)
- Use the same dialogue text styling as normal dialogue (not narration italics)
- A very subtle telephone icon (📞 or a small pixel phone sprite, ~10px, in `--speaker-name-color`) appears to the left of the speaker name
- This establishes a visual language for phone calls that will be reused throughout the game for the Morning Board calls

### Key narrative changes
- The "old neighbor" is now just "someone in town" — more mysterious, more village-energy
- The caller heard about yesterday's rescue — word spreads naturally in a small village
- "Thought you might know what to do" is softer than "nobody knew what to do, so I thought of you" — it respects the player's growing role without making everyone else helpless
- No "I'm on my way!" response from the player — the narration line "{{playerName}} was already reaching for their shoes" shows the same intent more cinematically

---

## New location: The park

### Asset needed: `src/assets/images/park-fountain.png`

**Image generation prompt:**

> Pixel art scene, small village park with a stone fountain in the center, cherry blossom trees surrounding the fountain, scattered pink petals on the ground, three large overgrown bushes in the foreground on the left and right sides of the frame — dense leafy green bushes about waist-height, stone benches visible in the background, a small stone path winding through, soft morning light, warm cream sky with a few clouds. Color palette strictly soft pinks, warm creams, mossy greens, stone greys, warm ambers. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic, iyashikei healing energy. The bushes should look substantial and slightly wild — something could definitely be hiding in them. No characters. No text.

**Key details:**
- The bushes are the interactive zones — make them prominent and readable
- Three bushes total: one large bush bottom-left, one bottom-right, one mid-ground center-right
- Leave the fountain and center of the frame relatively open so the scene doesn't feel cluttered
- Morning light matches the Day 1 riverside path — same time of day energy

---

## Search-the-bushes interaction

### Mechanic design

This is the second discovery method in the game. The player must search through bushes to find the hidden corgi.

The park background is now rendered **without bushes baked into the environment art**. Bushes are placed as separate layered sprites on top of the scene so they can animate independently and support interaction cleanly.

---

### Scene structure

**Layer order (back → front):**

1. Park background image
2. Mid-ground bush sprite
3. Corgi sprite layer
4. Foreground left bush sprite
5. Foreground right bush sprite
6. FX particles / dialogue overlays

The background artwork should contain naturally prepared foliage spaces where bushes visually belong, including subtle grass variation, soft shadows, petals, or exposed soil so the bush sprites blend seamlessly into the environment.

---

### Behavior

* The park background is displayed (park-fountain.png)
* Three bush sprites are rendered as independent positioned elements over the background (bush.png)
* Each bush sprite has an invisible interactive hotspot attached to it
* A gentle prompt appears in the dialogue panel:

```txt
"The dog is hiding somewhere in the park. Search the bushes."
```

* When the player taps/clicks a bush hotspot:

  * If it's **not** the corgi bush:

    * The bush sprite shakes (CSS keyframe, 3 quick left-right jiggles, 200ms total)
    * A small leaf particle or two falls
    * A soft rustle sound plays
    * The prompt updates to:

```txt
"Nothing here. Keep looking."
```

* If it's **the corgi bush** (randomly assigned at scene load from the three bush options):

  * The bush sprite shakes more vigorously
  * A `"Woof!"` text particle appears briefly above the bush
  * The corgi sprite emerges from behind the bush with a short slide-in animation
  * The corgi should visually appear from inside or behind the bush sprite edge, depending on bush orientation
  * The prompt updates to:

```txt
"There you are."
```

* The corgi sprite settles into an idle animation in front of the bush
* After an 800ms pause, advance to the next beat

---

## Bush sprite placement guidance

Adjust exact values after final asset export and responsive testing.

```js
bushSprites: [
  {
    id: 'bushLeft',
    position: {
      bottom: '6%',
      left: '4%',
      width: '28%'
    },
    layer: 'foreground'
  },

  {
    id: 'bushRight',
    position: {
      bottom: '5%',
      right: '3%',
      width: '30%'
    },
    layer: 'foreground'
  },

  {
    id: 'bushCenter',
    position: {
      top: '46%',
      left: '54%',
      width: '20%'
    },
    layer: 'midground'
  }
]
```

---

## Hotspot sizing guidance

Hotspots should slightly exceed the visible bush silhouette for forgiving interaction.

```js
bushHotspots: [
  { id: 'bushLeft',   top: '58%', left: '4%',  width: '30%', height: '30%' },
  { id: 'bushRight',  top: '56%', left: '66%', width: '30%', height: '32%' },
  { id: 'bushCenter', top: '46%', left: '52%', width: '22%', height: '24%' }
]
```

---

## Bush shake CSS

```css
@keyframes bushShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.bush-sprite.shaking {
  animation: bushShake 0.2s ease-in-out;
  transform-origin: bottom center;
}
```

---

## Leaf particle (optional, pure CSS)

A single small div, `4px × 6px` rounded rectangle in `--deep-moss`, spawns near the upper region of the shaken bush, falls `20px` downward with slight rotation, and fades out over `600ms`.

Reuse the blossom fall keyframe with adjusted distance and rotation.

---

## Visual integration notes

* Bush sprites should contain soft base shadowing at the bottom edge to help ground them into the environment
* Background planting zones should align with bush silhouettes
* Avoid perfectly circular bushes — asymmetrical silhouettes feel more natural
* Foreground bushes should overlap the lower frame edge slightly for depth
* Bush palette should match the mossy greens used throughout the environment
* Bushes should feel substantial enough that a corgi could realistically hide inside them

---

## Assets needed for this interaction

* Park background image (without bushes)
* Foreground left bush sprite
* Foreground right bush sprite
* Mid-ground bush sprite
* Corgi sprite
* Leaf particle sprite (optional)
* `"Woof!"` text particle (optional)


---

## After discovery: Petting and naming

Reuse the `pettingInteraction` beat type created for the husky on Day 1. Apply it to the corgi.

```js
{
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
  type: 'pettingInteraction',
  petName: 'the corgi',
  spriteKey: 'corgi',
  requiredPets: 3,
  promptText: 'Give the corgi some reassuring pets.',
  completionText: 'The corgi's tail started wagging. A good sign.'
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
}
```

**Key changes from Day 1:**
- No wash step — the corgi is clean, just shy
- Petting comes before naming — establishes trust first
- Uses `petName: 'the corgi'` as a placeholder in the prompt until they're named
- Token `secondPetName` is saved for use throughout the rest of Day 2

---

# Phase 2: Day 2 Evening — The Shelter Decision

## The realization moment

The current text is good but the presentation (lightbulb emoji, wall of text) breaks immersion. Replace with a gentler sequence.

### Walk home narration

```js
{
  type: 'dialogue',
  speaker: null,
  portrait: null,
  text: '{{playerName}} walked {{secondPetName}} home slowly, thinking.',
  style: 'narration'
},
{
  type: 'background',
  image: 'src/assets/images/house-dawn.png',
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
}
```

**Key changes:**
- No lightbulb emoji — the realization happens naturally through narration
- "Two animals in two days" is a clean thesis statement
- The decision is framed as a "maybe" and a "tomorrow problem" — it doesn't demand an immediate response, which keeps the evening cozy
- The transition into the spare room scene is motivated by the immediate need ({{secondPetName}} needs sleep) not the big decision

---

## New location: The spare room

### Asset: `src/assets/images/spare-room.png`

---

## Tuck in the corgi — reusing the drag interaction

The existing tuck-in interaction from Day 1 is already built and working with a drag mechanic. Reuse it here.

```js
{
  type: 'background',
  image: 'src/assets/images/spare-room.png',
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
  promptText: 'Drag the bed onto the rug, then help {{secondPetName}} settle in.',
  confirmText: 'Tap {{secondPetName}} to tuck them in.'
}
```

### New beat type: `dragTuckIn`

This beat combines the pet bed asset placement with the tuck-in interaction. It is a two-step process.

**Step 1 — Place the bed:**
- The spare room background is displayed
- The corgi sprite stands idle near the bottom-center of the screen
- A draggable pet bed sprite (your existing `pet-bed.png` asset) appears at the bottom-left of the screen in a "staging area" — slightly outside the main room composition, clearly grabbable
- A soft pulsing highlight appears on the rug at the position defined in `bedTargetPosition`
- The `promptText` appears in the dialogue panel
- The player drags the bed asset onto the highlighted rug area
- When the bed is dropped within ~30px of the target position, it snaps into place and the highlight fades
- If dropped elsewhere, it bounces back to the staging area with a gentle shake (invalid drop)

**Step 2 — Tuck in the pet:**
- Once the bed is placed, the corgi plays its `walkToBed` animation and moves to the bed position
- The corgi settles into the bed in its curled sleeping pose
- The `confirmText` replaces the prompt in the dialogue panel
- A soft pulsing highlight appears around the corgi
- The player taps the corgi
- On tap: the `curlUp` or ear-twitch animation plays, a heart floats up, a small blanket overlay fades in over the corgi, the dialogue panel fades out
- Auto-advance after 1200ms

**Draggable pet bed sprite:**
Your existing asset — ensure it is rendered at the correct scale (likely 2× or 3×) and has touch/mouse event handling for drag. Use standard drag-and-drop HTML5 API or a lightweight library if already in the project.

---

## Return to the main bedroom — tuck in the husky

After the corgi is tucked in, transition back to the main bedroom for the husky's bedtime.

```js
{
  type: 'dialogue',
  speaker: null,
  portrait: null,
  text: '{{secondPetName}} was asleep almost immediately.',
  style: 'narration'
},
{
  type: 'background',
  image: 'src/assets/images/house-interior.png',
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
  type: 'pettingInteraction',
  petName: '{{firstPetName}}',
  spriteKey: 'husky',
  requiredPets: 3,
  promptText: 'Give {{firstPetName}} some goodnight pets.',
  completionText: '{{firstPetName}}\'s tail thumped against the floor. All was well.'
},
{
  type: 'tuckInInteraction',
  petName: '{{firstPetName}}',
  spriteKey: 'husky',
  bedTarget: 'dogBed',
  promptText: 'Time for {{firstPetName}} to sleep.',
  confirmText: 'Tap {{firstPetName}} to tuck them in.'
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
```

**Key details:**
- The husky's bedtime is identical to Day 1 but now contextualized by the second pet sleeping in the other room
- The title card's second line reflects the shelter decision brewing in the player's mind without forcing it yet
- Reuses the existing `tuckInInteraction` beat (the non-drag version) since the bed is already in place in the main bedroom

---

# Phase 3: Day 3 Morning — The Morning Board Introduction

## The morning announcement

Day 3 begins with the realization made real. The notice board appears as the formal system.

```js
{
  type: 'background',
  image: 'src/assets/images/house-dawn.png',
  transition: 'crossfade',
  duration: 1400
},
{
  type: 'dayCard',
  label: 'Day 3'
},
{
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
```

**Key changes:**
- The "notice board" is rebranded as the **Morning Board** — feels warmer and more specific to this game's rhythm
- The three phone calls and the board being "already full" justify why this system exists — the player character is overwhelmed in a good way
- The decision to open a shelter is stated as fact, not a question — it happened overnight, no ceremony needed

---

## Morning Board UI introduction

The first time the player sees the Morning Board, a brief tutorial overlay explains how it works.

### Morning Board tutorial overlay

```js
{
  type: 'morningBoardTutorial',
  title: 'The Morning Board',
  steps: [
    {
      highlight: 'callCards',
      text: 'Each morning, calls and tips come in from around {{townName}}. Tap a card to read the details.'
    },
    {
      highlight: 'respondButton',
      text: 'When you\'re ready, tap "Respond" to go help. You can only respond to one call per morning — choose carefully.'
    },
    {
      highlight: 'speciesBadge',
      text: 'Some cards show the animal type. Others are mysteries — you won\'t know until you arrive.'
    }
  ],
  completionText: 'The rest is up to you.',
  dismissLabel: 'Got it'
}
```

### New beat type: `morningBoardTutorial`

A multi-step overlay tutorial that highlights specific regions of the Morning Board UI.

**Behavior:**
- The Morning Board UI is rendered in the background (showing 2–3 call cards for Day 3)
- A semi-transparent dark overlay (`rgba(26, 16, 32, 0.85)`) covers the entire screen except the highlighted region
- A small cream tutorial panel appears near the highlighted region (positioned dynamically to avoid covering the highlight)
- The panel contains:
  - The current step's `text` in the game's narration font, 13px, cream color
  - A "Next" button (or "Got it" on the final step) at the bottom-right of the panel
  - A small step indicator (e.g., "1 of 3") at the top-right in a muted color
- Each step highlights a different region of the Morning Board:
  - `callCards` — the entire card list area
  - `respondButton` — the respond/answer button on the selected card
  - `speciesBadge` — the small badge on one of the cards showing a species icon or `???`
- Tapping "Next" advances to the next step
- Tapping "Got it" on the final step dismisses the tutorial, fades out the overlay, and enables full interaction with the Morning Board
- Mark `morningBoardTutorialSeen` in localStorage so this never shows again

**Tutorial panel styling:**
```css
.tutorial-panel {
  background: rgba(253, 243, 231, 0.96);
  border: 1px solid rgba(220, 180, 170, 0.6);
  border-radius: 10px;
  padding: 14px 18px;
  max-width: 280px;
  box-shadow: 0 4px 12px rgba(90, 62, 56, 0.15);
}
```

---

## After tutorial: The Morning Board is live

Once the tutorial is dismissed, the player interacts with the Morning Board normally. This system now governs every morning for the rest of the game.

On Day 3, seed the board with 2 calls:
1. A dog call (dirty, easy, common breed)
2. A mystery call (hiding, species unknown)

Both are within the player's current capability (dogs only, basic care only). Future days will add complexity as the shelter grows.

---

# State updates across Day 2 and Day 3

### At the end of Day 2:
```js
GameState.ownedPets.push({
  id: generateId(),
  species: 'DOG',
  breed: 'Corgi',
  name: GameState.tokens.secondPetName,
  rarity: 'UNCOMMON',
  isRevealed: true,
  desirability: 50,
  healthStatus: 'HEALTHY',
  vetDaysRemaining: 0,
  isMine: true,
  outfits: [],
  discoveryMethod: 'HIDING'
});

localStorage.setItem('dayTwoSeen', 'true');
```

### At the start of Day 3:
```js
GameState.shelterUnlocked = true;
GameState.morningBoardUnlocked = true;
localStorage.setItem('dayThreeSeen', 'true');
```

---

# Asset summary

| Asset | Filename | Description | Prompt provided |
|---|---|---|---|
| Park fountain | `park-fountain.png` | Morning park scene with three prominent bushes | Yes |
| Spare room | `spare-room.png` | Empty spare room interior, moonlit, no pet bed | Yes |
| Corgi sprite | `corgi.png` | Corgi sprite sheet (if not already created) | Refer to sprite prompt from earlier planning docs |

---

# Verification checklist

## Phase 1: Day 2 Morning
1. After clicking "Answer" on the incoming call, the new dialogue sequence plays
2. The caller's name and phone icon appear correctly in the `phone` style dialogue
3. `{{playerName}}` token resolves correctly in the narration
4. The park background loads and displays three visible bush regions
5. Tapping a non-corgi bush triggers the shake animation and "Nothing here" prompt
6. Tapping the corgi bush triggers the woof, corgi emergence animation, and sprite settles correctly
7. The petting interaction works identically to Day 1 with the corgi sprite
8. After 3 pets, the naming input appears
9. `{{secondPetName}}` token resolves correctly in all subsequent text
10. No console errors during the park scene

## Phase 2: Day 2 Evening
11. The shelter decision narration plays naturally without breaking immersion
12. The spare room background loads correctly
13. The pet bed asset is draggable and snaps into place on the rug when dropped in the target zone
14. Dropping the bed outside the target zone causes it to bounce back to the staging area
15. After the bed is placed, the corgi walks to the bed and settles in
16. Tapping the corgi triggers the tuck-in animation and blanket overlay
17. The transition to the main bedroom loads the correct background
18. The husky petting and tuck-in work identically to Day 1
19. The Day 2 title card displays both lines correctly
20. `GameState.ownedPets` contains two pets (husky and corgi) with correct names at day end

## Phase 3: Day 3 Morning
21. The Day 3 announcement narration plays without feeling rushed
22. "The Morning Board" is mentioned by name and feels natural in context
23. The Morning Board UI renders with 2 call cards visible
24. The tutorial overlay appears on first view
25. Each tutorial step highlights the correct UI region
26. The step indicator shows "1 of 3", "2 of 3", "3 of 3" correctly
27. Tapping "Got it" dismisses the tutorial and enables full board interaction
28. `morningBoardTutorialSeen` is set in localStorage
29. On subsequent visits, the tutorial does not appear
30. The Morning Board is fully interactive after the tutorial
31. No console errors during any phase
32. All sequences work correctly on mobile viewports
33. All sequences respect `prefers-reduced-motion`