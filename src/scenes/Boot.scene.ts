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
    } else if (!state.phase4Complete) {
      this.scene.start('PlaceholderScene');
    } else {
      // Phase 4 complete. Check Phase 5 state
      if (state.phase5State === 'petting') {
         this.scene.start('PettingInteractionScene');
      } else if (state.phase5State === 'bedtime') {
         this.scene.start('BedroomScene');
      } else if (state.phase5State === 'naming') {
         // User refreshed during naming, Wash scene is normally still active here so they can see the dog
         this.scene.start('PlaceholderScene');
      } else if (state.phase5State === 'complete') {
         this.scene.start('PlaceholderScene');
      } else {
         this.scene.start('PlaceholderScene');
      }
    }
  }
}
