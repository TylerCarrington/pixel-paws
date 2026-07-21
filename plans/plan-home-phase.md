# Home Phase: Pet Leveling, Activities, Decorating & Dressing

## Overview

The home phase is where the player bonds with their permanent pets. This is the cozy counterbalance to the shelter's adoption-focused gameplay. Pets level up through daily activities and bedtime rituals, unlocking cosmetics and new interactions as they grow.

**Core systems:**
- Pet leveling (1–100, exponential scaling)
- Activity mini-games (10 games across 3 rooms, once per day per activity)
- Pet house decoration (placement memory, shop purchases)
- Pet accessories/dressing (visual customization, persistent display)
- Manual tuck-in bedtime (optional XP bonus)

---

# Leveling System Design

## XP and level curve

### XP required per level

The curve should be exponential so early levels feel fast and rewarding, while high levels (80+) require sustained daily play.

**Formula:**
```
XP_to_next_level = floor(100 × (current_level ^ 1.5))
```

**Example progression:**
| Level | XP to Next | Cumulative XP | Days to reach (approx) |
|---|---|---|---|
| 1 → 2 | 100 | 100 | 2 days |
| 5 → 6 | 559 | 2,425 | ~12 days from start |
| 10 → 11 | 1,581 | 11,385 | ~30 days from start |
| 25 → 26 | 6,250 | 86,750 | ~3 months |
| 50 → 51 | 17,677 | 456,533 | ~1 year |
| 75 → 76 | 32,475 | 1,330,750 | ~3 years |
| 99 → 100 | 49,005 | 3,283,500 | Peak endgame |

This means:
- Levels 1–10 are achievable in the first month
- Levels 10–25 are medium-term goals (2–3 months)
- Levels 25–50 are long-term (6 months to a year)
- Levels 50–100 are aspirational endgame content

### XP sources

| Source | XP Gained | Frequency |
|---|---|---|
| Activity mini-game | 80–150 XP | Once per day per activity |
| Manual tuck-in | 50 XP | Once per day per pet |
| Skip tuck-in | 0 XP | — |

**Daily max per pet (if player does everything):**
- 1 activity: ~120 XP average
- Manual tuck-in: +50 XP
- **Total: ~170 XP per day per pet**

This means:
- Level 1 → 2 in ~1 day (100 XP needed)
- Level 10 → 11 in ~9 days (1,581 XP / 170 per day)
- Level 25 → 26 in ~37 days (6,250 XP / 170 per day)

The player will level multiple pets in parallel, so they must choose: focus XP on one pet to unlock high-level content, or spread XP across pets to level everyone evenly.

---

# The 10 Activity Mini-Games

Each activity is a short (30–90 second) mini-game that awards XP once per day. Some require level milestones and/or purchases to unlock.

## Kitchen Activities

### 1. **Baking Treats** (Unlocked at Level 1, no purchase)
**Location:** Kitchen
**Mechanic:** Simple timing/rhythm game. Ingredients appear at the top of the screen (flour, egg, honey). Tap each ingredient in the correct order as they light up. Complete 5 sequences correctly to finish a batch of treats. The pet sits nearby, tail wagging as you work.
**XP Reward:** 80 XP
**Unlock:** Always available (starter activity)

---

### 2. **Fruit Catch** (Unlocked at Level 5, requires **Fruit Bowl - $40**)
**Location:** Kitchen
**Mechanic:** Toss fruit pieces in the air (tap to throw), the pet jumps to catch them. A meter shows the pet's position — time the throw so the fruit arc intersects with the pet's jump. Catch 8 out of 10 successfully to win.
**XP Reward:** 100 XP
**Unlock:** Level 5 + purchase Fruit Bowl from shop

---

### 3. **Cooking Together** (Unlocked at Level 15, requires **Chef's Apron - $90**)
**Location:** Kitchen
**Mechanic:** Prepare a simple dish (soup or stew). Drag ingredients from the counter into the pot in the correct order shown by icons. The pet "helps" by sitting nearby and occasionally nudging an ingredient toward you (auto-adds it to the pot as a bonus). Complete the recipe before the timer runs out.
**XP Reward:** 120 XP
**Unlock:** Level 15 + purchase Chef's Apron accessory (the pet wears it during this activity)

---

### 4. **Taste Tester** (Unlocked at Level 30, requires **Gourmet Treats Set - $150**)
**Location:** Kitchen
**Mechanic:** Present 5 different treats to the pet. The pet reacts to each (happy wag, neutral sniff, or dislike ear-back). You must remember which treats the pet liked and select only those from a lineup of 8 at the end. A memory matching game. Get 4 out of 5 correct.
**XP Reward:** 130 XP
**Unlock:** Level 30 + purchase Gourmet Treats Set

---

## Bedroom Activities

### 5. **Hide and Seek** (Unlocked at Level 1, no purchase)
**Location:** Bedroom
**Mechanic:** The pet "hides" behind furniture (bed, dresser, or curtain — only their tail or ear is visible). Tap the correct hiding spot. The pet pops out with a happy bark. Repeat 3 rounds with the hiding spot randomized each time.
**XP Reward:** 80 XP
**Unlock:** Always available (starter activity)

---

### 6. **Fetch** (Unlocked at Level 5, requires **Squeaky Toy - $75**)
**Location:** Bedroom
**Mechanic:** Throw the toy across the room (swipe to throw). The pet runs to fetch it and brings it back. You must time the throw to avoid hitting furniture (if you hit furniture, the pet gets confused and takes longer to return). Successfully fetch 5 times in a row without hitting furniture.
**XP Reward:** 100 XP
**Unlock:** Level 5 + purchase Squeaky Toy

---

### 7. **Puzzle Toy** (Unlocked at Level 20, requires **Smart Puzzle Feeder - $120**)
**Location:** Bedroom
**Mechanic:** A slider puzzle appears on screen. Slide tiles to reveal a treat compartment. The pet watches eagerly. Complete the puzzle within the time limit and the pet gets the treat. Puzzle difficulty increases slightly each time (3×3 grid at first, 4×4 at higher levels).
**XP Reward:** 125 XP
**Unlock:** Level 20 + purchase Smart Puzzle Feeder

---

## Family Room Activities

### 8. **Tug of War** (Unlocked at Level 1, no purchase)
**Location:** Family Room
**Mechanic:** Tap rapidly to pull on a rope toy. The pet pulls back with varying strength (shown by a tug meter). You must tap at the right rhythm to win without pulling too hard (which would make the pet let go). Win 2 out of 3 rounds.
**XP Reward:** 80 XP
**Unlock:** Always available (starter activity)

---

### 9. **Obstacle Course** (Unlocked at Level 10, requires **Agility Set - $100**)
**Location:** Family Room
**Mechanic:** The pet runs through a small obstacle course (jump over a low hurdle, weave through cones, run through a tunnel). You tap directional arrows to guide them (left, right, jump). Complete the course in under 15 seconds without mistakes.
**XP Reward:** 110 XP
**Unlock:** Level 10 + purchase Agility Set

---

### 10. **Tricks Showcase** (Unlocked at Level 50, requires **Champion Ribbon - $300**)
**Location:** Family Room
**Mechanic:** The pet performs a series of tricks (sit, spin, play dead, high-five). You must input the correct sequence of commands (tap icons in the right order) to match the trick routine displayed at the start. A Simon-says style memory game but with trick commands. Complete 6 tricks in sequence without error.
**XP Reward:** 150 XP
**Unlock:** Level 50 + purchase Champion Ribbon (a cosmetic reward that shows mastery)

---

## Activity unlock summary table

| Activity | Room | Level | Purchase | XP |
|---|---|---|---|---|
| Baking Treats | Kitchen | 1 | — | 80 |
| Hide and Seek | Bedroom | 1 | — | 80 |
| Tug of War | Family Room | 1 | — | 80 |
| Fruit Catch | Kitchen | 5 | $40 | 100 |
| Fetch | Bedroom | 5 | $75 | 100 |
| Obstacle Course | Family Room | 10 | $100 | 110 |
| Cooking Together | Kitchen | 15 | $90 | 120 |
| Puzzle Toy | Bedroom | 20 | $120 | 125 |
| Taste Tester | Kitchen | 30 | $150 | 130 |
| Tricks Showcase | Family Room | 50 | $300 | 150 |

---

# Pet Houses & Decoration System

## Starter: The Dog House

The player starts with a **dog house** (exterior structure, placed in the backyard or side yard of the main house). This is where the husky lives. The dog house comes with a single pet bed (required, cannot be removed).

### Unlocking more pet houses

Each additional permanent pet requires purchasing a new pet house:

| Pet House Type | Cost | Capacity | When to buy |
|---|---|---|---|
| Dog House | Starter | 1 pet | Already owned |
| Cat Tree House | $200 | 1 pet | When adopting a permanent cat |
| Small Animal Hutch | $150 | 1 pet | When adopting a rabbit, guinea pig, etc. |
| Aviary | $250 | 1 pet | When adopting a bird |

**Design intent:** The player can only keep as many permanent pets as they have houses for. This creates strategic decisions: "Do I save up for a cat house so I can keep this rare cat, or do I let them be adopted out and earn money?"

### Decoration shop

Decorations are purchased from the **Home & Garden** tab of Pets R Us. Examples:

| Item | Cost | Description |
|---|---|---|
| Cozy Rug | $30 | A soft rug for the floor |
| Food Bowl (ceramic) | $20 | Decorative bowl |
| Toy Basket | $25 | Holds toys visually |
| Wall Art (bone) | $35 | Hangs on the wall |
| Hanging Plant | $40 | Ceiling decoration |
| Cushion (round) | $15 | Small floor cushion |
| Lamp (warm) | $50 | Adds ambient light glow |

Decorations are cosmetic only — they do not affect gameplay. They exist purely for player expression and making each pet's house feel unique.

---

# Dressing System

Accessories are purchased from the **Pet Accessories** shop tab. They are placed on specific zones of the pet sprite and persist everywhere the pet is displayed.

## Accessory zones

Each pet sprite has defined attachment points:

| Zone | Description | Example Accessories |
|---|---|---|
| Head | Hats, bows, flowers | Party Hat, Flower Crown, Beret |
| Neck | Collars, bandanas, scarves | Bandana, Bow Tie, Scarf |
| Body | Sweaters, capes, vests | Sweater, Rain Coat, Cape |
| Back | Wings, backpacks | Angel Wings, Backpack |

### Accessory shop examples

| Item | Cost | Zone | Unlock Level |
|---|---|---|---|
| Red Bandana | $25 | Neck | 1 |
| Party Hat | $40 | Head | 5 |
| Cozy Sweater | $60 | Body | 10 |
| Bow Tie | $35 | Neck | 5 |
| Flower Crown | $50 | Head | 15 |
| Rain Coat | $70 | Body | 20 |
| Angel Wings | $150 | Back | 30 |
| Beret | $45 | Head | 10 |

Accessories unlock at certain pet levels — you cannot purchase a $150 accessory for a level 5 pet.

### Placement and persistence

When the player equips an accessory:
1. Open the pet's dressing screen
2. Select an accessory from inventory
3. Drag it onto the pet sprite — it snaps to the correct zone
4. The accessory is saved to the pet's `equippedAccessories` object
5. Everywhere the pet appears (activities, bedtime, house view), the accessory is rendered on top of the base sprite

**Data structure:**
```typescript
equippedAccessories: {
  head: 'partyHat' | null,
  neck: 'redBandana' | null,
  body: null,
  back: null
}
```

---

# Phase Breakdown

---

# Phase 5: Manual Tuck-In & XP Bonus

## Goal
The bedtime ceremony offers two options: manual tuck-in (interactive, +50 XP) or skip (instant, no XP). This rewards players who engage with the ritual while respecting those who want to move quickly.

## Deliverables

### 1. Bedtime options screen
When bedtime begins, instead of auto-starting the tuck-in, show a choice:

```
┌─────────────────────────────────────┐
│   Time to tuck in [Pet Name]        │
│                                     │
│  ┌──────────────┐  ┌──────────────┐│
│  │  Tuck In     │  │    Skip      ││
│  │  Manually    │  │              ││
│  │              │  │              ││
│  │  +50 XP      │  │   No XP      ││
│  └──────────────┘  └──────────────┘│
│                                     │
└─────────────────────────────────────┘
```

### 2. Manual tuck-in flow
If the player chooses "Tuck In Manually":
- The bedroom interior appears with the pet standing near the bed
- Player taps the pet bed (same interaction as Day 1)
- Pet walks to bed
- Player taps pet to tuck them in
- Blanket overlay appears
- +50 XP awarded with small notification
- Lights fade
- Advance to next pet or end of day

### 3. Skip flow
If the player chooses "Skip":
- Instant fade to lights down
- Pet is already tucked in (no interaction)
- No XP awarded
- Advance immediately to next pet or end of day

### 4. Multi-pet handling
If the player has multiple permanent pets (e.g., husky + a kept shelter pet):
- Present the tuck-in choice for each pet sequentially
- Player can choose manual for one and skip for another
- XP is awarded per pet based on their choice

## Assets needed

None — reuses existing bedroom interior from Phase 3.

## Verification checklist

1. Bedtime options screen appears with "Tuck In Manually" and "Skip" buttons
2. Both buttons show XP amounts correctly (+50 XP vs No XP)
3. Choosing "Tuck In Manually" starts the interactive sequence
4. Manual tuck-in awards +50 XP and shows notification
5. Choosing "Skip" bypasses the interaction and awards no XP
6. XP from manual tuck-in is added to the pet's total correctly
7. If the player has 2 pets, the choice appears for each separately
8. Skipping one pet and manually tucking another works correctly
9. After all pets are tucked in, the day ends and transitions to next morning
10. No console errors

---
# Phase 6: Dressing System (Optional)

## Goal
Players can purchase accessories, equip them on their pet, and see them displayed everywhere the pet appears.

## Deliverables

### 1. Accessory shop
Add **Pet Accessories** tab to Pets R Us:
- Red Bandana ($25, Neck, Level 1)
- Party Hat ($40, Head, Level 5)
- Bow Tie ($35, Neck, Level 5)
- Cozy Sweater ($60, Body, Level 10)
- Beret ($45, Head, Level 10)
- Flower Crown ($50, Head, Level 15)
- Rain Coat ($70, Body, Level 20)
- Angel Wings ($150, Back, Level 30)

Accessories are locked if the pet's level is too low. Purchased accessories go into inventory.

### 2. Dressing screen
- Opens from a "Dress" button in the home view or pet detail screen
- Shows the pet sprite large in the center
- Accessory inventory on the side or bottom
- Drag accessory onto the pet — it snaps to the correct zone (head, neck, body, back)
- Equipped accessories are saved:
  ```typescript
  equippedAccessories: {
    head: 'partyHat' | null,
    neck: 'redBandana' | null,
    body: 'cozySweater' | null,
    back: null
  }
  ```

### 3. Persistent display
Everywhere the pet is rendered (activities, bedtime, house view, detail screens), the equipped accessories render on top of the base sprite at the correct attachment points.

**Implementation:**
- Each accessory sprite is a small 16×16 overlay
- Position it relative to the pet sprite's head, neck, body, or back zone
- Render order: base pet sprite → body accessory → neck accessory → head accessory → back accessory
- Some accessories (like wings) render behind the pet sprite (z-index layering)

## Assets needed

### Accessory sprites

Each accessory is a 16×16 sprite designed to overlay on the pet sprite.

**Sprite generation prompt (use for each accessory):**

> Pixel art accessory sprite, [ACCESSORY DESCRIPTION], designed to overlay on a 16×16 dog sprite at the [ZONE] position, warm cozy aesthetic, soft colors from palette: blush pinks, warm creams, warm ambers, mossy greens. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black. Transparent background. The accessory should be small and clearly readable when placed on a pet sprite. No full character, just the accessory item. No text.

Replace `[ACCESSORY DESCRIPTION]` and `[ZONE]`:
- "red bandana tied around neck" (Neck)
- "small party hat with a pom-pom on top" (Head)
- "bow tie, formal black with cream center" (Neck)
- "knit sweater in soft cream with pink stripes" (Body)
- "small beret, tilted, in warm amber" (Head)
- "flower crown with small blush pink flowers and green leaves" (Head)
- "yellow rain coat with hood, small and cute" (Body)
- "small angel wings, white with soft pink glow" (Back)

## Verification checklist

1. Accessory shop displays all items with level locks
2. Locked accessories show lock icon and "Level X required"
3. Purchasing an accessory adds it to inventory and deducts money
4. Dressing screen opens and shows pet sprite
5. Dragging accessory onto pet equips it in the correct zone
6. Equipped accessories appear on the pet sprite immediately
7. Equipping a second head accessory replaces the first (only one per zone)
8. Accessories persist after closing and reopening dressing screen
9. Pet sprite in activities shows equipped accessories
10. Pet sprite in bedtime ceremony shows equipped accessories
11. Pet sprite in house view shows equipped accessories
12. Removing an accessory (drag off or tap to unequip) works correctly
13. No console errors during equipping/unequipping

---


# Phase 7 (Optional): Additional Pet Houses

## Goal
Allow the player to purchase and unlock houses for other species, enabling them to keep more than one permanent pet.

## Deliverables

### 1. Pet house shop
Add **Pet Houses** tab to Pets R Us:
- Cat Tree House ($200) — interior for cats
- Small Animal Hutch ($150) — interior for rabbits, guinea pigs
- Aviary ($250) — interior for birds

### 2. House interior backgrounds
Each pet house has a unique interior that matches the species.

### 3. Permanent pet adoption flow
When adopting out an animal from the shelter, add a prompt:
- "Would you like to keep [Pet Name] as your own?"
- "This requires purchasing a [Species] House for $X."
- If yes and player has enough money: deduct cost, unlock house, pet moves to owned pets
- If no or not enough money: pet is adopted out as normal

## Assets needed

### Cat Tree House interior: `src/assets/images/cat-house-interior.png`

**Prompt:**
> Pixel art interior scene, inside a cozy cat tree house structure, viewed from slight top-down angle, warm and playful. Multi-level wooden platforms and cubbies for climbing, soft cushions in blush pink and cream on each level, a small round window showing cherry blossoms outside, scratching post in one corner, hanging toys on strings from the ceiling, warm natural light. Open space on the lower level for decorations. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers. Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text.

### Small Animal Hutch interior: `src/assets/images/hutch-interior.png`

**Prompt:**
> Pixel art interior scene, inside a cozy small animal hutch, viewed from slight top-down angle, warm and safe. Wooden walls and floor in warm honey browns, a small hay pile in one corner, a ceramic water bowl, a wooden hideaway tunnel, soft bedding made of paper shreds in cream and pink tones, a small round window with cherry blossoms visible outside, warm natural light. Open floor space for decorations. Built for rabbits or guinea pigs. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers, honey browns. Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text.

### Aviary interior: `src/assets/images/aviary-interior.png`

**Prompt:**
> Pixel art interior scene, inside a cozy aviary structure for a pet bird, viewed from slight top-down angle, warm and airy. Wooden perches at different heights, a small swing hanging from the ceiling, a seed dish and water dish on a low platform, soft natural light coming through a mesh window showing cherry blossoms outside, a small nesting box in the corner with soft moss bedding, open floor space for decorations. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers, honey browns. Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text.

## Verification checklist

1. Pet house shop displays all house types with costs
2. Purchasing a house deducts money correctly
3. The new house appears in the home view as an enterable location
4. Entering the house shows the correct interior background
5. When adopting an animal, the "Keep as your own?" prompt appears
6. If the player chooses to keep and purchases the house, the pet moves to owned pets
7. The pet appears in their new house interior
8. Decorations and dressing work in the new house interiors
9. Activities can be played with the new pet
10. Multiple permanent pets can be tucked in sequentially at bedtime

---

# Summary of All Phases

| Phase | Deliverable | Key Systems | Validation Focus |
|---|---|---|---|
| 1 | Leveling + 1 activity | XP, levels, activity cooldown | Level-up works, XP scales correctly |
| 2 | Kitchen activities | 3 mini-games, shop gating | Unlocks work, once-per-day enforced |
| 3 | Bedroom + Family Room | 6 mini-games, 2 backgrounds | All 10 activities playable |
| 4 | Decoration | Pet house interior, placement, persistence | Decorations save and load correctly |
| 5 | Dressing | Accessories, zones, persistent display | Accessories show everywhere |
| 6 | Manual tuck-in | Bedtime choice, XP bonus | Manual vs skip works, XP awarded |
| 7 (Optional) | More pet houses | Multiple species houses, adoption flow | Multi-pet ownership works |

---

# Final Data Model Updates

```typescript
interface Animal {
  // ... existing fields
  level: number;
  currentXP: number;
  totalXP: number;
  activityCooldowns: { [activityKey: string]: boolean };
  equippedAccessories: {
    head: string | null;
    neck: string | null;
    body: string | null;
    back: string | null;
  };
}

interface GameState {
  // ... existing fields
  petHouseDecorations: {
    [petId: string]: {
      [decorationId: string]: { x: number, y: number, itemKey: string }
    }
  };
  ownedPetHouses: string[];  // ['dogHouse', 'catTreeHouse', ...]
  decorationInventory: string[];
  accessoryInventory: string[];
}
```