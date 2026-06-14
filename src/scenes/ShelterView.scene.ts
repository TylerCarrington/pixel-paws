import Phaser from 'phaser';
import { RESOLUTION } from '../config/resolution.config';
import { useGameStore } from '../stores/game.store';
import { STARTER_DOGS } from '../config/starterDogs.config';

export class ShelterViewScene extends Phaser.Scene {
  constructor() {
    super('ShelterViewScene');
  }

  preload() {
    const store = useGameStore.getState();
    const capacity = store.facilityUpgrades.includes('KENNEL_BASIC_3') ? 3 : 1;
    for (let i = 0; i < capacity; i++) {
      const animal = store.shelterAnimals[i];
      if (animal) {
        const def = STARTER_DOGS.find(d => d.id === animal.breed) || store.rescueBreed;
        if (def && def.spriteKey) {
          const url = `./src/assets/images/animals/dogs/${def.spriteKey}.png`;
          if (!this.textures.exists(def.spriteKey)) {
            this.load.image(def.spriteKey, url);
          }
        }
      }
    }
  }

  create() {
    const cx = RESOLUTION.GAME_WIDTH / 2;
    const cy = RESOLUTION.GAME_HEIGHT / 2;

    this.cameras.main.setBackgroundColor('#d7ccc8'); // Inside wall

    // Floor
    this.add.rectangle(0, RESOLUTION.GAME_HEIGHT * 0.6, RESOLUTION.GAME_WIDTH, RESOLUTION.GAME_HEIGHT * 0.4, 0x8d6e63).setOrigin(0);

    const store = useGameStore.getState();
    const capacity = store.facilityUpgrades.includes('KENNEL_BASIC_3') ? 3 : 1;

    // Draw 3 kennels
    const kennelW = 60;
    const kennelH = 80;
    const spacing = 15;
    const totalW = (kennelW * capacity) + (spacing * (capacity - 1));
    const startX = cx - totalW / 2;
    
    for (let i=0; i<capacity; i++) {
        const x = startX + i * (kennelW + spacing);
        const y = RESOLUTION.GAME_HEIGHT * 0.6 - kennelH + 20;

        // Kennel shadow / floor mat
        this.add.rectangle(x + kennelW/2, y + kennelH - 5, kennelW, 10, 0x5d4037, 0.5).setOrigin(0.5);

        // Kennel bars/box
        this.add.rectangle(x, y, kennelW, kennelH, 0x000000, 0.2).setOrigin(0);
        this.add.rectangle(x, y, kennelW, kennelH, 0, 0).setStrokeStyle(2, 0xaaaaaa).setOrigin(0);
        
        // Vertical bars
        for(let b=1; b<5; b++) {
            this.add.line(0, 0, x + (kennelW/5)*b, y, x + (kennelW/5)*b, y + kennelH, 0xaaaaaa);
        }

        // Draw animal if present
        const animal = store.shelterAnimals[i];
        if (animal) {
            const def = STARTER_DOGS.find(d => d.id === animal.breed) || store.rescueBreed;
            if (def && def.spriteKey) {
                this.add.sprite(x + kennelW/2, y + kennelH/2 + 10, def.spriteKey).setScale(2);
            } else {
                this.add.text(x + kennelW/2, y + kennelH/2, '🐶', { fontSize: '20px' }).setOrigin(0.5);
            }
        }
    }

    this.add.text(cx, 30, 'Shelter is setup!', {
             fontFamily: '"Press Start 2P"',
             fontSize: '10px',
             color: '#333333'
    }).setOrigin(0.5);

  }
}

