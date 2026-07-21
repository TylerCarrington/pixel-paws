import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, Check, Terminal } from 'lucide-react';

interface DevControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

function FlagToggle({ label, flag }: { label: string, flag: string }) {
  const value = useGameStore(state => (state as any)[flag]);
  return (
    <button
      onClick={() => useGameStore.setState({ [flag]: !value })}
      className={`flex items-center justify-between px-4 py-2 rounded-lg border transition-all ${
        value 
          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-100' 
          : 'bg-indigo-900/40 border-indigo-800 text-indigo-400 opacity-60 hover:opacity-100'
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      <div className={`w-3 h-3 rounded-full ${value ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-indigo-900'}`} />
    </button>
  );
}

export default function DevControls({ isOpen, onClose }: DevControlsProps) {
  const resetGame = useGameStore(state => state.resetGame);
  const resetDay = useGameStore(state => state.resetDay);
  const currentMoney = useGameStore(state => state.money);
  const dayNumber = useGameStore(state => state.dayNumber);
  const homeDogCapacity = useGameStore(state => state.homeDogCapacity);
  const homeCatCapacity = useGameStore(state => state.homeCatCapacity);
  const [moneyInput, setMoneyInput] = useState(currentMoney.toString());
  const [copied, setCopied] = useState(false);

  const copyDebugInfo = async () => {
    const state = useGameStore.getState();
    const debugInfo = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      resolution: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
      gameState: {
        money: state.money,
        dayNumber: state.dayNumber,
        phase6State: state.phase6State,
        ownedPets: state.ownedPets,
        shelterAnimals: state.shelterAnimals,
        facilityUpgrades: state.facilityUpgrades,
        shopUnlocks: state.shopUnlocks,
        inventory: state.inventory,
        capacities: {
          shelter: state.shelterCapacity,
          cat: state.catCapacity,
          homeDog: state.homeDogCapacity,
          homeCat: state.homeCatCapacity,
        },
        flags: {
          catsUnlocked: state.catsUnlocked,
          rarePetsUnlocked: state.rarePetsUnlocked,
          shelterUnlocked: state.shelterUnlocked,
          morningBoardUnlocked: state.morningBoardUnlocked,
          prologueComplete: state.prologueComplete,
        }
      }
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy debug info:', err);
    }
  };

  useEffect(() => {
    setMoneyInput(currentMoney.toString());
  }, [currentMoney]);

  // Only show in development mode
  // @ts-ignore
  if (import.meta.env?.MODE !== 'development') {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-night-plum/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-indigo-950 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden font-mono text-sm"
          >
            {/* Header */}
            <div className="bg-indigo-900/50 px-8 py-6 border-b border-indigo-500/20 flex flex-shrink-0 items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-indigo-100 tracking-tight">Terminal Interface</h2>
                <p className="text-indigo-400 text-xs mt-1 uppercase tracking-widest font-bold opacity-60">System Administrator Access</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-indigo-900/50 hover:bg-indigo-800 flex items-center justify-center text-indigo-300 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Jump Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Warp Core / Jump Coordinates</label>
                
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('dev-jump', { detail: { target: 'morning_board' } }));
                      onClose();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl transition-all shadow-lg active:scale-95 text-[10px] uppercase tracking-wider"
                  >
                    Morning
                  </button>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('dev-jump', { detail: { target: 'shelter_view' } }));
                      onClose();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl transition-all shadow-lg active:scale-95 text-[10px] uppercase tracking-wider"
                  >
                    Shelter
                  </button>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('dev-jump', { detail: { target: 'home_view' } }));
                      onClose();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl transition-all shadow-lg active:scale-95 text-[10px] uppercase tracking-wider"
                  >
                    Home
                  </button>
                </div>

                <div className="flex gap-4">
                  <select 
                    className="flex-1 bg-indigo-900 border border-indigo-700 rounded-xl px-4 py-3 text-indigo-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                    onChange={(e) => {
                      if (e.target.value) {
                        window.dispatchEvent(new CustomEvent('dev-jump', { detail: { target: e.target.value } }));
                        onClose();
                        e.target.value = ''; 
                      }
                    }}
                  >
                    <option value="">-- Select Destination --</option>
                    <optgroup label="Phase Jumps">
                      <option value="morning_board">Phase: Morning Board</option>
                      <option value="shelter_view">Phase: Shelter</option>
                      <option value="home_view">Phase: Home</option>
                    </optgroup>
                    <optgroup label="Day 1 Operations">
                      <option value="postReveal">Day 1: Post Rescue</option>
                      <option value="petting">Day 1: Petting Husky</option>
                      <option value="tuckIn">Day 1: Tuck In Husky</option>
                    </optgroup>
                    <optgroup label="Day 2 Operations">
                      <option value="parkScene">Day 2: Park Search</option>
                      <option value="discovery">Day 2: Post Rescue Corgi</option>
                      <option value="spareRoomScene">Day 2: Spare Room (Corgi Bed)</option>
                      <option value="day2Petting">Day 2: Petting Husky</option>
                      <option value="day2TuckIn">Day 2: Tuck In Husky</option>
                    </optgroup>
                    <optgroup label="Day 3 Operations">
                      <option value="day3Morning">Day 3: Morning Sequence</option>
                      <option value="morningBoardTutorial">Day 3: Board Tutorial</option>
                    </optgroup>
                    <optgroup label="Expansion Ops">
                      <option value="day4Shelter">Day 4: Shelter View</option>
                      <option value="shelterPurchase">Day 4: Shelter Purchase</option>
                    </optgroup>
                    <optgroup label="Subsystems Debug">
                      <option value="animation_debug">Animation Engine</option>
                      <option value="games_debug">Minigames Kernel</option>
                      <option value="activities_debug">Activities Stack</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Resource Management */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Financial Credits</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 font-bold">$</span>
                      <input 
                        type="number" 
                        className="w-full bg-indigo-900 border border-indigo-700 rounded-xl pl-8 pr-4 py-3 text-indigo-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                        value={moneyInput}
                        onChange={(e) => setMoneyInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const parsed = parseInt(moneyInput, 10);
                            if (!isNaN(parsed) && parsed >= 0) {
                              useGameStore.setState({ money: parsed });
                            }
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const parsed = parseInt(moneyInput, 10);
                        if (!isNaN(parsed) && parsed >= 0) {
                          useGameStore.setState({ money: parsed });
                        }
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95"
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Runtime Host</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="flex-1 bg-indigo-800 hover:bg-indigo-700 text-indigo-100 font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-indigo-600"
                    >
                      <span>External View</span>
                      <span className="text-xs opacity-50">↗</span>
                    </button>
                    <button 
                      onClick={copyDebugInfo}
                      className={`flex-1 font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 border ${
                        copied 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                          : 'bg-indigo-800 hover:bg-indigo-700 text-indigo-100 border-indigo-600'
                      }`}
                    >
                      {copied ? <Check size={16} /> : <Clipboard size={16} />}
                      <span>{copied ? 'Copied State' : 'Copy Details'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dangerous Operations */}
              <div className="pt-4 space-y-4">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Protocol Overrides / Flags</label>
                <div className="grid grid-cols-2 gap-3">
                  <FlagToggle label="Cats Unlocked" flag="catsUnlocked" />
                  <FlagToggle label="Rare Pets Unlocked" flag="rarePetsUnlocked" />
                  <FlagToggle label="Shelter Unlocked" flag="shelterUnlocked" />
                  <FlagToggle label="Morning Board Unlocked" flag="morningBoardUnlocked" />
                  <FlagToggle label="Spare Room Mode" flag="spareRoomAccessible" />
                  <FlagToggle label="Prologue Complete" flag="prologueComplete" />
                </div>
                
                <div className="flex items-center gap-4 pt-2">
                  <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest whitespace-nowrap">Current Cycle:</label>
                  <input 
                    type="number"
                    className="w-20 bg-indigo-900 border border-indigo-700 rounded-lg px-3 py-2 text-indigo-100 outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    value={dayNumber}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) useGameStore.setState({ dayNumber: val });
                    }}
                  />
                  <div className="flex-1 h-px bg-indigo-500/20" />
                </div>
                
                <div className="flex flex-wrap gap-4 pt-2">
                   <div className="flex items-center gap-4">
                      <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest whitespace-nowrap">Cycle:</label>
                      <input 
                        type="number"
                        className="w-16 bg-indigo-900 border border-indigo-700 rounded-lg px-3 py-2 text-indigo-100 outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-center"
                        value={dayNumber}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) useGameStore.setState({ dayNumber: val });
                        }}
                      />
                   </div>

                   <div className="flex items-center gap-4">
                      <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest whitespace-nowrap">Home Dogs:</label>
                      <input 
                        type="number"
                        className="w-16 bg-indigo-900 border border-indigo-700 rounded-lg px-3 py-2 text-indigo-100 outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-center"
                        value={homeDogCapacity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) useGameStore.setState({ homeDogCapacity: val });
                        }}
                      />
                   </div>

                   <div className="flex items-center gap-4">
                      <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest whitespace-nowrap">Home Cats:</label>
                      <input 
                        type="number"
                        className="w-16 bg-indigo-900 border border-indigo-700 rounded-lg px-3 py-2 text-indigo-100 outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-center"
                        value={homeCatCapacity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) useGameStore.setState({ homeCatCapacity: val });
                        }}
                      />
                   </div>
                </div>
              </div>

              {/* Destructive Operations */}
              <div className="pt-4 space-y-3">
                <label className="text-xs font-bold text-red-500 uppercase tracking-widest">Destructive Directives</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <button 
                      onClick={resetDay}
                      className="w-full bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-800 rounded-xl px-4 py-4 transition-all active:scale-95 text-xs font-bold"
                    >
                      Recalibrate Day
                    </button>
                    <p className="text-[10px] text-indigo-400/60 leading-tight">Resets current day progress while keeping persistent stats.</p>
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        resetGame();
                        window.location.reload();
                      }}
                      className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-300 border border-red-800/50 rounded-xl px-4 py-4 transition-all active:scale-95 text-xs font-bold"
                    >
                      Purge Simulation Data
                    </button>
                    <p className="text-[10px] text-red-400/60 leading-tight">Deletes all save data and reloads the application.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
