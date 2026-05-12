import Phaser from 'phaser';
import { useGameStore } from '../stores/game.store';
import { RESOLUTION } from '../config/resolution.config';
import { createPetAnimations } from '../assets/petAnimations.assets';

export class PettingInteractionScene extends Phaser.Scene {
  private puppySprite!: Phaser.GameObjects.Sprite;
  private tapCount: number = 0;
  private animsHelper: any;
  private bg!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('PettingInteractionScene');
  }

  preload() {
    const storeState = useGameStore.getState();
    const breed = storeState.assignedBreed;
    const spriteKey = breed ? breed.spriteKey : 'husky';
    
    // Fallback URL if we only have husky right now
    const url = `/src/assets/images/animals/dogs/${spriteKey}.png`;
    
    // We only load if not already loaded
    if (!this.textures.exists(spriteKey)) {
      this.load.image(spriteKey, url);
    }
  }

  create() {
    this.tapCount = 0;
    
    // Background
    this.bg = this.add.rectangle(0, 0, RESOLUTION.GAME_WIDTH, RESOLUTION.GAME_HEIGHT, 0x111111);
    this.bg.setOrigin(0);

    const storeState = useGameStore.getState();
    const breed = storeState.assignedBreed;
    const pet = storeState.ownedPets[storeState.ownedPets.length - 1]; // Current pet
    const spriteKey = breed ? breed.spriteKey : 'husky'; // Fallback

    const cx = RESOLUTION.GAME_WIDTH / 2;
    const cy = RESOLUTION.GAME_HEIGHT / 2;

    this.puppySprite = this.add.sprite(cx, cy, spriteKey);
    this.puppySprite.setScale(3);
    this.puppySprite.setInteractive({ useHandCursor: true });

    this.animsHelper = createPetAnimations(this, spriteKey);

    // Text instructions
    this.add.text(cx, RESOLUTION.GAME_HEIGHT * 0.15, `Pet ${pet?.name || 'your puppy'}`, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.puppySprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.tapCount++;
      this.animsHelper.tailWag(this.puppySprite);
      
      const evt = pointer.event as MouseEvent | TouchEvent;
      const clientX = 'touches' in evt ? evt.touches[0].clientX : evt.clientX;
      const clientY = 'touches' in evt ? evt.touches[0].clientY : evt.clientY;

      // Dispatch an event to the React layer to spawn hearts
      // We pass the screen coordinates of the pointer
      const event = new CustomEvent('spawn-heart', {
        detail: { x: clientX, y: clientY }
      });
      window.dispatchEvent(event);

      if (this.tapCount >= 3) {
        this.time.delayedCall(1000, () => {
          useGameStore.getState().setPhase5State('bedtime');
        });
      }
    });
  }
}

