import React from 'react';
import { Species } from '../types/animal.types';

export default function AvatarPlaceholder({ spriteKey, species = Species.DOG }: { spriteKey: string, species?: Species }) {
  const folder = species === Species.CAT ? 'cats' : 'dogs';
  return (
    <div className="w-16 h-16 rounded overflow-hidden bg-stone-grey/10 flex items-center justify-center p-2 text-6xl">
      <img
        src={`./src/assets/images/animals/${folder}/${spriteKey}.png`}
        className="w-full h-full object-contain pixelated"
        style={{ imageRendering: 'pixelated' }}
        alt="Pet"
        onError={(e) => {
          // Fallback if image not found, try to show an emoji based on species
          e.currentTarget.style.display = 'none';
          // Since we can't easily change the parent from here to show the emoji, 
          // we'll just let it be blank or we can handle it in the parent component.
        }}
      />
      {/* If the image fails, the alt text might show, but ideally we'd show an emoji fallback if needed */}
    </div>
  );
}
