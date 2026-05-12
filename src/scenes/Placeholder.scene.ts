import Phaser from 'phaser';
import { RESOLUTION } from '../config/resolution.config';

export default class PlaceholderScene extends Phaser.Scene {
  constructor() {
    super('PlaceholderScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#2d2d2d');

    this.add.text(
      RESOLUTION.GAME_WIDTH / 2, 
      RESOLUTION.GAME_HEIGHT / 2, 
      'Day 1 — Morning',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff',
      }
    ).setOrigin(0.5);
  }
}
