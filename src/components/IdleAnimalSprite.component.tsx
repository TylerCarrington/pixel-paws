import React, { useState, useEffect } from 'react';
import AnimalSprite, { AnimalAnimation } from './AnimalSprite.component';
import { Animal } from '../types/animal.types';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';

interface IdleAnimalSpriteProps {
  pet: Animal;
  size?: number | string;
  className?: string;
  onClick?: () => void;
}

export default function IdleAnimalSprite({ pet, size = 140, className = '', onClick }: IdleAnimalSpriteProps) {
  const [currentAnimation, setCurrentAnimation] = useState<AnimalAnimation>('idle');
  
  const breed = pet.species === 'CAT' 
    ? STARTER_CATS.find(c => c.id === pet.breed) 
    : STARTER_DOGS.find(d => d.id === pet.breed);

  useEffect(() => {
    const triggerRandomAnimation = () => {
      if (currentAnimation !== 'idle') return;

      const level = pet.level || 1;
      const species = pet.species;
      const animationPool: AnimalAnimation[] = [];

      if (species === 'CAT') {
        if (level >= 5) animationPool.push('cat_groom');
        if (level >= 10) animationPool.push('cat_slow_blink');
        if (level >= 20) animationPool.push('cat_loaf'); // Stay in loaf? Keyframes say forwards
        if (level >= 30) animationPool.push('cat_pounce');
        if (level >= 50) animationPool.push('cat_kneading');
      } else {
        if (level >= 5) animationPool.push('dog_stretch');
        if (level >= 10) animationPool.push('dog_chase_tail');
        if (level >= 20) animationPool.push('dog_dream_twitch');
        if (level >= 30) animationPool.push('dog_play_bow');
        if (level >= 50) animationPool.push('dog_zoomies');
      }

      if (animationPool.length > 0) {
        // Random chance every check (30% chance when interval hits)
        if (Math.random() < 0.3) {
          const randomAnim = animationPool[Math.floor(Math.random() * animationPool.length)];
          setCurrentAnimation(randomAnim);

          // Return to idle after animation finishes
          const durationMap: Record<string, number> = {
            dog_stretch: 2000,
            dog_chase_tail: 1800, // 0.6s * 3
            dog_dream_twitch: 3000,
            dog_play_bow: 1500,
            dog_zoomies: 2000, // 1s * 2
            cat_groom: 2000,
            cat_slow_blink: 3000,
            cat_loaf: 5000, // Stay loaf for a bit
            cat_pounce: 1200,
            cat_kneading: 4000,
          };

          const duration = durationMap[randomAnim] || 2000;
          setTimeout(() => {
            setCurrentAnimation('idle');
          }, duration);
        }
      }
    };

    const interval = setInterval(triggerRandomAnimation, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [pet.level, pet.species, currentAnimation]);

  return (
    <div onClick={onClick} className={className}>
      <AnimalSprite 
        spriteKey={breed?.spriteKey || 'dog_husky'} 
        species={pet.species}
        size={size} 
        animation={currentAnimation} 
      />
    </div>
  );
}
