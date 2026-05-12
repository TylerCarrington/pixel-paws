import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import BootScene from '../scenes/Boot.scene';
import PlaceholderScene from '../scenes/Placeholder.scene';
import PrologueScene from '../scenes/Prologue.scene';
import { PettingInteractionScene } from '../scenes/PettingInteraction.scene';
import { BedroomScene } from '../scenes/BedroomScene.scene';
import { PhoneCallCutscene } from '../scenes/PhoneCallCutscene.scene';
import { ReflectionScene } from '../scenes/Reflection.scene';
import { ShelterExteriorScene } from '../scenes/ShelterExterior.scene';
import { ShelterViewScene } from '../scenes/ShelterView.scene';
import { RESOLUTION } from '../config/resolution.config';
import { useGameStore } from '../stores/game.store';

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent: 'game-container',
        width: RESOLUTION.GAME_WIDTH,
        height: RESOLUTION.GAME_HEIGHT,
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [
          BootScene, 
          PlaceholderScene, 
          PrologueScene, 
          PettingInteractionScene, 
          BedroomScene,
          PhoneCallCutscene,
          ReflectionScene,
          ShelterExteriorScene,
          ShelterViewScene
        ]
      });
    }
    
    // Subscribe to Zustand to launch the appropriate scene
    const unsub = useGameStore.subscribe((state, prevState) => {
      if (!gameRef.current) return;
      
      const activeScene = gameRef.current.scene.getScenes(true)[0];
      if (!activeScene) return;

      // Phase 5 routing
      if (state.phase5State === 'petting' && prevState.phase5State !== 'petting') {
         activeScene.scene.start('PettingInteractionScene');
      }
      
      if (state.phase5State === 'bedtime' && prevState.phase5State !== 'bedtime') {
         activeScene.scene.start('BedroomScene');
      }

      // Phase 6 routing
      if (state.phase6State === 'phone_call' && prevState.phase6State !== 'phone_call') {
         activeScene.scene.start('ShelterViewScene');
      }

      if (state.phase6State === 'reflection' && prevState.phase6State !== 'reflection') {
         activeScene.scene.start('ReflectionScene');
      }

      if (state.phase6State === 'exterior' && prevState.phase6State !== 'exterior') {
         activeScene.scene.start('ShelterExteriorScene');
      }

      if (state.phase6State === 'shelter_view' && prevState.phase6State !== 'shelter_view') {
         activeScene.scene.start('ShelterViewScene');
      }
    });

    return () => {
      unsub();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container" className="w-full h-full flex items-center justify-center bg-night-plum touch-none" />;
}
