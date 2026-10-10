import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { IMAGES } from '../../data/speciesData';
import { RotateCcw, Trophy, Check } from 'lucide-react';
import { playCardFlip, playSuccess, playCelebration } from '../../utils/audio';
import { motion } from 'framer-motion';

export const MemoryScreen = () => {
  const { navigate, addPoints, triggerCelebration, unlockSpecies, profile, theme } = useApp();

  const [mode, setMode] = useState(() => {
    return profile === 'Niños' ? 'kids' : 'adults';
  });

  // Sets of cards
  const kidsSet = [
    { id: 'zorro', name: 'Zorro', img: IMAGES.zorro },
    { id: 'hornero', name: 'Hornero', img: IMAGES.hornero },
    { id: 'peperina', name: 'Peperina', img: IMAGES.peperina },
    { id: 'espinillo', name: 'Espinillo', img: IMAGES.espinillo },
  ];

  const adultsSet = [
    { id: 'corzuela', name: 'Corzuela', img: IMAGES.corzuela },
    { id: 'jote', name: 'Jote', img: IMAGES.jote },
    { id: 'algarrobo', name: 'Algarrobo', img: IMAGES.algarroboBlanco },
    { id: 'molle', name: 'Molle', img: IMAGES.molle },
    { id: 'puma', name: 'Puma', img: IMAGES.puma },
    { id: 'picaflor', name: 'Picaflor', img: IMAGES.picaflor },
  ];

  const activeBaseSet = mode === 'kids' ? kidsSet : adultsSet;
  const targetPairsCount = activeBaseSet.length;

  const generateShuffledCards = (baseSet) => {
    const doubled = [...baseSet, ...baseSet].map((item, index) => ({
      ...item,
      uniqueKey: `${item.id}-${index}`
    }));
    return doubled.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(() => generateShuffledCards(activeBaseSet));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const handleCardClick = (idx) => {
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(idx) ||
      matchedIds.includes(cards[idx].id)
    ) {
      return;
    }

    playCardFlip();
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(a => a + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.id === secondCard.id) {
        // Match!
        setTimeout(() => {
          playSuccess();
          const nextMatched = [...matchedIds, firstCard.id];
          setMatchedIds(nextMatched);
          setFlippedIndices([]);

          if (nextMatched.length === targetPairsCount) {
            triggerCelebration();
            addPoints(mode === 'kids' ? 120 : 200, '¡Juego de memoria silvestre completado!');
            unlockSpecies(firstCard.id === 'corzuela' ? 'corzuela-parda' : 'calandria-grande', 'memory');
          }
        }, 350);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 750);
      }
    }
  };

  const handleRestart = (newMode = mode) => {
    setMode(newMode);
    const newBase = newMode === 'kids' ? kidsSet : adultsSet;
    setCards(generateShuffledCards(newBase));
    setFlippedIndices([]);
    setMatchedIds([]);
    setAttempts(0);
  };

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-paper text-ink'
    }`}>
      {/* TopBar with styled back button */}
      <TopBar
        title="Memoria silvestre"
        onBack={() => navigate('games')}
        backLabel="Volver"
      />

      <div className="flex-1 flex flex-col justify-between px-4 py-2 overflow-y-auto">
        {/* Top Controls: Mode Switcher */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex bg-black/10 dark:bg-white/10 p-0.5 rounded-xl text-[10px] font-bold">
            <button
              onClick={() => handleRestart('kids')}
              className={`py-1 px-2.5 rounded-lg transition ${
                mode === 'kids'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              🧒 Niños (4 pares)
            </button>
            <button
              onClick={() => handleRestart('adults')}
              className={`py-1 px-2.5 rounded-lg transition ${
                mode === 'adults'
                  ? 'bg-forest text-white shadow-xs'
                  : 'text-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              🌿 Adultos (6 pares)
            </button>
          </div>

          <button
            onClick={() => handleRestart(mode)}
            className="p-1.5 rounded-xl border border-line dark:border-[#204535] text-muted hover:text-ink dark:hover:text-white transition active:scale-95"
            title="Reiniciar partida"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status Row */}
        <div className={`flex items-center justify-between p-2 rounded-2xl border text-[11px] mb-2 ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1f4535]' : 'bg-cream border-line'
        }`}>
          <span>Intentos: <strong className="font-bold">{attempts}</strong></span>
          <span className="font-bold text-forest">
            Aciertos: {matchedIds.length} / {targetPairsCount}
          </span>
        </div>

        {/* Memory Grid */}
        <div className={`grid gap-2 max-w-[320px] mx-auto w-full my-auto ${
          mode === 'kids' ? 'grid-cols-2 max-w-[240px]' : 'grid-cols-3'
        }`}>
          {cards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx) || matchedIds.includes(card.id);
            const isMatched = matchedIds.includes(card.id);

            return (
              <motion.button
                key={card.uniqueKey}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleCardClick(idx)}
                className={`relative rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 shadow-sm border ${
                  mode === 'kids' ? 'h-24' : 'h-20'
                } ${
                  isFlipped
                    ? isMatched
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-sun bg-sun/20'
                    : theme === 'dark'
                    ? 'bg-[#153427] border-[#224f3c] hover:bg-[#1b4131]'
                    : 'bg-forest text-mint/80 hover:bg-forest-light'
                }`}
              >
                {isFlipped ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1.5">
                    <img
                      src={card.img}
                      alt={card.name}
                      className="w-10 h-10 rounded-xl object-cover shadow-2xs mb-1"
                    />
                    <span className="text-[10px] font-bold truncate max-w-full leading-tight">
                      {card.name}
                    </span>
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-xl overflow-hidden opacity-85">
                    <img src="/icons/memory.png" alt="Dorso" className="w-full h-full object-contain" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Completion Message */}
        {matchedIds.length === targetPairsCount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 mt-2"
          >
            <strong className="text-xs font-bold block">¡Completaste todas las parejas!</strong>
            <span className="text-[10px]">Demostraste gran memoria silvestre en {attempts} intentos.</span>
          </motion.div>
        )}
      </div>
    </section>
  );
};
