import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import kitchenBg from '../assets/images/backgrounds/kitchen.png';
import panImg from '../assets/images/items/pan.png';
import AnimalSprite from './AnimalSprite.component';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';

interface CookingTogetherProps {
  pet: Animal;
  onComplete: () => void;
}

const INGREDIENTS = [
  { id: 'carrot', name: 'Carrot', icon: '🥕' },
  { id: 'potato', name: 'Potato', icon: '🥔' },
  { id: 'meat', name: 'Meat', icon: '🥩' },
  { id: 'herb', name: 'Herbs', icon: '🌿' },
  { id: 'salt', name: 'Salt', icon: '🧂' },
];

export default function CookingTogetherActivity({ pet, onComplete }: CookingTogetherProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentRecipe, setCurrentRecipe] = useState<string[]>([]);
  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const [finishedRecipes, setFinishedRecipes] = useState(0);
  const [petNudge, setPetNudge] = useState<string | null>(null);
  
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  const targetRecipes = 3;
  const breedDef = pet.species === 'CAT' 
    ? STARTER_CATS.find(c => c.id === pet.breed)
    : STARTER_DOGS.find(d => d.id === pet.breed);
  const spriteKey = breedDef?.spriteKey || pet.breed;

  const startNewRecipe = () => {
    const size = 3 + finishedRecipes;
    const recipe = Array.from({ length: size }, () => 
      INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)].id
    );
    setCurrentRecipe(recipe);
    setAddedIngredients([]);
    
    // Sometimes pet nudges an ingredient (bonus)
    if (Math.random() > 0.4) {
      setTimeout(() => {
        const randomIng = recipe[Math.floor(Math.random() * recipe.length)];
        setPetNudge(randomIng);
      }, 2000);
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && currentRecipe.length === 0) {
      startNewRecipe();
    }
  }, [gameState]);

  const handleDragEnd = (ingredientId: string, info: any) => {
    // In a real mobile app we'd check coordinates
    // Here we'll just check if they dragged it "enough" or simplify to a tap for best stability
    // But let's try a simple drop zone logic based on coordinates if possible
    // For simplicity in this environment, clicking is better, but I'll use a button "Add to Pot"
  };

  const handleAddIngredient = (id: string) => {
    if (gameState !== 'playing') return;

    const expectedId = currentRecipe[addedIngredients.length];
    if (id === expectedId || id === petNudge) {
      const newAdded = [...addedIngredients, id];
      setAddedIngredients(newAdded);
      
      if (id === petNudge) setPetNudge(null);

      if (newAdded.length >= currentRecipe.length) {
        const nextCount = finishedRecipes + 1;
        setFinishedRecipes(nextCount);
        if (nextCount >= targetRecipes) {
          setTimeout(() => setGameState('result'), 1000);
        } else {
          setTimeout(() => startNewRecipe(), 1000);
        }
      }
    } else {
      // Wrong ingredient - shake or feedback?
      console.log('Wrong ingredient');
    }
  };

  const handleFinish = () => {
    addXP(pet.id, 120);
    markActivityDone(pet.id, 'cookingTogether');
    onComplete();
  };

  const finalXP = 120 + (pet.hiddenBonuses?.activity || 0);

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${kitchenBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/95 p-6 rounded-3xl shadow-2xl backdrop-blur-md max-w-2xl w-full h-[85vh] flex flex-col border-4 border-amber-glow relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-game text-speaker-rose uppercase tracking-widest">Cooking Together</h2>
          <div className="flex gap-2">
            {Array.from({ length: targetRecipes }).map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 rounded-full border-2 ${
                  i < finishedRecipes ? 'bg-amber-glow border-amber-500' : 'bg-transparent border-stone-grey/20'
                }`}
              />
            ))}
          </div>
        </div>

        {gameState === 'intro' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-6xl mb-6">🥣</span>
            <p className="text-stone-grey mb-8 uppercase tracking-widest leading-relaxed">
              Prepare a hearty stew with {pet.name}!<br/>
              Add the ingredients in the order shown.<br/>
              {pet.name} might nudge some ingredients in for you!
            </p>
            <button 
              onClick={() => setGameState('playing')}
              className="bg-mossy-green text-white px-10 py-4 rounded-2xl font-game uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Start Cooking
            </button>
          </div>
        ) : gameState === 'playing' ? (
          <div className="flex-1 flex flex-col items-center justify-between py-4">
            {/* The Recipe Display */}
            <div className="w-full bg-white/40 p-4 rounded-2xl border-2 border-dashed border-stone-grey/20 flex gap-4 justify-center items-center h-24">
              {currentRecipe.map((id, i) => {
                const ing = INGREDIENTS.find(x => x.id === id);
                const isAdded = i < addedIngredients.length;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, opacity: isAdded ? 0.4 : 1 }}
                    className={`text-3xl p-2 rounded-lg bg-white shadow-sm ${isAdded ? 'border-none' : 'border-2 border-amber-glow'}`}
                  >
                    {ing?.icon}
                  </motion.div>
                );
              })}
            </div>

            {/* The Pot and Pet */}
            <div className="relative flex-1 w-full flex items-center justify-center">
               <motion.div 
                 className="relative z-10"
                 animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
               >
                 <img src={panImg} className="w-48 h-auto drop-shadow-2xl" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-wrap gap-1 justify-center w-32">
                    {addedIngredients.map((id, i) => (
                      <motion.span 
                        key={i} 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-xl"
                      >
                        {INGREDIENTS.find(x => x.id === id)?.icon}
                      </motion.span>
                    ))}
                 </div>
               </motion.div>

               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 flex flex-col items-center">
                  <div className="bg-amber-glow text-warm-brown text-[8px] px-3 py-1 rounded-full mb-2 uppercase font-game shadow-sm border border-warm-brown/20">
                     Chef {pet.name}
                  </div>
                  <AnimalSprite 
                    species={pet.species}
                    spriteKey={spriteKey} 
                    animation="happy" 
                    size={100} 
                  />
                  {petNudge && (
                    <motion.div
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -100, x: [0, 50, 0] }}
                      className="absolute top-0 text-3xl font-bold text-amber-glow"
                    >
                      {INGREDIENTS.find(x => x.id === petNudge)?.icon} 🐾
                    </motion.div>
                  )}
               </div>
            </div>

            {/* Ingredient Selection */}
            <div className="w-full flex justify-center gap-4 mt-8">
              {INGREDIENTS.map(ing => (
                <button
                  key={ing.id}
                  onClick={() => handleAddIngredient(ing.id)}
                  className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md hover:scale-110 active:scale-95 transition-all border-b-4 border-stone-grey/10"
                >
                  {ing.icon}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-6xl mb-6">🍛</span>
            <h3 className="text-2xl font-game text-night-plum mb-2">STEW'S READY!</h3>
            <p className="text-stone-grey mb-8 uppercase tracking-widest">
              It smells delicious! Excellent teamwork.
            </p>
            <div className="bg-amber-50 text-amber-600 px-6 py-3 rounded-xl mb-8 font-bold">+{finalXP} XP</div>
            <button 
              onClick={handleFinish}
              className="bg-night-plum text-white px-10 py-4 rounded-2xl font-game uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Finish
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={onComplete}
        className="absolute top-6 right-6 z-10 w-10 h-10 bg-night-plum/60 hover:bg-night-plum text-white rounded-full flex items-center justify-center backdrop-blur-md active:scale-95 transition-all font-pixel text-xl"
      >
        ×
      </button>
    </div>
  );
}
