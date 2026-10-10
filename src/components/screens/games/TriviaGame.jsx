import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { KIDS_TRIVIA_QUESTIONS, ADULT_TRIVIA_QUESTIONS } from '../../../data/quizData';
import { TopBar } from '../../layout/TopBar';
import { Leaf, Check, X, ChevronRight, RotateCcw, Trophy, Clock, Zap, User } from 'lucide-react';
import { playSuccess, playError, playPop } from '../../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const TriviaGame = () => {
  const { navigate, addPoints, triggerCelebration, unlockSpecies, profile, theme } = useApp();
  
  // Choose question bank based on profile or toggle
  const [triviaMode, setTriviaMode] = useState(() => {
    return profile === 'Niños' ? 'kids' : 'adults';
  });

  const questions = triviaMode === 'kids' ? KIDS_TRIVIA_QUESTIONS : ADULT_TRIVIA_QUESTIONS;

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
  }, [currentIndex, selectedOption, quizFinished, triviaMode]);

  const handleSelectOption = (idx) => {
    if (selectedOption !== null || quizFinished) return;
    clearInterval(timerRef.current);
    setSelectedOption(idx);

    if (idx === currentQ.answer) {
      playSuccess();
      const speedBonus = timeLeft * 5;
      const earned = currentQ.points + speedBonus;
      setScore(s => s + earned);
      addPoints(earned, '¡Respuesta correcta en Trivia!');
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
      triggerCelebration();
      unlockSpecies('piquillin', 'trivia');
      unlockSpecies('halconcito-colorado', 'trivia');
    }
  };

  const handleRestart = (newMode = triviaMode) => {
    playPop();
    setTriviaMode(newMode);
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

      {/* Mode Switcher: Niños vs Adultos */}
      <div className="px-4 pt-1 pb-1">
        <div className="flex bg-black/10 dark:bg-white/10 p-0.5 rounded-xl text-[10px] font-bold">
          <button
            onClick={() => handleRestart('kids')}
            className={`flex-1 py-1 rounded-lg transition flex items-center justify-center gap-1 ${
              triviaMode === 'kids'
                ? 'bg-forest text-white shadow-xs'
                : 'text-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <span>🧒 Modo Niños</span>
          </button>
          <button
            onClick={() => handleRestart('adults')}
            className={`flex-1 py-1 rounded-lg transition flex items-center justify-center gap-1 ${
              triviaMode === 'adults'
                ? 'bg-forest text-white shadow-xs'
                : 'text-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <span>🌿 Modo Adultos</span>
          </button>
        </div>
      </div>

      {quizFinished ? (
        /* Finished Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg mx-auto">
            <img src="/icons/trivia.png" alt="Trivia natural" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-forest-light text-[10px] font-bold uppercase tracking-wider block">
              ¡Trivia Completada!
            </span>
            <h2 className="font-serif text-2xl font-bold mt-1">
              {score} Puntos Obtenidos
            </h2>
            <p className="text-muted text-xs mt-1 max-w-xs mx-auto">
              Demostraste tus conocimientos sobre el ecosistema serrano de Villa Cielo.
            </p>
          </div>

          <div className="flex gap-2 w-full max-w-xs">
            <button
              onClick={() => handleRestart()}
              className="flex-1 py-2.5 rounded-xl bg-cream dark:bg-[#153427] border border-line dark:border-[#275b47] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jugar de Nuevo</span>
            </button>
            <button
              onClick={() => navigate('games')}
              className="flex-1 py-2.5 rounded-xl bg-forest text-white text-xs font-bold active:scale-95 transition shadow-md"
            >
              Ver Más Juegos
            </button>
          </div>
        </motion.div>
      ) : (
        /* Active Quiz Screen */
        <div className="flex-1 flex flex-col justify-between px-4 py-2 overflow-y-auto">
          {/* Status Header */}
          <div className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs ${
            theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-cream border-line'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-forest-light">
                Pregunta {currentIndex + 1} de {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-forest">
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
                <span>{currentIndex + 1 < questions.length ? 'Siguiente Pregunta' : 'Ver Resultado'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
};
