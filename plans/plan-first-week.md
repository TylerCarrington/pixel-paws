## Overview

This phase transitions from tutorial into the actual game. The player now has a functional shelter (the spare room), a reliable way to find animals (the Morning Board), and a clear goal (save up for a proper shelter building). This is where the core loop solidifies: find, care, adopt, earn, expand.

---

# The Spare Room UI

## Layout and capacity

The spare room serves as the makeshift shelter until the player can afford a real building.

**Starting capacity:** 3 pet beds
**Upgraded capacity:** 4 pet beds (requires purchasing "Extra Pet Bed" from shop)

### Visual layout

The spare room background already exists (`spare-room.png`). Pet beds are placed as interactive elements on the rug:

**3-bed layout (starting):**
```
Bed positions on the rug (percentage-based):
  Bed 1: { top: 58%, left: 25% }  (left)
  Bed 2: { top: 58%, left: 50% }  (center)
  Bed 3: { top: 58%, left: 75% }  (right)
```

**4-bed layout (after upgrade):**
```
Bed positions shift to a 2×2 grid:
  Bed 1: { top: 52%, left: 32% }  (top-left)
  Bed 2: { top: 52%, left: 68% }  (top-right)
  Bed 3: { top: 68%, left: 32% }  (bottom-left)
  Bed 4: { top: 68%, left: 68% }  (bottom-right)
```

### Pet display on beds

Each occupied bed shows:
- The pet sprite in idle animation, scaled 2.5× from 16×16
- The pet's name below the sprite (11px, `--dialogue-text-color`)
- A small colored mood indicator dot (8px circle) in the top-right of the bed area
- A desirability bar (simple horizontal bar, 40px wide, 4px tall) below the name

**Mood indicator colors:**
- Happy: `#f5c87a` (warm amber)
- Calm: `#7ab87a` (mossy green)
- Anxious: `#c8a8d8` (soft lilac)
- Shy: `#b0a898` (stone grey)

### Interaction flow

1. Player taps a pet bed
2. The pet card expands or a modal appears showing:
   - Pet portrait (larger sprite, 4× scale)
   - Name and breed
   - Mood indicator with label ("Happy", "Calm", etc.)
   - Desirability bar with number (e.g., "Desirability: 45/100")
   - Available actions (4 buttons)
   - "Done" or "Close" button
3. Player selects one action
4. Action animation plays on the pet sprite
5. Desirability updates visibly
6. Action UI closes or greyed out (one action per day used)
7. Player returns to room view

---

# Desirability System

## Core mechanics

Each shelter animal has a desirability score (0–100). This represents how ready they are for adoption — a combination of health, cleanliness, confidence, and charm.

### Starting desirability
- Animals found **dirty**: start at 10-20
- Animals found **hiding**: start at 15-25
- Animals found **tangled**: start at 20-30
- Animals found **scared**: start at 10-20
- Animals found **other**: start at 25-35

Basically: the more traumatic the discovery method, the lower the starting desirability. They need more care.

### Daily action limit

**Normal days (shelter not full):** 1 action per animal per day
**Full shelter days (no morning board animal):** 2 actions per animal per day

This creates a natural trade-off: more animals = more adoption chances but less time per animal. A full shelter with extra actions rewards quality over quantity.

### Actions and base effectiveness

| Action | Base Desirability Gain | When it's effective | Notes |
|---|---|---|---|
| **Pet** | +5 | Always safe, never negative | The reliable choice |
| **Feed** | +8 | Neutral to all moods | Slightly better than pet |
| **Play** | +12 | Happy, Calm moods | Risky with Anxious/Shy |
| **Groom** | +10 | Calm, Shy moods | Less effective if Anxious |

### Mood modifiers

The animal's current mood multiplies the effectiveness of each action:

| Mood | Pet | Feed | Play | Groom |
|---|---|---|---|---|
| **Happy** | 1.0× | 1.0× | 1.4× | 0.9× |
| **Calm** | 1.2× | 1.0× | 1.1× | 1.3× |
| **Anxious** | 1.3× | 1.1× | 0.6× | 0.7× |
| **Shy** | 1.4× | 1.0× | 0.7× | 1.2× |

**Example calculations:**
- Play action on a Happy animal: 12 × 1.4 = **16.8 desirability** (round to 17)
- Play action on an Anxious animal: 12 × 0.6 = **7.2 desirability** (round to 7)
- Pet action on a Shy animal: 5 × 1.4 = **7 desirability**

**No action ever reduces desirability.** Even a "wrong" action for the mood still helps a little. The worst outcome is +3 (groom an anxious animal = 10 × 0.7 = 7).

### Luck variance

Add a small random modifier to keep things from feeling too deterministic:

Final desirability gain = `(base × mood modifier) × randomFloat(0.9, 1.1)`

This means a +10 action could actually give anywhere from 9 to 11, preventing the game from feeling like pure math.

### Visual feedback on action

When the player selects an action, show immediate feedback:

**Strong match (modifier ≥ 1.2):**
- Large heart particles (5-6 hearts)
- "+15!" in green pops up above the pet
- Tail wag or happy animation plays

**Neutral match (modifier 0.9-1.1):**
- Medium heart particles (3-4 hearts)
- "+8" in cream pops up
- Idle or content animation

**Weak match (modifier < 0.9):**
- Small heart particles (1-2 hearts)
- "+5" in muted grey pops up
- Subtle ear twitch or minimal reaction animation

This teaches the player through play which actions work best for which moods without explicitly telling them the multipliers.

---

# Adoption System

## Daily adoption roll

At the end of each day (when the player chooses "End Day"), every shelter animal rolls for adoption.

### Adoption probability formula

```
Base chance = min(desirability / 5, rarity_cap)
```

**Rarity caps:**
- Common: 20%
- Uncommon: 15%

**Examples:**
- Common pet with 60 desirability: min(60/5, 20) = **12% chance**
- Common pet with 100 desirability: min(100/5, 20) = **20% chance** (capped)
- Uncommon pet with 75 desirability: min(75/5, 15) = **15% chance** (capped)
- Uncommon pet with 40 desirability: min(40/5, 15) = **8% chance**

This means:
- Common pets need 100 desirability to max out at 20%
- Uncommon pets need 75 desirability to max out at 15%
- Low desirability pets have very low chances (20 desirability = 4% for common)

### Adoption ceremony

When an animal is adopted:
1. A family sprite appears (simple generic family silhouette, warm colors)
2. The pet portrait glows with a soft cream outline
3. A small text appears: *"[Pet Name] found a home!"*
4. The pet sprite and family fade out together
5. Cash payout appears and adds to the player's total with a small +$ animation
6. The pet is removed from the shelter

If multiple pets are adopted in one day, show them sequentially with a 1.5-second pause between each.

### Payout calculation

```
Payout = base_payout[rarity] × care_bonus
```

**Base payouts:**
- Common: $30
- Uncommon: $90

**Care bonus:**
Scales linearly based on desirability at time of adoption:
```
care_bonus = 1.0 + (desirability / 200)
```

**Examples:**
- Common pet adopted at 50 desirability: $30 × 1.25 = **$37.50** → round to **$38**
- Common pet adopted at 100 desirability: $30 × 1.5 = **$45**
- Uncommon pet adopted at 75 desirability: $90 × 1.375 = **$123.75** → round to **$124**
- Uncommon pet adopted at 40 desirability: $90 × 1.2 = **$108**

This rewards the player for investing care before adoption happens. A well-cared-for common pet earns 50% more than a neglected one.

---

# The Path to a Real Shelter

## Target: ~10 adoptions

Assuming a mix of common and uncommon pets with moderate care:
- 7 common pets at average 60 desirability: 7 × $40 = **$280**
- 3 uncommon pets at average 60 desirability: 3 × $100 = **$300**
- **Total: $580**

### Shelter building cost

**The Shelter:** $500

This is affordable in approximately 8–10 adoptions if the player cares for their animals reasonably well. A player who min-maxes desirability could hit it in 7. A player who rushes animals through with low desirability might need 12–13.

### Optional early purchase: Extra Pet Bed

**Extra Pet Bed:** $75

Expands spare room capacity from 3 to 4 beds. Costs about 2 common adoptions. Worthwhile if the player wants to speed up the adoption pipeline, but not required. A strategic choice, not a necessity.

**Should the player buy it?**
- Yes: If they want to process 4 animals at once for faster money accumulation
- No: If they'd rather save that $75 toward the shelter and work with 3 beds

This creates the game's first meaningful economic choice.

---

# Day 3 Gameplay Flow

## Morning: The Board

1. Player wakes up on Day 3
2. Morning Board has 1 new call (the system is now fully operational)
3. Player selects and responds to the call
4. Discovery mini-game plays
5. New animal is brought back to the spare room
6. Player names the animal (if this is a new mechanic for that discovery type, or skip if already named in mini-game)

**Current animals in spare room after Day 3 morning:**
- Day 2 corgi (already there from last night)
- Day 3 new pet (just rescued)
- (Empty bed slot)

## Afternoon: Spare Room Care

The player enters the spare room. A brief first-time tutorial appears:

### Spare Room Tutorial

```
{
  type: 'spareRoomTutorial',
  title: 'Your Shelter',
  steps: [
    {
      highlight: 'petBeds',
      text: 'Each animal rests in their own bed. Tap a bed to care for them.'
    },
    {
      highlight: 'actionButtons',
      text: 'You can perform one action per animal each day. Choose carefully — some animals respond better to certain actions.'
    },
    {
      highlight: 'desirabilityBar',
      text: 'As you care for animals, their desirability increases. The higher it is, the better their chances of finding a home.'
    },
    {
      highlight: 'moodIndicator',
      text: 'Each animal has a mood. Pay attention — it affects how they respond to your care.'
    }
  ],
  completionText: 'The rest is up to you.',
  dismissLabel: 'Got it'
}
```

After the tutorial, the player cares for their two animals:
1. Tap corgi bed → select action → desirability increases
2. Tap new pet bed → select action → desirability increases
3. "End Day" button appears (or becomes enabled after both actions used)

## Evening: Adoption Results & Bedtime

1. Player taps "End Day"
2. Adoption ceremony plays for each animal:
   - Corgi (assuming ~50 desirability from Day 2's single action): 10% chance → roll
   - New pet (assuming ~35 desirability starting + 1 action): 7% chance → roll
3. If any pet is adopted:
   - Celebration, payout shown, money added to wallet
   - Bed becomes empty
4. If no pets adopted:
   - A gentle message: *"No adoptions today. Tomorrow is a new day."*
5. Transition to bedtime in the main bedroom with the husky (first pet)
6. Tuck in husky, lights down, Day 4 begins

---

# Days 4–10+: The Grind to $500

Each day follows the same loop:
1. Morning Board → 1 new animal (if space available)
2. Care for 1–3 animals in spare room (1 action each, or 2 if shelter full)
3. End Day → adoption rolls
4. Earn money, empty beds refill next morning
5. Repeat

### Pacing considerations

**If the player gets unlucky with adoptions:**
- Low desirability animals have low chances — RNG can be cruel
- Some days no animals are adopted
- This is okay — the player just keeps caring for them, raising desirability
- Eventually high desirability (80-100) makes adoptions very likely

**If the shelter fills up:**
The morning board message appears:

> *"Word around town is your shelter is full. Others in town are taking care of the animals they find today."*

And the action count increases:

> *"Since you have extra time this morning, you can give each animal a little more attention."*
> 
> **2 actions per animal today**

This prevents the player from feeling stuck. A full shelter becomes a strategic state: no new income opportunities, but faster desirability growth on current animals.

### Buying the Extra Pet Bed

If the player has $75 and decides to buy the extra bed:
1. Shop interaction (simple purchase flow)
2. Spare room capacity increases to 4
3. Bed layout shifts to the 2×2 grid
4. Next morning, 1 more animal can be taken in
5. Slightly faster money accumulation (4 adoption chances instead of 3)

**Time to $500 with 3 beds:** ~8–12 days depending on luck and care quality
**Time to $500 with 4 beds:** ~7–10 days

The bed purchase saves approximately 1–2 days. Worthwhile for impatient players, skippable for patient ones.

---

# UI Components to Build

## 1. Spare Room Scene

**File:** `src/scenes/SpareRoomScene.js`

**Elements:**
- Background image: `spare-room.png`
- 3 or 4 pet bed containers (absolutely positioned as defined above)
- Each bed contains:
  - Pet sprite (if occupied)
  - Pet name label
  - Mood indicator dot
  - Desirability bar
- "End Day" button (bottom-right, disabled until all actions used or player chooses to skip)
- Money display (top-right corner, small cream pill: `$ XXX`)

**Interactions:**
- Tap bed → open pet detail modal
- Tap "End Day" → adoption ceremony

---

## 2. Pet Detail Modal

**File:** `src/components/PetDetailModal.js`

**Layout:**
```
┌─────────────────────────────────────┐
│  [Pet Name] — [Breed]               │
│  ┌─────────────┐                    │
│  │             │   Mood: [●] Happy  │
│  │  Pet Sprite │                    │
│  │   (large)   │   Desirability     │
│  │             │   [████████░░] 68  │
│  └─────────────┘                    │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │ Pet │ │Feed │ │Play │ │Groom│  │
│  │ +5  │ │ +8  │ │ +12 │ │ +10 │  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
│                                     │
│              [Done]                 │
└─────────────────────────────────────┘
```

**Behavior:**
- Displays current state of the selected pet
- Action buttons show base desirability gain (the modifier is hidden — player learns by experience)
- After action is selected:
  - Animation plays on the sprite
  - Desirability bar animates to new value
  - Numeric feedback pops up ("+12!" or similar)
  - Action buttons grey out (already used today)
  - "Done" button closes modal
- If action already used today, all action buttons appear greyed with "Already cared for today" note

---

## 3. Adoption Ceremony Screen

**File:** `src/components/AdoptionCeremony.js`

**Sequence:**
1. Fade spare room to a soft overlay
2. For each adopted animal:
   - Pet portrait appears center-screen (glowing outline)
   - Family silhouette fades in beside pet
   - Text: *"[Pet Name] found a home!"*
   - Cash payout animates in: *"+$38"*
   - Pet and family fade out together
   - 1.5s pause
3. After all adoptions:
   - Total earnings shown: *"Today's adoptions: $114"*
   - Wallet total updates with animation
   - "Continue" button fades in
4. Tap Continue → bedtime scene

**If no adoptions:**
- Simple centered text panel: *"No adoptions today. Tomorrow is a new day."*
- "Continue" button
- No ceremony, straight to bedtime

---

## 4. Full Shelter Message

**File:** `src/components/FullShelterMessage.js`

**Displays when:**
`GameState.shelterAnimals.length >= shelterCapacity` at the start of the morning

**Message:**
> *Word around town is your shelter is full. Others in town are taking care of the animals they find today.*
> 
> *Since you have extra time this morning, you can give each animal a little more attention.*
> 
> **You have 2 actions per animal today.**

**Styling:**
- Same dialogue panel as other narration
- Warm, reassuring tone
- "2 actions per animal" in slightly larger, highlighted text (amber color)

---

# Economy Summary Table

| Item | Cost | Earned From | Notes |
|---|---|---|---|
| Extra Pet Bed | $75 | — | Optional, expands capacity to 4 |
| The Shelter | $500 | — | Main goal, unlocks proper shelter building |
| Common adoption | — | $30–45 | Base $30, up to $45 with max care |
| Uncommon adoption | — | $90–135 | Base $90, up to $135 with max care |

**Average earnings per day (3 beds, moderate care):**
- ~0.4 adoptions per day (accounting for probability)
- ~$50 per day average
- **10 days to shelter**

**With 4 beds:**
- ~0.5 adoptions per day
- ~$65 per day average
- **7–8 days to shelter**

---

# Mood System Details

## How moods are assigned

When an animal arrives at the shelter, their mood is determined by:
1. **Discovery method** (primary factor)
2. **Random variance** (small chance to differ)

| Discovery Method | Likely Mood | Chance |
|---|---|---|
| Dirty | Calm (70%), Shy (30%) | Needs gentle care |
| Hiding | Shy (60%), Anxious (30%), Calm (10%) | Nervous but not aggressive |
| Tangled | Anxious (50%), Calm (40%), Shy (10%) | Stressed but relieved after rescue |
| Scared | Anxious (70%), Shy (30%) | High stress |
| Other | Happy (40%), Calm (40%), Shy (20%) | Depends on context |

### Mood persistence

Moods are **fixed per animal** — they do not change day to day. A Shy corgi stays Shy. This allows the player to learn each animal's personality and choose actions accordingly.

In future expansions, moods could shift based on care quality, but for the spare room phase, keep them static for simplicity.

---

# Data Model Updates

Add to `Animal` type:

```typescript
interface Animal {
  // ... existing fields
  mood: 'Happy' | 'Calm' | 'Anxious' | 'Shy';
  actionsUsedToday: number;  // 0, 1, or 2
}
```

Add to `GameState`:

```typescript
interface GameState {
  // ... existing fields
  shelterCapacity: number;        // 3 or 4
  money: number;                  // total cash
  actionsPerPetToday: number;     // 1 or 2 (2 if shelter full)
}
```

---

# Verification Checklist

1. Spare room displays 3 pet beds on Day 3
2. Tapping a bed opens the pet detail modal with correct name, breed, mood, desirability
3. Action buttons show base gains (+5, +8, +12, +10)
4. Selecting an action plays animation and updates desirability bar
5. Desirability never exceeds 100
6. Mood modifier is applied correctly (test Happy + Play = higher gain than Anxious + Play)
7. After 1 action, action buttons grey out and show "Already cared for today"
8. "End Day" button is disabled until all animals have been cared for (or player chooses to skip)
9. Adoption ceremony displays for each adopted animal
10. Payout calculation is correct (base × care bonus)
11. Money total updates correctly after adoptions
12. If no adoptions, gentle "no adoptions today" message appears
13. Empty beds are visible the next morning
14. Morning Board only shows call if shelter has space
15. If shelter is full, the full shelter message appears
16. If shelter is full, each animal gets 2 actions instead of 1
17. Extra Pet Bed purchase increases capacity to 4 and shifts bed layout to 2×2
18. After purchasing shelter for $500, money deducts correctly
19. Tutorial appears on first spare room visit only
20. All UI works on mobile viewport
21. No console errors
22. The loop feels satisfying — caring, adopting, earning, progressing
</parameter>