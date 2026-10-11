import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { KIDS_TRIVIA_LEVELS, ADULT_TRIVIA_LEVELS } from '../../../data/quizData';
import { TopBar } from '../../layout/TopBar';
import { Check, X, ChevronRight, RotateCcw, Clock, Lock, Star, Sparkles } from 'lucide-react';
import { playSuccess, playError, playPop } from '../../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const TriviaGame = () => {
  const { 
    navigate, 
    completeGameLevel, 
    gameLevels, 
    unlockSpecies, 
    profile, 
    theme 
  } = useApp();
  
  const [triviaMode, setTriviaMode] = useState(() => {
    return profile === 'Niños' ? 'kids' : 'adults';
  });

  const levelSets = triviaMode === 'kids' ? KIDS_TRIVIA_LEVELS : ADULT_TRIVIA_LEVELS;
  const maxUnlockedLevel = gameLevels?.trivia || 1;

  const [currentLevelNum, setCurrentLevelNum] = useState(1);
  const activeLevelData = levelSets.find(l => l.level === currentLevelNum) || levelSets[0];
  const questions = activeLevelData.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizFinished, setQuizFinished] = useState(false);
  const timerRef = useRef(null);

  const currentQ = questions[currentIndex] || questions[0];

  // Timer logic
  useEffect(() => {
    if (selectedOption === null && !quizFinished) {
      const initialTime = currentQ.timeLimit || 15;
      setTimeLeft(initialTime);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            playError();
            setSelectedOption(-1); // timed out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [currentIndex, selectedOption, quizFinished, currentLevelNum, triviaMode]);

  const handleSelectOption = (idx) => {
    if (selectedOption !== null || quizFinished) return;
    clearInterval(timerRef.current);
    setSelectedOption(idx);

    if (idx === currentQ.answer) {
      playSuccess();
      const speedBonus = timeLeft * 4;
      const earned = currentQ.points + speedBonus;
      setScore(s => s + earned);
    } else {
      playError();
    }
  };

  const handleNext = () => {
    playPop();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      completeGameLevel('trivia', currentLevelNum, score > 0 ? score : 80);
      unlockSpecies(currentLevelNum === 1 ? 'piquillin' : 'halconcito-colorado', 'trivia');
    }
  };

  const handleSelectLevel = (lvlNum) => {
    if (lvlNum > maxUnlockedLevel) return;
    playPop();
    setCurrentLevelNum(lvlNum);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  const handleRestart = () => {
    playPop();
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-paper text-ink'
    }`}>
      {/* TopBar with visible styled '← Volver' */}
      <TopBar
        title="Trivia natural"
        onBack={() => navigate('games')}
        backLabel="Volver"
      />

      {/* Level Selection Bar (Progressive 1, 2, 3) */}
      <div className="px-4 pt-1 pb-1">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted">
            Progreso por Niveles:
          </span>
          <div className="flex bg-black/10 dark:bg-white/10 p-0.5 rounded-lg text-[9px] font-bold">
            <button
              onClick={() => {
                setTriviaMode('kids');
                setCurrentIndex(0);
                setSelectedOption(null);
                setQuizFinished(false);
              }}
              className={`px-2 py-0.5 rounded transition ${triviaMode === 'kids' ? 'bg-forest text-white' : 'text-muted'}`}
            >
              🧒 Niños
            </button>
            <button
              onClick={() => {
                setTriviaMode('adults');
                setCurrentIndex(0);
                setSelectedOption(null);
                setQuizFinished(false);
              }}
              className={`px-2 py-0.5 rounded transition ${triviaMode === 'adults' ? 'bg-forest text-white' : 'text-muted'}`}
            >
              🌿 Adultos
            </button>
          </div>
        </div>

        {/* 3 Level Pills */}
        <div className="grid grid-cols-3 gap-1.5">
          {levelSets.map(lvl => {
            const isUnlocked = lvl.level <= maxUnlockedLevel;
            const isActive = lvl.level === currentLevelNum;

            return (
              <button
                key={lvl.level}
                disabled={!isUnlocked}
                onClick={() => handleSelectLevel(lvl.level)}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition flex items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-forest text-white border-forest shadow-xs'
                    : isUnlocked
                    ? 'bg-black/5 dark:bg-white/5 border-line dark:border-[#204535] text-ink dark:text-white'
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

      {quizFinished ? (
        /* Finished Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 my-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-forest text-sun grid place-items-center shadow-lg mx-auto">
            <Star className="w-7 h-7 fill-sun" />
          </div>
          <div>
            <span className="text-forest-light text-[10px] font-bold uppercase tracking-wider block">
              ¡Nivel {currentLevelNum} Superado!
            </span>
            <h2 className="font-serif text-2xl font-bold mt-0.5">
              +{score} Puntos y EXP
            </h2>
            <p className="text-muted text-xs mt-1 max-w-xs mx-auto">
              {currentLevelNum < 3
                ? `¡Desbloqueaste el Nivel ${currentLevelNum + 1} de la Trivia Serrana!`
                : '¡Has dominado todos los niveles de la Trivia de Villa Cielo!'}
            </p>
          </div>

          <div className="flex gap-2 w-full max-w-xs pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-2.5 rounded-xl border border-line dark:border-[#275b47] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir</span>
            </button>
            {currentLevelNum < 3 ? (
              <button
                onClick={() => handleSelectLevel(currentLevelNum + 1)}
                className="flex-1 py-2.5 rounded-xl bg-forest text-white text-xs font-bold active:scale-95 transition shadow-md flex items-center justify-center gap-1"
              >
                <span>Nivel {currentLevelNum + 1}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('games')}
                className="flex-1 py-2.5 rounded-xl bg-forest text-white text-xs font-bold active:scale-95 transition shadow-md"
              >
                Menú Juegos
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        /* Active Quiz Screen */
        <div className="flex-1 flex flex-col justify-between px-4 py-2 overflow-y-auto">
          {/* Status Header */}
          <div className={`flex items-center justify-between p-2 rounded-2xl border text-xs ${
            theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-cream border-line'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-forest-light">
                {activeLevelData.title}
              </span>
              <span className="text-[10px] text-muted">
                ({currentIndex + 1}/{questions.length})
              </span>
            </div>
            <div className="flex items-center gap-1 font-bold text-forest">
              <Clock className="w-3.5 h-3.5 text-forest" />
              <span className={timeLeft <= 5 ? 'text-rose-600 animate-pulse font-extrabold' : ''}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="my-auto py-3">
            <h3 className="font-serif text-base sm:text-lg font-bold leading-snug">
              {currentQ.q}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2 mb-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.answer;
              const hasAnswered = selectedOption !== null;

              let btnStyle = theme === 'dark'
                ? 'bg-[#122b22] border-[#204a39] text-[#e8f2ec] hover:bg-[#183a2e]'
                : 'bg-white border-line text-ink hover:bg-cream';

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
                } else {
                  btnStyle = 'opacity-40 border-transparent';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs font-medium transition active:scale-[0.99] flex items-center justify-between shadow-2xs ${btnStyle}`}
                >
                  <span className="pr-2 leading-snug">{opt}</span>
                  {hasAnswered && isCorrect && <Check className="w-4 h-4 shrink-0 stroke-[3]" />}
                  {hasAnswered && isSelected && !isCorrect && <X className="w-4 h-4 shrink-0 stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-2xl border text-xs mb-1 ${
                selectedOption === currentQ.answer
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300'
              }`}
            >
              <p className="text-[11px] leading-snug mb-2 font-medium">
                {currentQ.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-2 rounded-xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition active:scale-95"
              >
                <span>{currentIndex + 1 < questions.length ? 'Siguiente Pregunta' : 'Completar Nivel'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
};
