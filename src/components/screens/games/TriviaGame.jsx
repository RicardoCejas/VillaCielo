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

  useEffect(() => {
    if (selectedOption === null && !quizFinished) {
      const initialTime = currentQ.timeLimit || 15;
      setTimeLeft(initialTime);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            playError();
            setSelectedOption(-1);
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

  const initialTimeLimit = currentQ.timeLimit || 15;
  const timeProgressPercent = Math.max(0, Math.min(100, (timeLeft / initialTimeLimit) * 100));

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-[#f7f5f0] text-ink'
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
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-black dark:text-white">
            Progreso por Niveles:
          </span>
          <div className="flex bg-black/10 dark:bg-white/10 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => {
                setTriviaMode('kids');
                setCurrentIndex(0);
                setSelectedOption(null);
                setQuizFinished(false);
              }}
              className={`px-2.5 py-0.5 rounded transition ${triviaMode === 'kids' ? 'bg-[#173b32] text-white shadow-xs' : 'text-black/75 dark:text-white/80'}`}
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
              className={`px-2.5 py-0.5 rounded transition ${triviaMode === 'adults' ? 'bg-[#173b32] text-white shadow-xs' : 'text-black/75 dark:text-white/80'}`}
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
                className={`py-1.5 px-2 rounded-xl text-[10.5px] font-bold border transition flex items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-[#173b32] text-white border-[#173b32] shadow-xs'
                    : isUnlocked
                    ? 'bg-white dark:bg-[#132c22] border-[#b0c2b7] dark:border-[#224e3c] text-black dark:text-white shadow-2xs hover:bg-[#eef5f1]'
                    : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
          <div className="w-14 h-14 rounded-2xl bg-[#173b32] text-sun grid place-items-center shadow-lg mx-auto">
            <Star className="w-7 h-7 fill-sun" />
          </div>
          <div>
            <span className="text-black dark:text-mint text-[11px] font-bold uppercase tracking-wider block">
              ¡Nivel {currentLevelNum} Superado!
            </span>
            <h2 className="font-serif text-2xl font-bold mt-0.5 text-black dark:text-white">
              +{score} Puntos y EXP
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-xs mt-1 max-w-xs mx-auto font-medium">
              {currentLevelNum < 3
                ? `¡Desbloqueaste el Nivel ${currentLevelNum + 1} de la Trivia Serrana!`
                : '¡Has dominado todos los niveles de la Trivia de Villa Cielo!'}
            </p>
          </div>

          <div className="flex gap-2 w-full max-w-xs pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-[#275b47] bg-white dark:bg-[#132c22] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition shadow-2xs text-black dark:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir</span>
            </button>
            {currentLevelNum < 3 ? (
              <button
                onClick={() => handleSelectLevel(currentLevelNum + 1)}
                className="flex-1 py-2.5 rounded-xl bg-[#173b32] text-white text-xs font-bold active:scale-95 transition shadow-md flex items-center justify-center gap-1"
              >
                <span>Nivel {currentLevelNum + 1}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('games')}
                className="flex-1 py-2.5 rounded-xl bg-[#173b32] text-white text-xs font-bold active:scale-95 transition shadow-md"
              >
                Menú Juegos
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        /* Active Quiz Screen */
        <div className="flex-1 flex flex-col px-4 py-2 overflow-y-auto">
          {/* Header Card with Time Progress Bar */}
          <div className="p-3 rounded-2xl border shadow-sm bg-white dark:bg-[#11261e] border-[#b0c2b7] dark:border-[#1e4536]">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-black dark:text-white">
                  {activeLevelData.title}
                </span>
                <span className="text-[11px] font-bold text-black/70 dark:text-white/80">
                  ({currentIndex + 1}/{questions.length})
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-rose-600' : 'text-black dark:text-white'}`} />
                <span className={`text-xs tabular-nums font-bold ${timeLeft <= 5 ? 'text-rose-600 font-extrabold animate-pulse' : 'text-black dark:text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Continuous countdown timer line */}
            <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-all duration-300 ${
                  timeLeft <= 5
                    ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                    : timeLeft <= 9
                    ? 'bg-amber-500'
                    : 'bg-emerald-600 dark:bg-emerald-400'
                }`}
                animate={{ width: `${timeProgressPercent}%` }}
                transition={{ ease: 'linear', duration: 0.3 }}
              />
            </div>
          </div>

          {/* Centered Question Box with Species Photo Card */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-1 py-2 my-auto">
            {/* Species / Topic Photo Card */}
            {currentQ.image && (
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0, scale: 0.92, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-[260px] h-32 sm:h-36 rounded-2xl overflow-hidden border-2 border-forest/20 dark:border-mint/30 shadow-md mb-2.5 bg-black/5"
              >
                <img
                  src={currentQ.image}
                  alt="Especie de Villa Cielo"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                
                {currentQ.tag && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/65 backdrop-blur-md text-[9.5px] font-bold text-white tracking-wider border border-white/20">
                    🌿 {currentQ.tag}
                  </span>
                )}
              </motion.div>
            )}

            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#111111] dark:text-[#ffffff] mb-1.5 opacity-90">
              Pregunta {currentIndex + 1} de {questions.length}
            </span>

            <h3 className="font-serif text-[18px] sm:text-2xl font-bold leading-snug text-black dark:text-white max-w-sm px-1 drop-shadow-none">
              {currentQ.q}
            </h3>
          </div>

          {/* Options with High Contrast & Clear Readability */}
          <div className="space-y-2.5 mb-2 w-full max-w-md mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.answer;
              const hasAnswered = selectedOption !== null;

              let btnStyle = theme === 'dark'
                ? 'bg-[#152a22] border-[#295644] text-white hover:bg-[#1e3c31]'
                : 'bg-white border-[#b8c7bf] text-black hover:bg-[#edf5f0] shadow-sm';

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-700 text-white border-emerald-600 font-bold shadow-md';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-700 text-white border-rose-600 font-bold shadow-md';
                } else {
                  btnStyle = 'opacity-40 border-transparent bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border text-[14px] font-bold transition active:scale-[0.99] flex items-center justify-between shadow-xs ${btnStyle}`}
                >
                  <span className="pr-2 leading-snug text-inherit">{opt}</span>
                  {hasAnswered && isCorrect && <Check className="w-4 h-4 shrink-0 stroke-[3] text-white" />}
                  {hasAnswered && isSelected && !isCorrect && <X className="w-4 h-4 shrink-0 stroke-[3] text-white" />}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl border text-xs mb-1 w-full max-w-md mx-auto shadow-sm ${
                selectedOption === currentQ.answer
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 text-emerald-950 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200'
              }`}
            >
              <p className="text-[12px] leading-relaxed mb-2.5 font-medium">
                {currentQ.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition active:scale-95"
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
