import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { IMAGES } from '../../data/speciesData';
import { RotateCcw, Trophy, Check, Lock, Star, ChevronRight } from 'lucide-react';
import { playCardFlip, playSuccess } from '../../utils/audio';
import { motion } from 'framer-motion';

export const MemoryScreen = () => {
  const { 
    navigate, 
    completeGameLevel, 
    gameLevels, 
    unlockSpecies, 
    theme 
  } = useApp();

  const maxUnlockedLevel = gameLevels?.memory || 1;
  const [currentLevel, setCurrentLevel] = useState(1);

  // Progressive sets of cards per level
  const levelConfigs = [
    {
      level: 1,
      title: 'Nivel 1: Primeras Huellas',
      pairs: [
        { id: 'zorro', name: 'Zorro Gris', img: IMAGES.zorro },
        { id: 'hornero', name: 'Hornero', img: IMAGES.hornero },
        { id: 'peperina', name: 'Peperina', img: IMAGES.peperina },
      ]
    },
    {
      level: 2,
      title: 'Nivel 2: Monte Silvestre',
      pairs: [
        { id: 'zorro', name: 'Zorro Gris', img: IMAGES.zorro },
        { id: 'corzuela', name: 'Corzuela Parda', img: IMAGES.corzuela },
        { id: 'espinillo', name: 'Espinillo', img: IMAGES.espinillo },
        { id: 'picaflor', name: 'Picaflor', img: IMAGES.picaflor },
      ]
    },
    {
      level: 3,
      title: 'Nivel 3: Maestría Serrano',
      pairs: [
        { id: 'zorro', name: 'Zorro Gris', img: IMAGES.zorro },
        { id: 'corzuela', name: 'Corzuela Parda', img: IMAGES.corzuela },
        { id: 'puma', name: 'Puma', img: IMAGES.puma },
        { id: 'jote', name: 'Jote Negro', img: IMAGES.jote },
        { id: 'algarrobo', name: 'Algarrobo', img: IMAGES.algarroboBlanco },
        { id: 'molle', name: 'Molle de Beber', img: IMAGES.molle },
      ]
    }
  ];

  const activeLevelConfig = levelConfigs.find(l => l.level === currentLevel) || levelConfigs[0];
  const targetPairsCount = activeLevelConfig.pairs.length;

  const generateShuffledCards = (baseSet) => {
    const doubled = [...baseSet, ...baseSet].map((item, index) => ({
      ...item,
      uniqueKey: `${item.id}-${index}`
    }));
    return doubled.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(() => generateShuffledCards(activeLevelConfig.pairs));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const handleCardClick = (idx) => {
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(idx) ||
      matchedIds.includes(cards[idx].id) ||
      levelCompleted
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
            setLevelCompleted(true);
            const rewardExp = currentLevel * 60;
            completeGameLevel('memory', currentLevel, rewardExp);
            unlockSpecies('calandria-grande', 'memory');
          }
        }, 350);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 700);
      }
    }
  };

  const handleSelectLevel = (lvlNum) => {
    if (lvlNum > maxUnlockedLevel) return;
    setCurrentLevel(lvlNum);
    const newConfig = levelConfigs.find(l => l.level === lvlNum) || levelConfigs[0];
    setCards(generateShuffledCards(newConfig.pairs));
    setFlippedIndices([]);
    setMatchedIds([]);
    setAttempts(0);
    setLevelCompleted(false);
  };

  const handleRestart = () => {
    handleSelectLevel(currentLevel);
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
        {/* Progressive Level Selector */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted">
              Nivel de Dificultad:
            </span>
            <button
              onClick={handleRestart}
              className="p-1 rounded-lg border border-line dark:border-[#204535] text-muted hover:text-ink transition"
              title="Reiniciar nivel"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {levelConfigs.map(lvl => {
              const isUnlocked = lvl.level <= maxUnlockedLevel;
              const isActive = lvl.level === currentLevel;

              return (
                <button
                  key={lvl.level}
                  disabled={!isUnlocked}
                  onClick={() => handleSelectLevel(lvl.level)}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition flex items-center justify-center gap-1 ${
                    isActive
                      ? 'bg-forest text-white border-forest shadow-xs'
                      : isUnlocked
                      ? 'bg-black/5 dark:bg-white/5 border-line dark:border-[#204535]'
                      : 'bg-black/5 dark:bg-white/5 border-line/40 text-muted/50 cursor-not-allowed'
                  }`}
                >
                  {!isUnlocked && <Lock className="w-2.5 h-2.5" />}
                  <span>Nivel {lvl.level}</span>
                  {isUnlocked && lvl.level < maxUnlockedLevel && <Star className="w-2.5 h-2.5 text-sun fill-sun" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Row */}
        <div className={`flex items-center justify-between p-2 rounded-2xl border text-[11px] mb-2 ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1f4535]' : 'bg-cream border-line'
        }`}>
          <div className="flex items-center gap-1">
            <span className="font-bold text-forest-light">{activeLevelConfig.title}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span>Intentos: <strong>{attempts}</strong></span>
            <span className="font-bold text-forest">
              {matchedIds.length} / {targetPairsCount}
            </span>
          </div>
        </div>

        {/* Memory Grid */}
        <div className={`grid gap-2 max-w-[320px] mx-auto w-full my-auto ${
          targetPairsCount <= 3 ? 'grid-cols-2 max-w-[210px]' : targetPairsCount === 4 ? 'grid-cols-2 max-w-[260px]' : 'grid-cols-3'
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
                  targetPairsCount <= 3 ? 'h-24' : targetPairsCount === 4 ? 'h-22' : 'h-18'
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
                  <div className="w-full h-full flex flex-col items-center justify-center p-1">
                    <img
                      src={card.img}
                      alt={card.name}
                      className="w-9 h-9 rounded-xl object-cover shadow-2xs mb-0.5"
                    />
                    <span className="text-[9px] font-bold truncate max-w-full leading-tight">
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

        {/* Level Completion Banner */}
        {levelCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 mt-2 text-center"
          >
            <div className="flex items-center justify-center gap-1 text-sun mb-1">
              <Star className="w-4 h-4 fill-sun" />
              <Star className="w-4 h-4 fill-sun" />
              <Star className="w-4 h-4 fill-sun" />
            </div>
            <strong className="text-xs font-bold block">
              ¡Nivel {currentLevel} Completado en {attempts} intentos!
            </strong>
            <div className="flex gap-2 mt-2 max-w-xs mx-auto">
              <button
                onClick={handleRestart}
                className="flex-1 py-1.5 rounded-xl border border-emerald-500/40 text-[11px] font-bold"
              >
                Repetir
              </button>
              {currentLevel < 3 ? (
                <button
                  onClick={() => handleSelectLevel(currentLevel + 1)}
                  className="flex-1 py-1.5 rounded-xl bg-forest text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Nivel {currentLevel + 1}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('games')}
                  className="flex-1 py-1.5 rounded-xl bg-forest text-white text-[11px] font-bold shadow-xs"
                >
                  Más Juegos
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
