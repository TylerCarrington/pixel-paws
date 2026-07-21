import React from 'react';

export type AnimalAnimation = 
  | 'idle' 
  | 'nervous' 
  | 'cowering' 
  | 'curious' 
  | 'retreat' 
  | 'happy' 
  | 'shivering' 
  | 'trusting'
  | 'petting'
  | 'fear'
  | 'neutral'
  | 'hidden'
  | 'revealed'
  // Dog specialized idles
  | 'dog_stretch'
  | 'dog_chase_tail'
  | 'dog_dream_twitch'
  | 'dog_play_bow'
  | 'dog_zoomies'
  // Cat specialized idles
  | 'cat_groom'
  | 'cat_slow_blink'
  | 'cat_loaf'
  | 'cat_pounce'
  | 'cat_kneading';

interface AnimalSpriteProps {
  spriteKey: string;
  animation?: AnimalAnimation;
  size?: number | string;
  className?: string;
  species?: string;
}

export default function AnimalSprite({ 
  spriteKey, 
  animation = 'idle', 
  size = 64,
  className = '',
  species = 'DOG'
}: AnimalSpriteProps) {
  
  const getAnimationClass = () => {
    switch (animation) {
      case 'idle': return 'anim-idle';
      case 'nervous': return 'anim-nervous';
      case 'curious': return 'anim-curious';
      case 'happy': return 'anim-happy';
      case 'shivering': return 'anim-shiver';
      case 'petting': return 'anim-petting';
      case 'retreat': return 'anim-retreat';
      case 'cowering': return 'state-cowering';
      case 'trusting': return 'state-trusting';
      case 'fear': return 'state-fear';
      case 'neutral': return 'state-neutral';
      case 'hidden': return 'state-hidden';
      case 'revealed': return 'state-revealed';
      // Specialized Dog
      case 'dog_stretch': return 'anim-dog-stretch';
      case 'dog_chase_tail': return 'anim-dog-chase-tail';
      case 'dog_dream_twitch': return 'anim-dog-dream-twitch';
      case 'dog_play_bow': return 'anim-dog-play-bow';
      case 'dog_zoomies': return 'anim-dog-zoomies';
      // Specialized Cat
      case 'cat_groom': return 'anim-cat-groom';
      case 'cat_slow_blink': return 'anim-cat-slow-blink';
      case 'cat_loaf': return 'anim-cat-loaf';
      case 'cat_pounce': return 'anim-cat-pounce';
      case 'cat_kneading': return 'anim-cat-kneading';
      default: return '';
    }
  };

  const getFolder = () => {
    const spec = species.toUpperCase();
    if (spec === 'CAT') return 'cats';
    if (spec === 'REPTILE') return 'reptiles';
    if (spec === 'AQUATIC' || spec === 'FISH') return 'fish';
    return 'dogs';
  };

  const folder = getFolder();

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={`./src/assets/images/animals/${folder}/${spriteKey}.png`}
        className={`w-full h-full object-contain pixelated ${getAnimationClass()}`}
        style={{ imageRendering: 'pixelated' }}
        alt="Animal"
        onError={(e) => {
          e.currentTarget.src = `./src/assets/images/animals/${folder}/placeholder.png`; // Fallback
        }}
      />
    </div>
  );
}
