import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { Leaf, Sparkles, User, Palette, RotateCcw, Trophy, Check } from 'lucide-react';
import { playCardFlip, playSuccess, playCelebration } from '../../utils/audio';
import { motion } from 'framer-motion';

export const MemoryScreen = () => {
  const { navigate, addPoints, triggerCelebration, unlockSpecies } = useApp();

  // 8 cards (4 pairs) of native species
  const initialCards = ['peperina', 'calandria', 'zorro', 'espinillo', 'peperina', 'calandria', 'zorro', 'espinillo'];
  const [cards, setCards] = useState(initialCards);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const icons = {
    peperina: Leaf,
    calandria: Sparkles,
    zorro: User,
    espinillo: Palette
  };

  const labels = {
    peperina: 'Peperina',
    calandria: 'Calandria',
    zorro: 'Zorro Gris',
    espinillo: 'Espinillo'
  };

  const handleCardClick = (idx) => {
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(idx) ||
      matchedIndices.includes(idx)
    ) {
      return;
    }

    playCardFlip();
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(a => a + 1);
      const [first, second] = newFlipped;

      if (cards[first] === cards[second]) {
        // Match!
        setTimeout(() => {
          playSuccess();
          const nextMatched = [...matchedIndices, first, second];
          setMatchedIndices(nextMatched);
          setFlippedIndices([]);

          if (nextMatched.length === cards.length) {
            triggerCelebration();
            addPoints(200, '¡Juego de memoria silvestre completado!');
            unlockSpecies('calandria-grande', 'memory');
            unlockSpecies('peperina-serrana', 'memory');
          }
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 750);
      }
    }
  };

  const handleRestart = () => {
    // Shuffle cards
    const shuffled = [...initialCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setAttempts(0);
  };

  return (
    <section className="relative w-full h-full bg-paper flex flex-col justify-between overflow-hidden">
      {/* TopBar with styled back button */}
      <TopBar
        title="Memoria silvestre"
        onBack={() => navigate('games')}
        backLabel="Volver"
      />

      <div className="flex-1 flex flex-col justify-between px-5 py-3 overflow-y-auto">
        {/* Topline Info with Memory Icon */}
        <div className="flex items-center justify-between text-xs bg-cream p-2 rounded-2xl border border-line">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-2xs shrink-0">
              <img src="/icons/memory.png" alt="Memoria" className="w-full h-full object-contain" />
            </div>
            <div>
              <strong className="text-forest font-bold block text-[11px] leading-tight">Memoria silvestre</strong>
              <span className="text-muted text-[9px]">Intentos: {attempts}</span>
            </div>
          </div>
          <strong className="text-forest font-bold text-xs bg-white px-2.5 py-1 rounded-xl shadow-2xs">
            Parejas: {matchedIndices.length / 2} / 4
          </strong>
        </div>

        {/* 2x4 Memory Board */}
        <div className="grid grid-cols-2 gap-3 max-w-[270px] mx-auto w-full my-auto">
          {cards.map((type, idx) => {
            const isFlipped = flippedIndices.includes(idx) || matchedIndices.includes(idx);
            const isMatched = matchedIndices.includes(idx);
            const Icon = icons[type];

            return (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleCardClick(idx)}
                className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 shadow-md ${
                  isFlipped
                    ? 'bg-mint text-forest border-2 border-moss/40'
                    : 'bg-forest text-mint/80 hover:bg-forest-light'
                }`}
                aria-label={`Carta ${idx + 1}`}
              >
                {isFlipped ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <Icon className="w-8 h-8 stroke-[2.2]" />
                    <span className="text-[10px] font-bold mt-1">
                      {labels[type]}
                    </span>
                  </motion.div>
                ) : (
                  <div className="w-10 h-10 rounded-xl overflow-hidden opacity-90 transition-transform">
                    <img src="/icons/memory.png" alt="Dorso de carta" className="w-full h-full object-contain" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Bottom Banner */}
        {matchedIndices.length === cards.length ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sun text-forest rounded-2xl p-3 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 fill-current" />
              <strong className="text-xs font-bold font-serif">
                ¡Completaste el desafío!
              </strong>
            </div>
            <button
              onClick={() => navigate('games')}
              className="px-3 py-1.5 rounded-xl bg-forest text-white text-[10px] font-bold shadow-sm active:scale-95 transition"
            >
              Volver a juegos
            </button>
          </motion.div>
        ) : (
          <p className="text-center text-xs text-muted mb-2 font-medium">
            Tocá dos cartas para encontrar la pareja.
          </p>
        )}
      </div>
    </section>
  );
};
