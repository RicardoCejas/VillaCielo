import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IMAGES } from '../../data/speciesData';
import { TopBar } from '../layout/TopBar';
import { RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';
import { playClick, playSuccess, playCelebration } from '../../utils/audio';
import { motion } from 'framer-motion';

export const PuzzleScreen = () => {
  const { navigate, addPoints, triggerCelebration, unlockSpecies } = useApp();
  // Target solved state is [1, 2, 3, 4, 5, 6, 7, 8, 0]
  // Solvable initial state
  const [board, setBoard] = useState([1, 2, 3, 4, 5, 6, 7, 0, 8]);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const checkSolved = (currentBoard) => {
    const target = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    return currentBoard.every((val, idx) => val === target[idx]);
  };

  const handleTileClick = (clickedIdx) => {
    if (isSolved) return;
    const emptyIdx = board.indexOf(0);

    playClick();
    const newBoard = [...board];
    [newBoard[emptyIdx], newBoard[clickedIdx]] = [newBoard[clickedIdx], newBoard[emptyIdx]];

    setBoard(newBoard);
    setMoves(m => m + 1);

    if (checkSolved(newBoard)) {
      setIsSolved(true);
      triggerCelebration();
      addPoints(150, '¡Puzzle del paisaje completado!');
      unlockSpecies('tala-serrano', 'puzzle');
      unlockSpecies('quebracho-blanco', 'puzzle');
    }
  };

  const handleReset = () => {
    playClick();
    setBoard([1, 2, 3, 4, 5, 6, 7, 0, 8]);
    setMoves(0);
    setIsSolved(false);
  };

  return (
    <section className="relative w-full h-full bg-paper flex flex-col justify-between overflow-hidden">
      {/* TopBar with styled back button */}
      <TopBar
        title="Puzzle del paisaje"
        onBack={() => navigate('games')}
        backLabel="Volver"
      />

      <div className="flex-1 flex flex-col justify-between px-5 py-3 overflow-y-auto">
        {/* Topline Info with Puzzle Icon */}
        <div className="flex items-center justify-between text-xs bg-cream p-2 rounded-2xl border border-line">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-2xs shrink-0">
              <img src="/icons/puzzle.png" alt="Puzzle" className="w-full h-full object-contain" />
            </div>
            <div>
              <strong className="text-forest font-bold block text-[11px] leading-tight">Sendero del Tala</strong>
              <span className="text-muted text-[9px]">Nivel fácil · 3 × 3</span>
            </div>
          </div>
          <strong className="text-forest font-bold text-xs bg-white px-2.5 py-1 rounded-xl shadow-2xs">{moves} movs</strong>
        </div>

        {/* Puzzle Board */}
        <div className="relative aspect-square w-full max-w-[270px] mx-auto bg-mint/50 p-1.5 rounded-3xl border-4 border-white shadow-xl grid grid-cols-3 gap-1">
          {board.map((tile, idx) => {
            if (tile === 0) {
              return (
                <div
                  key="empty"
                  className="rounded-xl bg-repeat puzzle-empty"
                />
              );
            }

            return (
              <motion.button
                key={tile}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTileClick(idx)}
                className={`puzzle-piece p-${tile} shadow-sm border border-black/10`}
                aria-label={`Mover pieza ${tile}`}
              />
            );
          })}

          {/* Solved Overlay */}
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-forest/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-4 text-center text-white"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl mb-2">
                <img src="/icons/puzzle.png" alt="Puzzle completado" className="w-full h-full object-contain" />
              </div>
              <strong className="font-serif text-xl font-bold">
                ¡Paisaje Reconstruido!
              </strong>
              <p className="text-xs text-mint mt-1">
                Resuelto en {moves} movimientos.
              </p>
            </motion.div>
          )}
        </div>

        {/* Target Image Preview */}
        <div className="bg-cream rounded-2xl p-2.5 flex items-center gap-3 border border-line">
          <img
            src={IMAGES.trail}
            alt="Referencia del paisaje"
            className="w-12 h-10 object-cover rounded-xl shadow-sm border border-white"
          />
          <div className="flex flex-col">
            <small className="text-muted text-[8px] font-bold uppercase tracking-wider">
              Imagen Objetivo
            </small>
            <strong className="text-xs font-bold text-forest">
              Sendero del Tala
            </strong>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleReset}
          className="w-full h-11 rounded-2xl border border-forest text-forest hover:bg-forest hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>REINICIAR PUZZLE</span>
        </button>
      </div>
    </section>
  );
};
