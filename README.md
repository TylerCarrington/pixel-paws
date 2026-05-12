# Paws & Purpose

A 2D browser-based pixel-art game built with React, Phaser 3, and Zustand.

## Technology Stack
- **Rendering:** Phaser 3 (for canvas-based 2D pixel-art graphics and scenes)
- **UI Layer:** React (for menus, character builder, notice board)
- **State Management:** Zustand (for serializable game state across day phases)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Build Tooling:** Vite

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser to the URL provided by Vite (usually `http://localhost:3000`).

## File Conventions
- `*.types.ts`: TypeScript interfaces and enums only, no logic.
- `*.constants.ts`: Exported constants only, no logic.
- `*.store.ts`: State management slice or store.
- `*.logic.ts`: Pure functions, game rules, calculations.
- `*.scene.ts`: Phaser scene class.
- `*.component.tsx`: Single UI component.
- `*.config.ts`: Static configuration objects.
