import { useState } from 'react';
import { StarterDogDef } from '../config/starterDogs.config';
import AvatarPlaceholder from './AvatarPlaceholder.component';

interface PetNameInputProps {
  prompt: string;
  breedLabel?: string;
  maxLength?: number;
  initialName?: string;
  onConfirm: (name: string) => void;
  spriteKey?: string;
}

export default function PetNameInput({ 
  prompt, 
  breedLabel, 
  maxLength = 15, 
  initialName = '', 
  onConfirm,
  spriteKey
}: PetNameInputProps) {
  const [name, setName] = useState(initialName);

  return (
    <div className="flex flex-col items-center justify-center bg-warm-cream bg-opacity-95 p-8 rounded-xl border-4 border-soft-rose shadow-[0_4px_12px_rgba(180,120,100,0.15)] max-w-md w-full font-pixel">
      {spriteKey && (
        <div className="mb-4 transform scale-150 relative -top-4">
          <AvatarPlaceholder spriteKey={spriteKey} />
        </div>
      )}
      {breedLabel && (
        <div className="text-speaker-rose text-[10px] tracking-widest mb-2 uppercase text-center w-full">
          {breedLabel}
        </div>
      )}

      <h2 className="text-xs font-game text-dialogue-text mb-8 text-center leading-relaxed italic">{prompt}</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value.trimStart())}
        maxLength={maxLength}
        placeholder="ENTER NAME..."
        className="w-full bg-warm-cream border-2 border-soft-rose rounded-lg px-4 py-4 text-xs text-center text-dialogue-text font-game focus:border-mossy-green focus:outline-none transition-colors mb-6 placeholder:text-stone-grey"
        autoFocus
        onKeyDown={(e) => {
           if (e.key === 'Enter' && name.trim().length > 0) {
              onConfirm(name.trim());
           }
        }}
      />

      <button
        onClick={() => {
          if (name.trim().length > 0) onConfirm(name.trim());
        }}
        disabled={name.trim().length === 0}
        className="w-full bg-amber-glow hover:brightness-110 disabled:bg-stone-grey disabled:text-warm-cream text-warm-brown font-game text-[10px] py-4 px-6 rounded-lg shadow-sm transition-all uppercase tracking-wider disabled:cursor-not-allowed"
      >
        Confirm
      </button>
    </div>
  );
}
