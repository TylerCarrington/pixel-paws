import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../stores/game.store';
import { Animal } from '../types/animal.types';
import { DECORATIONS } from '../constants/decorations.constants';
import { X, Package, Trash2, CheckCircle } from 'lucide-react';
import AnimalSprite from './AnimalSprite.component';
import { STARTER_DOGS } from '../config/starterDogs.config';

// Background asset
import dogHouseBg from '../assets/images/backgrounds/dog-house-interior.png';

interface DecorationModeProps {
  pet: Animal;
  onClose: () => void;
}

export default function DecorationMode({ pet, onClose }: DecorationModeProps) {
  const inventory = useGameStore(state => state.inventory);
  const petHouseDecorations = useGameStore(state => state.petHouseDecorations[pet.id] || {});
  const saveDecoration = useGameStore(state => state.saveDecoration);
  const removeDecoration = useGameStore(state => state.removeDecoration);
  
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Ensure pet bed is present
    const hasBed = Object.values(petHouseDecorations).some(d => d.itemKey === 'PET_BED');
    if (!hasBed) { 
      saveDecoration(pet.id, 'default_bed', 'PET_BED', 20, 80);
    }
  }, [petHouseDecorations, pet.id, pet.species, saveDecoration]);

  const breed = STARTER_DOGS.find(d => d.id === pet.breed);

  // Group inventory by itemKey for display count
  const decorationInventory = inventory.filter(id => DECORATIONS[id]);
  
  // Calculate available counts (owned - placed)
  const availableCounts: Record<string, number> = {};
  decorationInventory.forEach(id => {
    availableCounts[id] = (availableCounts[id] || 0) + 1;
  });
  
  Object.values(petHouseDecorations).forEach(placed => {
    if (availableCounts[placed.itemKey]) {
      availableCounts[placed.itemKey]--;
    }
  });

  const handlePlaceNew = (itemKey: string) => {
    if (availableCounts[itemKey] <= 0) return;
    
    const instanceId = `inst_${itemKey}_${Date.now()}`;
    // Place in center initially
    saveDecoration(pet.id, instanceId, itemKey, 50, 50);
  };

  const handleUpdatePosition = (instanceId: string, itemKey: string, x: number, y: number) => {
    saveDecoration(pet.id, instanceId, itemKey, x, y);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-night-plum/90 backdrop-blur-md">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white/5 border-b border-white/10">
        <div>
          <h2 className="text-warm-cream font-pixel text-lg uppercase tracking-widest">{pet.name}'s House</h2>
          <p className="text-warm-cream/60 text-[10px] uppercase tracking-wider mt-1">Decoration Mode</p>
        </div>
        <button 
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all active:scale-95 text-warm-cream"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Main Decoration Area */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-4xl aspect-[16/10] bg-cover bg-center shadow-2xl overflow-hidden rounded-3xl border-8 border-white/10"
          style={{ backgroundImage: `url(${dogHouseBg})` }}
        >
          {/* The Pet */}
          <div className="absolute bottom-[15%] left-[20%] z-20 pointer-events-none">
             <AnimalSprite 
               spriteKey={breed?.spriteKey || 'dog_husky'} 
               size={120} 
               animation="idle" 
             />
          </div>

          {/* Placed Decorations */}
          {Object.entries(petHouseDecorations).map(([instanceId, data]) => {
            const item = DECORATIONS[data.itemKey];
            if (!item) return null;
            
            return (
              <motion.div
                key={instanceId}
                drag
                dragMomentum={false}
                dragConstraints={containerRef}
                onDragEnd={(_, info) => {
                  if (!containerRef.current) return;
                  const rect = containerRef.current.getBoundingClientRect();
                  const xRel = ((info.point.x - rect.left) / rect.width) * 100;
                  const yRel = ((info.point.y - rect.top) / rect.height) * 100;
                  handleUpdatePosition(instanceId, data.itemKey, xRel, yRel);
                }}
                className="absolute cursor-move z-30 group"
                style={{ 
                  left: `${data.x}%`, 
                  top: `${data.y}%`,
                  translateX: '-50%',
                  translateY: '-50%'
                }}
              >
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="drop-shadow-lg"
                    style={{ width: item.width * 2, height: item.height * 2 }} 
                  />
                  
                  {/* Remove Button on hover */}
                  {data.itemKey !== 'PET_BED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDecoration(pet.id, instanceId);
                      }}
                      className="absolute -top-4 -right-4 bg-speaker-rose text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Inventory Bar */}
      <div className="h-44 bg-white/10 backdrop-blur-xl border-t border-white/20 p-4 shrink-0">
        <div className="max-w-6xl mx-auto flex gap-4 h-full">
          <div className="flex flex-col justify-center gap-1 border-r border-white/10 pr-6 mr-2">
            <Package className="text-amber-glow" size={24} />
            <h3 className="text-white font-pixel text-[10px] uppercase tracking-widest">Inventory</h3>
          </div>
          
          <div className="flex-1 overflow-x-auto flex items-center gap-4 custom-scrollbar-horizontal px-2">
            {Object.keys(availableCounts).map(itemKey => {
              const item = DECORATIONS[itemKey];
              const count = availableCounts[itemKey];
              
              return (
                <button
                  key={itemKey}
                  onClick={() => handlePlaceNew(itemKey)}
                  disabled={count <= 0}
                  className={`relative min-w-[100px] h-32 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all p-3 border-2
                    ${count > 0 
                      ? 'bg-white/5 border-white/10 hover:border-amber-glow/50 hover:bg-white/10' 
                      : 'opacity-40 grayscale cursor-not-allowed border-transparent bg-white/2'
                    }
                  `}
                >
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain drop-shadow-md" />
                  <div className="text-center">
                    <p className="text-white font-pixel text-[8px] uppercase whitespace-nowrap">{item.name}</p>
                    <div className="mt-1 bg-white/20 rounded-full px-2 py-0.5 inline-block">
                       <p className="text-[7px] text-warm-cream font-bold">{count} LEFT</p>
                    </div>
                  </div>
                </button>
              );
            })}

            {Object.keys(availableCounts).length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-white/40">
                <p className="text-xs font-pixel uppercase tracking-widest text-center">
                  Your decoration inventory is empty.<br/>
                  <span className="text-[8px] opacity-50">Visit Pets R Us to buy items!</span>
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center ml-4 pl-4 border-l border-white/10">
             <button 
               onClick={onClose}
               className="bg-mossy-green hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-pixel text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center gap-3"
             >
               <CheckCircle size={18} />
               Save & Exit
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
