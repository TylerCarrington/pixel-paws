# Cozy Animal Rescue Encounters — Single Sprite Implementation Plan

# Vision

Build emotionally warm rescue encounters using:
- a single static 64x64 animal sprite
- CSS transform animation
- particles
- lighting
- camera motion
- easing
- sound design
- environmental storytelling

Do not rely on:
- sprite sheets
- articulated rigs
- body part layers
- frame-by-frame animation

The emotional experience should come from:
- pacing
- hesitation
- trust
- movement timing
- subtle visual feedback

The player should feel:
- calm
- gentle
- patient
- emotionally connected

Never:
- punished
- rushed
- stressed aggressively

---

# Core Technical Direction

## Animation Philosophy

All emotional states should be created through:
- translate
- rotate
- scale
- squash/stretch
- opacity
- filters
- particles
- lighting changes

The animal sprite acts like a tiny puppet.

Small movement matters more than complex animation.

---

# Global Animation States

These reusable animation states should support all encounters.

## Idle

Soft breathing loop.

Used when:
- calm
- waiting
- neutral

Animation behavior:
- slight vertical bob
- tiny scaleY pulse
- slow easing

---

## Nervous

Tiny horizontal shake.

Used when:
- scared
- injured
- trapped
- uncertain

Animation behavior:
- 1px horizontal tremble
- slight darkening
- compressed posture

---

## Curious

Small leaning movement.

Used when:
- approaching
- sniffing
- investigating

Animation behavior:
- slight forward lean
- tiny rotation
- gentle anticipation

---

## Retreating

Quick backward movement.

Used when:
- trust breaks
- player moves too fast
- danger increases

Animation behavior:
- slide backward
- slight scale reduction
- dust particles
- lowered brightness

---

## Happy

Gentle bounce.

Used when:
- rescued
- warmed up
- freed
- comforted

Animation behavior:
- vertical bounce
- slight brightness increase
- comfort particles

---

## Shivering

Fast tiny shake.

Used when:
- cold
- wet
- scared

Animation behavior:
- rapid subtle shake
- low saturation
- dimmed lighting

---

## Trusting

Open posture state.

Used during:
- successful trust-building
- calming moments

Animation behavior:
- slightly taller posture
- brighter lighting
- softer movement

---

# Global Systems

These systems should exist before implementing encounters.

---

# Emotional State System

Every animal should support:
- calm
- nervous
- scared
- curious
- trusting
- happy
- cold
- injured

The renderer should apply:
- CSS classes
- transitions
- particles
- audio layers

based on emotional state.

---

# Interaction Framework

Create reusable systems for:
- tap interactions
- hold interactions
- drag interactions
- timing windows
- proximity tracking
- visibility tracking
- directional input
- comfort meters

All interactions should:
- be forgiving
- use soft failure
- prioritize emotional pacing

---

# Soft Failure Philosophy

Failure should feel like:
- "they got nervous"
not:
- "you lost"

Use:
- retreating
- hesitation
- partial progress decay
- calming pauses

Avoid:
- harsh sounds
- flashing red
- loud failure states
- aggressive timers

---

# Shared Visual Systems

## Lighting

Use warm soft lighting:
- pastel glows
- gentle bloom
- warm highlights

Avoid harsh contrast.

---

## Particle Systems

Reusable particles:
- drifting petals
- dust puffs
- falling leaves
- water droplets
- warm sparkles
- floating dust

Environmental motion helps compensate for minimal sprite animation.

---

## Camera System

Use:
- gentle float
- soft zoom
- slow pan

Avoid:
- screen shake
- sudden cuts
- aggressive movement

Camera emotion matters heavily.

---

# Breed Reveal Philosophy

The animal identity should remain partially hidden until care is complete.

Use:
- darkness
- mud overlays
- desaturation
- lighting concealment

Reveal occurs through:
- warmth
- trust
- rescue
- comfort

This preserves the core emotional metaphor:
"care reveals identity."

---

# Shared Asset Requirements

## Animal Assets

Only required initially:
- one 64x64 base animal sprite

Optional later:
- alternate silhouettes
- alternate color palettes

---

## Environment Assets

Need:
- alley
- fence
- construction site
- market
- woodpile
- village path
- porch
- riverside
- crossroads
- park

These environments should carry much of the visual storytelling.

# PHASE 10 — Reassure the Injured

## Emotional Goal

Emotional care before physical care.

---

## Morning Board Call

"Dog limping near the park. Looks like they hurt their paw. Too scared to let anyone check."

---

## Core Gameplay

The player calms the animal before treating the injury.

Trust must be earned first.

---

## Visual Implementation

### Injured State
Use:
- nervous shaking
- lowered posture
- dim lighting

### Calming Actions
Gradually transition into:
- idle breathing
- trusting posture
- brighter lighting

### Thorn Removal
Use:
- careful hold interaction
- hesitation animation
- tension easing

---

## Systems Required

### Sequential Trust States
Require calming actions before treatment.

### Precision Hold Interaction
Track:
- speed
- steadiness
- release timing

---

## Completion Sequence

The thorn is removed.

The animal:
- relaxes
- bounces gently
- follows the player willingly

---

# Long-Term Expansion Support

Design all systems to support:
- additional species
- weather conditions
- nighttime rescues
- seasonal lighting
- rare encounters
- personality traits
- emotional difficulty scaling

All without requiring major new sprite production.

---

# Final Emotional Rule

Every interaction should reinforce:

Care creates connection.

The player should feel:
- needed
- trusted
- gentle
- hopeful

The game should never feel:
- punishing
- loud
- frantic
- exploitative

The world should feel soft enough that even tiny movements carry emotional meaning.