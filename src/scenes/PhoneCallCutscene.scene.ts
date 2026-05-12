import Phaser from 'phaser';
import { RESOLUTION } from '../config/resolution.config';
import { useGameStore } from '../stores/game.store';

export class PhoneCallCutscene extends Phaser.Scene {
  constructor() {
    super('PhoneCallCutscene');
  }

  create() {
    const cx = RESOLUTION.GAME_WIDTH / 2;
    const cy = RESOLUTION.GAME_HEIGHT / 2;

    this.cameras.main.setBackgroundColor('#2c3e50');

    // Phone ring animation text
    const text = this.add.text(cx, cy - 20, '* RIIIING *', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: '-=10',
      yoyo: true,
      repeat: 3,
      duration: 100,
      onComplete: () => {
        this.time.delayedCall(500, () => {
          text.setText([
            "Neighbor:",
            "Hey! There's a stray",
            "animal stuck in the",
            "ditch by my farm.",
            "",
            "Can you help?!"
          ]);
          text.setAlign('center');
          text.setY(cy - 20);

          const continueText = this.add.text(cx, RESOLUTION.GAME_HEIGHT - 30, 'Tap to rush over', {
             fontFamily: '"Press Start 2P"',
             fontSize: '10px',
             color: '#aaaaaa'
          }).setOrigin(0.5);

          this.tweens.add({
             targets: continueText,
             alpha: { from: 0.2, to: 1 },
             yoyo: true,
             repeat: -1,
             duration: 600
          });

          this.input.once('pointerdown', () => {
            useGameStore.getState().setPhase6State('wash_rescue');
          });
        });
      }
    });

  }
}
