import Phaser from 'phaser';
import { RESOLUTION } from '../config/resolution.config';
import { useGameStore } from '../stores/game.store';

export class ReflectionScene extends Phaser.Scene {
  constructor() {
    super('ReflectionScene');
  }

  create() {
    const cx = RESOLUTION.GAME_WIDTH / 2;
    const cy = RESOLUTION.GAME_HEIGHT / 2;

    this.cameras.main.setBackgroundColor('#8bc34a'); // Yard

    // Simplistic visual representation
    this.add.rectangle(0, cy, RESOLUTION.GAME_WIDTH, cy, 0x558b2f).setOrigin(0);

    const store = useGameStore.getState();
    const dogBreed = store.ownedPets[0]?.breed;
    const rescueBreed = store.rescueBreed?.id;

    // We don't have human sprites yet, just text for reflection
    this.add.text(cx, cy - 40, "You look at the two animals,\nsafe and clean...", {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff',
      align: 'center',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      const thoughtText = this.add.text(cx, cy + 20, "💭 There must be more \nanimals that need help...", {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#444444'
      }).setOrigin(0.5);

      this.time.delayedCall(3000, () => {
         const continueText = this.add.text(cx, RESOLUTION.GAME_HEIGHT - 30, 'Tap to continue', {
             fontFamily: '"Press Start 2P"',
             fontSize: '10px',
             color: '#aaaaaa'
          }).setOrigin(0.5);

          this.input.once('pointerdown', () => {
             useGameStore.getState().setPhase6State('naming');
          });
      });
    });
  }
}
