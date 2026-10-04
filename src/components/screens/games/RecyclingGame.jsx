import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { TopBar } from '../../layout/TopBar';
import { Trash2, Recycle, Sparkles, Check, AlertTriangle, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { playSuccess, playError, playPop, playCelebration } from '../../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const RecyclingGame = () => {
  const { navigate, addPoints, triggerCelebration, unlockSpecies } = useApp();

  const wasteItems = [
    {
      id: 1,
      name: 'Botella de Plástico PET',
      category: 'plastic',
      icon: '🍾',
      fact: 'Tarda más de 450 años en degradarse en el monte serrano si no se recicla.'
    },
    {
      id: 2,
      name: 'Cáscara de Fruta',
      category: 'organic',
      icon: '🍌',
      fact: 'Es materia orgánica biodegradable que nutre la tierra mediante compostaje.'
    },
    {
      id: 3,
      name: 'Folleto de Papel',
      category: 'paper',
      icon: '📄',
      fact: 'El papel limpio y seco se transforma en pulpa reciclable para nuevos cuadernos.'
    },
    {
      id: 4,
      name: 'Lata de Aluminio',
      category: 'plastic', // yellow bin (plastics and metals)
      icon: '🥫',
      fact: 'El aluminio es 100% infinitamente reciclable ahorrando 95% de energía.'
    },
    {
      id: 5,
      name: 'Yerba Mate Usada',
      category: 'organic',
      icon: '🌿',
      fact: 'La yerba mate es un abono orgánico excelente para especies nativas.'
    },
    {
      id: 6,
      name: 'Caja de Cartón',
      category: 'paper',
      icon: '📦',
      fact: 'Por cada tonelada de cartón reciclado se salvan decenas de árboles.'
    },
  ];

  const bins = [
    {
      id: 'organic',
      name: 'Orgánicos',
      color: 'bg-emerald-600',
      border: 'border-emerald-500',
      lightBg: 'bg-emerald-50 text-emerald-800',
      desc: 'Restos de fruta, yerba y hojas'
    },
    {
      id: 'plastic',
      name: 'Plásticos y Metales',
      color: 'bg-amber-500',
      border: 'border-amber-400',
      lightBg: 'bg-amber-50 text-amber-800',
      desc: 'Botellas, latas y envases'
    },
    {
      id: 'paper',
      name: 'Papel y Cartón',
      color: 'bg-sky-600',
      border: 'border-sky-500',
      lightBg: 'bg-sky-50 text-sky-800',
      desc: 'Hojas secas, cajas y diarios'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cleanedCount, setCleanedCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = wasteItems[currentIndex];

  const handleClassify = (targetBinId) => {
    if (feedback !== null || isFinished) return;

    if (targetBinId === currentItem.category) {
      playSuccess();
      setFeedback({
        type: 'success',
        title: '¡Clasificación Correcta!',
        message: currentItem.fact
      });
      setCleanedCount(c => c + 1);

      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 < wasteItems.length) {
          setCurrentIndex(i => i + 1);
        } else {
          setIsFinished(true);
          triggerCelebration();
          addPoints(180, '¡Sendero de Villa Cielo 100% limpio!');
          unlockSpecies('chanar', 'recycling');
        }
      }, 1600);
    } else {
      playError();
      setFeedback({
        type: 'error',
        title: '¡Contenedor Incorrecto!',
        message: `Este residuo debe ir al contenedor de ${
          bins.find(b => b.id === currentItem.category)?.name
        }.`
      });

      setTimeout(() => {
        setFeedback(null);
      }, 1800);
    }
  };

  const handleRestart = () => {
    playPop();
    setCurrentIndex(0);
    setCleanedCount(0);
    setFeedback(null);
    setIsFinished(false);
  };

  return (
    <section className="relative w-full h-full bg-paper flex flex-col justify-between overflow-hidden">
      {/* TopBar */}
      <TopBar
        title="Guardián del Sendero"
        onBack={() => navigate('games')}
        backLabel="Volver"
      />

      {isFinished ? (
        /* Game Completed Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-600 text-white grid place-items-center shadow-2xl">
            <Recycle className="w-10 h-10 animate-spin-slow" />
          </div>

          <div>
            <span className="text-forest text-[10px] font-bold uppercase tracking-wider block">
              ¡Sendero Descontaminado!
            </span>
            <h2 className="font-serif text-3xl font-bold text-ink mt-1">
              +180 Puntos
            </h2>
            <p className="text-muted text-xs mt-2 max-w-xs leading-relaxed">
              Separaste correctamente todos los residuos. Protegiste el suelo serrano, las cuencas del Río Calabalumba y a los animales nativos de Villa Cielo.
            </p>
          </div>

          <div className="w-full space-y-2 pt-4">
            <button
              onClick={() => navigate('games')}
              className="w-full h-11 rounded-2xl bg-forest text-white font-bold text-xs shadow-lg active:scale-95 transition"
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
        /* Active Game Area */
        <div className="flex-1 flex flex-col justify-between px-4 py-3 overflow-y-auto">
          {/* Progress Header */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted font-medium">
                Residuo {currentIndex + 1} de {wasteItems.length}
              </span>
              <strong className="text-forest font-bold">
                Sendero Limpio: {Math.round((cleanedCount / wasteItems.length) * 100)}%
              </strong>
            </div>
            <div className="w-full h-2 bg-[#e9ece8] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / wasteItems.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Waste Item Card (The item found on the trail) */}
          <div className="my-auto py-2 flex flex-col items-center text-center">
            <span className="text-[9px] font-bold text-forest uppercase tracking-wider bg-mint px-2.5 py-0.5 rounded-full mb-2">
              Residuo encontrado en el sendero
            </span>

            <motion.div
              key={currentItem.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-3xl bg-cream border-2 border-line shadow-lg grid place-items-center text-4xl mb-2"
            >
              {currentItem.icon}
            </motion.div>

            <h3 className="font-serif text-lg font-bold text-ink">
              {currentItem.name}
            </h3>
            <p className="text-[11px] text-muted max-w-xs mt-0.5">
              ¿A qué contenedor ecológico corresponde? Tocá el contenedor correcto:
            </p>
          </div>

          {/* Educational Feedback Alert */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`p-3 rounded-2xl border text-xs leading-snug mb-3 shadow-md ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  {feedback.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{feedback.title}</span>
                </div>
                <p className="text-[11px] opacity-90 pl-5">{feedback.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The 3 Ecological Bins */}
          <div className="grid gap-2 pt-1">
            {bins.map((bin) => (
              <motion.button
                key={bin.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleClassify(bin.id)}
                className={`w-full p-2.5 rounded-2xl border ${bin.border} ${bin.lightBg} flex items-center justify-between shadow-xs hover:shadow-md transition-all text-left`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${bin.color} text-white grid place-items-center shadow-sm`}>
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold block leading-tight">
                      {bin.name}
                    </strong>
                    <small className="text-[9px] opacity-75">{bin.desc}</small>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
