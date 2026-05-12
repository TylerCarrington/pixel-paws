# Pixel Paws - Art Asset Manifest

This document tracks all visual assets required for the game. Currently, most assets are represented by colored shapes or emoji-based placeholders.

## Characters
| Asset | Type | Dimensions | Frames | Status |
| :--- | :--- | :--- | :--- | :--- |
| Player Base | Sprite Sheet | 32x32 per frame | 4 (Idle) | Placeholder (Rect) |
| Player Walk | Animation | 32x32 per frame | 8 | Missing |
| NPC - Shopkeeper | Sprite | 32x32 | 1 | Placeholder |

## Animals (Species Packs)
*Each species needs variants for Body, Patterns, and Expressions.*

| Asset | Dimensions | Frames | Status |
| :--- | :--- | :--- | :--- |
| Dog (General) | 32x32 | 4 (Idle) | Placeholder |
| Cat (General) | 32x32 | 4 | Placeholder |
| Rabbit | 24x24 | 2 | Placeholder |
| Bird | 24x24 | 4 (Flap) | Placeholder |
| Reptile | 32x16 | 2 | Placeholder |

## Environmental Assets
| Asset | Dimensions | Type | Status |
| :--- | :--- | :--- | :--- |
| Shelter Floor Tiles | 16x16 | Tileset | Placeholder |
| Home Wallpaper | 256x256 | Texture | Solid Color |
| Kennel Sprite | 48x48 | Static | Placeholder |
| Vet Table | 64x32 | Static | Placeholder |
| Wash Tub | 64x48 | Animated (Bubbles) | Placeholder |

## UI & VFX
- **Heart Particles**: 8x8 pixel heart (Done: Vector/CSS)
- **Pixel Fade**: Transition shader (Done: GLSL/CSS)
- **Tutorial Icons**: Controller/Keyboard prompts (Missing)
- **Success Fanfare**: Animated sparkles (Done: CSS)

## Dimensions Guide
- **Small Animals**: 16x16 to 24x24
- **Medium Animals/Humans**: 32x32
- **Large Furniture**: 64x64 or 48x48
- **Background Tiles**: 16x16 (Standardized)
