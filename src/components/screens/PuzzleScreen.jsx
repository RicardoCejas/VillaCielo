import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IMAGES } from '../../data/speciesData';
import { TopBar } from '../layout/TopBar';
import { RotateCcw, Trophy, CheckCircle2, Lock, Star, ChevronRight } from 'lucide-react';
import { playClick, playSuccess } from '../../utils/audio';
import { motion } from 'framer-motion';

export const PuzzleScreen = () => {
  const { 
    navigate, 
    completeGameLevel, 
    gameLevels, 
    unlockSpecies, 
    theme 
  } = useApp();

  const maxUnlockedLevel = gameLevels?.puzzle || 1;
  const [currentLevel, setCurrentLevel] = useState(1);

  // Initial solvable boards per level
  const levelConfigs = [
    {
      level: 1,
      title: 'Nivel 1: Mirador del Tala (Iniciación)',
      initialBoard: [1, 2, 3, 4, 5, 6, 7, 0, 8], // 1 step from [1,2,3,4,5,6,7,8,0]
      image: IMAGES.trail
    },
    {
      level: 2,
      title: 'Nivel 2: Balcones del Uritorco (Intermedio)',
      initialBoard: [1, 2, 3, 4, 0, 5, 7, 8, 6],
      image: IMAGES.uritorco
    },
    {
      level: 3,
      title: 'Nivel 3: Cumbre de las Sierras (Desafío)',
      initialBoard: [1, 0, 2, 4, 5, 3, 7, 8, 6],
      image: IMAGES.trail
    }
  ];

  const activeLevelConfig = levelConfigs.find(l => l.level === currentLevel) || levelConfigs[0];

  const [board, setBoard] = useState(activeLevelConfig.initialBoard);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const checkSolved = (currentBoard) => {
    const target = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    return currentBoard.every((val, idx) => val === target[idx]);
  };

  const handleTileClick = (clickedIdx) => {
    if (isSolved) return;
    const emptyIdx = board.indexOf(0);

    // Can only move if adjacent (row distance + col distance === 1)
    const emptyRow = Math.floor(emptyIdx / 3);
    const emptyCol = emptyIdx % 3;
    const clickedRow = Math.floor(clickedIdx / 3);
    const clickedCol = clickedIdx % 3;
    const isAdjacent = Math.abs(emptyRow - clickedRow) + Math.abs(emptyCol - clickedCol) === 1;

    if (!isAdjacent) return;

    playClick();
    const newBoard = [...board];
    [newBoard[emptyIdx], newBoard[clickedIdx]] = [newBoard[clickedIdx], newBoard[emptyIdx]];

    setBoard(newBoard);
    setMoves(m => m + 1);

    if (checkSolved(newBoard)) {
      setIsSolved(true);
      completeGameLevel('puzzle', currentLevel, currentLevel * 75);
      unlockSpecies('tala-serrano', 'puzzle');
    }
  };

  const handleSelectLevel = (lvlNum) => {
    if (lvlNum > maxUnlockedLevel) return;
    setCurrentLevel(lvlNum);
    const cfg = levelConfigs.find(l => l.level === lvlNum) || levelConfigs[0];
    setBoard(cfg.initialBoard);
    setMoves(0);
    setIsSolved(false);
  };

  const handleReset = () => {
    playClick();
    setBoard(activeLevelConfig.initialBoard);
    setMoves(0);
    setIsSolved(false);
  };

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-paper text-ink'
    }`}>
      {/* TopBar with styled back button */}
      <TopBar
        title="Puzzle del paisaje"
        onBack={() => navigate('games')}
        backLabel="Volver"
      />

      <div className="flex-1 flex flex-col justify-between px-4 py-2 overflow-y-auto">
        {/* Progressive Level Selector */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted">
              Nivel Progresivo:
            </span>
            <button
              onClick={handleReset}
              className="p-1 rounded-lg border border-line dark:border-[#204535] text-muted hover:text-ink transition"
              title="Reiniciar tablero"
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

        {/* Topline Info */}
        <div className={`flex items-center justify-between p-2 rounded-2xl border text-[11px] mb-2 ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1f4535]' : 'bg-cream border-line'
        }`}>
          <span className="font-bold text-forest-light">{activeLevelConfig.title}</span>
          <span className="text-muted">Movimientos: <strong className="text-forest">{moves}</strong></span>
        </div>

        {/* 3x3 Puzzle Canvas */}
        <div className="relative aspect-square w-full max-w-[270px] mx-auto bg-stone-200 dark:bg-stone-900 rounded-2xl p-2 shadow-inner border border-line dark:border-[#1e4536] my-auto">
          <div className="puzzle-grid w-full h-full">
            {board.map((tile, idx) => {
              if (tile === 0) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="puzzle-empty border-2 border-dashed border-forest/20 rounded-xl"
                  />
                );
              }

              return (
                <motion.button
                  key={`tile-${tile}`}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleTileClick(idx)}
                  className={`puzzle-piece p-${tile} relative rounded-xl shadow-xs overflow-hidden border border-white/40 flex items-center justify-center font-bold text-white text-xs drop-shadow`}
                >
                  <span className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.2 rounded text-[8px]">
                    {tile}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Level Solved Banner */}
        {isSolved && (
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
              ¡Paisaje de Nivel {currentLevel} Completado en {moves} movimientos!
            </strong>
            <div className="flex gap-2 mt-2 max-w-xs mx-auto">
              <button
                onClick={handleReset}
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
