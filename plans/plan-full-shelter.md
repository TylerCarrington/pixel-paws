# Shelter Upgrade System: Unlocking Cats & Expanding Capacity

## Overview

The shelter upgrade is the first major expansion milestone. It costs between $500 and $1500 depending on the selected listing. It fundamentally changes the game:

- **Unlocks cats** as a discoverable species on the Morning Board
- **Expands capacity** from 3 animals total to 12 (6 dogs + 6 cats)
- **Unlocks rare pets** (10% adoption chance cap, higher payouts)
- **Replaces the spare room** with a proper two-room shelter facility
- **Cosmetic choice** based on the listing chosen by the player

---

# The Upgrade Flow

## Step 1: Unlock condition

When the player has $500, an "Upgrade Shelter" button appears somewhere prominent in the spare room or main menu.

**Button text:** `"Upgrade to a Real Shelter — $500"`

## Step 2: Property listings screen

Clicking the button opens a "shelter property" browser styled like a cozy, simplified Zillow.

### Listing browser UI

A scrollable list of 4–5 shelter property cards. Each card shows:
- An exterior illustration of the building
- A property name (e.g., "The Cherry Blossom Shelter")
- Location in town (e.g., "Near the Riverside Path")
- A few playful "stats" that fit the game's tone
- A "Choose This Shelter" button
- Price: $500 (same for all)

**Example stat categories:**
- **Charm:** ★★★★☆ (purely cosmetic, no gameplay effect)
- **Curb Appeal:** High / Medium / Cozy
- **Proximity to Cherry Blossoms:** Very Close / Walking Distance / Scenic View
- **Year Built:** Recently Renovated / Vintage Character / Brand New
- **Special Feature:** "Large front garden" / "Stone pathway" / "Wisteria overhang" / "Lantern-lit entrance"

**Below the stats:**
> *"This shelter unlocks the ability to care for both dogs and cats. Capacity: 6 dogs, 6 cats."*
> 
> *"Rare animals may now appear on the Morning Board."*

### The 5 shelter options

All shelters function identically. The choice is purely cosmetic — which building exterior the player likes best.

---

## Shelter Exterior Assets

Each shelter needs one exterior illustration (displayed on the listing card and potentially as a "zoomed out" establishing shot when entering the shelter).

### Shelter 1: The Cherry Blossom Shelter

**Filename:** `shelter-exterior-1.png`

**Prompt:**
> Pixel art exterior scene, small animal shelter building, two-story structure with a warm cream facade and terracotta roof tiles, large front window with a "Paws & Purpose" sign visible, a cherry blossom tree in full bloom on the left side of the building dropping petals onto a stone pathway leading to the front door, a small fenced yard on the right with a wooden gate, a vintage lantern hanging by the door, warm afternoon light, soft shadows. The building looks welcoming and well-loved. Color palette strictly soft pinks, warm creams, terracotta oranges, mossy greens, warm ambers. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic, iyashikei healing energy. No characters. No text except the sign.

**Stats:**
- Charm: ★★★★★
- Curb Appeal: High
- Proximity to Cherry Blossoms: Very Close
- Year Built: Recently Renovated
- Special Feature: "Cherry blossom tree drops petals on the pathway all spring"

---

### Shelter 2: The Riverside Refuge

**Filename:** `shelter-exterior-2.png`

**Prompt:**
> Pixel art exterior scene, small animal shelter building, single-story structure with stone and wood siding in warm honey browns and cream, a peaked roof with dark wooden shingles, large front windows with flower boxes full of pink and cream blooms, a small stone bridge visible in the background crossing a stream, a wooden sign post near the door, morning mist rising gently from the nearby water, soft morning light. The building sits close to the riverside path. Color palette strictly soft pinks, warm creams, stone greys, mossy greens, honey browns. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text except the sign.

**Stats:**
- Charm: ★★★★☆
- Curb Appeal: Scenic
- Proximity to River: Right Beside It
- Year Built: Vintage Character
- Special Feature: "Wake up to the sound of the stream every morning"

---

### Shelter 3: The Garden Path Sanctuary

**Filename:** `shelter-exterior-3.png`

**Prompt:**
> Pixel art exterior scene, small animal shelter building, cottage-style structure with a soft blush pink facade and a steep thatched-style roof in warm amber tones, climbing wisteria vines with purple blooms covering one side of the building, a cobblestone pathway leading to a rounded wooden door, small round windows with cream shutters, a low wooden fence surrounding a lush garden full of flowers in pinks and creams, warm golden hour light. The building feels like it grew out of the garden itself. Color palette strictly soft pinks, warm creams, soft purples, mossy greens, warm ambers. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text except a small sign.

**Stats:**
- Charm: ★★★★★
- Curb Appeal: Storybook
- Garden Size: Generous
- Year Built: Timeless
- Special Feature: "Wisteria blooms attract butterflies in the summer"

---

### Shelter 4: The Lantern Street Shelter

**Filename:** `shelter-exterior-4.png`

**Prompt:**
> Pixel art exterior scene, small animal shelter building, two-story structure with warm cream walls and a traditional Japanese-style roof with curved eaves in dark wood, stone lanterns lining the pathway to the front door, a small covered porch with hanging paper lanterns, a single cherry blossom tree on the right side, evening light with the lanterns glowing warmly, a peaceful residential street visible in the background. The building has a quiet, welcoming presence. Color palette strictly soft pinks, warm creams, warm ambers, stone greys, dark honey browns. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text except a sign.

**Stats:**
- Charm: ★★★★☆
- Curb Appeal: Elegant
- Lighting: Lantern-lit
- Year Built: Traditional
- Special Feature: "Lanterns light your way home every evening"

---

### Shelter 5: The Hilltop Haven

**Filename:** `shelter-exterior-5.png`

**Prompt:**
> Pixel art exterior scene, small animal shelter building, single-story structure with large windows and a modern rustic design, warm wood siding in honey tones and cream plaster sections, a flat roof with a small overhang, positioned on a gentle hill with a view of the village below, a wooden deck on one side with potted plants, a winding stone path up the hill, late afternoon light with long shadows, cherry blossom petals drifting up from the village below. The building has a peaceful, elevated position. Color palette strictly soft pinks, warm creams, honey browns, mossy greens, warm ambers. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text except a sign.

**Stats:**
- Charm: ★★★★☆
- Curb Appeal: Modern Rustic
- View: Overlooks the Village
- Year Built: Brand New
- Special Feature: "Best sunset view in town from the deck"

---

## Step 3: Purchase confirmation

When the player taps "Choose This Shelter" on any listing:

1. A confirmation dialog appears:
   - *"Purchase [Shelter Name] for $500?"*
   - *"This will become your new shelter. All animals will move with you."*
   - *"Your spare room will no longer be used as a shelter."*
   - [Confirm] [Cancel]

2. If confirmed:
   - Deduct $500 from player's money
   - Save the chosen shelter exterior key to `GameState.shelterExterior`
   - Set `GameState.shelterUnlocked = true`
   - Set `GameState.shelterCapacity = { dogs: 6, cats: 6 }`
   - Set `GameState.rarePetsUnlocked = true`
   - Set `GameState.catsUnlocked = true`
   - Move all animals from `shelterAnimals` to the new shelter (no data change needed, just a flag flip)
   - Show a brief celebration screen

3. Celebration screen:
   - The chosen shelter exterior fades in
   - Gentle confetti or blossom particles
   - Text: *"Welcome to [Shelter Name]!"*
   - [Continue]

4. Transition to the new shelter interior

---

# The New Shelter Interior

## Two-room navigation

The shelter has two separate rooms:
- **Dog Kennels** (6 capacity)
- **Cat Playground** (6 capacity)

At the top of the shelter screen, two tab buttons allow switching between rooms:

```
[ Dog Kennels ]  [ Cat Playground ]
```

Tapping a tab crossfades to that room's background and displays the animals in that room.

---

## Room 1: Dog Kennels

**Filename:** `shelter-dog-kennels.png`

**Prompt:**
> Pixel art interior scene, animal shelter dog kennel room, viewed from a slight top-down angle, warm and organized. Six individual kennel enclosures arranged in two rows of three, each kennel has a small gate (open), a soft bed inside in cream and pink tones, a water bowl, and a small toy. Wooden floors with a woven runner rug down the center aisle in soft creams and mossy greens. A large window on the back wall with sheer cream curtains letting in warm natural light, cherry blossom branches visible outside. A small counter on the side wall with grooming supplies and a clipboard. The space feels clean, warm, and well-cared-for. Enough visual space to see each kennel clearly. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers, honey browns. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text.

### Kennel layout (6 kennels)

Pet beds are positioned as interactive zones. Each pet bed can hold one dog.

Same interaction as the spare room: tap kennel → pet detail modal → choose action.

---

## Room 2: Cat Playground

**Filename:** `shelter-cat-playground.png`

**Prompt:**
> Pixel art interior scene, animal shelter cat play area, viewed from a slight top-down angle, warm and playful. A multi-level wooden cat tree structure in the center with platforms, cubbies, and scratching posts in warm honey browns, six soft cushions or small beds placed throughout the room on different levels and surfaces in blush pinks and creams, a large window on the back wall with a wide sill covered in soft cushions where cats can sunbathe, sheer cream curtains, cherry blossom branches visible outside, warm natural light streaming in. Wooden floor with scattered woven mats and a few hanging feather toys from the ceiling. A small side table with grooming supplies and treats. The space feels playful, warm, and designed entirely for cats to explore. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers, honey browns. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text.

### Cat bed layout (6 beds)

Cats are positioned at various levels and surfaces rather than uniform kennels.

**Suggested layout (percentage-based):**
```
  Bed 1 (window sill left):  { top: 30%, left: 8% }
  Bed 2 (window sill right): { top: 30%, left: 70% }
  Bed 3 (tree top):          { top: 35%, left: 42% }
  Bed 4 (tree middle left):  { top: 52%, left: 28% }
  Bed 5 (tree middle right): { top: 52%, left: 56% }
  Bed 6 (floor mat):         { top: 72%, left: 42% }
```

Each occupied bed displays:
- Cat sprite (idle animation, scaled 2.5×)
- Name label
- Mood indicator dot
- Desirability bar

Same interaction pattern as dogs.

---

# Unlocking Cats: Morning Board Changes

## New species filter

Once `GameState.catsUnlocked = true`, the Morning Board call generation includes cats in the eligible species pool.

**Call distribution after shelter upgrade:**
- 60% dogs (still the majority early on)
- 40% cats

### Cat-specific discovery methods

Cats use some of the same discovery methods as dogs, but with cat-appropriate flavor:

| Discovery Method | Works for Cats? | Notes |
|---|---|---|
| Hiding in Bushes | Yes | Classic cat behavior |
| Too Scared to Approach | Yes | Feral or shy cats |
| Tangled in Fence | Yes | Cats get stuck too |
| Follow the Sound | Yes | Meowing instead of barking |
| Tempt with Food | Yes | Very effective for cats |
| Coax from Under Porch | Yes | Perfect for cats |
| Warm Them Up | Yes | Wet cats need drying |
| Box Discovery | NEW | Cat-specific (see below) |
| Tree Rescue | NEW | Cat-specific (see below) |

# Cat Sprite Prompts

Each cat needs a 16×16 sprite sheet with the standard animations (idle, walk, tail wag, being petted, sleeping, etc.). Here are 10 cat breeds/variants in the game's style.

**Base sprite sheet prompt structure:**

> 16×16 pixel art sprite sheet, [CAT DESCRIPTION], for a cozy animal shelter game, warm soft color palette with colors from: soft pinks, warm creams, mossy greens, warm ambers, honey browns. Each sprite shows the cat from a slight top-down angle. Animations needed (horizontal rows): idle (4 frames), walk (6 frames), tail swish (6 frames), being petted (4 frames), curl up (6 frames), sleeping (4 frames), eating (4 frames). Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic, iyashikei healing energy, extremely cute and shareable. Transparent background. 1px gap between frames. No text.

Replace `[CAT DESCRIPTION]` with:

---

### 1. **Orange Tabby**
> cute chubby orange tabby cat with cream underside, distinctive darker orange stripes, round face, short ears, fluffy tail

**Rarity:** Common

---

### 2. **Tuxedo Cat**
> elegant tuxedo cat with black fur on back and head, white chest and paws, white nose stripe, sleek build, alert ears, medium tail

**Rarity:** Uncommon

---

### 3. **Calico**
> fluffy calico cat with patches of orange, black, and white, round face, one orange ear and one black ear, thick fluffy tail, soft expression

**Rarity:** Uncommon

---

### 4. **Grey Tabby**
> soft grey tabby cat with darker grey stripes, white paws and chest, round green eyes, medium build, gently curved tail

**Rarity:** Common

---

### 5. **Siamese**
> sleek Siamese cat with cream body and dark brown points on face, ears, paws and tail, blue eyes, slender elegant build, long tail

**Rarity:** Rare

---

### 6. **Russian Blue**
> plush solid grey cat with silvery sheen, green eyes, dense fluffy coat, sturdy build, rounded ears, thick tail

**Rarity:** Rare

---

### 7. **Black Cat**
> sleek solid black cat with golden eyes, glossy fur, slender build, tall pointed ears, long elegant tail, mysterious but friendly expression

**Rarity:** Uncommon

---

### 8. **White Persian**
> fluffy long-haired white Persian cat with a flat face, round blue eyes, extremely fluffy coat, short legs, very fluffy tail, dignified expression

**Rarity:** Rare

---

### 9. **Tortoiseshell**
> mottled tortoiseshell cat with swirled patches of black, orange, and brown, medium build, bright amber eyes, medium-length fur, expressive tail

**Rarity:** Uncommon

---

### 10. **Cream Ragdoll**
> large fluffy cream and light brown Ragdoll cat with blue eyes, long soft fur, stocky build, relaxed floppy posture, very fluffy tail, sweet gentle expression

**Rarity:** Rare

---

# Rare Pets System

## What changes with rare pets unlocked

Once `GameState.rarePetsUnlocked = true`:

**For dogs:**
- Rare breeds can now appear on the Morning Board (10% of dog calls)
- Example rare dogs: Shiba Inu, Akita, Samoyed, Corgi (upgraded to rare), Dalmatian, Border Collie

**For cats:**
- Siamese, Russian Blue, White Persian, Cream Ragdoll (from the list above)

### Rare pet stats

| Attribute | Common | Uncommon | Rare |
|---|---|---|---|
| Starting desirability | 10–25 | 15–30 | 20–40 |
| Adoption chance cap | 20% | 15% | 10% |
| Base payout | $30 | $90 | $175 |
| Max payout (with care) | $45 | $135 | $260 |

Rare pets are:
- Harder to get adopted (lower cap)
- Worth significantly more money
- Start with slightly higher desirability (they're desirable by nature)
- More likely to be kept as permanent pets by the player

---

# Data Model Updates

```typescript
interface GameState {
  // ... existing fields
  shelterExterior: string;           // 'cherry', 'riverside', 'garden', 'lantern', 'hilltop'
  shelterCapacity: {
    dogs: number;                    // 6 after upgrade
    cats: number;                    // 6 after upgrade
  };
  catsUnlocked: boolean;             // true after shelter purchase
  rarePetsUnlocked: boolean;         // true after shelter purchase
  spareRoomAccessible: boolean;      // false after shelter purchase
}
```

---

# New Cat Discovery Mini-Games

## 1. **Box Discovery**

**Morning Board call:**
> *"Someone left a cardboard box near the post office. There's movement inside and soft meowing. Can you check it out?"*

**Location:** Post office exterior (new background)

**Mechanic:**
A sealed cardboard box sits on the ground. You must carefully open it. Tap the box flaps in sequence (top-left, top-right, pull up) to open without startling what's inside. Open too quickly and the cat hisses and retreats deeper (you have to start over). Open gently and a cat pokes its head out, looks around, then emerges.

**Background needed:** `src/assets/images/post-office.png`

**Prompt:**
> Pixel art exterior scene, small village post office building, single-story structure with a warm cream facade and a red tiled roof, a wooden post box mounted by the door, a small covered porch area, cherry blossom petals scattered on the ground, a cardboard box sitting near the steps in the foreground (closed, no cat visible yet), morning light, quiet street. Color palette strictly soft pinks, warm creams, reds, mossy greens, stone greys. Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text except a small sign.

---

## 2. **Tree Rescue**

**Morning Board call:**
> *"A cat climbed too high up the old oak tree in the park and won't come down. It's been up there since yesterday."*

**Location:** Park with tall tree (new background or variant of existing park)

**Mechanic:**
The cat is perched on a high branch (small sprite, visible but distant). You must coax them down step by step. Tap positions on lower branches to guide the cat's path down. If you rush and select a branch too far, the cat refuses to jump. Work patiently branch by branch. Once the cat reaches the lowest branch, you hold out your arms (tap "Catch") and the cat jumps into them.

**Background needed:** `src/assets/images/park-tree.png`

**Prompt:**
> Pixel art scene, village park with a large old oak tree in the center, thick trunk and sprawling branches, green leaves with dappled sunlight filtering through, a cat visible as a small shape high up on a branch, cherry blossom trees in the background, a stone path winding around the tree, soft morning light. The tree dominates the scene but leaves space at the bottom for the player interaction. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers, brown trunk. Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters except the cat sprite. No text.

---

## 3. **Window Ledge Rescue**

**Morning Board call:**
> *"A cat got stuck on a second-story window ledge. The owner is away and we can't get to it. Can you help?"*

**Location:** Residential street exterior (new background)

**Mechanic:**
The cat is on a narrow ledge, nervous. You must stack cushions below the window (drag-and-drop mechanic) to create a safe landing zone. Stack 3 cushions correctly (centered, stable) and then call the cat softly (tap "Call Gently"). The cat jumps onto the cushions and is safe. If the cushions are misaligned, the cat won't jump and you must reposition them.

**Background needed:** `src/assets/images/residential-street.png`

**Prompt:**
> Pixel art exterior scene, quiet residential street in a cozy village, two-story houses with warm cream and soft pink facades, terracotta roofs, small front gardens with flowers, a narrow cobblestone street, cherry blossom trees lining the street, a cat visible on a second-story window ledge of the nearest house (small sprite, anxious pose), afternoon light with soft shadows. The street is peaceful and safe. Color palette strictly soft pinks, warm creams, terracotta, mossy greens, stone greys. Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters except the cat. No text.

---

## 4. **Garden Maze**

**Morning Board call:**
> *"A neighbor's cat wandered into the hedge maze at the old estate and can't find its way out. The owner is worried."*

**Location:** Hedge maze entrance (new background)

**Mechanic:**
A simple top-down maze appears (5×5 grid, not too complex). You guide the cat through the maze using directional taps (up, down, left, right). The cat is visible as a sprite moving through the paths. Dead ends are visible. Guide the cat to the exit. If you lead them to a dead end, they sit and meow until you backtrack.

**Background needed:** `src/assets/images/hedge-maze.png`

**Prompt:**
> Pixel art scene, entrance to a small hedge maze in a garden, tall green hedges forming neat pathways, an arched opening in the foreground leading into the maze, cherry blossom petals drifting down, a small stone bench near the entrance, warm afternoon light. The maze looks charming and not too intimidating. In the distance beyond the maze, a manor house is faintly visible. Color palette strictly soft pinks, warm creams, mossy greens, stone greys. Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text.

---

## 5. **Alley Chase**

**Morning Board call:**
> *"A stray cat has been spotted darting through the alley behind the bakery. Quick and skittish. Could use a gentle hand."*

**Location:** Bakery alley (new background)

**Mechanic:**
A side-scrolling scene. The cat runs left to right, pausing at trash bins and crates. You must quietly remove obstacles from their path (tap to shift a crate, tap to quiet a clanging trash lid) so they don't spook and run off-screen. If you make too much noise (tap too aggressively), the cat bolts and you retry. Clear a safe path and the cat reaches a dead end where you can calmly approach them.

**Background needed:** `src/assets/images/bakery-alley.png`

**Prompt:**
> Pixel art scene, narrow alley behind a bakery, brick walls in warm terracotta and cream tones, wooden crates stacked along one side, metal trash bins, a back door to the bakery with a small awning, cherry blossom petals scattered on the cobblestone ground, morning light creating soft shadows. The alley is cozy despite being a back alley — it feels safe and lived-in. A cat is visible as a small sprite near a crate. Color palette strictly soft pinks, warm creams, terracotta, stone greys, mossy greens. Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters except the cat. No text.

---

## 6. **Attic Discovery**

**Morning Board call:**
> *"We've been hearing soft meowing from the attic for days. Finally got up there — it's a cat, but too dark and cramped to reach easily."*

**Location:** Attic interior (new background)

**Mechanic:**
A dim attic scene with boxes and old furniture. You have a flashlight (tap to shine it in different areas). The cat's eyes glow when the light hits them. You must locate the cat by sweeping the flashlight beam across the attic (tap-and-drag or tap zones). Once found, you must clear a path of boxes (tap boxes to move them aside) to reach the cat. The cat is nervous but stays put once in the light.

**Background needed:** `src/assets/images/attic.png`

**Prompt:**
> Pixel art interior scene, dusty attic space with wooden beams and floorboards in warm honey browns, stacked cardboard boxes, an old trunk, a small round window letting in a shaft of warm afternoon light with dust particles visible, cobwebs in the corners (subtle, not creepy), shadows in the far corners where a cat could be hiding. The space is dim but not dark — cozy-dusty rather than creepy. Color palette strictly soft pinks, warm creams, honey browns, warm ambers (for light). Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters except the cat (hidden until found). No text.

---

## 7. **Carrier Escape**

**Morning Board call:**
> *"A cat escaped from its carrier at the vet's office. Now it's hiding somewhere in the waiting room. The vet needs help coaxing it out."*

**Location:** Vet waiting room (new background)

**Mechanic:**
The waiting room has several hiding spots (under chairs, behind a potted plant, in a corner). You must check each spot (tap to peek). The cat moves to a new spot each time you check the wrong one (you see a tail disappearing). After checking 3 spots correctly (building trust), the cat stays in the 4th spot and you can gently approach with treats. A hide-and-seek variant with movement.

**Background needed:** `src/assets/images/vet-waiting-room.png`

**Prompt:**
> Pixel art interior scene, cozy veterinary clinic waiting room, a few cushioned chairs in soft creams and pinks along the walls, a low wooden coffee table with magazines, a potted plant in the corner, a reception desk in the background, warm natural light from a large window with sheer curtains, cherry blossom branch visible outside, wooden floor with a woven rug. The space feels calm and welcoming. Hiding spots visible: under chairs, behind plant. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers, honey browns. Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters except the cat (hidden). No text.

---

## 8. **Barn Loft**

**Morning Board call:**
> *"A cat has been living in the barn loft at the edge of town. The farmer wants to help it find a real home."*

**Location:** Barn loft (new background)

**Mechanic:**
The loft has hay bales stacked up. The cat is perched on the highest bale. You must climb (tap footholds — hay bales, a wooden ladder, a beam) to reach the cat level by level. If you rush and skip a foothold, you slip and restart. Reach the top carefully and the cat, seeing you're not a threat, allows you to pick them up.

**Background needed:** `src/assets/images/barn-loft.png`

**Prompt:**
> Pixel art interior scene, rustic barn loft with wooden beams and floorboards in warm honey browns, stacked hay bales in golden yellows and creams, a wooden ladder leaning against the wall, sunlight streaming through cracks in the wooden slats creating warm beams of light with visible dust particles, a small window showing cherry blossom trees outside. The space is warm, dusty, and peaceful. The cat is visible as a small sprite perched on the highest hay bale. Color palette strictly soft pinks, warm creams, honey browns, golden yellows, mossy greens (through window). Style is refined 16-bit pixel art, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters except the cat. No text.

---

---

# Verification Checklist

## Shelter Purchase Flow
1. "Upgrade Shelter" button appears when player has $500
2. Property listing screen shows all 5 shelter options
3. Each listing displays correct stats and exterior illustration
4. Each listing clearly states "Unlocks cats" and "6 dogs, 6 cats"
5. "Choose This Shelter" button on each listing works
6. Confirmation dialog appears with correct shelter name and warnings
7. Confirming purchase deducts $500 correctly
8. Celebration screen shows chosen shelter exterior
9. Player is transitioned to the new shelter interior

## New Shelter Interior
10. Dog Kennels room displays with 6 kennel zones visible
11. Cat Playground room displays with 6 bed zones visible
12. Tab buttons at top switch between rooms smoothly
13. All animals from spare room appear in the correct room (dogs in kennels, cats in playground if any exist)
14. Spare room is no longer accessible from the home screen

## Cat Unlocking
15. After purchase, Morning Board generates cat calls
16. Cat discovery mini-games function correctly (test 2–3)
17. Discovered cats are identified correctly by breed
18. Cats appear in the Cat Playground room after being brought to shelter
19. Cat care actions work identically to dogs (pet, feed, play, groom)
20. Cat adoption rolls work with correct 15% cap for uncommon, 10% for rare

## Rare Pets
21. After shelter purchase, rare dogs and rare cats can appear on Morning Board
22. Rare pets have correct starting desirability (20–40)
23. Rare pets have correct adoption cap (10%)
24. Rare pets pay out correctly ($175 base, up to $260 with care)

## General
25. All new backgrounds load without errors
26. Cat sprite sheets display correctly with all animations
27. Switching between Dog Kennels and Cat Playground does not lose animal data
28. Capacity limits are enforced (max 6 dogs, max 6 cats)
29. No console errors during any part of the shelter upgrade flow
30. Everything works on mobile viewport