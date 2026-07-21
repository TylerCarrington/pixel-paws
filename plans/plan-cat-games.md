# 5 Cat-Specific Discovery Mini-Games

## Overview

These mini-games are designed specifically for cat discoveries, leveraging unique feline behaviors and characteristics. Each game has a distinct mechanic and requires a new background asset.

---

## 1. **Laser Pointer Chase**

**Morning Board Call:**
> *"A cat has been spotted in the community center, but they're too playful and energetic to catch. Maybe we can tire them out first?"*

**Location:** Community center indoor gymnasium

**Mechanic:**
The cat is in the middle of a large open room, alert and ready to pounce. You have a laser pointer. Move the red dot around the room by dragging or tapping positions. The cat chases the dot wherever you place it. Your goal is to guide the cat through a specific path that spells out a simple shape (like a circle or figure-8) to tire them out. 

If you move the laser too erratically, the cat gets overstimulated and retreats to hide (you have to start over). If you move it too slowly, the cat loses interest. Find the right pace - smooth, deliberate movements in a pattern. Once the pattern is complete (tracking shows their path matches the target shape), the cat is pleasantly tired and sits down, allowing you to approach and collar them.

**Completion indicator:** Path tracking overlay shows the cat's movement trail. When it matches 80%+ of the target pattern, success.

**Background needed:** `src/assets/images/backgrounds/community-center-gym.png`

**Prompt:**
> Pixel art interior scene, community center gymnasium with wooden floor, high ceiling with exposed beams, large windows on one wall letting in warm natural light, a few gymnastics mats stacked in the corner in soft pinks and creams, a basketball hoop visible on the back wall, cherry blossom branches visible through windows, open floor space in center perfect for a cat to run around. The room should feel spacious and safe, warm afternoon light. Color palette strictly soft pinks, warm creams, honey browns for wood floor and beams, mossy greens, warm ambers. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic, iyashikei healing energy. No characters. No text. File path: src/assets/images/backgrounds/community-center-gym.png

---

## 2. **Catnip Trail**

**Morning Board Call:**
> *"A very shy cat has been living in the bookshop basement. The owner tried to approach but they hide every time. Maybe catnip can help?"*

**Location:** Bookshop basement with shelves and boxes

**Mechanic:**
Top-down view of a basement with bookshelves, storage boxes, and various hiding spots. The cat is hidden somewhere (you see occasional movement - a tail tip, an ear flick). You have a bag of catnip. Place small piles of catnip to create a trail from the cat's hiding spot to your position near the stairs.

Tap to place catnip piles (you have 8 piles total). The cat will cautiously emerge and follow the trail, sniffing each pile. If the piles are too far apart, the cat won't make the connection and returns to hiding. If they're too close together, you waste your limited supply. Space them correctly (visual guide shows optimal spacing zone when placing) and the cat follows the complete trail to you, where you can gently scoop them up.

**Strategy element:** You must identify where the cat is hiding first by watching for movement indicators before placing your trail.

**Background needed:** `src/assets/images/backgrounds/bookshop-basement.png`

**Prompt:**
> Pixel art top-down interior scene, cozy bookshop basement with wooden shelves full of books lining the walls, stacked cardboard boxes in corners creating hiding spots, a few dusty vintage items, a small window at ground level letting in a shaft of warm light with dust particles visible, exposed brick walls in warm terracotta and cream, wooden floorboards in honey brown, the layout should show clear pathways between obstacles. The space feels cluttered but charming, warm and dusty. Color palette strictly soft pinks, warm creams, honey browns for wood, terracotta for brick, mossy greens. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/bookshop-basement.png

---

## 3. **Reflection Rescue**

**Morning Board Call:**
> *"A cat is mesmerized by their own reflection in the dance studio mirrors and won't leave. We need to break the trance gently."*

**Location:** Dance studio with wall of mirrors

**Mechanic:**
Side view of a dance studio. The cat sits in front of a large mirror, staring at their reflection, completely transfixed. You need to break their focus without startling them.

You have three gentle distraction tools to use in sequence: (1) Toss a soft toy to the side (tap where to throw - must be visible in their peripheral vision but not directly in front), (2) Once they glance at the toy, gently shake a treat bag (timing mini-game - shake when their head starts to turn), (3) When they look toward the treat sound, slowly approach from the side (drag your position closer in small increments - too fast and they bolt back to the mirror).

Each step must be timed correctly based on the cat's body language cues (ear position, tail movement, head angle). The game teaches reading cat signals. Success means approaching close enough to pick them up while they're distracted from the mirror.

**Visual cues:** The cat's sprite shows subtle animations - ears swivel toward sounds, tail position changes based on their emotional state, whiskers twitch when deciding whether to investigate.

**Background needed:** `src/assets/images/backgrounds/dance-studio.png`

**Prompt:**
> Pixel art interior scene, dance studio with wooden floor in honey brown, one full wall covered in mirrors reflecting the room, a ballet barre along the mirror wall in warm wood, large windows on the opposite wall with sheer cream curtains and cherry blossoms visible outside, warm afternoon light streaming in, a few soft mats in corners in soft pink and cream. The mirror should be clearly distinguishable (slight blue tint or reflective quality suggested), open floor space in center. Color palette strictly soft pinks, warm creams, honey browns for wood, sky blues for mirror suggestion, mossy greens. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/dance-studio.png

---

## 4. **Cardboard Kingdom**

**Morning Board Call:**
> *"A cat built a fortress out of cardboard boxes in the recycling area behind the cafe. They're defending their kingdom fiercely!"*

**Location:** Behind a cafe, recycling area with many cardboard boxes

**Mechanic:**
The cat has stacked and arranged multiple cardboard boxes into a "fortress" and sits on top of the highest box, looking down at you. You cannot approach directly - they'll swat and hiss if you try to climb.

Instead, you must carefully remove boxes from the bottom of the structure to lower their perch, one box at a time. Each box you remove shifts the structure slightly. Remove boxes too quickly or from the wrong positions, and the whole structure wobbles - the cat gets scared and jumps down to hide behind a different stack (reset).

Remove boxes strategically (puzzle element - some boxes are supporting others, some are decorative). A stability indicator shows how stable the structure is. Reduce the height gradually until the cat's perch is low enough to reach safely. Once at ground level, offer a treat to coax them out of their box kingdom.

**Physics element:** Simple structural stability - remove corner supports and boxes tumble. Remove non-essential boxes and structure stays stable while getting shorter.

**Background needed:** `src/assets/images/backgrounds/cafe-recycling-area.png`

**Prompt:**
> Pixel art exterior scene, small area behind a cozy cafe designated for recycling, multiple cardboard boxes of various sizes stacked and scattered, some boxes are flattened, some are intact and stacked to create a structure, wooden fence in background in honey brown, a few scattered cherry blossom petals on the ground, cafe's back door visible in corner showing warm light from inside, stone or concrete ground, morning light creating soft shadows. The scene should feel organized-messy, like a play area. Color palette strictly soft pinks for petals, warm creams, honey browns for boxes and fence, stone greys, mossy greens for weeds peeking through. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/cafe-recycling-area.png

---

## 5. **Keyboard Concert**

**Morning Board Call:**
> *"A cat got into the music classroom and is 'playing' the piano by walking on the keys. They seem to be enjoying themselves too much to stop!"*

**Location:** Music classroom with piano

**Mechanic:**
Side view of a piano. A cat is walking back and forth across the keys, producing random notes (you hear pleasant piano notes as they move - not jarring, kept musical). They're having fun and won't stop on their own.

Your goal is to play a simple melody using the piano keys yourself (while the cat is still on the piano) that catches their attention and calms them down. A musical staff shows the target melody (5-6 notes, something simple like "Twinkle Twinkle" first line).

Tap piano keys to play notes. The cat continues their own "performance" which creates background noise. You must play the correct melody despite the cat's interference. Each correct note in sequence causes the cat to pause and listen. Complete the melody correctly and the cat sits down on the piano bench, charmed and calm, ready to be picked up.

**Audio element:** Pleasant piano notes (both from the cat's walking and your playing). The melody guides you even if you can't read music - visual indicators show which keys to press in sequence.

**Accessibility:** Can be played without sound - visual indicator shows whether each note is correct (green) or incorrect (red) immediately.

**Background needed:** `src/assets/images/backgrounds/music-classroom.png`

**Prompt:**
> Pixel art interior scene, cozy music classroom with wooden floor, a grand piano or upright piano against one wall in rich honey brown and black finish, a piano bench in front, sheet music visible on the music stand, large windows with sheer curtains showing cherry blossoms outside, warm natural light, a few chairs and music stands in the background, soundproofing panels on walls in soft cream, a small bookshelf with music books. The piano should be prominent and clearly show the keyboard. Color palette strictly soft pinks, warm creams, honey browns for wood, black piano body (warm black, not harsh), mossy greens. Style is refined 16-bit pixel art, clean lines, warm rose-brown outlines not black, Neko Atsume cozy aesthetic. No characters. No text. File path: src/assets/images/backgrounds/music-classroom.png

---

## Game Mechanics Summary

| Game | Primary Mechanic | Skill Tested | Difficulty |
|---|---|---|---|
| Laser Pointer Chase | Pattern tracing, speed control | Precision, patience | Medium |
| Catnip Trail | Strategic placement, resource management | Planning, observation | Easy-Medium |
| Reflection Rescue | Timing, reading body language | Observation, timing | Medium |
| Cardboard Kingdom | Physics puzzle, structural stability | Logic, strategy | Medium-Hard |
| Keyboard Concert | Melody matching, audio/visual pattern | Rhythm, memory | Medium |

---

## Implementation Notes

### Shared Cat Behavior Elements

All five games should incorporate these subtle cat behaviors to increase immersion:

**Idle animations while waiting:**
- Slow blink (contentment)
- Ear swivel (listening)
- Tail swish (excitement or annoyance)
- Whisker forward (curiosity)
- Crouch wiggle (preparing to pounce)

**Success animation:**
- Cat does a slow blink at the player
- Small purr particle effect (musical notes or hearts)
- Tail curl up (happy)

**Failure animation:**
- Ears flatten briefly
- Tail puffs slightly
- Quick dart to hiding spot
- Peek out after a moment (they're not really scared, just playing)

### Difficulty Scaling

All games should have a "patient mode" option where:
- Timers are more forgiving
- Visual guides are more prominent
- Mistakes don't reset progress completely (just set back a step)

This makes the games accessible while keeping the core mechanics engaging.

---

## Asset Summary

**5 new backgrounds needed:**
1. `community-center-gym.png` - Spacious gym with wooden floor
2. `bookshop-basement.png` - Top-down cluttered basement
3. `dance-studio.png` - Studio with mirror wall
4. `cafe-recycling-area.png` - Outdoor area with cardboard boxes
5. `music-classroom.png` - Classroom with piano

**Props needed (most already in asset list):**
- Laser pointer
- Catnip toy
- Soft toy
- Treat
- Sheet music

**All backgrounds maintain:**
- Warm rose-brown outlines (not black)
- Soft pink, cream, amber, green palette
- Neko Atsume cozy aesthetic
- Iyashikei healing energy
- Clear play space for cat sprite

---

## Why These Games Work for Cats

1. **Laser Pointer Chase** - Classic cat behavior, instantly recognizable
2. **Catnip Trail** - Uses cats' love of catnip, requires thinking about cat psychology
3. **Reflection Rescue** - Cats do get fascinated by mirrors, teaches reading cat body language
4. **Cardboard Kingdom** - Cats LOVE boxes, playful and physical puzzle
5. **Keyboard Concert** - Whimsical, music-based (calm energy), unexpected cat behavior

Each game celebrates what makes cats unique while teaching patience and observation - perfect for the Pixel Paws philosophy.