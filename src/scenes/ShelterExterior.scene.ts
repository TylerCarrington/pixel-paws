import Phaser from 'phaser';
import { RESOLUTION } from '../config/resolution.config';
import { useGameStore } from '../stores/game.store';

export class ShelterExteriorScene extends Phaser.Scene {
  constructor() {
    super('ShelterExteriorScene');
  }

  create() {
    const cx = RESOLUTION.GAME_WIDTH / 2;
    const cy = RESOLUTION.GAME_HEIGHT / 2;

    this.cameras.main.setBackgroundColor('#8ce6ef'); // Sky blue

    // Grass
    this.add.rectangle(0, cy + 20, RESOLUTION.GAME_WIDTH, RESOLUTION.GAME_HEIGHT - (cy + 20), 0x8bc34a).setOrigin(0);

    // Shelter Building
    const buildingW = 160;
    const buildingH = 100;
    const buildingX = cx - buildingW / 2;
    const buildingY = cy + 20 - buildingH;
    
    // Main structure
    this.add.rectangle(buildingX, buildingY, buildingW, buildingH, 0xffeb3b).setOrigin(0); // yellow tint walls
    
    // Roof
    this.add.triangle(cx, buildingY - 40, 
       0, 40, buildingW + 20, 40, buildingW / 2 + 10, 0, 
       0xef5350).setOrigin(0.5);

    // Door
    this.add.rectangle(cx - 15, buildingY + buildingH - 40, 30, 40, 0x795548).setOrigin(0);

    // Sign
    this.add.rectangle(cx, buildingY + 20, 120, 30, 0xffffff).setOrigin(0.5);
    this.add.rectangle(cx, buildingY + 20, 116, 26, 0x8d6e63).setOrigin(0.5);

    const store = useGameStore.getState();
    const shelterName = store.shelterName || 'The Shelter';

    this.add.text(cx, buildingY + 20, shelterName, {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 100 }
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
       const text = this.add.text(cx, RESOLUTION.GAME_HEIGHT - 20, 'Tap to enter', {
             fontFamily: '"Press Start 2P"',
             fontSize: '10px',
             color: '#ffffff'
          }).setOrigin(0.5);

          this.tweens.add({
             targets: text,
             alpha: { from: 0.2, to: 1 },
             yoyo: true,
             repeat: -1,
             duration: 600
          });

          this.input.once('pointerdown', () => {
             useGameStore.getState().setPhase6State('shelter_view');
          });
    });
  }
}
