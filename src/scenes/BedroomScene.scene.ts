import Phaser from 'phaser';
import { useGameStore } from '../stores/game.store';
import { RESOLUTION } from '../config/resolution.config';
import { loadBedroomAssets } from '../assets/bedroom.assets';
import { createPetAnimations } from '../assets/petAnimations.assets';

export class BedroomScene extends Phaser.Scene {
  private puppySprite!: Phaser.GameObjects.Sprite;
  private animsHelper: any;
  private tuckedIn: boolean = false;

  constructor() {
    super('BedroomScene');
  }

  preload() {
    loadBedroomAssets(this);
    
    const storeState = useGameStore.getState();
    const breed = storeState.assignedBreed;
    const spriteKey = breed ? breed.spriteKey : 'husky';
    
    const url = `./src/assets/images/animals/dogs/${spriteKey}.png`;
    
    if (!this.textures.exists(spriteKey)) {
      this.load.image(spriteKey, url);
    }
  }

  create() {
    this.tuckedIn = false;
    
    // Background - wood floor
    this.add.tileSprite(0, 0, RESOLUTION.GAME_WIDTH, RESOLUTION.GAME_HEIGHT, 'wood_floor').setOrigin(0);

    // Wall (top half)
    this.add.rectangle(0, 0, RESOLUTION.GAME_WIDTH, RESOLUTION.GAME_HEIGHT * 0.4, 0x2c3e50).setOrigin(0);
    this.add.rectangle(0, RESOLUTION.GAME_HEIGHT * 0.4, RESOLUTION.GAME_WIDTH, 4, 0x1a252f).setOrigin(0); // Baseboard

    // Rug
    const cx = RESOLUTION.GAME_WIDTH / 2;
    this.add.image(cx, RESOLUTION.GAME_HEIGHT * 0.7, 'rug');

    // Slot 1: bed
    const bedX = cx;
    const bedY = RESOLUTION.GAME_HEIGHT * 0.7;
    this.add.image(bedX, bedY, 'pet_bed');

    const storeState = useGameStore.getState();
    const breed = storeState.assignedBreed;
    const pet = storeState.ownedPets[storeState.ownedPets.length - 1]; // Current pet
    const spriteKey = breed ? breed.spriteKey : 'husky'; // Fallback

    // Puppy starts off-screen or walking in
    this.puppySprite = this.add.sprite(0, bedY, spriteKey);
    this.puppySprite.setScale(2); // Slightly smaller in room perspective

    this.animsHelper = createPetAnimations(this, spriteKey);

    // Instruction text
    const text = this.add.text(cx, RESOLUTION.GAME_HEIGHT * 0.15, `It's time for bed.`, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Sequence: Walk to bed, then wait for tap
    this.animsHelper.walkToBed(this.puppySprite, bedX, bedY - 10, () => {
      text.setText('Tap to tuck in');
      this.puppySprite.setInteractive({ useHandCursor: true });
      
      this.puppySprite.on('pointerdown', () => {
        if (this.tuckedIn) return;
        this.tuckedIn = true;
        text.setText('Goodnight...');
        
        // Curl up animation
        this.animsHelper.curlUp(this.puppySprite);
        
        // Zzz particles could go here
        
        // Fade to stars transition
        this.time.delayedCall(1500, () => {
          this.fadeToStars();
        });
      });
    });
  }

  private fadeToStars() {
    // Generate star field layer
    const stars = this.add.graphics();
    stars.fillStyle(0xffffff, 1);
    for (let i = 0; i < 50; i++) {
        stars.fillCircle(Phaser.Math.Between(0, RESOLUTION.GAME_WIDTH), Phaser.Math.Between(0, RESOLUTION.GAME_HEIGHT), Phaser.Math.Between(1, 2));
    }
    stars.setAlpha(0);

    // Create a blackout rect
    const blackout = this.add.rectangle(0, 0, RESOLUTION.GAME_WIDTH, RESOLUTION.GAME_HEIGHT, 0x000010).setOrigin(0);
    blackout.setAlpha(0);

    this.tweens.add({
      targets: blackout,
      alpha: 1,
      duration: 1500,
      onComplete: () => {
        this.tweens.add({
            targets: stars,
            alpha: 1,
            duration: 1000,
            yoyo: true, // Fade in stars, then out
            hold: 1000,
            onComplete: () => {
                useGameStore.getState().setPhase5State('complete');
            }
        });
      }
    });
  }
}
