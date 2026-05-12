# Wash Interaction Rework Plan

## Overview
We will replace the existing wash interaction scene with a "scratch-off" style scrubbing mechanic using `Phaser.GameObjects.RenderTexture`. The user will scrub away a muddy shape to reveal the pet sprite underneath. The starter pet will be guaranteed to be a Husky.

## 1. Updated breed assignment
- Modify the starter breed logic to ensure the first pet is a Husky.
- Update the breed configuration to use the new `husky.png` sprite located at `src/assets/images/animals/dogs/husky.png`.

## 2. Asset Preloading
- Load the base animal sprite.
- Load the muddy mask image (`src/assets/images/muddy-shape.png`).
- Preload or generate a simple bubble particle texture for the scrubbing effect.

## 3. Scene Rework (`WashInteraction.scene.ts`)
- **Visuals**:
  - Place the actual animal sprite hidden underneath the mud layer in the center of the screen.
  - Use a `RenderTexture` placed exactly over the animal, drawn using `muddy-shape.png`.
- **Interaction (Scrubbing)**:
  - Track pointer drag across the center area.
  - As the user drags, use the eraser blend mode to "wipe away" parts of the mud render texture.
  - Emit bubble particles at the pointer's location while scrubbing.
  - Track the scrub progress (e.g., area covered or number of interactions) and trigger completion once a threshold is reached.
- **UI**:
  - Show subtle, pulsing text at the bottom: *"try cleaning the animal"*

## 4. Steps to Implement
1. Update breed definitions and store to assign Husky.
2. Update Phaser BootScene/Preloader to include the new images.
3. Completely replace `WashInteraction.scene.ts` logic with the new mechanics.
