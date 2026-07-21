import Phaser from 'phaser';

export const createWashAssets = (scene: Phaser.Scene) => {
    scene.load.image('husky', './src/assets/images/animals/dogs/husky.png');
    scene.load.image('muddy_shape', './src/assets/images/items/muddy-shape.png');

    if (!scene.textures.exists('eraser_brush')) {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d')!;
        // Make the center solid, fade out to edges. Eraser alpha matters for RenderTextures.
        // Or just a solid circle works too.
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(20, 20, 20, 0, Math.PI * 2);
        ctx.fill();
        scene.textures.addCanvas('eraser_brush', canvas);
    }
};

export const createWashAnimations = (scene: Phaser.Scene) => {
    // Animations for new assets if needed. Not needed simple image shaking can be done by tweens.
};