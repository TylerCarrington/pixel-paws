# Paws & Purpose — Game Bible

> This document is the single source of truth for the game's identity, style, story, and design principles. Reference it before creating any asset, writing any dialogue, or implementing any feature. If something feels off, check it against this document first.

---

## Overview

**Title:** Paws & Purpose
**Genre:** Cozy life simulation / animal shelter management
**Platform:** Browser (HTML, CSS, JavaScript)
**Tone:** Warm, whimsical, healing — never stressful, never punishing
**Inspiration:** Neko Atsume, Animal Crossing, Stardew Valley, Studio Ghibli

Paws & Purpose is a cozy game about building an animal shelter in a small cherry blossom village. The player discovers stray and hidden animals each morning, nurses them back to health, finds them loving homes, and keeps a few for themselves. The game is built around compassion, patience, and the quiet joy of caring for things that cannot ask for help.

---

## The World

### Setting
A small, peaceful Japanese-inspired village nestled in green hills. The kind of place where everyone waves, the bakery runs out of the good rolls by 9am, and the riverside path is always worth a slow walk. Named by the player at the start of the game — the default name is **Hanami Village**.

The village exists in a soft, slightly magical version of the real world. Animals are more abundant and varied than you'd expect. The community is warm and immediately accepting. Nothing bad happens here — only things that need tending.

### Time
The game runs on a three-phase daily loop:
- **Morning** — explore the village, respond to calls, discover animals in need
- **Afternoon** — care for shelter animals, manage the clinic, work toward adoptions
- **Evening / Weekend** — spend time with your own pets at home, decorate, go on walks, tuck everyone in

Days are not timed. The player moves through phases at their own pace.

### Key Locations
| Location | Description | Introduced |
|---|---|---|
| The house on the hill | Player's home. A small white cottage with a cherry blossom tree, a stone path, a dog house, a bench, and a mailbox. Morning light is warm cream. Evening light is amber and gold. | Day 1 |
| The riverside path | A gentle walking trail along a slow stream. Stone lanterns, an old wooden bridge, cherry blossom trees. Where the first animal is found. Becomes the primary morning discovery zone. | Day 1 |
| The shelter | An old building on the main street repurposed by the player. Grows from a bare room with 3 kennels into a full shelter and veterinary clinic over the course of the game. | Day 2 |
| Marigold's cottage | Down the path past the mossy stone wall. Too many wind chimes. Not visitable but referenced in dialogue. | Opening |
| The shrine path | A stone-stepped trail leading to a small neighborhood shrine. Unlocked as a second morning discovery zone mid-game. | Mid-game |

---

## Visual Style

### The Core Reference
The primary visual reference is the **daytime house image** (`outside-house.jpeg`). Every asset decision should be measured against it. If an asset looks like it belongs in the same world as that image, it's right. If it doesn't, revise it.

Key qualities of that image to preserve in all assets:
- Soft, warm cream sky — not white, not blue. The sky has warmth.
- Cherry blossom pinks are the dominant accent color — bright but never garish
- Greens are mossy and rich but softened, never harsh
- The pixel grid is visible and deliberate but never chunky — clean 16-bit clarity
- Everything feels slightly rounded and friendly, even hard edges like the roof tiles
- Lighting is diffused and even — no harsh shadows, no high contrast drama

### Art Style Statement
A high-quality pixel art illustration in a cozy, whimsical aesthetic. Soft pastel colors with warm, diffused lighting. A refined 16-bit aesthetic with clean lines and smooth color gradients, reminiscent of a peaceful Japanese countryside or a nostalgic RPG. Atmospheric elements including floating flower petals, gentle sunbeams, and a sense of *iyashikei* (healing) tranquility. A harmonious palette of blush pinks, soft ambers, and mossy greens. Serene and dreamlike with detailed textures and a shallow depth-of-field quality to background elements.

### Color Palette
These are the canonical game colors. All assets and UI elements must draw from this palette.

| Name | Hex | Used for |
|---|---|---|
| Blossom pink | `#f2a7c3` | Cherry blossoms, accents, UI highlights, CSS blossom particles |
| Soft rose | `#e8849a` | Darker blossom tones, portrait outlines, active states |
| Warm cream | `#fdf3e7` | Sky, dialogue panels, UI backgrounds |
| Amber glow | `#f5c87a` | Sunset light, window warmth, coin/money UI |
| Mossy green | `#7ab87a` | Grass, hills, foliage mid-tones |
| Deep moss | `#4a8a4a` | Foliage shadows, ground detail |
| Stone grey | `#b0a898` | Paths, stone walls, bridge, rooftile |
| Warm brown | `#8b5e3c` | Wood, tree trunks, fences, furniture |
| Soft lilac | `#c8a8d8` | Evening sky, shadows, mystery/magic accents |
| Night plum | `#1a1020` | Night transition background |
| Dialogue text | `#5a3e38` | All body text in dialogue panels |
| Speaker rose | `#b07060` | Speaker name labels, day card text |
| Muted sage | `#9ab8a0` | Secondary UI text, subtle labels |

### What to Avoid
- Pure white or pure black anywhere — use warm cream and warm dark brown instead
- Cold blues or greys — all neutrals should lean warm
- Hard drop shadows — use very soft, warm-tinted shadows only
- High contrast edges — outlines should be in warm rose-brown, not black
- Flat UI colors that don't belong to the palette — every interface element should feel like it came from the same cozy world

### UI Style
The game UI uses the same palette and pixel sensibility as the scene backgrounds. Dialogue panels are soft cream with slight transparency, rounded tops, warm border. No sharp corners, no stark whites, no digital-feeling elements. Everything should feel like it was designed for a sleepy village morning board.

---

## Characters

### The Player Character
Customised at the start of the game. Name chosen by the player. Gender expression is freely chosen — two base silhouettes, fully mix-and-match accessories. The player character is never shown in cutscenes — they are implied through narration ("{{playerName}} stepped inside..."). The player character's presence is felt, not seen.

### Marigold
The player's first neighbor and the village's warm heart. Lives down the path past the mossy stone wall.

**Age:** 60s
**Vibe:** Warm grandmotherly. The kind of person who always has tea ready and knows everyone's name.
**Appearance:** Silver-white hair pinned up loosely, a few wisps free. Cream and blush pink kimono-style cardigan. Small floral pattern. Always carrying something — a basket of flowers, a teacup, a watering can.
**Portrait style:** Cute Japanese flat illustration, Neko Atsume aesthetic, warm rose-brown outlines (not black), soft pink and cream palette, extremely friendly and shareable.
**Portrait states needed:** Neutral (attentive, kind) and Smiling (warm, delighted)
**Role in game:** Introduces the player to the village in the opening sequence. Reappears periodically on the morning board with tips and warm observations as the shelter grows. The person who calls on Day 2 about the second animal, inspiring the player to open the shelter.
**Voice / dialogue style:** Gentle, slightly poetic, never hurried. Uses short sentences with natural pauses. Occasionally says more than she means to. Never explains — she suggests.

### Future NPCs (to be developed)
- The bakery owner who donates day-old bread for the shelter animals
- A quiet child who visits the shelter every Saturday
- A wildlife ranger who begins sending rare animal cases once the shelter has a full vet clinic
- Adopting families — procedurally named, appear briefly in the adoption ceremony

---

## Story

### The Full Arc
The game has no ending. It is a living world. But it has a beginning, a middle, and an ongoing present.

**Beginning (Days 1–3):** The player arrives in Hanami Village, meets Marigold, finds a muddy puppy on the riverside path, and names it. On Day 2 a call comes in about a second animal in need — this moment inspires the player to convert the old building on the main street into a shelter. The shelter opens with almost nothing: three kennels and a wash station. Pets R Us, an online pet supply store, arrives on Day 3.

**Early game (Days 4–14):** The shelter grows slowly. The player learns the morning board, the morning discovery routes, the care actions, and the adoption system. The first vet upgrade is saved toward and purchased. The first non-dog species (cats) is unlocked. The player's home begins to fill with owned pets they've chosen to keep.

**Mid game (Days 15–40):** The shelter becomes a real facility. Multiple species, a proper vet clinic wing, a reputation in the community. Rare and exotic animals begin appearing. The morning routes expand to include the shrine path. Marigold and other NPCs appear more frequently.

**Late game (Days 40+):** The full facility is built. Legendary animals are possible. The player has a rich home life with their owned pets and a thriving shelter. The game settles into a comfortable ongoing rhythm.

### The Emotional Journey
The game is about the gap between what you can do and what you wish you could do — and how that gap closes slowly through patience and care. Early game the player can only wash animals. They can't treat injuries. They can't house rare species. They watch animals they'd love to keep go to other families because the shelter isn't ready. Over time, all of that changes. The game rewards playing through limitation rather than around it.

The player should never feel punished. They should occasionally feel wistful, and frequently feel warm.

---

## Core Gameplay Tenets

These are non-negotiable. Every feature decision must hold up against them.

### 1. No animal ever suffers due to player choice
Vet care is always available and always free. Animals the shelter cannot yet house simply do not appear — the community only calls about animals the shelter is ready to help. No animal waits in distress because the player is short on money or space.

### 2. Every limitation is about readiness, not gatekeeping
The shelter can only house dogs at the start because it is a dog shelter — the player hasn't yet built the capability or reputation for anything else. When a new species becomes available it feels like growth, not an unlock. The world reflects capability.

### 3. Money creates choices, not barriers
The economy funds decisions about what to invest in next — faster vet recovery, more space, new species, home comforts. It never creates a situation where an animal cannot be cared for. The tension is always between competing good options, never between a good option and a bad one.

### 4. The mystery is the joy
Animals never reveal themselves until cared for. A muddy shape, a box with sounds inside, something hiding in a bush — identity is always discovered through care. This is the game's central metaphor and must be preserved in every discovery design.

### 5. Letting go is part of the loop
Most shelter animals will be adopted out. This is correct and good. The player invests care in animals knowing they will probably leave, and that is the point. The adoption ceremony should feel bittersweet and right. The animals the player keeps are more meaningful because of the ones they let go.

### 6. The home is separate and sacred
The home phase is purely cozy. No economy pressure, no adoption probability, no urgency. It is where the player connects with the animals they've chosen to keep. The bedtime ceremony ends every day with warmth regardless of how the shelter day went.

---

## Animal Systems

### Rarity Tiers
| Tier | Examples | Adoption cap | Payout range |
|---|---|---|---|
| Common | Mixed breed dog, tabby cat, pigeon | 20% / day | $25–50 |
| Uncommon | Persian cat, corgi, parrot | 15% / day | $75–120 |
| Rare | Fennec fox, axolotl, chinchilla | 10% / day | $175–250 |
| Exotic | Capybara, sugar glider, hedgehog | 5% / day | $350–500 |
| Legendary | Albino animals, bonded pairs | 2% / day | $750–1,000 |

### Species Unlock Order
Dogs → Cats → Small animals → Birds → Reptiles → Exotic small → Aquatic → Exotic large

Each unlock requires both a habitat upgrade AND a vet capability upgrade. Neither alone is sufficient.

### Discovery Methods
Animals are always concealed until cared for. Current discovery types:
- **Too dirty to identify** — wash to reveal
- **Babies in a box** — evaluate at shelter
- **Hiding in bushes** — tempt out with food
- **Heard but not seen** — follow audio cues
- **Tangled in netting** — cut free
- **Egg or cocoon** — multi-day incubation
- **Nocturnal sleeper** — silhouette only until lit
- **Camouflaged** — mud or paint covered
- **Fallen in water** — net out and dry off
- **Overprotective parent blocking** — distract adult to reach baby

### Desirability
Each shelter animal has a desirability score (0–100) affecting daily adoption probability up to the rarity cap. Care actions raise desirability. Mood states (happy, calm, anxious, shy) affect which actions are most effective. The vet health certificate gives a permanent badge and desirability boost on discharge.

---

## The Shelter

### Facility Progression
Starts as three dog kennels and a wash station. Grows through purchased upgrades into a full shelter and veterinary clinic. The vet wing is always in-house — animals never leave the facility for treatment.

### The Vet Wing
The player is the vet in the early game, doing their best with limited supplies. As upgrades are purchased the clinic grows from a triage corner to a full operating suite. A staff vet is the final hire. Severity tiers (minor, moderate, serious, critical) determine recovery days. All upgrades reduce recovery time or expand capacity — never gatekeep care.

### The Morning Board
The morning notice board lists 2–4 incoming calls per day. Calls are filtered by current facility capability — species the shelter cannot house never appear. Day 1 and Day 2 calls are scripted (tutorial). Day 3 onwards are procedurally generated from the eligible pool. Each call describes the situation without revealing the animal's identity — the mystery is preserved until the player responds.

### The Shop — Pets R Us
An online pet supply store that arrives via a notice on Day 3. Inventory grows as facility upgrades are purchased. Two tabs: shelter supplies and home furnishings. Purchases are delivered immediately.

---

## Audio Direction (to be implemented)

### Music
Three distinct tracks, one per day phase. All should feel like they belong to the same world.
- **Morning theme:** Gentle, curious, slightly adventurous. A music box quality. Cherry blossom energy.
- **Shelter afternoon theme:** Warm, busy, purposeful. Slightly more structured rhythm. Still cozy.
- **Evening home theme:** The softest of the three. Slow, intimate, like the end of a good day.

All tracks should crossfade on phase transition. No abrupt cuts.

### Sound Effects
- Wash scrub — soft water sound, satisfying
- Breed reveal fanfare — a small, delighted chime sequence
- Adoption ceremony — gentle bells, a warm resolved chord
- Coin collect — soft pleasant ping
- Button clicks — very quiet, fabric-soft
- Pet interaction (tail wag, hearts) — tiny pop sounds
- Bedtime chime — a single soft note that fades slowly

---

## Writing Style Guide

All in-game text — dialogue, narration, morning board calls, UI labels — follows these rules:

**Narration** is quiet and observational. It notices small things. It never over-explains. It trusts the player.
> *The cherry blossom tree outside the window was already busy dropping petals onto the porch.*

**Dialogue** (Marigold and other NPCs) uses natural speech rhythms with deliberate pauses marked by em dashes. Short sentences. Occasional gentle humor. Never exposition.
> *"That's what we've always called it, anyway. Though I suppose it's your home now too."*

**Morning board calls** are written as brief community reports — factual but with personality. The animal's identity is always hidden.
> *"Stray spotted near the old bridge. Matted fur, uncertain breed. Skittish but not aggressive."*

**UI labels** are minimal and warm. Never clinical. "End Day" not "Submit." "Send to Vet" not "Initiate Treatment." "Tuck in" not "Sleep."

**Token replacement:** `{{playerName}}` and `{{townName}}` appear throughout all text. Always resolve these before rendering. Never show a raw token to the player.

---

## Asset Checklist Reference

When creating any new asset, verify it against these questions:

1. Does it use only colors from the canonical palette?
2. Does it use warm rose-brown outlines rather than black?
3. Does it feel like it belongs in the same world as `outside-house.jpeg`?
4. If it contains a character, does the character have warm, friendly, readable features at small sizes?
5. If it is a background, does it have a soft, diffused quality with no harsh shadows?
6. If it is a sprite, is it legible at 16×16 pixels?
7. Does it feel *iyashikei* — healing, gentle, safe?

If the answer to any of these is no, revise before using.

---

## Document History

| Version | Notes |
|---|---|
| 1.0 | Initial game bible. Created during early planning phase. |