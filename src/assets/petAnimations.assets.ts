import { Scene } from 'phaser';

export const createPetAnimations = (scene: Scene, spriteKey: string) => {
  // If we had a sprite sheet, we would create animations here.
  // For now, we'll achieve animations via tweens on the sprite.
  return {
    tailWag: (sprite: Phaser.GameObjects.Sprite) => {
      scene.tweens.add({
        targets: sprite,
        angle: { from: -5, to: 5 },
        scaleY: { from: 2.9, to: 3.1 },
        yoyo: true,
        repeat: 3,
        duration: 100,
        ease: 'Sine.easeInOut'
      });
    },
    curlUp: (sprite: Phaser.GameObjects.Sprite) => {
      scene.tweens.add({
        targets: sprite,
        scaleY: 1.5,
        scaleX: 3.5,
        y: '+=20',
        duration: 800,
        ease: 'Power2'
      });
    },
    walkToBed: (sprite: Phaser.GameObjects.Sprite, targetX: number, targetY: number, onComplete: () => void) => {
       // A little bounce to simulate walking
       scene.tweens.add({
         targets: sprite,
         x: targetX,
         y: targetY,
         duration: 2000,
         ease: 'Linear',
         onComplete
       });
       
       scene.tweens.add({
         targets: sprite,
         y: '-=10',
         yoyo: true,
         repeat: 9,
         duration: 200,
         ease: 'Sine.easeInOut'
       });
    }
  };
};
