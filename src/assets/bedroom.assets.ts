import Phaser from 'phaser';

export const loadBedroomAssets = (scene: Phaser.Scene) => {
    // Generate simple placeholder assets for the bedroom
    
    // Bed texture
    const bedGraphics = scene.make.graphics({x: 0, y: 0}, false);
    bedGraphics.fillStyle(0x4a3b32); // Wood frame
    bedGraphics.fillRoundedRect(0, 0, 100, 60, 8);
    bedGraphics.fillStyle(0x8b9bb4); // Blue pillow/blanket
    bedGraphics.fillRoundedRect(5, 5, 90, 50, 4);
    bedGraphics.generateTexture('pet_bed', 100, 60);

    // Floor texture
    const floorGraphics = scene.make.graphics({x: 0, y: 0}, false);
    floorGraphics.fillStyle(0x3e2723); 
    floorGraphics.fillRect(0, 0, 32, 32);
    // Add some wood lines
    floorGraphics.lineStyle(1, 0x2d1a11);
    floorGraphics.beginPath();
    floorGraphics.moveTo(0, 8);
    floorGraphics.lineTo(32, 8);
    floorGraphics.moveTo(0, 24);
    floorGraphics.lineTo(32, 24);
    floorGraphics.strokePath();
    floorGraphics.generateTexture('wood_floor', 32, 32);

    // Rug texture
    const rugGraphics = scene.make.graphics({x: 0, y: 0}, false);
    rugGraphics.fillStyle(0x8d6e63);
    rugGraphics.fillRoundedRect(0, 0, 200, 120, 20);
    rugGraphics.lineStyle(4, 0x5d4037);
    rugGraphics.strokeRoundedRect(2, 2, 196, 116, 20);
    rugGraphics.generateTexture('rug', 200, 120);
};
