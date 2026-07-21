# Late-Stage Progression: Home & Shelter Expansion

## Overview

This document covers the evolution of both the player's home and shelter as the game matures. The home becomes a true multi-pet household with meaningful choices about which animals to keep. The shelter expands through a branching species unlock system that creates unique player progression paths.

**Core principles:**
- Every expansion costs money and requires deliberate choice
- Species are no longer inherently rare — all species have common/uncommon/rare variants
- The player's first species extension is their choice (creating unique paths)
- Building takes time (creates anticipation)
- Home and shelter expansions are interlinked but serve different purposes

---

# Part 1: Home Expansion System

## Current State (Post-Day 1)
- Player has 1 permanent dog (the first husky from Day 1)
- Dog lives in the dog house exterior
- Player can interact, level up, dress, and tuck in this dog

## The Problem
The home feels like "a house with a dog house" rather than "a home full of animals." Adding more permanent pets should feel natural and exciting, not just functional.

---

# Phase 1: The Second Dog & Bedroom Integration

## Goal
Allow the player to bring a second dog home. One dog lives in the bedroom (house-interior), one in the dog house. They can swap locations freely.

## New Home Structure

### Location 1: House Interior (Bedroom)
**Existing asset:** `src/assets/images/backgrounds/house-interior.png`

**What changes:**
- A dog bed is now a permanent fixture in the bedroom (update the background asset or add a persistent overlay)
- When a dog is assigned to the bedroom, they appear on this bed during home phase activities
- During bedtime, this dog gets tucked in first (in the bedroom), then transition to the dog house for the second dog

### Location 2: Dog House
**Existing asset:** `src/assets/images/backgrounds/dog-house-interior.png`

**What changes:**
- Remains identical, still has decorations
- This is where the second dog lives and gets tucked in

## Purchasing the Second Dog Slot

**Unlock:** After shelter upgrade (when they have 6 dog kennels)

**Item in shop:** "Bedroom Pet Bed — $150"
- Appears in **Home & Garden** tab
- Description: *"A cozy bed for the bedroom. Allows a second dog to live in your home."*

**Effect:**
- `GameState.homeDogCapacity` increases from 1 to 2
- A "Bring Home" button appears on dog detail screens in the shelter
- A "Swap Locations" button appears in the home view

## Swapping Locations

In the home phase view, a small UI button appears: **"Manage Pets"**

Opens a simple modal:
```
┌────────────────────────────────────┐
│  Your Home                         │
│                                    │
│  Bedroom:                          │
│    [Husky sprite] Max              │
│    [Swap] [Activities]             │
│                                    │
│  Dog House:                        │
│    [Corgi sprite] Biscuit          │
│    [Swap] [Activities]             │
│                                    │
│  [Done]                            │
└────────────────────────────────────┘
```

**Swap button:**
- Tapping "Swap" next to Bedroom pet moves them to Dog House
- Tapping "Swap" next to Dog House pet moves them to Bedroom
- Only works if there are 2 dogs; if only 1, the button is greyed

**Activities button:**
- Shortcuts directly to that pet's activity selection screen

---

# Phase 2: Adding Cats to the Home

## The Cat Integration

Cats cannot live in the dog house. They need their own space.

### Family Room Integration

**Asset needed:** `src/assets/images/backgrounds/family-room.png`
pet-bed: `src/assets/images/items/pet-bed.png`

## Purchasing the First Cat Slot

**Family Room Cat Bed (Option A):** $200
- Appears in **Home & Garden** tab after cats unlocked
- Adds a cat bed to the family room
- `GameState.homeCatCapacity` increases from 0 to 1

---

# Phase 3: Pet Transfer System (Shelter ↔ Home)

## Bringing Shelter Pets Home

When viewing a pet in the shelter, if the player has an open home slot for that species, a button appears:

**"Bring [Pet Name] Home — Make Permanent"**

Tapping it:
1. Confirmation dialog: *"Are you sure you want to bring [Pet Name] home? They will no longer be available for adoption."*
2. If confirmed:
   - Pet is removed from `shelterAnimals`
   - Pet is added to `ownedPets`
   - Pet moves to the appropriate home location (bedroom, dog house, family room, or sunroom)
   - A small celebration: *"Welcome home, [Pet Name]!"*

## Putting Owned Pets Up for Adoption

In the "Manage Pets" home screen, each owned pet has a new option:

**"Put Up for Adoption"**

Tapping it:
1. Warning dialog: *"Are you sure? [Pet Name] will move to the shelter and could be adopted by someone else."*
2. Additional note: *"You can bring them back home anytime before they're adopted."*
3. If confirmed:
   - Pet is removed from `ownedPets`
   - Pet is added to `shelterAnimals`
   - Pet keeps all levels, XP, and equipped accessories
   - A bittersweet message: *"[Pet Name] is waiting at the shelter."*

**Why allow this?**
- Player discovers a rarer pet they want to keep instead
- Player wants to focus leveling on fewer pets
- Player accidentally brought home the wrong pet
- Adds emotional weight — giving up a leveled pet you've bonded with is a meaningful decision

---

# Phase 4: Leveling Animations & Idle Behaviors

## Cosmetic Animations Unlocked by Level

As pets level up, they unlock small CSS animation behaviors that play randomly during idle time in the home. These are purely cosmetic — no XP reward, just charm.

**Level thresholds:**
- Level 5: First idle animation
- Level 10: Second idle animation
- Level 20: Third idle animation
- Level 30: Fourth idle animation
- Level 50: Fifth idle animation (rare/special)

### Dog Idle Animations

| Level | Animation | Description |
|---|---|---|
| 5 | Stretch | Dog does a full-body stretch (front paws forward, rear up, tail wag) |
| 10 | Chase Tail | Dog spins in a circle chasing their tail, then sits looking satisfied |
| 20 | Dream Twitch | While sleeping, ears twitch and paws paddle (dreaming animation) |
| 30 | Play Bow | Dog drops into a play bow position (front down, rear up), tail wagging, then bounces up |
| 50 | Happy Zoomie | Dog does a quick excited run in a small circle (the "zoomies"), then flops down panting happily |

### Cat Idle Animations

| Level | Animation | Description |
|---|---|---|
| 5 | Groom | Cat licks one paw and wipes it over their ear and face |
| 10 | Slow Blink | Cat does a slow affectionate blink (the "cat kiss") directly at the camera |
| 20 | Loaf Position | Cat settles into "loaf" position (paws tucked under, compact) and purrs |
| 30 | Pounce Practice | Cat crouches, wiggles rear, pounces at an imaginary target, sits proudly |
| 50 | Kneading | Cat kneads with front paws on their bed/cushion while purring (ultimate contentment) |

### How They Trigger

**During home phase:**
- When viewing a pet in their home location (bedroom, dog house, family room, sunroom)
- Random chance every 15-30 seconds that an unlocked animation plays
- Animations are weighted: lower-level ones play more often, high-level ones are rarer
- Each animation plays its full sequence (3-5 seconds) then returns to idle
- If multiple animations are unlocked, one is chosen randomly from the pool

**Technical implementation:**
Each animation is a CSS keyframe sequence that plays on the pet sprite. No new sprite frames needed if using CSS transforms (scale, rotate, translate, skew). For more complex animations like "groom" or "kneading," use alternate sprite frames that swap in during the animation.

---

# Part 2: Shelter Expansion System

## Rethinking Species Rarity

**Old system:**
- Dogs = common species with common/uncommon/rare breeds
- Cats = uncommon species with rare breeds
- Exotic species = always rare

**New system:**
- **Every species has common, uncommon, and rare variants**
- Species unlock is about *diversity*, not rarity
- Rarity is about *individual pet appeal within a species*

**Examples:**

| Species | Common Variant | Uncommon Variant | Rare Variant |
|---|---|---|---|
| Dogs | Mixed breed, Beagle | Corgi, Husky, Shiba Inu | Dalmatian, Akita, Samoyed |
| Cats | Tabby, Black Cat | Tuxedo, Calico, Tortie | Siamese, Persian, Ragdoll |
| Rabbits | Brown Rabbit, White Rabbit | Lop-Eared, Dutch | Lionhead, Angora, Flemish Giant |
| Birds | Parakeet, Canary | Cockatiel, Lovebird | Parrot, Macaw, Cockatoo |
| Small Animals | Hamster, Guinea Pig | Fancy Rat, Ferret | Chinchilla, Hedgehog, Sugar Glider |
| Reptiles | Garter Snake, Turtle | Corn Snake, Bearded Dragon | Ball Python, Gecko, Blue-Tongued Skink |
| Aquatic | Goldfish, Betta | Koi, Axolotl | Rare Koi Variants, Exotic Saltwater Fish |

This makes every species equally deep and rewards specialization.

---

# Phase 5: First Species Extension (Player Choice)

## When It Unlocks

After purchasing the first shelter ($500) and operating it for a while, a new shop category appears: **Shelter Extensions**

**Unlock condition:**
- Player has completed at least 20 total adoptions (shows commitment)
- Player has at least $400 saved (can afford an extension)

## The First Extension Choice

The player can choose **one** species extension to add to their shelter. This is a major decision — it shapes their mid-game experience.

**Available first extensions:**

| Species | Cost | Build Time | Unlocks |
|---|---|---|---|
| Rabbits & Small Animals | $400 | 3 days | Hutch room, rabbit/guinea pig/hamster/rat discoveries |
| Birds | $450 | 3 days | Aviary room, bird discoveries |
| Reptiles | $500 | 4 days | Reptile habitat, reptile discoveries |
| Aquatic | $550 | 4 days | Aquarium room, fish/axolotl discoveries |

**Each extension includes:**
- A new shelter room (6 capacity for that species)
- Morning Board calls for that species start appearing
- A corresponding **home item** unlocks in the shop (for bringing one home as a permanent pet)

---

## The Build System

When the player purchases an extension:

1. **Confirmation screen:**
   - *"Build the [Species] Extension for $[Cost]?"*
   - *"This will take [X] days to complete. You can continue operating your shelter during construction."*
   - *"Once complete, [Species] will start appearing on the Morning Board."*

2. **Payment & Start:**
   - Money is deducted
   - `GameState.activeConstruction` is set:
     ```typescript
     activeConstruction: {
       type: 'rabbitHutch' | 'aviary' | 'reptileHabitat' | 'aquariumRoom';
       daysRemaining: number;
     }
     ```

3. **During Construction:**
   - A small banner appears in the shelter view: *"🔨 [Species] Extension — [X] days remaining"*
   - Each day transition, `daysRemaining` decrements
   - Player can still use shelter normally (dogs and cats continue as usual)

4. **Completion:**
   - On the morning when `daysRemaining` reaches 0:
   - A celebration screen: *"The [Species] Extension is complete!"*
   - New room tab appears in the shelter navigation
   - New species calls start appearing on the Morning Board
   - Corresponding home item appears in the shop

---

## Species Room Backgrounds

### Hutch Room (Rabbits & Small Animals)

**File path:** `src/assets/images/backgrounds/shelter-hutch-room.png`

**Prompt:**
> Pixel art interior scene, animal shelter small animal / rabbit hutch room, viewed from slight top-down angle, warm and organized. Six individual hutch enclosures arranged in two rows of three, each hutch has a wire front (open), soft bedding of paper shreds in cream and pink tones inside, a small ceramic water bowl, and a wooden hide box. Wooden floors with a woven runner rug in soft creams and mossy greens down the center aisle. A large window on the back wall with sheer cream curtains letting in warm natural light, cherry blossom branches visible outside. A small counter on the side wall with hay, pellets, and grooming supplies. The space feels clean, warm, and well-cared-for. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers, honey browns. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/shelter-hutch-room.png

---

### Aviary Room (Birds)

**File path:** `src/assets/images/backgrounds/shelter-aviary.png`

**Prompt:**
> Pixel art interior scene, animal shelter aviary room for birds, viewed from slight top-down angle, bright and airy. Six individual large bird cages arranged around the room, each cage has multiple wooden perches at different heights, a swing, seed and water dishes, and an open door. Wooden floor with scattered safe bird toys. A large window taking up most of the back wall with sheer cream curtains, warm natural light flooding in, cherry blossom branches visible outside. A small table with bird care supplies and treats. The cages are spacious and the room feels cheerful and light. Color palette strictly soft pinks, warm creams, sky blues, mossy greens, warm ambers. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/shelter-aviary.png

---

### Reptile Habitat

**File path:** `src/assets/images/backgrounds/shelter-reptile-habitat.png`

**Prompt:**
> Pixel art interior scene, animal shelter reptile habitat room, viewed from slight top-down angle, warm and calm. Six glass terrariums arranged in two rows of three on sturdy wooden stands, each terrarium has a heat lamp above (warm glow), substrate appropriate to the species (sand, moss, or bark), a hide box, a water dish, and a basking rock. Wooden floor with a neutral woven rug. A large window on the back wall with sheer curtains, warm natural light supplementing the heat lamps, cherry blossom branch visible outside. A small counter with reptile care supplies, thermometers, and feeding tools. The room feels warm, controlled, and peaceful. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers, stone greys, honey browns. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/shelter-reptile-habitat.png

---

### Aquarium Room (Aquatic)

**File path:** `src/assets/images/backgrounds/shelter-aquarium-room.png`

**Prompt:**
> Pixel art interior scene, animal shelter aquarium room for aquatic animals, viewed from slight top-down angle, tranquil and softly lit. Six large glass aquarium tanks arranged in two rows of three on wooden stands, each tank has soft underwater lighting (blue-green glow), aquatic plants, smooth stones, and gentle filtration bubbles visible. The room is slightly dimmer than other shelter rooms to reduce stress on aquatic animals, with soft ambient light rather than bright natural light. A small window with heavy cream curtains mostly drawn, a sliver of cherry blossom visible. Wooden floor with a water-safe mat. A counter with fish food, water testing kits, and nets. The room feels calm, cool, and soothing. Color palette strictly soft pinks, warm creams, cool blues, mossy greens, warm ambers (minimal), stone greys. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/shelter-aquarium-room.png

---

## Corresponding Home Items

When a species extension is built, a new item appears in the **Home & Garden** shop tab.

| Species Extension | Home Item | Cost | Effect |
|---|---|---|---|
| Rabbits & Small Animals | Indoor Hutch | $200 | Adds a rabbit/small animal slot to the family room or sunroom |
| Birds | Bird Perch Stand | $250 | Adds a bird slot to the family room or sunroom |
| Reptiles | Terrarium Stand | $300 | Adds a reptile slot to the family room or a new study room |
| Aquatic | Home Aquarium | $350 | Adds an aquatic pet slot to the family room or a new study room |

**Visual implementation:**
These items appear as small furniture pieces in the family room (or new rooms). When purchased, the pet of that species can be brought home and will appear on/in that item (bird on perch, rabbit in hutch, fish in tank, etc.).

---

# Phase 6: Second Extension & The "Larger Land" Unlock

## The Gate

After purchasing the first extension and using it for a while, the player will want more species. But there's a gate.

**Message when trying to purchase a second extension:**
> *"Your current property doesn't have space for another extension. You'll need to expand to a larger plot of land to add more species."*

## Larger Land Expansion

**Item in shop:** "Larger Land Expansion — $1,500"
- Appears in **Shelter Extensions** after first extension is complete
- Description: *"Expand your shelter to a larger property. Unlocks the ability to build up to 3 additional species extensions."*

**Effect:**
- `GameState.largerLandUnlocked = true`
- All remaining species extensions become purchasable
- Shelter capacity per species increases from 6 to 8
- The shelter exterior illustration could change to show a bigger building (optional cosmetic)

**Build time:** 7 days (this is a major expansion)

During the 7-day build, the shelter continues operating normally but with a persistent banner:
> *"🔨 Larger Land Expansion — [X] days remaining"*

---

## After Larger Land

The player can now purchase up to 3 more species extensions (whichever they didn't choose the first time, plus any additional species you add later).

**Second/Third/Fourth Extension Costs:**
- Same as first extension costs ($400–$550 depending on species)
- Same build times (3–4 days)
- Unlocks follow the same pattern: new room, new Morning Board calls, new home item

**Endgame state:**
A player who goes all-in can have:
- Dogs (6 kennels → 8 with larger land)
- Cats (6 playground spots → 8)
- Rabbits (6 hutches → 8)
- Birds (6 cages → 8)
- Reptiles (6 terrariums → 8)
- Aquatic (6 tanks → 8)

**Total capacity:** 48 shelter animals across 6 species

This is a long-term endgame goal that takes months of play to achieve.

---

# Phase 7: New Study Room for Exotic Home Pets

For players who bring reptiles or aquatic pets home, the family room might feel crowded. Add an optional new room.

**Item in shop:** "Study Room Addition — $400"
- Appears after any exotic species is unlocked (reptiles or aquatic)
- Description: *"A quiet study room perfect for exotic pets. Adds a new space to your home."*

**New asset needed:** `src/assets/images/backgrounds/study-room.png`

**Prompt:**
> Pixel art interior scene, cozy cottage study room, viewed from slight top-down angle, quiet and warm. A small wooden desk against one wall with a chair, a few books and a reading lamp, a low bookshelf on another wall filled with books and small plants, a woven rug in soft creams and mossy greens on the wooden floor, a window with sheer cream curtains and cherry blossom branch visible outside, soft warm natural light. A small wooden stand in the corner perfect for a terrarium or aquarium, and a cushioned reading nook by the window. The room feels peaceful, intimate, and thoughtful. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers, honey browns. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/study-room.png

**Effect:**
- Adds a new home location
- Can hold 1 reptile and 1 aquatic pet (with appropriate furniture from the shop)
- Expands total home capacity for exotic pets

---

# Summary of Progression Gates

| Milestone | Cost | Unlock | Notes |
|---|---|---|---|
| Second Dog Slot | $150 | Bedroom pet bed | Allows 2 dogs at home (bedroom + dog house) |
| First Cat Slot | $100–300 | Family room bed or Sunroom | Allows 1 cat at home |
| First Species Extension | $400–550 | New shelter room + home item | Player's choice: Rabbit, Bird, Reptile, or Aquatic |
| Larger Land | $1,500 | +3 species extension slots, +2 capacity per species | 7-day build time |
| Additional Extensions | $400–550 each | More species diversity | 3–4 day build each |
| Study Room | $400 | Home space for exotic pets | Optional for reptile/aquatic owners |

**Total cost to unlock everything:** ~$4,000+
**Time investment:** Months of daily play

This creates a long tail of goals that keeps the game engaging well into the endgame.

---

# Data Model Updates

```typescript
interface GameState {
  // Home
  homeDogCapacity: number;          // 1 → 2 with bedroom bed
  homeCatCapacity: number;          // 0 → 1+ with purchases
  homeRabbitCapacity: number;       // 0 → 1 with hutch
  homeBirdCapacity: number;         // 0 → 1 with perch
  homeReptileCapacity: number;      // 0 → 1 with terrarium
  homeAquaticCapacity: number;      // 0 → 1 with aquarium
  
  homeRooms: string[];              // ['bedroom', 'dogHouse', 'familyRoom', 'sunroom', 'studyRoom']
  
  // Shelter
  activeConstruction: {
    type: string;
    daysRemaining: number;
  } | null;
  
  largerLandUnlocked: boolean;
  
  shelterExtensions: string[];      // ['dogs', 'cats', 'rabbits', 'birds', ...]
  
  shelterCapacity: {
    dogs: number;                   // 6 → 8 with larger land
    cats: number;
    rabbits: number;
    birds: number;
    reptiles: number;
    aquatic: number;
  };
}

interface Animal {
  // ... existing fields
  location: 'bedroom' | 'dogHouse' | 'familyRoom' | 'sunroom' | 'studyRoom' | 'shelter';
  unlockedIdleAnimations: string[]; // ['stretch', 'chaseTail', ...]
}
```

---

# Verification Checklist

## Home Expansion
1. Bedroom pet bed purchase works and increases `homeDogCapacity` to 2
2. Second dog can be brought home from shelter
3. "Manage Pets" screen shows both dogs in their locations
4. Swap button correctly moves dogs between bedroom and dog house
5. Both dogs can be interacted with (activities, dressing, leveling)
6. Both dogs get separate tuck-in ceremonies at bedtime

## Cat Integration
7. Family room cat bed or Sunroom purchase works
8. Cat can be brought home from shelter after purchase
9. Cat appears in the correct home location
10. Cat activities work identically to dogs
11. Cat tuck-in works in their home location

## Pet Transfer System
12. "Bring Home" button appears on shelter pets when home slots available
13. Bringing pet home moves them from shelter to owned pets correctly
14. "Put Up for Adoption" button appears on owned pets
15. Putting owned pet up moves them to shelter correctly
16. Pet keeps all levels, XP, and accessories when transferred
17. Brought-home pets can be adopted out from shelter if player doesn't bring them back

## Leveling Animations
18. Level 5 idle animation unlocks and plays randomly
19. Level 10, 20, 30, 50 animations unlock at correct thresholds
20. Animations trigger randomly every 15–30 seconds in home view
21. Multiple unlocked animations are chosen randomly from pool
22. Animations complete their full sequence before returning to idle

## Shelter Extensions
23. "Shelter Extensions" shop tab appears after 20 adoptions
24. All 4 first extension options are visible with correct costs
25. Purchasing an extension deducts money and starts build timer
26. Construction banner shows in shelter during build
27. Each day decrements `daysRemaining` correctly
28. On completion, celebration screen appears
29. New room tab appears in shelter navigation
30. New room background loads correctly
31. Morning Board starts generating calls for new species

## Build System
32. Player can continue using shelter normally during construction
33. Dogs and cats are unaffected during construction
34. Multiple constructions cannot run simultaneously (one at a time)
35. Build completion is automatic (no manual claiming required)

## Larger Land
36. Second extension purchase is blocked until Larger Land
37. Larger Land purchase costs $1,500 and starts 7-day build
38. During 7-day build, shelter operates normally
39. After completion, all remaining extensions become purchasable
40. Shelter capacity increases from 6 to 8 per species

## Species Room Functionality
41. Hutch room displays 6 enclosures, each can hold one small animal
42. Aviary displays 6 cages, each can hold one bird
43. Reptile habitat displays 6 terrariums, each can hold one reptile
44. Aquarium room displays 6 tanks, each can hold one aquatic pet
45. Care actions work identically across all species rooms

## Home Items
46. When extension completes, corresponding home item appears in shop
47. Purchasing home item unlocks slot for that species at home
48. Home pet of that species can be brought from shelter
49. Study room purchase adds new home location
50. Study room can hold reptile and aquatic pets with appropriate furniture

## General
51. All new backgrounds load without errors
52. All transitions between rooms work smoothly
53. No data loss when transferring pets between shelter and home
54. All costs are deducted correctly
55. Build timers persist across game sessions (if player closes and reopens)
56. Everything works on mobile viewport
57. No console errors during any expansion flow