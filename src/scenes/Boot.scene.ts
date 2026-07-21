import Phaser from 'phaser';
import { useGameStore } from '../stores/game.store';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
  }

  create() {
    const state = useGameStore.getState();
    if (!state.playerName) {
      // Still in Character Builder, do nothing, the listener in GameCanvas will move it
    } else if (!state.prologueComplete) {
      this.scene.start('PrologueScene');
    } else if (!state.washComplete) {
      // Stay on prologue or an idle state during wash/reveal
      this.scene.start('PrologueScene');
    } else {
      // Phase 4 complete.
      if (state.phase6State === 'shelter_view' || state.phase6State === 'phone_call') {
         this.scene.start('ShelterViewScene');
      } else if (state.phase6State === 'exterior') {
         this.scene.start('ShelterExteriorScene');
      } else {
         // Default to an empty but safe state instead of Placeholder
         // Petting and Bedroom are now handled in React for Day 1
         this.scene.start('PrologueScene');
      }
    }
  }
}
