# Cherry Blossom Party: Multiplayer Board Game Mode

## Overview

A Mario Party-style multiplayer mode where 2-4 players compete to collect the most Golden Cherry Blossoms by playing mini-games from the main campaign. Players roll dice, move around a branching board, and compete in timed mini-games to earn money and purchase Golden Cherry Blossoms.

**Core Loop:**
1. All players roll dice (1-10, weighted toward higher numbers)
2. All players move simultaneously based on their rolls
3. A random mini-game is selected via wheel spin from 5 options
4. Players compete in the mini-game (timed, best time wins)
5. Money is awarded based on placement
6. Players can purchase Golden Cherry Blossoms when landing on the spot
7. Repeat for 15-30 rounds (player choice)
8. Player with most Golden Cherry Blossoms wins (tiebreaker: most money)

---

# Game Setup

## Character Selection

Players choose from any species they've unlocked in the main game:
- Dogs (any breed they've discovered)
- Cats (if unlocked)
- Rabbits (if unlocked)
- Birds, Reptiles, Fish, Horses, Small Animals (if unlocked)

**Character sprite:** The chosen animal's 16×16 sprite scaled up for board visibility

**Color coding:** Each player gets a colored outline/glow to distinguish on the board:
- Player 1: Soft pink glow
- Player 2: Warm amber glow
- Player 3: Mossy green glow
- Player 4: Soft lilac glow

---

## Round Selection

Before starting, players choose:
- **Number of rounds:** 15, 20, 25, or 30
- **Board layout:** Random or Preset (see board options below)

**Estimated playtime:**
- 15 rounds: ~20-25 minutes
- 20 rounds: ~30-35 minutes
- 25 rounds: ~35-45 minutes
- 30 rounds: ~45-60 minutes

---

# The Board System

## Board Design

A branching path board with multiple routes, intersections, and special spaces.

### Space Types

| Space Type | Icon | Effect |
|---|---|---|
| **Regular Space** | Cherry blossom petal | No special effect |
| **Golden Blossom Space** | Golden cherry blossom icon | Can purchase Golden Cherry Blossom for $10 |
| **Bonus Space** | Coin icon | Gain $2 immediately |
| **Event Space** | Question mark | Random event (good or bad) |
| **Junction Space** | Arrows | Player chooses which path to take |

### Board Layouts

**Option 1: The Village Loop**
- Circular board with branching side paths
- 3 junctions offering shortcuts vs. longer safer routes
- 2 Golden Blossom spaces (opposite sides of the loop)
- Total spaces: ~40

**Option 2: The Hillside Trail**
- Linear path with switchbacks up and down a hill
- Multiple crossroads creating alternate routes
- 2 Golden Blossom spaces (one at peak, one at base)
- Total spaces: ~45

**Option 3: The River Journey**
- Winding path following a river's course
- Bridge crossings that create route choices
- 2 Golden Blossom spaces (one at waterfall, one at delta)
- Total spaces: ~50

**Random Mode:** Combines elements from all three, randomized each game

---

## Dice Rolling System

### Weighted Dice (1-10)

To keep the game moving and feeling exciting, higher numbers are slightly more likely:

| Roll | Base Probability | Weighted Probability |
|---|---|---|
| 1 | 10% | 6% |
| 2 | 10% | 7% |
| 3 | 10% | 8% |
| 4 | 10% | 9% |
| 5 | 10% | 10% |
| 6 | 10% | 11% |
| 7 | 10% | 12% |
| 8 | 10% | 13% |
| 9 | 10% | 13% |
| 10 | 10% | 11% |

This creates a curve where 7-9 are most common, but any roll is possible.

### Roll Sequence

1. All 4 players roll simultaneously (or sequentially if preferred)
2. Dice animation shows for each player (3D cube rotating, lands on number)
3. All players move at the same time (staggered slightly so you can see each)
4. If multiple players land on the same space, they all get the effect
5. After all movement resolves, mini-game selection begins

---

# Mini-Game Selection System

## The Wheel Spin

After all players have moved, the mini-game selection phase begins:

1. **Filter eligible games:** Only games the host player has unlocked in the main campaign are available
2. **Select 5 random games** from the eligible pool (no repeats within the same match)
3. **Display the wheel:** A colorful wheel divided into 5 sections, each showing a game icon and name
4. **Spin animation:** The wheel spins rapidly, slowing down gradually
5. **Landing:** The wheel lands on one of the 5 games
6. **Transition:** Brief preview of the game (3 seconds) then launch into it

### Wheel UI Design

A circular wheel in the center of the screen with:
- 5 equal sections
- Each section has a game icon, name, and subtle background color
- A pointer/arrow at the top indicates which game is selected
- Cherry blossom petals drift around the wheel during spin
- Gentle sound effect as it spins, satisfying "ding" when it lands

---

# Mini-Game Competition

## Time-Based Scoring

All games are played **individually in sequence** (not simultaneously). Each player gets their turn, and the best time wins.

**Turn order:** Randomized at the start of each round, shown on screen

**Gameplay flow:**
1. Player 1's turn begins
2. "Get Ready" countdown (3, 2, 1, GO!)
3. Player 1 plays the mini-game, timer runs
4. When complete, their time is recorded and displayed
5. Player 2's turn begins (repeat)
6. After all players complete, results are shown

### Results Screen

Shows all players ranked by time:

```
┌──────────────────────────────────────┐
│         Mini-Game Results            │
│                                      │
│  1st  [Dog sprite]  Max    8.4s  $10│
│  2nd  [Cat sprite]  Luna   9.1s  $3 │
│  3rd  [Bird sprite] Sky   11.2s  $2 │
│  4th  [Rabbit sprite] Hop 15.6s  $1 │
│                                      │
│         [Continue]                   │
└──────────────────────────────────────┘
```

Money is added to each player's total immediately.

---

# Golden Cherry Blossom System

## Purchasing

When a player lands on a Golden Blossom Space:

**If they have $10 or more:**
- A prompt appears: *"Purchase a Golden Cherry Blossom for $10?"*
- [Yes] [No]
- If Yes: Deduct $10, add 1 Golden Cherry Blossom to their collection, celebration animation
- If No: Turn continues normally

**If they have less than $10:**
- Message: *"Not enough money. You need $10 to purchase a Golden Cherry Blossom. (You have $X)"*
- Turn continues

## Blossom Movement

After a Golden Cherry Blossom is purchased:
1. The space becomes a regular space
2. At the start of the next round, a new random space (that isn't already special) becomes a Golden Blossom Space
3. A brief announcement: *"A new Golden Cherry Blossom has appeared!"*
4. Camera pans to show the new location briefly

This keeps the board dynamic and prevents camping.

---

# Event Space Effects

When a player lands on an Event Space, one of these random events occurs:

**Positive Events (60% chance):**
1. **Cherry Blossom Shower:** Gain $3
2. **Lucky Dice:** Your next roll is guaranteed 8, 9, or 10
3. **Shortcut Discovered:** Teleport forward 5 spaces
4. **Generous Neighbor:** Steal $2 from the player with the most money
5. **Spring Breeze:** Move forward 3 additional spaces

**Negative Events (30% chance):**
1. **Muddy Path:** Lose $2
2. **Wrong Turn:** Move backward 3 spaces
3. **Distracted:** Your next roll is 1-4 only
4. **Share the Wealth:** Give $2 to the player with the least money
5. **Lost Directions:** Swap positions with a random player

**Neutral Events (10% chance):**
1. **Nothing Happens:** Just a scenic view
2. **Trade Places:** Swap money totals with a random player (can be good or bad)

---

# Victory Conditions

## End of Game

After the final round:

1. All players' scores are tallied
2. **Primary:** Player with the most Golden Cherry Blossoms wins
3. **Tiebreaker:** If tied for blossoms, player with the most money wins
4. **Double Tie:** If still tied, both players share the victory

### Victory Screen

```
┌──────────────────────────────────────┐
│       🌸 Cherry Blossom Party 🌸     │
│                                      │
│           Winner: Max!               │
│         [Dog sprite animation]       │
│                                      │
│   Golden Cherry Blossoms: 3          │
│   Money: $24                         │
│                                      │
│  Final Standings:                    │
│  1st  Max     3 🌸  $24             │
│  2nd  Luna    2 🌸  $18             │
│  3rd  Sky     1 🌸  $15             │
│  4th  Hop     1 🌸  $12             │
│                                      │
│  [Play Again] [Return to Menu]      │
└──────────────────────────────────────┘
```

Confetti and cherry blossom petals rain down, winner's sprite does a happy animation.

---

# Five Exclusive Party Mode Mini-Games

These games are only playable in Cherry Blossom Party mode and designed for quick competitive play.

---

## 1. **Petal Dash**

**Category:** Racing/Platforming
**Objective:** Race through a cherry blossom grove to reach the finish line as fast as possible
**Time Limit:** 60 seconds

**Gameplay:**
- Side-scrolling race through a beautiful grove
- Jump over fallen logs, duck under low branches
- Collect cherry blossom petals for a small speed boost (optional, risky)
- 3 lanes: top, middle, bottom - obstacles appear randomly
- Simple controls: tap to jump, swipe down to duck, swipe left/right to change lanes

**Completion:** When player crosses the finish line, timer stops

**Background needed:** `src/assets/images/backgrounds/party-petal-dash.png`

**Prompt:**
> Pixel art side-scrolling scene, cherry blossom grove race course, horizontal path through blooming trees, three parallel lanes (top, middle, bottom levels) with wooden platforms and logs, pink petals actively falling and drifting, finish line flag visible in the distance on the right, spring morning light filtering through trees, the path should feel like it's moving through a magical forest tunnel of blossoms. Color palette strictly soft pinks, warm creams, mossy greens, honey browns. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text except finish line. File path: src/assets/images/backgrounds/party-petal-dash.png

---

## 2. **Blossom Catch**

**Category:** Reflex/Timing
**Objective:** Catch as many falling cherry blossoms as possible before time runs out
**Time Limit:** 30 seconds

**Gameplay:**
- Player sprite (chosen animal) moves left and right at the bottom of the screen
- Cherry blossoms fall from the top at varying speeds
- Golden blossoms are worth 3 points, pink blossoms worth 1 point
- Rotten brown petals subtract 2 points - avoid these!
- Movement controls: tap left/right of character, or drag character directly

**Completion:** After 30 seconds, total score determines time (higher score = faster completion)
- Formula: `time = 30 - (score × 0.5)` (minimum 5 seconds)
- This rewards higher scores with better "times" for ranking

**Background needed:** `src/assets/images/backgrounds/party-blossom-catch.png`

**Prompt:**
> Pixel art scene, open sky view under cherry blossom trees, view looking up at canopy, branches with pink blossoms at the top of frame, soft blue sky with fluffy white clouds, gentle gradient from top to bottom, open grassy ground at the bottom where character stands, peaceful spring day atmosphere, petals should appear to be falling through the space. Color palette strictly soft pinks, warm creams, sky blues, mossy greens. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/party-blossom-catch.png

---

## 3. **Village Sprint**

**Category:** Quick Navigation
**Objective:** Navigate through the village streets to collect 5 coins and return to start
**Time Limit:** 45 seconds

**Gameplay:**
- Top-down view of a small village section
- 5 coins are placed randomly throughout the streets
- Player must navigate from the starting point, collect all 5 coins, and return to start
- Simple maze-like street layout with branching paths
- Controls: Tap directional arrows or swipe to move

**Completion:** Timer stops when player returns to start with all 5 coins

**Background needed:** `src/assets/images/backgrounds/party-village-sprint.png`

**Prompt:**
> Pixel art top-down view, small cozy village section with cobblestone streets forming a gentle maze pattern, several small houses with warm cream and pink facades and terracotta roofs, cherry blossom trees lining the streets, a few benches and lamp posts, a fountain in a small plaza, clear pathways between buildings, a marked starting point (small flag or marker), the layout should allow for multiple routes through the area. Color palette strictly soft pinks, warm creams, terracotta, mossy greens, stone greys. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text except start marker. File path: src/assets/images/backgrounds/party-village-sprint.png

---

## 4. **Balloon Pop**

**Category:** Precision/Speed
**Objective:** Pop balloons in the correct order as fast as possible
**Time Limit:** None (pure speed challenge)

**Gameplay:**
- 20 balloons float on screen in random positions
- Each balloon has a number (1-20)
- Player must pop them in numerical order by tapping
- Popping the wrong balloon adds +2 seconds penalty
- Visual feedback: correct pop = satisfying pop sound, wrong pop = buzzer + penalty

**Completion:** Timer stops when balloon #20 is popped

**Background needed:** `src/assets/images/backgrounds/party-balloon-pop.png`

**Prompt:**
> Pixel art scene, village festival setting, sunny day with soft blue sky and fluffy clouds, festival banners and decorative flags hanging between cherry blossom trees, a wooden festival stage or platform in the background, open grassy area perfect for a balloon game, warm cheerful atmosphere, space for 20 floating balloons to be clearly visible across the frame. Color palette strictly soft pinks, warm creams, sky blues, mossy greens, warm ambers. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/party-balloon-pop.png

---

## 5. **River Crossing**

**Category:** Timing/Platforming
**Objective:** Cross the river by jumping on floating logs without falling in
**Time Limit:** 40 seconds

**Gameplay:**
- Side view of a river with floating logs drifting left and right
- 5 logs arranged at different distances across the river
- Logs move in predictable patterns (some left, some right, some stationary)
- Player must time jumps to land on each log and reach the far bank
- Fall in water = restart from near bank (no time penalty beyond time lost)
- Controls: Tap to jump when lined up with next log

**Completion:** Timer stops when player reaches the far bank

**Background needed:** `src/assets/images/backgrounds/party-river-crossing.png`

**Prompt:**
> Pixel art side view scene, peaceful river with clear blue water flowing gently, wooden logs floating at various distances across the width of the river creating a crossing path, near bank on the left with green grass and a cherry blossom tree, far bank on the right also with grass and blossoms, lily pads and small fish visible in the water, morning light creating soft reflections on water surface. Color palette strictly soft pinks, warm creams, water blues, mossy greens, honey browns for logs. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/party-river-crossing.png

---

# Board Game Assets

## Game Board Backgrounds

The board itself needs a high-quality illustrated map that serves as the play surface.

### Board 1: Village Loop

**Filename:** `src/assets/images/boards/village-loop-board.png`

**Prompt:**
> Pixel art game board map, overhead view of a cozy village arranged in a circular loop path, cobblestone pathway forming a complete circle with branching side paths creating shortcuts, houses and buildings placed around the inside and outside of the loop, cherry blossom trees scattered throughout, a central village square with fountain in the middle, junction points marked with small signposts, spaces for tokens clearly visible along the path (40 distinct spaces), warm spring day lighting, the path should be clearly defined and easy to follow with the eye. Color palette strictly soft pinks, warm creams, terracotta, mossy greens, stone greys for paths. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic, designed to be viewed from above as a board game map. No characters. Minimal text. File path: src/assets/images/boards/village-loop-board.png

---

### Board 2: Hillside Trail

**Filename:** `src/assets/images/boards/hillside-trail-board.png`

**Prompt:**
> Pixel art game board map, overhead view of a winding trail up and down a gentle hill, path switchbacks creating zigzag routes up the hillside with crossroads where players can choose different routes, cherry blossom trees more dense at the base and top of the hill, a scenic overlook platform at the peak, stone steps on steeper sections, junctions marked with trail signs, spaces for game tokens clearly visible along the path (45 distinct spaces), afternoon lighting with long soft shadows, the elevation changes should be suggested through shading and tree placement. Color palette strictly soft pinks, warm creams, mossy greens, stone greys for paths and steps, honey browns for earth. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. Minimal text. File path: src/assets/images/boards/hillside-trail-board.png

---

### Board 3: River Journey

**Filename:** `src/assets/images/boards/river-journey-board.png`

**Prompt:**
> Pixel art game board map, overhead view of a winding path following a river's course from mountain spring to delta, the river meanders creating natural curves in the path, wooden bridges crossing the river at several points creating route choices, a waterfall at the upper section, reeds and lily pads in calmer sections, cherry blossom trees lining both banks, fishing docks and small boats visible, junctions at bridge crossings, spaces for game tokens clearly visible along both banks (50 distinct spaces), the water should have gentle flow lines to show current direction. Color palette strictly soft pinks, warm creams, water blues and aquas, mossy greens, honey browns for wooden elements, stone greys. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. Minimal text. File path: src/assets/images/boards/river-journey-board.png

---

## Space Icons & UI Elements

### Golden Cherry Blossom (purchasable item)

**Filename:** `src/assets/images/items/golden-cherry-blossom.png`

**Prompt:**
> Pixel art icon, single golden cherry blossom flower, five petals in brilliant gold with slight shimmer effect suggested through shading, warm glow emanating from the center, the blossom should look precious and special, slightly larger than a regular pink cherry blossom, celebratory and valuable appearance. 24×24 pixels. Color palette: golden yellows, warm ambers, touches of cream for highlights. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic, designed to be instantly recognizable as the valuable collectible. Transparent background. File path: src/assets/images/items/golden-cherry-blossom.png

---

### Board Space Markers

**Filename:** `src/assets/images/items/board-spaces.png` (sprite sheet with all space types)

**Prompt:**
> Pixel art sprite sheet of game board space markers, 6 different types arranged horizontally: (1) Regular space - single pink cherry blossom petal, (2) Golden Blossom space - small golden cherry blossom icon with glow, (3) Bonus space - gold coin icon, (4) Event space - question mark on cream background, (5) Junction space - directional arrows, (6) Start/Finish space - decorative flag. Each icon is 16×16 pixels, 1px gap between them, should be clearly distinguishable from each other when placed on a board. Color palette strictly soft pinks, golden yellows, warm creams, mossy greens. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. Transparent background. File path: src/assets/images/items/board-spaces.png

---

### Player Tokens (Color-Coded Bases)

**Filename:** `src/assets/images/items/player-tokens.png`

**Prompt:**
> Pixel art sprite sheet of 4 player token bases, simple circular platforms with a soft glow effect for each player color, arranged horizontally: (1) Soft pink glow, (2) Warm amber glow, (3) Mossy green glow, (4) Soft lilac glow. Each base is 20×20 pixels with the glow extending slightly beyond, 1px gap between them, designed to sit beneath any animal sprite on the game board. The bases should be subtle but clearly distinguishable. Style is refined 16-bit pixel art, gentle gradient glows, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. Transparent background. File path: src/assets/images/items/player-tokens.png

---

### Dice

**Filename:** `src/assets/images/items/party-dice.png`

**Prompt:**
> Pixel art sprite sheet of a 6-sided dice showing faces 1 through 10 (using multiple dice if needed), each die face shown from a slight isometric angle to give a 3D appearance, the dice are cream colored with warm rose-brown pips/numbers, soft shading to show dimension, cherry blossom petal decorating one face. Arrange faces in a grid or row format. Each die face approximately 24×24 pixels. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines, Neko Atsume cozy aesthetic, should look cheerful and inviting to roll. Transparent background. File path: src/assets/images/items/party-dice.png

---

### Selection Wheel

**Filename:** `src/assets/images/items/selection-wheel.png`

**Prompt:**
> Pixel art circular wheel divided into 5 equal sections for mini-game selection, each section a different soft pastel color (pink, amber, green, cream, lilac), decorative borders between sections, a central hub with a cherry blossom design, an ornate pointer/arrow at the top pointing to 12 o'clock position, the wheel should look festive and exciting like a game show wheel. 128×128 pixels total. Color palette strictly soft pinks, warm ambers, mossy greens, warm creams, soft lilacs. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. Transparent background. File path: src/assets/images/items/selection-wheel.png

---

## Party Mode UI Mockup

**Filename:** `src/assets/images/backgrounds/party-mode-ui-mockup.png`

**Prompt:**
> Pixel art UI mockup showing the Cherry Blossom Party mode main screen layout, top section shows 4 player panels (name, chosen animal sprite, current money, golden cherry blossom count), center section shows the game board with player tokens visible on the path, bottom section shows current round counter and action buttons ("Roll Dice", "View Scores"), decorative cherry blossom frame around the edges, warm cream background with soft pink accents, all text in a clean readable pixel font. The layout should feel organized, cheerful, and easy to parse at a glance. Color palette strictly soft pinks, warm creams, mossy greens, warm ambers. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No actual characters, just placeholder sprites. File path: src/assets/images/backgrounds/party-mode-ui-mockup.png

---

# Implementation Phases

## Phase 1: Core Board System
**Deliverables:**
- Board generation (paths, spaces, junctions)
- Dice rolling with weighted probability
- Token movement
- Turn sequencing for 2-4 players
- Space effects (bonus, event, golden blossom)

**Verification:**
1. Players can roll dice with correct probability distribution
2. Tokens move the correct number of spaces
3. Multiple players on the same space works correctly
4. Junctions allow player to choose direction
5. Event space triggers random event correctly
6. Golden Blossom can be purchased for $10
7. Money totals update correctly

---

## Phase 2: Mini-Game Integration
**Deliverables:**
- Filter unlocked games from main campaign
- Select 5 random games (no repeats in match)
- Wheel spin animation and selection
- Launch selected mini-game
- Record completion time for each player
- Rank players by time
- Award money ($10, $3, $2, $1)

**Verification:**
1. Only unlocked games appear in selection
2. 5 different games are shown each round
3. Wheel spins and lands on one game
4. Game launches correctly
5. Each player plays in sequence
6. Times are recorded accurately
7. Rankings are correct (fastest to slowest)
8. Money is awarded to correct players
9. No crashes when game completes

---

## Phase 3: Party-Exclusive Mini-Games
**Deliverables:**
- Implement all 5 party-exclusive games:
  - Petal Dash
  - Blossom Catch
  - Village Sprint
  - Balloon Pop
  - River Crossing
- Create all 5 backgrounds
- Ensure they work with the timing system

**Verification:**
1. Petal Dash: Timer starts on GO, stops at finish line
2. Blossom Catch: Score converts to time correctly
3. Village Sprint: All 5 coins must be collected before return
4. Balloon Pop: Wrong balloons add penalty, correct order required
5. River Crossing: Falling restarts at near bank
6. All games feel balanced (average completion 10-30 seconds)

---

## Phase 4: Golden Blossom & Victory
**Deliverables:**
- Golden Blossom purchase system
- Blossom relocation after purchase
- Round counter (15/20/25/30 rounds)
- End-of-game scoring
- Victory screen with rankings
- Tiebreaker logic

**Verification:**
1. Players can only purchase with $10+
2. Blossom moves to new random space after purchase
3. Round counter decrements correctly
4. Game ends after chosen number of rounds
5. Winner is player with most blossoms
6. Tiebreaker uses money correctly
7. Victory screen shows final stats
8. "Play Again" starts a new match
9. "Return to Menu" exits to main menu

---

## Phase 5: Polish & Multiplayer UX
**Deliverables:**
- Player color coding (glows, outlines)
- Smooth camera panning to show events
- Sound effects (dice roll, wheel spin, coin collect, blossom purchase)
- Celebration animations (confetti, petals)
- Smooth transitions between phases
- Tutorial for first-time players

**Verification:**
1. Each player's token has correct color glow
2. Camera pans smoothly to show important events
3. All sound effects play at appropriate times
4. Victory celebration looks and feels satisfying
5. No jarring transitions between board and mini-game
6. Tutorial covers all mechanics clearly
7. Game is playable with 2, 3, or 4 players

---

# Complete Asset Checklist

## Backgrounds (10 total)

| Asset | Description | File Path |
|---|---|---|
| Petal Dash | Side-scrolling cherry blossom grove race | `src/assets/images/backgrounds/party-petal-dash.png` |
| Blossom Catch | Sky view under trees | `src/assets/images/backgrounds/party-blossom-catch.png` |
| Village Sprint | Top-down village maze | `src/assets/images/backgrounds/party-village-sprint.png` |
| Balloon Pop | Festival setting | `src/assets/images/backgrounds/party-balloon-pop.png` |
| River Crossing | Side view river with logs | `src/assets/images/backgrounds/party-river-crossing.png` |
| Village Loop Board | Circular board map | `src/assets/images/boards/village-loop-board.png` |
| Hillside Trail Board | Hill switchback map | `src/assets/images/boards/hillside-trail-board.png` |
| River Journey Board | River path map | `src/assets/images/boards/river-journey-board.png` |
| Party UI Mockup | Full UI layout reference | `src/assets/images/backgrounds/party-mode-ui-mockup.png` |

---

## Items & UI Elements (6 total)

| Asset | Description | File Path |
|---|---|---|
| Golden Cherry Blossom | 24×24 golden blossom icon | `src/assets/images/items/golden-cherry-blossom.png` |
| Board Spaces | 6 space types sprite sheet | `src/assets/images/items/board-spaces.png` |
| Player Tokens | 4 color-coded bases | `src/assets/images/items/player-tokens.png` |
| Party Dice | Dice faces 1-10 | `src/assets/images/items/party-dice.png` |
| Selection Wheel | 5-section wheel | `src/assets/images/items/selection-wheel.png` |

---

## Reused from Main Game

- All animal sprites (unlocked species become playable characters)
- All main campaign mini-game backgrounds (reused in party mode)
- All mini-game mechanics (just timed for competition)

**Total new assets to create:** 15 (10 backgrounds, 5 items/UI)

---

# Data Model

```typescript
interface PartyGame {
  players: PartyPlayer[];
  currentRound: number;
  totalRounds: number; // 15, 20, 25, or 30
  boardType: 'villageLoop' | 'hillsideTrail' | 'riverJourney' | 'random';
  goldenBlossomPositions: number[]; // space indices where blossoms are
  completedMiniGames: string[]; // prevent repeats within match
}

interface PartyPlayer {
  id: string;
  name: string;
  species: string; // 'DOG', 'CAT', etc.
  breed: string; // 'Husky', 'Siamese', etc.
  spriteKey: string; // reference to sprite asset
  color: 'pink' | 'amber' | 'green' | 'lilac';
  position: number; // current space on board
  money: number;
  goldenCherryBlossoms: number;
  lastMiniGameTime: number; // in seconds
}

interface MiniGameResult {
  playerId: string;
  completionTime: number; // in seconds
  rank: number; // 1-4
  moneyEarned: number; // $10, $3, $2, or $1
}
```

---

# Summary

**Cherry Blossom Party** is a full-featured multiplayer mode that:
- Reuses all existing mini-games from the campaign (respecting player progression)
- Adds 5 exclusive party games for variety
- Provides 3 different board layouts (plus random)
- Supports 2-4 players with clear color coding
- Offers customizable match length (15-30 rounds)
- Creates competitive but friendly gameplay loop
- Requires only 15 new assets (mostly backgrounds and UI)

**Estimated total playtime per match:** 20-60 minutes depending on rounds chosen
**Replayability:** High (random boards, random game selection, different character choices)
**Accessibility:** Works with any number of unlocked species, scales with player progression