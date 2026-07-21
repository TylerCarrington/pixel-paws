import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Star, MapPin, Sparkles, X, Check } from 'lucide-react';
import { useGameStore } from '../stores/game.store';
import { SHELTER_LISTINGS, ShelterListing } from '../config/shelters.config';

interface ShelterListingsProps {
  onClose: () => void;
  onPurchaseComplete: () => void;
}

export default function ShelterListings({ onClose, onPurchaseComplete }: ShelterListingsProps) {
  const money = useGameStore((s) => s.money);
  const purchaseShelter = useGameStore((s) => s.purchaseShelter);
  
  const [selectedShelter, setSelectedShelter] = useState<ShelterListing | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePurchase = () => {
    if (selectedShelter && money >= selectedShelter.cost) {
      purchaseShelter(selectedShelter.id, selectedShelter.cost);
      setShowConfirm(false);
      onPurchaseComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-warm-cream rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border-8 border-white/20"
      >
        {/* Header */}
        <div className="bg-white/50 p-6 border-b border-stone-grey/10 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-night-plum flex items-center gap-2">
              <Home className="text-speaker-rose" />
              Real Estate Listings
            </h2>
            <p className="text-stone-grey/80 text-sm mt-1">
              Find the perfect permanent home for your shelter. Unlocks cats and rare pets!
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-stone-grey text-sm mr-2">Your Funds:</span>
              <span className={`font-bold text-lg ${money < 500 ? 'text-red-500' : 'text-sage-green'}`}>
                ${money}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/50 hover:bg-white rounded-full text-stone-grey transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Listings Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {SHELTER_LISTINGS.map((listing) => (
            <div 
              key={listing.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-speaker-rose/20 flex gap-6"
            >
              {/* Image */}
              <div className="w-1/3 shrink-0 relative rounded-xl overflow-hidden shadow-inner bg-stone-100">
                <img 
                  src={listing.image} 
                  alt={listing.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-night-plum shadow-sm">
                  ${listing.cost}
                </div>
              </div>
              
              {/* Details */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-night-plum">{listing.name}</h3>
                    <div className="flex items-center text-stone-grey/80 text-sm mt-1 gap-1">
                      <MapPin size={14} />
                      {listing.location}
                    </div>
                  </div>
                  
                  <div className="flex bg-speaker-rose/10 px-3 py-1.5 rounded-full" title="Charm Rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < listing.charm ? "fill-speaker-rose text-speaker-rose" : "text-speaker-rose/20"} 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm mb-6 flex-1">
                  <div className="flex justify-between border-b border-stone-100 pb-1">
                    <span className="text-stone-grey/60">Curb Appeal</span>
                    <span className="font-medium text-night-plum">{listing.curbAppeal}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1">
                    <span className="text-stone-grey/60">Location</span>
                    <span className="font-medium text-night-plum">{listing.proximityDesc}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1">
                    <span className="text-stone-grey/60">Year Built</span>
                    <span className="font-medium text-night-plum">{listing.yearBuilt}</span>
                  </div>
                  <div className="col-span-2 mt-2 bg-sage-green/10 p-3 rounded-lg border border-sage-green/20">
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-sage-green shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-sage-green text-xs uppercase tracking-wider block mb-1">Special Feature</span>
                        <span className="text-night-plum/80 text-sm italic">{listing.specialFeature}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  disabled={money < listing.cost}
                  onClick={() => {
                    setSelectedShelter(listing);
                    setShowConfirm(true);
                  }}
                  className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                    money >= listing.cost 
                      ? 'bg-speaker-rose text-white hover:bg-opacity-90 hover:shadow-md' 
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {money >= listing.cost ? (
                    <>Choose This Shelter</>
                  ) : (
                    <>Not Enough Funds (${listing.cost})</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer info */}
        <div className="bg-white/50 p-4 text-center text-stone-grey text-sm border-t border-stone-grey/10 shrink-0">
          <p>This shelter unlocks the ability to care for both dogs and cats. Starting Capacity: 4 dogs, 4 cats (expandable to 6 each!).</p>
          <p className="mt-1 font-medium text-night-plum/70">Rare animals may now appear on the Morning Board.</p>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && selectedShelter && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-2xl font-bold text-night-plum mb-4 text-center">Confirm Purchase</h3>
              <div className="bg-stone-100 rounded-xl p-4 mb-6 text-center">
                <p className="font-bold text-lg mb-1">{selectedShelter.name}</p>
                <p className="text-speaker-rose font-bold text-xl">${selectedShelter.cost}</p>
              </div>
              
              <ul className="space-y-3 text-stone-grey mb-8">
                <li className="flex items-start gap-2">
                  <Check size={18} className="text-sage-green shrink-0 mt-0.5" />
                  <span>This will become your new shelter. All animals will move with you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={18} className="text-sage-green shrink-0 mt-0.5" />
                  <span>Your spare room will no longer be used as a shelter.</span>
                </li>
              </ul>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-full font-bold bg-stone-200 text-stone-600 hover:bg-stone-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePurchase}
                  className="flex-1 py-3 rounded-full font-bold bg-speaker-rose text-white hover:bg-opacity-90 shadow-md transition-all"
                >
                  Confirm Purchase
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
