import Phaser from 'phaser';
import { RESOLUTION } from '../config/resolution.config';
import { useGameStore } from '../stores/game.store';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';
import { Species } from '../types/animal.types';

export class ShelterViewScene extends Phaser.Scene {
  constructor() {
    super('ShelterViewScene');
  }

  preload() {
    const store = useGameStore.getState();
    const animals = store.shelterAnimals;
    animals.forEach(animal => {
      const def = STARTER_DOGS.find(d => d.id === animal.breed) || STARTER_CATS.find(c => c.id === animal.breed);
      if (def && def.spriteKey) {
        const folder = animal.species === Species.CAT ? 'cats' : 'dogs';
        const url = `/src/assets/images/animals/${folder}/${def.spriteKey}.png`;
        if (!this.textures.exists(def.spriteKey)) {
          this.load.image(def.spriteKey, url);
        }
      }
    });
  }

  create() {
    const cx = RESOLUTION.GAME_WIDTH / 2;
    const cy = RESOLUTION.GAME_HEIGHT / 2;

    this.cameras.main.setBackgroundColor('#d7ccc8'); // Inside wall

    // Floor
    this.add.rectangle(0, RESOLUTION.GAME_HEIGHT * 0.6, RESOLUTION.GAME_WIDTH, RESOLUTION.GAME_HEIGHT * 0.4, 0x8d6e63).setOrigin(0);

    const store = useGameStore.getState();
    const capacity = store.shelterCapacity + (store.catsUnlocked ? store.catCapacity : 0);
    const animals = store.shelterAnimals;

    // Draw kennels - dynamically calculate spacing for up to 6
    const maxPerRow = Math.min(6, capacity);
    const kennelW = capacity > 4 ? 40 : 60;
    const kennelH = capacity > 4 ? 60 : 80;
    const spacing = 10;
    const totalW = (kennelW * maxPerRow) + (spacing * (maxPerRow - 1));
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
        for(let b=1; b< (capacity > 4 ? 3 : 5); b++) {
            this.add.line(0, 0, x + (kennelW/(capacity > 4 ? 3 : 5))*b, y, x + (kennelW/(capacity > 4 ? 3 : 5))*b, y + kennelH, 0xaaaaaa);
        }

        // Draw animal if present
        const animal = animals[i];
        if (animal) {
            const def = STARTER_DOGS.find(d => d.id === animal.breed) || STARTER_CATS.find(c => c.id === animal.breed);
            if (def && def.spriteKey) {
                this.add.sprite(x + kennelW/2, y + kennelH/2 + 10, def.spriteKey).setScale(capacity > 4 ? 1.2 : 2.0);
            } else {
                this.add.text(x + kennelW/2, y + kennelH/2, animal.species === Species.CAT ? '🐱' : '🐶', { fontSize: capacity > 4 ? '14px' : '20px' }).setOrigin(0.5);
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

