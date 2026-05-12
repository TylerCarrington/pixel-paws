import Phaser from 'phaser';
import { useGameStore } from '../stores/game.store';
import { PROLOGUE_PANELS } from '../config/prologue.config';

export default class PrologueScene extends Phaser.Scene {
  private panelIndex = 0;
  private unsub: (() => void) | null = null;

  constructor() {
    super('PrologueScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#111111');
    
    this.panelIndex = 0;
    useGameStore.getState().setProloguePanel(this.panelIndex);

    this.input.on('pointerdown', this.advance, this);
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-SPACE', this.advance, this);
      this.input.keyboard.on('keydown-ENTER', this.advance, this);
    }

    this.unsub = useGameStore.subscribe((state) => {
      if (state.prologueComplete && this.scene.isActive()) {
        if (this.unsub) {
            this.unsub();
            this.unsub = null;
        }
        this.scene.start('PlaceholderScene');
      }
    });

    this.events.on('shutdown', () => {
      if (this.unsub) {
        this.unsub();
        this.unsub = null;
      }
    });
  }

  advance() {
    this.panelIndex++;
    if (this.panelIndex >= PROLOGUE_PANELS.length) {
      useGameStore.getState().advancePrologue();
      // The unsub listener will catch prolougeComplete and start the next scene
    } else {
      useGameStore.getState().setProloguePanel(this.panelIndex);
    }
  }
}
