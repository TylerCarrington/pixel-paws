# Visual Style Compliance Plan

This document outlines the changes needed to bring the codebase into full compliance with the Paws & Purpose Game Bible's "Visual Style" section.

## 1. Implement Core Color Palette
We will update `src/index.css` to define the official canonical colors as Tailwind theme variables.

**Colors to Add:**
- `blossom-pink`: `#f2a7c3`
- `soft-rose`: `#e8849a`
- `warm-cream`: `#fdf3e7`
- `amber-glow`: `#f5c87a`
- `mossy-green`: `#7ab87a`
- `deep-moss`: `#4a8a4a`
- `stone-grey`: `#b0a898`
- `warm-brown`: `#8b5e3c`
- `soft-lilac`: `#c8a8d8`
- `night-plum`: `#1a1020`
- `dialogue-text`: `#5a3e38`
- `speaker-rose`: `#b07060`
- `muted-sage`: `#9ab8a0`

## 2. Eliminate Unapproved Colors and High Contrast
We will scan and replace occurrences of:
- `bg-gray-*`, `text-gray-*`, `border-gray-*` (Cold greys are forbidden. Neutrals must lean warm).
- `bg-black`, `text-black` (Pure black must be replaced with `night-plum` or `warm-brown`).
- `bg-white`, `text-white` (Pure white must be replaced with `warm-cream`).
- `bg-indigo-*`, `bg-blue-*`, `bg-purple-*` (These cold colors violate the warm, cozy palette style. Replace with `soft-lilac`, `soft-rose`, or `blossom-pink`).

## 3. Update Shadows and Outlines
- **Shadows:** Replace Tailwind's default hard drop shadows (`shadow-lg`, `shadow-2xl`) and drop shadows with soft, warm-tinted shadows (e.g., `shadow-[0_4px_12px_rgba(180,120,100,0.15)]`).
- **Outlines/Borders:** Update any hard black or dark grey borders to use `warm-brown` or `soft-rose`.

## 4. Specific Component Updates
- **Dialogue & Input Panels (`DialoguePanel.tsx`, `NameInputPanel.tsx`, `TownInputPanel.tsx`, `PetNameInput.component.tsx`):**
  - Background must be `warm-cream`.
  - Borders must be warm and rounded (no sharp corners).
  - Body text must be `dialogue-text`.
  - Speaker names must be `speaker-rose`.
- **UI Backgrounds & Overlays (`HomeView`, `ShelterFloor`, `ShopScreen`, `SettingsScreen`, etc.):**
  - Replace dark grey/black overlays with `night-plum` (with opacity) for night transitions or `warm-cream` for daytime UI.
- **Buttons:**
  - Replace stark blue/indigo buttons with `blossom-pink`, `soft-rose`, or `amber-glow` variants.
  - Text on buttons should ensure readability while avoiding pure white where possible (use `warm-cream`).
- **Typography Colors:**
  - Replace stark `text-white` with `text-warm-cream`.
  - Replace `text-gray-500` and similar subtitle/secondary text with `text-muted-sage`.

## Implementation Strategy
1. **Update `src/index.css`** with the new palette and custom shadow definitions via `@theme`.
2. **Review and refactor root/shared CSS** (like `opening.css` and `index.css`).
3. **Iteratively update React components**, starting from core UI (like Dialogues and NameInputs) to specific game screens (Shop, Shelter, Home, etc.).
4. **Compile & Preview** to ensure correct aesthetic and legibility before declaring completion.
