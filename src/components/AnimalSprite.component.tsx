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
  | 'revealed';

interface AnimalSpriteProps {
  spriteKey: string;
  animation?: AnimalAnimation;
  size?: number | string;
  className?: string;
}

export default function AnimalSprite({ 
  spriteKey, 
  animation = 'idle', 
  size = 64,
  className = ''
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
      default: return '';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={`./src/assets/images/animals/dogs/${spriteKey}.png`}
        className={`w-full h-full object-contain pixelated ${getAnimationClass()}`}
        style={{ imageRendering: 'pixelated' }}
        alt="Animal"
        onError={(e) => {
          e.currentTarget.src = './src/assets/images/animals/dogs/husky.png'; // Fallback
        }}
      />
    </div>
  );
}
