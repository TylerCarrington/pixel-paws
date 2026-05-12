# Change Request: Husky Reveal, Naming, Bonding & First Night

## Context
The wash/reveal mechanic is already implemented and working. The husky sprite already exists in the project. This change handles everything that happens after the husky is fully revealed on the riverside — the naming moment, the walk home, the petting interaction inside the house, and the first bedtime ceremony. This is the emotional payoff of Day 1 and sets the tone for every future bedtime.


---

## Sequence overview

```
Husky fully revealed on riverside
  → Narration beat — the reveal reaction
  → Naming input — right there on the riverside
  → Narration beat — the walk home (scene cut)
  → Background crossfade to house interior
  → Petting interaction — 3 taps, hearts, husky reacts
  → Gentle tuck-in prompt appears
  → Player taps the dog bed
  → Husky walks-to-bed animation plays
  → Player taps husky to tuck in
  → Lights fade, moonlight only
  → Title card — end of Day 1
  → Fade to stars
  → Day 2 morning begins
```

---

## Script additions — append to `dayOneScript.js`

Add the following beats immediately after the existing `end` beat that hands off from the wash interaction. The wash scene should call back into this script at the `postReveal` entry point rather than ending cold.

```js
// ── POST REVEAL ───────────────────────────────────────────
{
  id: 'postReveal',
  type: 'background',
  image: 'src/assets/images/riverside-bridge-close.png',
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
  image: 'src/assets/images/house-dawn.png',
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
  image: 'src/assets/images/house-interior.png',
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
  type: 'tuckInInteraction',
  petName: '{{firstPetName}}',
  spriteKey: 'husky',
  bedTarget: 'dogBed',
  promptText: 'Tap the bed to help {{firstPetName}} settle in.',
  confirmText: 'Tap {{firstPetName}} to tuck them in.'
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
```

---

## New beat types to implement

### `pettingInteraction`

The first interactive bonding moment. The husky sprite is displayed centered on screen above the dialogue panel. The player taps or clicks the sprite to give pets.

**Behavior:**
- Show the husky sprite in its idle animation on the interior background
- Display the `promptText` in the dialogue panel (narration style, no speaker, no portrait)
- Each tap on the sprite triggers:
  - The husky's `beingPetted` animation plays once
  - A small cluster of 3–4 pixel heart particles float upward from the sprite and fade out
  - A soft pop sound plays (when audio is implemented)
  - An internal pet counter increments
- After the 3rd tap:
  - The husky plays its `tailWag` animation
  - A slightly larger heart appears and lingers for 800ms before fading
  - The `completionText` replaces the prompt text in the dialogue panel
  - A tap/click anywhere advances to the next beat
- The player cannot advance before 3 pets have been given — the advance indicator is hidden until the 3rd pet is received
- Token replacement applies to all text fields in this beat

**Sprite positioning:**
- Centered horizontally
- Bottom of sprite sits approximately 40% from the bottom of the screen — sitting above the dialogue panel with comfortable breathing room
- Sprite should be rendered at 3× or 4× scale (from its native 16×16) so it reads clearly on screen
- Do not crop the sprite — ensure the full sprite including tail is visible

**Heart particles:**
- Reuse the `HeartParticle` component already built for this system
- Spawn position: top-center of the sprite bounding box
- Drift upward and slightly left or right randomly
- Fade out over 900ms

---

### `tuckInInteraction`

The first bedtime ceremony. Two-step interaction — first the player taps the bed, then taps the husky.

**Step 1 — Tap the bed:**
- The interior background is shown
- The husky sprite stands on the rug, idle animation
- A soft pulsing highlight (a gentle cream glow, CSS `box-shadow` pulse) appears around the dog bed area of the background image
  - Position this highlight as an absolutely-positioned overlay div. Coordinates for the dog bed highlight region should be defined as percentage-based values so they scale with the viewport. Set the default to approximately `{ top: 58%, left: 28%, width: 18%, height: 12% }` — adjust after seeing the actual interior asset.
- The `promptText` appears in the dialogue panel
- When the player taps inside the highlight region:
  - The bed highlight fades out
  - The husky plays its `walkToBed` animation, moving toward the bed position
  - Animation completes with the husky in the curled-up position on the bed

**Step 2 — Tap the husky:**
- The `confirmText` appears in the dialogue panel
- A soft pulsing highlight appears around the husky's new position on the bed
- When the player taps the husky:
  - The `curlUp` animation plays if not already in curl position, or a gentle ear-twitch if already curled
  - A single soft heart floats up and fades
  - A small cream blanket overlay fades in over the husky sprite — a simple pixel rectangle in cream/pink, slightly transparent, suggesting they are tucked in
  - The dialogue panel fades out
  - Advance automatically after 1200ms to the `lightsDown` beat

---

### `lightsDown`

Dims the interior scene to simulate the candle being blown out, leaving only moonlight.

**Behavior:**
- Apply a dark overlay (`background: rgba(20, 14, 30, 0.72)`) over the interior background
- Fade the overlay in over the `duration` specified in ms
- The warm amber tones of the room cool to a soft blue-silver moonlit quality
- Achieve this with a second overlay: `background: rgba(180, 200, 220, 0.12)` fading in simultaneously
- The husky sprite remains visible in its sleeping position, softened by the darkness
- Hold for 800ms after full darkness, then auto-advance
- Player cannot skip this beat

---

## Connecting the wash scene to this script

The existing wash interaction ends when the reveal is complete. Update the wash scene's completion handler to:

1. Check that the revealed animal is the first pet (Day 1, `dayOneWalkSeen` not yet set)
2. If so, do not transition to the main game — instead call the `DayOneWalk` scene continuation at the beat with `id: 'postReveal'`
3. Pass the revealed animal data (species: husky) into the scene so the correct sprite is used in `pettingInteraction` and `tuckInInteraction`

For all future wash interactions (Day 2 onwards), the wash scene transitions to the shelter floor as normal.

---

## Token additions

Add `firstPetName` to the token replacement system alongside `playerName` and `townName`. It should resolve correctly in all beat text fields after the `nameInput` beat with `saveAs: 'firstPetName'` is confirmed.

Save `firstPetName` to `GameState.ownedPets[0].name` as well as to the token store so it persists correctly.

---

## State updates on completion

When the `end` beat with `next: 'dayTwoMorning'` is reached:

```js
// Add the husky to owned pets
GameState.ownedPets.push({
  id: generateId(),
  species: 'DOG',
  breed: 'Husky',
  name: GameState.tokens.firstPetName,
  rarity: 'COMMON',
  isRevealed: true,
  desirability: 50,
  healthStatus: 'HEALTHY',
  vetDaysRemaining: 0,
  isMine: true,
  outfits: [],
  discoveryMethod: 'DIRTY'
});

// Mark day one complete
localStorage.setItem('dayOneSeen', 'true');
localStorage.setItem('dayOneWalkSeen', 'true');
```

---

## Verification checklist

1. After the husky is fully revealed in the wash interaction, the narration beats appear on the riverside background without any blank screen gap
2. The naming input appears on the riverside — not after a scene change
3. `{{firstPetName}}` resolves correctly in all subsequent text including "their tail wagged" beat
4. The crossfade to `house-dawn.png` and then to `house-interior.png` both transition smoothly
5. The husky sprite appears centered and clearly readable above the dialogue panel in the interior scene
6. Tapping the husky once triggers the petting animation and spawns hearts
7. The advance indicator does not appear until 3 pets have been given
8. After the 3rd pet the tail wag animation plays and the completion text appears
9. After advancing, the dog bed highlight pulses gently on the interior background
10. Tapping the bed triggers the walk-to-bed animation and the husky moves to the bed position
11. The second prompt appears asking the player to tap the husky in the bed
12. Tapping the husky in bed plays the curl or ear-twitch, a blanket overlay fades in, and the panel fades out
13. The lights-down sequence dims the room warmly without making the scene feel scary or cold
14. The Day 1 title card appears correctly with both lines
15. `GameState.ownedPets` contains one husky with the correct name after the sequence ends
16. `dayOneSeen` and `dayOneWalkSeen` are both set in localStorage
17. Day 2 morning begins correctly after the fade
18. No console errors at any point during the sequence
19. The full sequence works on a mobile-sized viewport with no layout breakage
20. With `prefers-reduced-motion` enabled all transitions are instantaneous and the sequence completes correctly