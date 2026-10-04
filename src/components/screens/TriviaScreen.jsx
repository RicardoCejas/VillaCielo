import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TRIVIA_QUESTIONS } from '../../data/quizData';
import { TopBar } from '../layout/TopBar';
import { Leaf, Check, X, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { playSuccess, playError, playPop } from '../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const TriviaScreen = () => {
  const { navigate, addPoints, triggerCelebration } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = TRIVIA_QUESTIONS;
  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    if (idx === currentQ.answer) {
      playSuccess();
      setScore(prev => prev + currentQ.points);
      addPoints(currentQ.points, '¡Respuesta correcta en Trivia!');
    } else {
      playError();
    }
  };

  const handleNext = () => {
    playPop();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      triggerCelebration();
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
      {/* TopBar */}
      <TopBar
        title="Trivia natural"
        onBack={() => navigate('games')}
      />

      {quizFinished ? (
        /* Finished Celebration View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-sun text-forest grid place-items-center shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>
          <div>
            <span className="text-forest text-[10px] font-bold uppercase tracking-wider block">
              ¡Trivia Completada!
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink mt-1">
              +{score} Puntos
            </h2>
            <p className="text-muted text-xs mt-1 max-w-xs">
              Demostraste un gran conocimiento sobre la flora y fauna de Villa Cielo Abierto.
            </p>
          </div>

          <div className="w-full space-y-2 pt-4">
            <button
              onClick={handleRestart}
              className="w-full h-11 rounded-2xl bg-forest text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar de nuevo</span>
            </button>
            <button
              onClick={() => navigate('games')}
              className="w-full h-11 rounded-2xl bg-cream border border-line text-forest font-bold text-xs hover:bg-cream-dark active:scale-95 transition"
            >
              Volver al menú de juegos
            </button>
          </div>
        </motion.div>
      ) : (
        /* Quiz Question View */
        <div className="flex-1 flex flex-col justify-between px-5 py-3 overflow-y-auto">
          {/* Top Line Meta & Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted font-medium mb-1.5">
              <span>Pregunta {currentIndex + 1} de {questions.length}</span>
              <strong className="text-forest font-bold">{score} pts</strong>
            </div>
            <div className="w-full h-2 bg-[#e9ece8] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-coral rounded-full"
                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Visual Badge */}
          <motion.div
            key={currentQ.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-3xl bg-mint text-forest flex flex-col items-center justify-center gap-1.5 mx-auto my-3 -rotate-3 shadow-md border border-moss/20"
          >
            <Leaf className="w-9 h-9 stroke-[2.2]" />
            <span className="text-[7px] font-extrabold tracking-wider text-forest/80 uppercase">
              Desafío Natural
            </span>
          </motion.div>

          {/* Question Text */}
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-center text-ink leading-snug px-2 min-h-[50px]">
            {currentQ.q}
          </h2>

          {/* Options */}
          <div className="grid gap-2.5 my-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.answer;
              let btnClass = 'bg-cream text-ink border-line hover:border-moss/40';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnClass = 'bg-[#dff4e8] text-[#245f45] border-[#4e9977] font-bold shadow-sm';
                } else if (isSelected) {
                  btnClass = 'bg-[#fbe0d9] text-[#884231] border-[#d5735d]';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3 rounded-2xl border grid grid-cols-[32px_1fr_24px] items-center gap-2.5 transition-all text-xs font-semibold ${btnClass}`}
                >
                  <span className="w-7 h-7 rounded-xl bg-white text-forest font-bold text-xs grid place-items-center shadow-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                  {selectedOption !== null && isCorrect && (
                    <Check className="w-5 h-5 text-[#245f45] stroke-[3]" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <X className="w-5 h-5 text-[#884231] stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream p-3 rounded-xl border border-line text-[11px] text-muted leading-tight mb-2"
            >
              💡 <strong className="text-forest">Dato clave:</strong> {currentQ.explanation}
            </motion.div>
          )}

          {/* Next Button */}
          <div className="pt-2">
            {selectedOption !== null ? (
              <button
                onClick={handleNext}
                className="w-full h-12 rounded-2xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-forest/20 active:scale-95 transition"
              >
                <span>
                  {currentIndex + 1 < questions.length ? 'Siguiente Pregunta' : 'Ver Resultados'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="h-12" />
            )}
          </div>
        </div>
      )}
    </section>
  );
};
