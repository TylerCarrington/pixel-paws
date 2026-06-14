import React from 'react';

export default function AvatarPlaceholder({ spriteKey }: { spriteKey: string }) {
  return (
    <div className="w-16 h-16 rounded overflow-hidden bg-stone-grey/10 flex items-center justify-center p-2">
      <img
        src={`./src/assets/images/animals/dogs/${spriteKey}.png`}
        className="w-full h-full object-contain pixelated"
        style={{ imageRendering: 'pixelated' }}
        alt="Pet"
        onError={(e) => {
          // Fallback if image not found
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}
