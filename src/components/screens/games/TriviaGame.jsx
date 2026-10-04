import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { SERRANA_TRIVIA_QUESTIONS } from '../../../data/quizData';
import { TopBar } from '../../layout/TopBar';
import { Leaf, Check, X, ChevronRight, RotateCcw, Trophy, Clock, Zap } from 'lucide-react';
import { playSuccess, playError, playPop, playCelebration } from '../../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const TriviaGame = () => {
  const { navigate, addPoints, triggerCelebration, unlockSpecies } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizFinished, setQuizFinished] = useState(false);
  const timerRef = useRef(null);

  const questions = SERRANA_TRIVIA_QUESTIONS;
  const currentQ = questions[currentIndex];

  // Timer logic
  useEffect(() => {
    if (selectedOption === null && !quizFinished) {
      setTimeLeft(15);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Time out: mark as wrong
            playError();
            setSelectedOption(-1); // timed out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [currentIndex, selectedOption, quizFinished]);

  const handleSelectOption = (idx) => {
    if (selectedOption !== null || quizFinished) return;
    clearInterval(timerRef.current);
    setSelectedOption(idx);

    if (idx === currentQ.answer) {
      playSuccess();
      const speedBonus = timeLeft * 10;
      const earned = currentQ.points + speedBonus;
      setScore(s => s + earned);
      addPoints(earned, '¡Respuesta correcta en Trivia Serrana!');
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

  const handleRestart = () => {
    playPop();
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <section className="relative w-full h-full bg-paper flex flex-col justify-between overflow-hidden">
      {/* TopBar with visible styled '← Volver' */}
      <TopBar
        title="Trivia natural"
        onBack={() => navigate('games')}
        backLabel="Volver"
      />

      {quizFinished ? (
        /* Finished Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4"
        >
          <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl mx-auto">
            <img src="/icons/trivia.png" alt="Trivia natural" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-forest text-[10px] font-bold uppercase tracking-wider block">
              ¡Trivia Natural Completada!
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink mt-1">
              +{score} Puntos
            </h2>
            <p className="text-muted text-xs mt-1 max-w-xs leading-relaxed">
              Demostraste un conocimiento excepcional sobre la biodiversidad, geografía e historia de Villa Cielo y Capilla del Monte.
            </p>
          </div>

          <div className="w-full space-y-2 pt-4">
            <button
              onClick={() => navigate('games')}
              className="w-full h-11 rounded-2xl bg-forest text-white font-bold text-xs shadow-md active:scale-95 transition"
            >
              Volver a juegos
            </button>
            <button
              onClick={handleRestart}
              className="w-full h-11 rounded-2xl bg-cream border border-line text-forest font-bold text-xs hover:bg-cream-dark transition"
            >
              Jugar de nuevo
            </button>
          </div>
        </motion.div>
      ) : (
        /* Question View */
        <div className="flex-1 flex flex-col justify-between px-5 py-3 overflow-y-auto">
          {/* Header Progress & Countdown Timer */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted font-medium mb-1">
              <span>Pregunta {currentIndex + 1} de {questions.length}</span>

              {/* Countdown badge with warning colors */}
              <div className={`flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-full ${
                timeLeft <= 5 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-mint text-forest'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>

              <strong className="text-forest font-bold">{score} pts</strong>
            </div>

            {/* Time progress bar */}
            <div className="w-full h-1.5 bg-[#e9ece8] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 5 ? 'bg-rose-500' : 'bg-coral'
                }`}
                style={{ width: `${(timeLeft / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text with Trivia Icon */}
          <div className="my-auto py-1 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xs mb-1">
              <img src="/icons/trivia.png" alt="Trivia natural" className="w-full h-full object-contain" />
            </div>
            <span className="text-[8px] font-bold text-forest-light uppercase tracking-wider block text-center mb-0.5">
              Trivia Natural · Capilla del Monte
            </span>
            <h2 className="font-serif text-base sm:text-lg font-bold text-center text-ink leading-snug px-1">
              {currentQ.q}
            </h2>
          </div>

          {/* Options */}
          <div className="grid gap-2 my-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.answer;
              let btnClass = 'bg-cream text-ink border-line hover:border-moss/40';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 text-emerald-900 border-emerald-500 font-bold shadow-xs';
                } else if (isSelected) {
                  btnClass = 'bg-rose-50 text-rose-900 border-rose-400';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3 rounded-2xl border grid grid-cols-[30px_1fr_24px] items-center gap-2.5 transition-all text-xs font-semibold ${btnClass}`}
                >
                  <span className="w-6 h-6 rounded-xl bg-white text-forest font-bold text-xs grid place-items-center shadow-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <X className="w-4 h-4 text-rose-600 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Immediate Educational Explanation */}
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream p-3 rounded-2xl border border-line text-[11px] text-muted leading-tight mb-2"
            >
              💡 <strong className="text-forest">Dato ecológico:</strong> {currentQ.explanation}
            </motion.div>
          )}

          {/* Next Button */}
          <div className="pt-1">
            {selectedOption !== null ? (
              <button
                onClick={handleNext}
                className="w-full h-11 rounded-2xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <span>
                  {currentIndex + 1 < questions.length ? 'Siguiente Pregunta' : 'Ver Puntuación Final'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="h-11" />
            )}
          </div>
        </div>
      )}
    </section>
  );
};
