# Paws & Purpose — Implementation Plan

After each phase is complete, verify the deliverable using the verification steps provided, then return and implement the next phase.

---

## Guiding principles for the AI

Before writing any code, establish these practices and never deviate from them:

- **Single-purpose files.** Every file does one thing. A file that renders a button does not also fetch data. A file that manages state does not also handle routing.
- **Small files.** If a file exceeds ~150 lines, it is doing too much. Split it.
- **Typed interfaces.** Define data shapes in dedicated type/interface files. No inline type definitions on complex objects.
- **No magic strings.** Game constants (species names, rarity tiers, action names, upgrade costs) live in a single constants file, never hardcoded in logic files.
- **Separation of concerns.** Game logic, UI rendering, state management, and data definitions are always in separate files.
- **Descriptive naming.** File names describe what they do: `useShelterState.ts`, `PetCard.tsx`, `adoptionLogic.ts`. Never `utils.ts`, `helpers.ts`, or `misc.ts`.
- **One component per file.** No file exports more than one React component (or equivalent).
- **Comments on intent, not mechanics.** Comment why something is done, not what the code obviously does.

---

## Technology guidance

You are building a 2D browser-based pixel-art game. Choose technologies that satisfy these needs:

- **Rendering:** You need a canvas-based 2D renderer capable of pixel-perfect sprite rendering, tile maps, and simple animations. Consider Phaser, PixiJS, or a lightweight canvas wrapper. Do not use a DOM-based UI library for the game canvas itself.
- **UI layer:** Menus, notice boards, shops, character builders, and HUD elements outside the canvas can use a component framework (React, Vue, Svelte) layered over the canvas. Pick one and be consistent.
- **State management:** The game has persistent daily state (shelter animals, money, upgrades, owned pets, vet recovery timers). Choose a state solution that can be serialized to localStorage for save/load.
- **Language:** Use TypeScript throughout. No JavaScript files.
- **Styling:** Use a utility-first CSS approach or CSS modules. No global stylesheets except a single reset/base file.
- **Build tooling:** Use a modern bundler with hot module replacement for fast iteration (Vite is recommended).
- **Asset pipeline:** Pixel art sprites will be small PNGs. The asset pipeline must support importing PNG spritesheets and slicing them into frames.
- **Audio:** Simple looping background music and one-shot sound effects. The audio engine must support layering and volume control per channel.

Document your specific technology choices at the top of `plan.md` before beginning Phase 1, and stick with them for the entire project.

---

## File type conventions

Establish these file types before writing any feature code. Every file in the project must be one of these types:

| Suffix / folder | Purpose | Example |
|---|---|---|
| `*.types.ts` | TypeScript interfaces and enums only, no logic | `animal.types.ts` |
| `*.constants.ts` | Exported constants only, no logic | `rarity.constants.ts` |
| `*.store.ts` | State management slice or store | `shelter.store.ts` |
| `*.logic.ts` | Pure functions, game rules, calculations | `adoption.logic.ts` |
| `*.scene.ts` | Phaser scene class (or equivalent) | `MorningScene.scene.ts` |
| `*.component.tsx` | Single UI component | `PetCard.component.tsx` |
| `*.hook.ts` | Custom React hook (or equivalent) | `useDayPhase.hook.ts` |
| `*.config.ts` | Static configuration objects | `upgrades.config.ts` |
| `*.assets.ts` | Asset key registrations and sprite configs | `animals.assets.ts` |
| `*.audio.ts` | Sound effect and music definitions | `shelter.audio.ts` |

---

## Game data model (reference for all phases)

Define these types in Phase 1. All later phases build on them.

```
Animal
  id: string
  species: Species (enum)
  breed: string
  name: string | null           -- null until named by player
  rarity: Rarity (enum)
  isRevealed: boolean           -- false while still muddy/hidden
  desirability: number          -- 0–100
  healthStatus: HealthStatus (enum)
  vetDaysRemaining: number      -- 0 if not in vet
  isMine: boolean               -- true if adopted by player as own pet
  outfits: string[]             -- equipped outfit keys
  discoveryMethod: DiscoveryMethod (enum)

Species enum: DOG, CAT, SMALL_ANIMAL, BIRD, REPTILE, EXOTIC_SMALL, AQUATIC, EXOTIC_LARGE

Rarity enum: COMMON, UNCOMMON, RARE, EXOTIC, LEGENDARY

HealthStatus enum: HEALTHY, MINOR, MODERATE, SERIOUS, CRITICAL

DiscoveryMethod enum: DIRTY, HIDING, BOX, SOUND, TANGLED, EGG, NOCTURNAL, CAMOUFLAGED, UNDERWATER, PARENT_BLOCKED

DayPhase enum: MORNING, AFTERNOON, EVENING

GameState
  playerName: string
  townName: string
  shelterName: string
  dayNumber: number
  phase: DayPhase
  money: number
  shelterAnimals: Animal[]
  ownedPets: Animal[]
  vetAnimals: Animal[]           -- animals currently in recovery
  facilityUpgrades: string[]     -- keys of purchased upgrades
  shopUnlocks: string[]          -- keys of unlocked shop categories
  reputationBySpecies: Record<Species, number>
  noticeBoard: Call[]

Call
  id: string
  title: string
  description: string
  species: Species
  isMysterious: boolean          -- hides species in UI if true
  discoveryMethod: DiscoveryMethod
  requiredFacility: string[]     -- upgrade keys needed to receive this call
```

---

## Phase overview

| Phase | Name | What it delivers |
|---|---|---|
| 1 | Project scaffold | Runnable blank canvas with TypeScript, build tooling, file conventions, and all core types defined |
| 2 | Character creation | Working character builder UI — appearance, player name, town name |
| 3 | Prologue cutscene | Pixel comic panel sequence leading to the muddy puppy |
| 4 | First wash interaction | Scrub mini-game revealing the puppy, breed announcement |
| 5 | Name and bond | Name the puppy, pet interaction, first bedtime ceremony |
| 6 | Day 2 — the call | Phone call cutscene, second animal rescue, shelter naming |
| 7 | Shelter floor | Kennel grid, pet cards, wash action, desirability bar |
| 8 | Notice board | Morning call system, facility-gated call filtering |
| 9 | End-of-day adoption | Adoption probability roll, result screen, payout |
| 10 | Vet triage corner | First aid station unlock, recovery timer, daily vet interactions |
| 11 | Pets R Us shop | Shop UI, Day 3 inventory, purchase flow |
| 12 | Home phase | Pet room, outfits, walk mini-game, bedtime ceremony |
| 13 | Facility upgrades | Kennel expansion, species unlock progression, dual-requirement gating |
| 14 | Economy balancing | Full rarity/payout table, care bonus multiplier, shop pricing pass |
| 15 | Audio and polish | Background music, sound effects, pixel transition animations |

---

## Phase 1 — Project scaffold

### Goal
A running application in the browser with nothing visible except a canvas and a placeholder "Day 1 — Morning" text. All file conventions, types, and constants are in place. No game logic yet, but the skeleton every future phase will build on is solid.

### Deliverables
- Project initialised with chosen build tooling
- TypeScript configured strictly (`strict: true`, no implicit any)
- Canvas renderer initialised and rendering at a fixed pixel resolution (recommend 320×180 upscaled to fill viewport, maintaining aspect ratio — classic pixel-art resolution)
- All core type files created and exported (no logic, just types)
- All core constants files created with placeholder values
- A single placeholder scene rendering "Day 1 — Morning" in a pixel font
- A README documenting the chosen technology stack and how to run the project

### Files to create in Phase 1

```
src/
  types/
    animal.types.ts
    game.types.ts
    facility.types.ts
    call.types.ts
    player.types.ts
  constants/
    rarity.constants.ts
    species.constants.ts
    upgrades.constants.ts
    actions.constants.ts
  config/
    resolution.config.ts       -- canvas width, height, scale
    gamePhase.config.ts        -- DayPhase enum values and labels
  scenes/
    Boot.scene.ts              -- loads assets, transitions to placeholder
    Placeholder.scene.ts       -- renders "Day 1 — Morning" text
  main.ts                      -- entry point, initialises renderer with Boot scene
  index.html
README.md
plan.md                        -- this file
```

### Implementation notes
- `resolution.config.ts` must export `GAME_WIDTH`, `GAME_HEIGHT`, and `PIXEL_SCALE`. All scenes import from here — never hardcode pixel dimensions anywhere else.
- `animal.types.ts` must define the full `Animal` interface, all enums (`Species`, `Rarity`, `HealthStatus`, `DiscoveryMethod`), and nothing else.
- `game.types.ts` must define `GameState` and `DayPhase`.
- `call.types.ts` must define the `Call` interface.
- `facility.types.ts` must define upgrade and shop unlock shapes.
- `player.types.ts` must define the player character appearance shape (for character builder).
- All constants files export plain objects or enums. No functions, no logic.
- The placeholder scene must use a pixel/monospace font loaded from a CDN or bundled — establish the font pipeline now so all later scenes can use it.
- Do not add any game logic in Phase 1. If you find yourself writing an if-statement about game rules, stop and put it in a `*.logic.ts` file to be fleshed out in a later phase.

### Verification plan

After Phase 1 is implemented, verify the following before moving to Phase 2:

1. Run `npm install` (or equivalent) with no errors.
2. Run the dev server (`npm run dev` or equivalent). The browser opens without errors in the console.
3. A canvas is visible, filling the browser window while maintaining its aspect ratio. Resizing the window does not break the layout.
4. The text "Day 1 — Morning" (or similar placeholder) is visible on the canvas in a pixel/monospace font.
5. Open `src/types/animal.types.ts`. Confirm it contains the `Animal` interface, `Species`, `Rarity`, `HealthStatus`, and `DiscoveryMethod` enums, and nothing else (no functions, no default exports of objects).
6. Open `src/constants/rarity.constants.ts`. Confirm it contains rarity tier data (labels, payout ranges, adoption caps) as plain exported constants.
7. Run `npx tsc --noEmit`. Zero TypeScript errors.
8. Open the README. Confirm it documents the chosen tech stack and run instructions.

---

## Phase 2 — Character creation

### Goal
A fully functional character builder UI screen. The player can customise their character's appearance, enter their name, and enter the town name. Confirming advances to a placeholder "prologue" screen. All choices are saved to game state.

### Deliverables
- Character builder screen rendered over or instead of the canvas (UI layer)
- Live pixel-art character preview updating as choices are made
- Appearance options: base silhouette (2), skin tone (6), hair style (6), hair color (8), outfit color (3), eye color (5)
- Player name text input (max 20 characters)
- Town name text input (max 20 characters)
- Confirm button advances to placeholder next screen
- Player name, town name, and appearance saved to `GameState`

### Files to create in Phase 2

```
src/
  components/
    CharacterBuilder.component.tsx   -- parent screen
    AppearanceSelector.component.tsx -- one reusable option-picker row
    CharacterPreview.component.tsx   -- live pixel sprite preview
    NameInput.component.tsx          -- reused for player name and town name
  stores/
    game.store.ts                    -- initialises GameState, exposes setters
  logic/
    characterBuilder.logic.ts        -- validates name input, builds initial player object
  assets/
    character.assets.ts              -- sprite sheet keys and frame definitions for character preview
```

### Implementation notes
- `AppearanceSelector.component.tsx` must be generic — it takes a label, an array of options, and a selected value. It renders the options as clickable swatches or buttons. It does not know what it is selecting (hair, skin, outfit).
- `CharacterPreview.component.tsx` composes the chosen sprite layers. If full sprite layering is complex at this stage, a placeholder coloured silhouette that updates colour on selection is acceptable — mark a TODO for final art pass in Phase 15.
- `game.store.ts` creates the initial `GameState` with all fields at their zero/null values. The character builder populates `playerName`, `townName`, and the player appearance fields.
- Name validation in `characterBuilder.logic.ts`: no empty strings, no special characters that would break save files, max length enforced.
- Town name is purely cosmetic — store it and use it in UI strings going forward.
- The confirm button must be disabled until both name fields are non-empty.

### Verification plan

1. Dev server runs with no console errors.
2. The character builder screen is visible on load.
3. Clicking each appearance option updates the preview in real time.
4. Typing in the player name field updates a visible name display.
5. Typing in the town name field stores the value (verify in state debugger or console log on confirm).
6. Confirm button is disabled when either name field is empty.
7. Confirm button is enabled and clickable when both names are filled.
8. Clicking Confirm advances to the next screen (placeholder is fine).
9. Run `npx tsc --noEmit`. Zero TypeScript errors.
10. Open `CharacterBuilder.component.tsx`. Confirm it contains no game logic — only composition of child components and wiring to the store.

---

## Phase 3 — Prologue cutscene

### Goal
A short, non-interactive comic-panel sequence that introduces the player's character arriving in town and discovering the muddy puppy. Panels advance on tap/click. Sets emotional tone before the first interaction.

### Deliverables
- 4 sequential pixel-art comic panels (placeholder art acceptable, final art in Phase 15)
- Each panel has a scene illustration area and an optional caption line at the bottom
- Tap/click anywhere or press Space/Enter to advance
- Player name and town name are interpolated into captions where relevant
- Final panel transitions into Phase 4 (the wash interaction)
- A skip button for returning players

### Files to create in Phase 3

```
src/
  scenes/
    Prologue.scene.ts              -- manages panel sequence, input, transition
  components/
    CutscenePanel.component.tsx    -- renders one panel: art + caption
    SkipButton.component.tsx       -- skip cutscene entirely
  config/
    prologue.config.ts             -- panel definitions: art key, caption template strings
  assets/
    prologue.assets.ts             -- sprite/background keys for each panel
```

### Implementation notes
- `prologue.config.ts` exports an ordered array of panel config objects. Each object has an art key and a caption string that may contain `{playerName}` and `{townName}` tokens. The scene replaces tokens at render time. No logic in the config file.
- Captions use the pixel font established in Phase 1.
- Placeholder art: simple flat-color scene illustrations are fine. Each panel must be visually distinct (different dominant color/scene) so the sequence feels like progression.
- The skip button writes to `GameState` that the prologue has been seen, so it can be skipped on future playthroughs automatically or via a settings toggle.
- Panel 4 (muddy blob with eyes) must use a dedicated muddy-blob sprite that will be reused in Phase 4's wash interaction — establish the asset key here.

### Verification plan

1. After the character builder confirm, the prologue sequence appears.
2. Four panels advance in order on click/tap/Space/Enter.
3. Player name and town name appear correctly interpolated in captions.
4. The skip button is visible and skips to the wash screen.
5. After panel 4, the screen transitions (placeholder screen is fine).
6. Run `npx tsc --noEmit`. Zero TypeScript errors.
7. Open `prologue.config.ts`. Confirm it is purely data — no JSX, no functions beyond simple string templates.

---

## Phase 4 — First wash interaction

### Goal
The game's first interactive mechanic. The player scrubs the muddy puppy clean via mouse drag or touch swipe. As mud is removed, the hidden puppy is gradually revealed. The breed is randomly assigned at scene load. On full reveal, a breed announcement plays.

### Deliverables
- Wash scene renders the muddy-blob sprite
- Player scrubs by clicking/dragging or touching/swiping over the blob
- Mud clears in the scrubbed area progressively (pixel mask or overlay approach)
- As mud clears, the puppy sprite underneath becomes visible in patches
- At ~90% revealed, a "clean shake" animation plays automatically
- Breed is randomly selected from the starter common dog pool (5–6 breeds)
- Breed announcement screen: breed name, a clean sprite, small fanfare
- Transitions to Phase 5 (naming screen)

### Files to create in Phase 4

```
src/
  scenes/
    WashInteraction.scene.ts        -- manages scrub input, mud mask, reveal logic
  logic/
    washReveal.logic.ts             -- calculates reveal percentage, triggers thresholds
    breedAssignment.logic.ts        -- randomly selects breed from eligible pool
  config/
    starterDogs.config.ts           -- starter breed pool: name, sprite key, rarity, base desirability range
  components/
    BreedAnnouncement.component.tsx -- breed name + sprite reveal card
  assets/
    wash.assets.ts                  -- mud overlay sprite, puppy sprite sheet, shake animation frames
```

### Implementation notes
- The mud mask technique: render the clean puppy sprite beneath a mud overlay. Track a coverage map (simple grid of cells, e.g. 20×20). Each scrub event marks cells as cleared. Render cleared cells as transparent on the mud overlay. This is simpler than per-pixel and performs well.
- `washReveal.logic.ts` is a pure function: given a coverage map, returns the reveal percentage. No DOM access, no scene references.
- `breedAssignment.logic.ts` is a pure function: given a random seed and the starter dog pool, returns a breed. No side effects.
- `starterDogs.config.ts` defines the initial eligible breeds. This file will grow in later phases as more species unlock. Keep it data-only.
- The "clean shake" animation is the first use of the sprite animation pipeline — make sure it works end-to-end as it will be reused for many animals.
- Breed announcement card uses the UI component layer (not canvas) for readability and easy styling.

### Verification plan

1. Wash scene appears after the prologue.
2. Clicking and dragging over the muddy blob clears mud in the dragged area.
3. The puppy sprite is visible through cleared areas.
4. When approximately 90% of mud is cleared, the shake animation plays automatically.
5. The breed announcement card appears after the shake, showing the correct breed name and a clean sprite.
6. Run `breedAssignment.logic.ts` in isolation (unit test or console): given the same seed, it always returns the same breed. Given different seeds, it returns different breeds.
7. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 5 — Name and bond

### Goal
After the breed reveal, the player names their puppy, has a brief petting interaction, and completes the first bedtime ceremony. This is the emotional payoff of the prologue.

### Deliverables
- Naming screen: puppy sprite, breed label, name text input, confirm button
- Petting interaction: tap/click the puppy, tail-wag animation plays, pixel hearts float up (3 taps total before prompting bed)
- Bedtime screen: cottage interior, puppy walks to bed, curls up, player tucks in with a tap
- Fade to stars transition
- "Day 2 — Morning" placeholder screen
- Puppy is saved to `GameState.ownedPets` with chosen name, `isMine: true`

### Files to create in Phase 5

```
src/
  scenes/
    NamingScreen.scene.ts
    PettingInteraction.scene.ts
    BedroomScene.scene.ts          -- reused in every future bedtime ceremony
  components/
    PetNameInput.component.tsx     -- reused whenever an animal is named
    HeartParticle.component.tsx    -- floating heart animation, reusable
  logic/
    ownedPet.logic.ts              -- creates a fully-formed Animal object from breed + name
  assets/
    bedroom.assets.ts              -- cottage bedroom background, pet bed sprites
    petAnimations.assets.ts        -- tail wag, curl-up, walk-to-bed animation frames
```

### Implementation notes
- `PetNameInput.component.tsx` is the same component used later when naming shelter animals and the shelter itself. Keep it generic: accepts a prompt string, a max length, and an onConfirm callback.
- `HeartParticle.component.tsx` is a self-contained floating animation. It takes a position and plays once. It will be reused throughout the home phase.
- `BedroomScene.scene.ts` is designed from the start to support multiple pets in bed — even though only one pet exists now. Render a bed slot system: one slot occupied, remaining slots empty (not visible yet). This avoids a rewrite in Phase 12.
- `ownedPet.logic.ts` creates the `Animal` object: sets `isMine: true`, `isRevealed: true`, `rarity: COMMON`, `desirability: 50` (starting bond), name from input.
- The fade-to-stars transition establishes the visual language for all future day endings. Build it as a reusable transition utility.

### Verification plan

1. After breed announcement, naming screen appears with the puppy sprite.
2. Confirm button is disabled until a name is entered.
3. After naming, the petting screen shows the puppy. Tapping the puppy plays the tail-wag and spawns floating hearts.
4. After 3 pets (or a "time for bed" prompt), the bedroom scene appears.
5. Tapping the puppy in bed plays the curl-up animation.
6. A fade-to-stars transition plays and "Day 2 — Morning" (placeholder) appears.
7. Open `GameState` in the store/debugger: `ownedPets` array contains one animal with the correct name and `isMine: true`.
8. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 6 — Day 2: the call and shelter naming

### Goal
Day 2 opens with a phone-call cutscene, a second animal rescue (another wash interaction, this time leading to the shelter), and the decision to open a shelter — including naming it.

### Deliverables
- Phone-call cutscene: simple illustrated panel, neighbor's voice (text only at this stage), animal in distress implied
- Second wash interaction (reuses Phase 4 wash scene with a different breed/species from starter dog pool)
- Post-rescue reflection scene: character looks at cottage, puppy, rescued animal — thought bubble "there must be more..."
- Shelter naming screen: text input, confirm button, shelter name saved to `GameState`
- Shelter building exterior pixel scene with the new name on the sign
- Shelter opens: 3 kennel slots, wash action only, rescued animal placed in first kennel slot
- Rescued animal has enough desirability for a small adoption chance — first adoption can happen at end of day 2

### Files to create in Phase 6

```
src/
  scenes/
    PhoneCallCutscene.scene.ts
    ShelterNaming.scene.ts
    ShelterExterior.scene.ts        -- the building reveal moment
  components/
    ShelterNameInput.component.tsx  -- thin wrapper over PetNameInput with shelter-specific prompt
    ThoughtBubble.component.tsx     -- reusable for future character reflection moments
  config/
    shelterOpening.config.ts        -- flavor text strings for the shelter opening sequence
  logic/
    shelterSetup.logic.ts           -- initialises shelter state: 3 kennels, wash-only capability
```

### Implementation notes
- The second wash interaction calls the same `WashInteraction.scene.ts` from Phase 4 — do not duplicate the scene. Pass configuration (which breed pool to use, which context string to show) as scene data.
- `shelterSetup.logic.ts` creates the initial facility state: `facilityUpgrades` contains only `'KENNEL_BASIC_3'`, no vet upgrades, no shop unlocks. This pure function is the source of truth for what a brand-new shelter looks like.
- The shelter exterior scene must render the shelter name dynamically from `GameState.shelterName`. The name appears on a pixel-art sign above the door.
- The notice board is introduced here as a UI element even if it only has one call on it to start. Establish the component now.

### Verification plan

1. Day 2 begins with the phone-call cutscene.
2. The rescue leads into a wash interaction. Scrubbing works identically to Phase 4.
3. The reflection scene plays after the rescue.
4. The shelter naming screen appears. Entering a name and confirming shows the shelter exterior with the name on the sign.
5. The shelter floor shows 3 kennel slots: 1 occupied by the rescued animal, 2 empty.
6. The wash action is available on the rescued animal. Other actions (feed, groom, photo) are not yet present.
7. Open `GameState`: `shelterName` is set, `shelterAnimals` has one animal, `facilityUpgrades` contains only the basic kennel key.
8. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 7 — Shelter floor

### Goal
The full afternoon shelter phase UI. All care actions available (wash, feed, groom, pet, photo, train, socialize, vet). Desirability system functional. Animal mood states visible.

### Deliverables
- Shelter floor grid: kennel slots rendered, occupied/empty states
- Pet card for each animal: sprite, name (or "???" if unrevealed), rarity badge, desirability bar, mood indicator
- Action panel: all 8 care actions as buttons, enabled/disabled based on animal state
- Each action applies a desirability delta via game logic
- Desirability capped at 100; adoption chance capped per rarity tier
- Animals in vet shown with recovery badge and days remaining — no actions available
- Mood states: happy, calm, anxious, shy — affect which actions give bonus

### Files to create in Phase 7

```
src/
  components/
    ShelterFloor.component.tsx
    KennelSlot.component.tsx        -- single slot: empty or occupied
    PetCard.component.tsx           -- animal portrait, name, rarity, desirability
    ActionPanel.component.tsx       -- 8 action buttons for selected animal
    DesirabilityBar.component.tsx   -- reusable progress bar with color thresholds
    MoodIndicator.component.tsx     -- icon + label for current mood
    RarityBadge.component.tsx       -- colored pill with rarity label
  logic/
    careActions.logic.ts            -- pure functions: applyAction(animal, action) => Animal
    desirability.logic.ts           -- clamp, calculate adoption chance, apply mood modifier
    moodState.logic.ts              -- determines mood from recent actions and time in shelter
  stores/
    shelter.store.ts                -- shelterAnimals array, selected animal, action history
  constants/
    careActions.constants.ts        -- action names, base desirability deltas, unlock requirements
```

### Implementation notes
- `careActions.logic.ts` exports one function per action (or a dispatch-style `applyAction(animal, actionKey)`). Each function takes an `Animal` and returns a new `Animal` (immutable update). No side effects.
- `desirability.logic.ts` exports `getAdoptionChance(animal)` — uses rarity cap and current desirability to return a 0–1 probability. This is the single source of truth for adoption probability used in Phase 9.
- `moodState.logic.ts` derives mood from days in shelter and recent action types. Shy animals respond better to quiet actions (pet, feed), anxious animals respond better to the vet checkup. This is pure logic — no UI.
- `ActionPanel.component.tsx` receives the selected animal and a list of available action keys. It does not calculate which actions are available — that comes from the store or a selector.
- Actions that aren't yet unlocked (because of missing shelter upgrades) are visible but disabled with a lock icon and upgrade hint tooltip.

### Verification plan

1. Shelter floor shows correct number of kennel slots matching current capacity.
2. Occupied kennels show the pet card with name, rarity badge, desirability bar.
3. Selecting a kennel highlights it and shows the action panel.
4. Clicking each action button visibly updates the desirability bar.
5. Desirability cannot exceed 100.
6. An animal in vet care shows the recovery badge and greyed-out action panel.
7. Happy/calm/anxious/shy mood is visible on the pet card.
8. Run `careActions.logic.ts` functions in isolation: given the same animal and action, the output is deterministic and the desirability delta matches the constants file.
9. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 8 — Notice board and morning calls

### Goal
The morning phase is now functional. The notice board shows incoming calls filtered by current facility capability. The player selects a call, goes to the relevant discovery scene, and brings an animal back to the shelter.

### Deliverables
- Morning phase screen: pixel scene background, notice board UI
- Notice board lists today's calls (2–4 per day)
- Each call shows: title, description, mystery badge or species badge, discovery method hint
- Call selection highlights the card and shows a detail expand
- "Respond" button leads to the discovery interaction (wash scene for dirty animals, or a placeholder for other discovery methods)
- Calls are generated based on current `facilityUpgrades` — species not yet unlocked never appear
- Day 1 and Day 2 calls are hardcoded (tutorial); Day 3+ calls are procedurally generated from eligible pool

### Files to create in Phase 8

```
src/
  components/
    NoticeBoard.component.tsx
    CallCard.component.tsx           -- single call listing
    CallDetail.component.tsx         -- expanded detail panel
  logic/
    callGeneration.logic.ts          -- generates daily calls from eligible pool given facility state
    facilityGating.logic.ts          -- given facilityUpgrades, returns eligible species and discovery methods
  config/
    callPool.config.ts               -- all possible call templates: title, description, species, discoveryMethod, requiredFacility
    tutorialCalls.config.ts          -- hardcoded Day 1 and Day 2 calls
  stores/
    noticeBoard.store.ts             -- today's calls, selected call, responded calls
```

### Implementation notes
- `callPool.config.ts` is a large data file — every possible call template. Each entry has a `requiredFacility` array of upgrade keys. `facilityGating.logic.ts` filters this list against the current `facilityUpgrades` to get the eligible pool for today.
- `callGeneration.logic.ts` picks 2–4 calls from the eligible pool each morning, weighted by discovery method variety (don't show 4 dirty animals in a row if possible). Pure function: given the pool and a seed, returns today's calls.
- Tutorial calls in `tutorialCalls.config.ts` are used for days 1–2 regardless of the generation system. Day 3 onwards uses generation.
- The "Respond" action must handle multiple discovery methods. For Phase 8, only the wash interaction is fully implemented. Other discovery methods show a placeholder scene with the animal already cleaned (to be fleshed out in a post-Phase 15 expansion pass).

### Verification plan

1. Morning phase shows the notice board with 2–4 calls.
2. Day 1 and Day 2 calls match the tutorial scripts exactly.
3. Selecting a call highlights it and shows the detail panel.
4. Responding to a dirty-animal call loads the wash interaction.
5. After the wash, the animal is added to `GameState.shelterAnimals`.
6. A call requiring a facility upgrade the player doesn't have never appears on the board.
7. Run `facilityGating.logic.ts` in isolation: given an upgrade list with only basic kennels, the output excludes all non-dog species calls.
8. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 9 — End-of-day adoption

### Goal
At the end of the afternoon, the player presses "End Day." Each shelter animal rolls against their adoption probability. Results are shown as a ceremony. Payouts are deposited. Adopted animals are removed from the shelter.

### Deliverables
- "End Day" button on the shelter floor
- Adoption roll runs for every animal in `shelterAnimals` (excluding vet animals)
- Result screen: list of animals, adopted or not, with adoption shown as a family-arrives animation
- Adopted animal portrait glows, a brief goodbye plays
- Payout shown per adopted animal and total for the day
- `GameState.money` updated
- Adopted animals removed from `shelterAnimals`
- Day phase advances to EVENING

### Files to create in Phase 9

```
src/
  scenes/
    AdoptionResult.scene.ts
  components/
    AdoptionResultCard.component.tsx   -- one animal's result: adopted or staying
    PayoutSummary.component.tsx        -- total earnings for the day
  logic/
    adoptionRoll.logic.ts              -- pure: given animals, returns adoption results
    payoutCalculation.logic.ts         -- pure: given animal rarity + desirability, returns payout
  config/
    payouts.config.ts                  -- base payout per rarity, care bonus multiplier formula
```

### Implementation notes
- `adoptionRoll.logic.ts` is fully deterministic given a seed — use a seeded random function so results can be replicated in tests. It takes the array of animals and returns a parallel array of booleans.
- `payoutCalculation.logic.ts` applies: `basePayout[rarity] × careBonus(desirability)`. Care bonus is 1.0 at 50 desirability, 1.5 at 100. Linear interpolation. This formula lives here and nowhere else.
- `payouts.config.ts` contains the base payout table and the care bonus formula parameters — not hardcoded in logic.
- The adoption ceremony animation is the emotional highlight — even if it's placeholder art, make the timing feel good. Show each adopted animal one at a time with a 1-second pause between.

### Verification plan

1. Clicking "End Day" triggers the adoption result screen.
2. Animals with higher desirability visibly have better outcomes over multiple test runs.
3. No animal exceeds its rarity adoption cap (verify by running `getAdoptionChance` unit test at 100 desirability for each rarity).
4. Payout total matches the sum of individual payouts shown.
5. `GameState.money` increases by the correct total.
6. Adopted animals are no longer in `GameState.shelterAnimals` after the result screen.
7. The screen advances to the EVENING phase after the ceremony.
8. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 10 — Vet triage corner

### Goal
The vet wing is purchasable for $75–100. Once purchased, animals can be sent to vet care. Recovery takes days based on severity. Daily vet interactions (check in, bandage, medicine, comfort) are available. The vet upgrade unlocks moderate-severity animals in future calls.

### Deliverables
- Vet upgrade purchasable from a "Facility" tab (precursor to the shop, appearing on Day 3)
- On purchase: vet wing scene added to shelter, triage table visible
- Animals can be assigned to vet care from the action panel ("Send to Vet")
- Vet severity assigned on admission (random from animal's health status, or visible if already set by call)
- Recovery countdown shown in days on the vet animal's card
- Daily interactions: check in (+mood), change bandage (+small recovery speed), give medicine (+recovery speed), comfort visit (+bond if keeping)
- On discharge: health certificate badge added to animal, desirability boost applied, animal returns to shelter floor

### Files to create in Phase 10

```
src/
  scenes/
    VetWing.scene.ts
  components/
    VetWing.component.tsx
    VetAnimalCard.component.tsx      -- recovery progress, daily interaction buttons
    RecoveryProgress.component.tsx   -- days remaining bar
    HealthCertBadge.component.tsx    -- displayed on pet card post-discharge
  logic/
    vetAdmission.logic.ts            -- assigns severity, calculates base recovery days
    vetRecovery.logic.ts             -- applies daily interactions, checks discharge condition
    upgradeEffect.logic.ts           -- given facilityUpgrades, returns recovery day modifiers
  config/
    vetUpgrades.config.ts            -- all vet upgrades: cost, effect, recovery modifier
    severity.config.ts               -- severity tiers: days, desirability boost on discharge
```

### Implementation notes
- `vetRecovery.logic.ts` runs once per day transition. It decrements `vetDaysRemaining` for each vet animal, checks for discharge, and applies any daily interaction bonuses accumulated that day. Pure function.
- `upgradeEffect.logic.ts` is the single place that translates the `facilityUpgrades` list into numeric modifiers (recovery speed, bed count, etc.). All logic files that need these modifiers call this function — never check upgrade keys directly in scene or component code.
- Recovery bed count starts at 1. If a second animal needs vet care and the bed is occupied, the game shows a gentle message: "Rex is still recovering — [animal name] will be seen as soon as a bed is free." No suffering implied, just a queue.
- The "you are the vet" framing: before the staff vet upgrade is purchased, action labels say "Do your best" and "Apply bandage yourself." After the staff vet upgrade, labels change to "Dr. [name] checks in" etc. This is purely a string swap in the config — no logic change.

### Verification plan

1. The vet upgrade appears as purchasable on Day 3 or later.
2. Purchasing it deducts the correct amount from `GameState.money` and adds the upgrade key to `facilityUpgrades`.
3. The vet wing section is visible in the shelter after purchase.
4. Sending an animal to vet care moves it from `shelterAnimals` to `vetAnimals`.
5. The animal's card in the vet wing shows days remaining, decreasing each day.
6. Daily interaction buttons (check in, bandage, medicine, comfort) each have a visible effect on the animal card.
7. On the correct day, the animal is discharged: moved back to `shelterAnimals`, health certificate badge visible, desirability increased.
8. Run `vetRecovery.logic.ts` in isolation: given an animal with 3 days remaining and a medicine interaction, output has 2 days remaining (or less with upgrade modifier).
9. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 11 — Pets R Us shop

### Goal
The shop opens on Day 3 as "Pets R Us." Initial inventory covers shelter essentials. Shop categories unlock with facility upgrades. Purchases are fulfilled immediately and effects applied to game state.

### Deliverables
- Shop tab visible from Day 3 onward
- "Pets R Us" branding — styled like an online store notification/flyer
- Day 3 starter inventory: premium food bowl, grooming brush, cozy kennel bed, enrichment toy, kennel expansion kit
- Purchase flow: item card with name, description, cost, buy button
- Insufficient funds state: buy button disabled, cost shown in red
- Purchase applies effect immediately (unlocks action, adds kennel slot, etc.)
- Shop inventory grows as facility upgrades are purchased (new categories appear)

### Files to create in Phase 11

```
src/
  components/
    ShopScreen.component.tsx
    ShopItemCard.component.tsx       -- item name, description, cost, buy button
    ShopCategory.component.tsx       -- collapsible category header + item list
    InsufficientFunds.component.tsx  -- inline warning state
  logic/
    shopInventory.logic.ts           -- filters master item list by current unlocks
    purchaseItem.logic.ts            -- applies item effect to GameState, deducts money
  config/
    shopItems.config.ts              -- all items: key, name, description, cost, category, requiredUnlock, effect
  stores/
    shop.store.ts                    -- purchased items, available inventory
```

### Implementation notes
- `shopItems.config.ts` is a flat list of all items across all categories and all unlock stages. Each item has a `requiredUnlock` field (an upgrade key or `null` for always available). `shopInventory.logic.ts` filters this list by current unlocks.
- `purchaseItem.logic.ts` applies the item's effect. Effects are typed: `ADD_KENNEL_SLOT`, `UNLOCK_ACTION`, `PASSIVE_DESIRABILITY_BOOST`, etc. The logic file handles each effect type. No effect logic lives in components.
- The shop must not allow purchasing the same one-time item twice — track purchased item keys in `GameState`.
- The kennel expansion kit adds one slot to the shelter. The shelter floor component reads slot count from state — it should already handle this correctly from Phase 7.

### Verification plan

1. Shop tab appears on Day 3.
2. Starter inventory shows 5 items.
3. Items the player cannot afford show a disabled buy button with cost in a warning color.
4. Purchasing an item deducts the correct amount from `GameState.money`.
5. Purchasing the grooming brush unlocks the groom action on the shelter floor.
6. Purchasing the kennel expansion kit adds one visible empty kennel slot.
7. A purchased one-time item cannot be purchased again.
8. Run `shopInventory.logic.ts` in isolation: given only the basic kennel upgrade, the output excludes cat-room items.
9. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 12 — Home phase

### Goal
The evening/weekend home phase is fully playable. The player can interact with their owned pets, dress them, go on walks, decorate the room, and complete the bedtime ceremony.

### Deliverables
- Home phase screen: pixel room view with owned pets visible
- Outfit system: equip/unequip outfits per pet; species-compatible outfits only shown
- Walk mini-game: short side-scrolling scene, pets follow player, items can be found
- Room decoration: grid-based furniture placement, items from shop affect comfort rating
- Bedtime ceremony: click through each pet to tuck in, custom per-species animation, fade to stars
- Owned pet comfort/mood carries over to next day's bond score

### Files to create in Phase 12

```
src/
  scenes/
    HomePhase.scene.ts
    WalkScene.scene.ts
  components/
    PetRoom.component.tsx
    OutfitSelector.component.tsx
    RoomGrid.component.tsx           -- furniture placement grid
    FurnitureItem.component.tsx      -- draggable/placeable room item
    BedtimeCeremony.component.tsx    -- sequences through each pet tuck-in
  logic/
    outfitCompatibility.logic.ts     -- filters outfits by species and size
    roomComfort.logic.ts             -- calculates room comfort rating from placed furniture
    walkItemDrop.logic.ts            -- determines items found on walk (seeded random)
  config/
    outfits.config.ts                -- all outfits: key, name, species compatibility, sprite key
    furniture.config.ts              -- all furniture: key, name, comfort value, sprite key, grid size
    walkItems.config.ts              -- items findable on walks: key, name, type, rarity
```

### Implementation notes
- `BedtimeCeremony.component.tsx` was scaffolded in Phase 5 to handle multiple pets. It now renders correctly for the full owned pet list.
- `outfitCompatibility.logic.ts` is a pure filter: given a species and a list of outfits, return only compatible ones.
- The walk scene is intentionally simple — a looping background with the player and pets as sprites. Item drops are the main mechanic. Do not over-engineer this scene; it will receive an art pass in Phase 15.
- Room grid uses a simple 2D array in state. Furniture occupies N×M cells. Validation prevents overlapping placement.
- Comfort rating from `roomComfort.logic.ts` feeds a passive desirability bonus to owned pets only (not shelter animals).

### Verification plan

1. Evening phase shows the room with owned pets visible.
2. Selecting a pet shows compatible outfit options. Equipping an outfit changes the pet sprite.
3. Starting a walk launches the walk scene. Moving through it and returning deposits any found items.
4. Placing furniture in the room updates the comfort rating display.
5. Bedtime ceremony sequences through each pet with a tuck-in animation.
6. After all pets are tucked in, fade-to-stars plays and Day N+1 begins.
7. Run `outfitCompatibility.logic.ts` in isolation: dog outfits do not appear for cats.
8. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 13 — Facility upgrades and species unlocks

### Goal
The full upgrade tree is functional. Habitat and vet upgrades unlock new species. The notice board respects species gating. Reputation meters fill with successful adoptions.

### Deliverables
- Facility upgrade screen (separate tab or modal)
- All habitat upgrades purchasable in sequence (kennel expansion, cat room, hutch, aviary, reptile, exotic, aquatic, legendary suite)
- All vet clinic upgrades purchasable (medicine cabinet, exam room, recovery kennels, X-ray, surgery room, rehab yard, staff vet)
- Species unlock requires both habitat AND vet upgrade for that tier
- Reputation meter per species visible in facility screen, fills with each adoption
- When reputation threshold met, next species upgrade becomes available to purchase
- Narrative unlock message displayed when a new species becomes available

### Files to create in Phase 13

```
src/
  components/
    FacilityScreen.component.tsx
    UpgradeCard.component.tsx        -- single upgrade: name, cost, effect, locked/unlocked state
    ReputationMeter.component.tsx    -- per-species progress bar
    UnlockNotification.component.tsx -- narrative message when new species available
  logic/
    speciesUnlock.logic.ts           -- given facilityUpgrades, returns unlocked species list
    reputationGain.logic.ts          -- increments reputation on successful adoption
    upgradeAvailability.logic.ts     -- given upgrades + reputation, returns purchasable upgrades
  config/
    habitatUpgrades.config.ts        -- all habitat upgrades: cost, species unlocked, kennel capacity
    vetUpgradesTree.config.ts        -- full vet upgrade tree (extends Phase 10 config)
    reputationThresholds.config.ts   -- adoptions needed per species to unlock next tier
    unlockMessages.config.ts         -- narrative strings shown on species unlock
```

### Verification plan

1. Facility screen shows all upgrades in their locked/unlocked/purchasable state.
2. Purchasing a cat room habitat does not unlock cats unless the exam room vet upgrade is also purchased.
3. Purchasing both required upgrades for cats adds cat calls to the notice board the next morning.
4. Reputation meters increase after each successful adoption of that species.
5. When the reputation threshold is met, the next upgrade tier becomes highlighted/purchasable.
6. Unlock notification appears with the correct narrative message.
7. Run `speciesUnlock.logic.ts` in isolation: given only basic kennel + triage, output is `[DOG]` only.
8. Run `npx tsc --noEmit`. Zero TypeScript errors.

---

## Phase 14 — Economy balancing

### Goal
All money values, payout tables, and upgrade costs are reviewed and balanced as a complete system. No new features — this phase is tuning and testing the economy loop.

### Deliverables
- Full payout table reviewed: base payouts per rarity, care bonus multiplier, feels rewarding at all tiers
- Upgrade costs form a sensible progression: early upgrades reachable in 2–4 days, late upgrades require sustained play
- Shop prices feel meaningful but not punishing
- A full playthrough test (Day 1–10) is documented with money earned vs money spent at each stage
- Any values that feel wrong are adjusted in config files only — no logic changes

### Files modified in Phase 14
- `payouts.config.ts`
- `vetUpgrades.config.ts`
- `habitatUpgrades.config.ts`
- `shopItems.config.ts`
- `severity.config.ts`

### Verification plan

1. Start a new game. By end of Day 3, the player has enough money to purchase the first aid station without grinding.
2. By end of Day 7, the player can afford either a cat room or the exam room upgrade (not both) — creates a meaningful choice.
3. A legendary animal's payout feels like a genuine windfall — meaningfully larger than a full day of common adoptions.
4. No single upgrade costs more than approximately 10 days of average earnings at that stage.
5. Document the Day 1–10 economy test in a `BALANCE_NOTES.md` file in the project root.

---

## Phase 15 — Audio and polish

### Goal
Background music, sound effects, and visual transitions bring the game to life. Pixel art sprites are finalized or clearly marked as placeholder with an art asset list for a designer.

### Deliverables
- Background music: separate tracks for morning, shelter afternoon, home evening — crossfade on phase transition
- Sound effects: wash scrub, breed reveal fanfare, adoption ceremony, coin collect, button click, pet interaction, bedtime chime
- All phase transitions use the pixel-fade or wipe established in Phase 5
- Loading screen with game title and a pixel animation while assets load
- An `ART_ASSETS.md` file listing every sprite and animation that needs final art, with dimensions and frame counts
- Settings screen: music volume, SFX volume, skip prologue toggle

### Files to create in Phase 15

```
src/
  audio/
    morning.audio.ts
    shelter.audio.ts
    home.audio.ts
    sfx.audio.ts
  components/
    LoadingScreen.component.tsx
    SettingsScreen.component.tsx
    VolumeSlider.component.tsx
  scenes/
    LoadingScene.scene.ts
ART_ASSETS.md
BALANCE_NOTES.md
```

### Verification plan

1. Each day phase has distinct background music that crossfades on transition.
2. All listed sound effects play at the correct moment with no delay.
3. Volume sliders in settings affect music and SFX independently.
4. Loading screen appears on first load and disappears when assets are ready.
5. Prologue skip toggle works and persists across sessions.
6. `ART_ASSETS.md` lists every sprite used in the game with placeholder vs final status noted.
7. Run `npx tsc --noEmit`. Zero TypeScript errors across the entire project.
8. Run the game from Day 1 through Day 5 without any console errors or warnings.


--- Phase 16


# Task: Implement the Opening Sequence for Paws & Purpose

## Context
The game already has a working start screen and core structure. This task adds the opening cinematic sequence that plays **once**, the first time a new player clicks "Start." It should never play again on subsequent visits — use localStorage to track whether the opening has been seen.

This sequence replaces whatever currently happens after the player clicks Start on a first playthrough. On returning visits, clicking Start skips directly to the existing game flow.

---

## What you are building

A visual-novel-style opening sequence using:
- A single background image (the house on the hill `src/assets/images/outside-house.jpeg`)
- A single NPC portrait image (Marigold —  `src/assets/images/marigold.png`)
- Pure CSS effects — no animation libraries, no sprite sheets, no video
- A dialogue panel with typewriter text and tap/click-to-advance
- One name input moment woven naturally into the dialogue
- A clean handoff back into the existing game flow when the sequence ends

---

## File structure

Do not modify existing game files unless strictly necessary to hook in the new sequence. Create the following new files:

```
src/
  scenes/
    OpeningSequence.js        (or .ts if the project uses TypeScript)
  components/
    DialoguePanel.js          single-purpose: renders speaker name, portrait, typewriter text, advance prompt
    NameInputPanel.js         single-purpose: replaces dialogue text with a styled text input
    BlossomLayer.js           single-purpose: renders pure-CSS drifting blossoms
  styles/
    opening.css               all styles for the opening sequence, scoped so they cannot affect existing game styles
  config/
    openingScript.js          the full dialogue script as a plain data array — no logic, no rendering
```

`OpeningSequence.js` is the only file that orchestrates the sequence. It imports from the above and knows nothing about the rest of the game except how to call the existing Start function when the sequence ends.

---

## The script

The dialogue is defined in `openingScript.js` as an ordered array of beat objects. Each beat has a `type` and associated data. No logic lives in this file.

```js
export const openingScript = [

  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'Oh my! You\'re finally here.'
  },
  {
    type: 'pause',
    ms: 600
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'I\'ve been watching that little house sit quiet for months now. We all have, really. The whole village kept wondering who\'d come along and fill it with life again.'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'Well — here you are.'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: 'I\'m Marigold. I live just down the path, past the stone wall with all the moss on it. You can\'t miss it — I have far too many wind chimes.'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'And you are...?'
  },
  {
    type: 'nameInput',
    placeholder: 'introduce yourself...',
    saveAs: 'playerName'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: '{{playerName}}.',
    note: 'She repeats the name warmly. A short beat before the next line.'
  },
  {
    type: 'pause',
    ms: 800
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: 'What a lovely name. It suits someone who\'d choose a house with a cherry blossom tree in the garden, I think.'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: 'Well, {{playerName}} — welcome to {{townName}}.'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'We\'re small. Quiet, mostly. The kind of place where everyone knows when the bakery runs out of the good rolls.'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'I hope you\'ll be happy here. I have a feeling you will be.'
  },
  {
    type: 'pause',
    ms: 500
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'Oh — one more thing.'
  },
  {
    type: 'pause',
    ms: 600
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: 'Keep your eyes open on your walks, would you? This village has a way of... needing things. Little things. You\'ll see what I mean.'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'She waves and disappears around the stone wall.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The house sits quiet again. A blossom lands on the porch rail.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Something rustles in the garden below — but when you look, there\'s nothing there.',
    style: 'narration'
  },
  {
    type: 'end'
  }

];
```

### Token replacement
Any `{{playerName}}` or `{{townName}}` token in a text field must be replaced at render time with the value collected during the sequence (for `playerName`) or from existing game state (for `townName`). If `townName` does not yet exist in game state at this point, use the placeholder string `"Hanami Village"`.

---

## Visual design

### Color palette
Match the Neko Atsume aesthetic of the existing game — soft pinks, creams, and warm whites. These values are starting points; adjust to match the existing game palette if it differs.

```css
--opening-bg-overlay:    rgba(255, 245, 240, 0.15);
--dialogue-bg:           rgba(255, 248, 244, 0.92);
--dialogue-border:       rgba(220, 180, 170, 0.4);
--speaker-name-color:    #b07060;
--dialogue-text-color:   #5a3e38;
--narration-text-color:  #9a8078;
--input-placeholder:     #c4a090;
--input-text:            #5a3e38;
--input-underline:       #d4a090;
--advance-hint-color:    #c4a090;
--blossom-color:         #f2a7c3;
```

### Background image
- Display the house-on-hill image as a full-screen fixed background
- Apply a very slow Ken Burns effect — scale from 1.0 to 1.06 over 30 seconds, alternating. This makes the still image feel alive without requiring any animation assets
- Add a very subtle warm overlay (`--opening-bg-overlay`) on top of the image to soften it slightly and ensure dialogue text is readable

```css
@keyframes kenBurns {
  from { transform: scale(1.0); }
  to   { transform: scale(1.06); }
}

.opening-background {
  animation: kenBurns 30s ease-in-out infinite alternate;
  transform-origin: center center;
}
```

### Drifting blossoms
Generate 8 blossom elements in `BlossomLayer.js`. Each is a small div, pure CSS, no image required. Vary their `left` position, `animation-duration` (between 7s and 14s), and `animation-delay` (between 0s and 8s) so they never feel synchronized.

```css
@keyframes blossomFall {
  0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0; }
  10%  { opacity: 0.85; }
  90%  { opacity: 0.5; }
  100% { transform: translateY(105vh) rotate(200deg); opacity: 0; }
}

.blossom {
  position: fixed;
  width: 7px;
  height: 7px;
  border-radius: 50% 50% 50% 0;
  background: var(--blossom-color);
  pointer-events: none;
  animation: blossomFall linear infinite;
}
```

### Dialogue panel
- Fixed to the bottom third of the screen
- Soft cream background with slight transparency so the house image is still visible behind it
- Rounded top corners only (`border-radius: 16px 16px 0 0`)
- Gentle border along the top and sides
- Padding: `24px 28px`
- No hard drop shadow — a very subtle `box-shadow: 0 -2px 20px rgba(180, 120, 100, 0.08)` is the maximum

### Marigold portrait
- Positioned at the bottom-left, overlapping the top edge of the dialogue panel by approximately 20px
- Fades in with `opacity` transition (0.4s ease) when Marigold begins speaking
- Fades out when a narration beat has `speaker: null`
- If two portrait variants exist (`neutral`, `smiling`), crossfade between them using opacity on two absolutely-positioned images in the same container
- If only one portrait image exists, skip the crossfade — just use the one image throughout

### Speaker name
- Small, 13px, color `--speaker-name-color`
- Sits above the dialogue text with 6px gap
- Hidden (opacity 0) on narration beats

### Dialogue text
- 16px, line-height 1.7, color `--dialogue-text-color`
- Narration beats use `--narration-text-color` and `font-style: italic`
- Typewriter effect: reveal one character at a time at approximately 40ms per character
- Player can tap/click anywhere on the dialogue panel to skip the typewriter and show the full line immediately
- Once the full line is shown, a small advance indicator appears (a soft `▾` or `···` in `--advance-hint-color`, bottom-right of the panel)
- Tapping/clicking again advances to the next beat

### Pause beats
Do not show the advance indicator during a `pause` beat. Wait the specified `ms` then automatically advance. The player cannot skip a pause by clicking.

---

## Name input panel

When a beat with `type: 'nameInput'` is reached:

- Hide the speaker name and typewriter text
- Reveal a single minimal text input in their place
- The input has no visible box or border — just a soft underline (`border-bottom: 1px solid var(--input-underline)`)
- Placeholder text from the beat's `placeholder` field, styled in `--input-placeholder`
- Text color `--input-text`, font size 16px, matching the dialogue text size exactly
- Auto-focus the input when it appears
- A small confirm prompt appears below the input: `"press enter or tap ✓"` in `--advance-hint-color` at 12px
- On confirm (Enter key or a small confirm button): validate that the input is not empty and not more than 20 characters. If invalid, gently shake the input (CSS keyframe, no library). If valid, save the value to game state under the key specified in `saveAs`, then advance to the next beat.
- Do not show Marigold's portrait shift until the beat after the name is confirmed — the crossfade to smiling should happen as she repeats the name back.

---

## Sequence flow logic

`OpeningSequence.js` maintains a current beat index. On each advance (click, Enter, or auto-timer for pauses) it increments the index and renders the next beat. When `type: 'end'` is reached:

1. Mark the opening as seen in localStorage: `localStorage.setItem('pawsOpeningSeen', 'true')`
2. Save `playerName` to game state using whatever state management the existing game uses
3. Fade the entire opening sequence out (opacity 0, 0.8s transition)
4. Call the existing game's start function / load the next scene

On any page load, before showing the start screen, check:
```js
if (localStorage.getItem('pawsOpeningSeen') === 'true') {
  // skip opening, go directly to existing game flow
}
```

---

## Accessibility

- All dialogue text must be readable at the rendered size — do not go below 14px
- The name input must be focusable via keyboard and usable without a mouse
- The blossom layer must have `pointer-events: none` and `aria-hidden="true"` so it does not interfere with interaction or screen readers
- The dialogue panel must have `role="dialog"` and `aria-live="polite"` so screen readers announce new lines as they appear

---

## Constraints and things to avoid

- Do not use any animation library (no GSAP, no Anime.js, no Framer Motion). Pure CSS transitions and keyframes only.
- Do not modify the existing game's CSS files. All opening styles live in `opening.css` and are prefixed or scoped to `.opening-sequence` to prevent bleed.
- Do not hardcode the player name or town name anywhere. Always read from game state or the values collected during this sequence.
- Do not autoplay any audio. If the game has background music, do not start it during the opening sequence — let the existing game handle music on its own schedule.
- The sequence must work on both desktop (click) and mobile (tap) without separate code paths.
- The Ken Burns animation must respect `prefers-reduced-motion`. If the user has reduced motion enabled, disable the Ken Burns scale and blossom fall animations entirely. The sequence must still be fully usable.

```css
@media (prefers-reduced-motion: reduce) {
  .opening-background { animation: none; }
  .blossom { animation: none; display: none; }
}
```

---

## Verification checklist

Before considering this task complete, confirm the following:

1. On a fresh browser session (localStorage cleared), clicking Start plays the opening sequence
2. On a returning session (localStorage has `pawsOpeningSeen: true`), clicking Start skips directly to the game
3. Every dialogue line appears with the typewriter effect; clicking mid-type shows the full line immediately
4. Pause beats cannot be skipped by clicking
5. The name input appears in place of the dialogue text, is auto-focused, and rejects empty or overlong input with a visible shake
6. `{{playerName}}` is correctly replaced in all subsequent dialogue lines after the name is entered
7. `{{townName}}` is correctly replaced, falling back to `"Hanami Village"` if not yet set
8. Marigold's portrait fades in on her first line and fades out on narration beats
9. The Ken Burns effect is visible on the background image — slow, subtle, never jarring
10. Blossoms drift at varied speeds and never appear synchronized
11. The entire sequence fades out cleanly and hands off to the existing game
12. With `prefers-reduced-motion` enabled, Ken Burns and blossoms are disabled and the sequence still completes correctly
13. The sequence works on a mobile-sized viewport with no layout breakage
14. No console errors at any point during the sequence


---

## Appendix: key rules the AI must never break

1. **Never put game logic in a component.** Components render and dispatch. Logic files calculate.
2. **Never put constants in a logic file.** Numbers and strings that configure behavior belong in `*.constants.ts` or `*.config.ts`.
3. **Never access `GameState` directly in a scene.** Scenes call store actions. Stores update state.
4. **Never hardcode pixel dimensions.** Always import from `resolution.config.ts`.
5. **Never duplicate a type.** If two files need the same shape, one imports from the other — usually from `*.types.ts`.
6. **Never skip the verification plan.** Each phase must pass its verification before the next begins.
7. **Never start Phase N+1 if `npx tsc --noEmit` has errors.** TypeScript must be clean at the end of every phase.
