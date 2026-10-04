import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { TopBar } from '../../layout/TopBar';
import { Sparkles, Star, Trophy, RotateCcw, ChevronRight, Moon, Compass } from 'lucide-react';
import { playClick, playSuccess, playCelebration, playError } from '../../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const StargazingGame = () => {
  const { navigate, addPoints, triggerCelebration, unlockSpecies } = useApp();

  const constellations = [
    {
      id: 'cruz-del-sur',
      name: 'La Cruz del Sur (Crux)',
      subtitle: 'La brújula natural del hemisferio sur',
      lore: 'Constelación insignia del cielo de Capilla del Monte. Indicaba a los pueblos originarios el sur astronómico para sus travesías nocturnas.',
      stars: [
        { id: 1, x: 50, y: 18, name: 'Gacrux' },
        { id: 2, x: 50, y: 78, name: 'Acrux' },
        { id: 3, x: 28, y: 46, name: 'Mimosa' },
        { id: 4, x: 74, y: 44, name: 'Delta Crucis' },
        { id: 5, x: 62, y: 56, name: 'Ginan' }
      ],
      // Connections to draw in order: 1->2, then 3->4, etc.
      lines: [
        [0, 1], // Gacrux to Acrux
        [2, 3], // Mimosa to Delta
        [3, 4]  // Delta to Ginan
      ]
    },
    {
      id: 'tres-marias',
      name: 'Las Tres Marías (Cinturón de Orión)',
      subtitle: 'Faro estelar de las noches de verano en Punilla',
      lore: 'Tres estrellas alineadas casi simétricamente (Alnitak, Alnilam y Mintaka) que se alzan imponentes sobre la cumbre del Cerro Uritorco.',
      stars: [
        { id: 1, x: 25, y: 65, name: 'Mintaka' },
        { id: 2, x: 50, y: 50, name: 'Alnilam' },
        { id: 3, x: 75, y: 35, name: 'Alnitak' },
        { id: 4, x: 30, y: 20, name: 'Betelgeuse' },
        { id: 5, x: 70, y: 80, name: 'Rigel' }
      ],
      lines: [
        [0, 1],
        [1, 2],
        [0, 3],
        [2, 4]
      ]
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [connectedStars, setConnectedStars] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const currentConstellation = constellations[currentIdx];

  const handleStarClick = (starIndex) => {
    if (isCompleted) return;

    const nextRequiredIndex = connectedStars.length;

    if (starIndex === nextRequiredIndex) {
      playSuccess();
      const nextConnected = [...connectedStars, starIndex];
      setConnectedStars(nextConnected);

      if (nextConnected.length === currentConstellation.stars.length) {
        setIsCompleted(true);
        triggerCelebration();
        setTotalScore(s => s + 150);
        addPoints(150, `¡Constelación de ${currentConstellation.name} revelada!`);

        // Unlock celestial card
        if (currentIdx === 0) {
          unlockSpecies('pastizal-uritorco', 'stargazing');
        } else {
          unlockSpecies('condor-andino', 'stargazing');
        }
      }
    } else if (connectedStars.includes(starIndex)) {
      playClick();
    } else {
      playError();
    }
  };

  const handleNextConstellation = () => {
    playClick();
    if (currentIdx + 1 < constellations.length) {
      setCurrentIdx(i => i + 1);
      setConnectedStars([]);
      setIsCompleted(false);
    } else {
      navigate('games');
    }
  };

  const handleRestart = () => {
    playClick();
    setConnectedStars([]);
    setIsCompleted(false);
  };

  return (
    <section className="relative w-full h-full bg-[#050b14] flex flex-col justify-between overflow-hidden">
      {/* TopBar with styled back button */}
      <TopBar
        title="Observatorio de Estrellas"
        onBack={() => navigate('games')}
        backLabel="Volver"
        light
      />

      <div className="flex-1 flex flex-col justify-between px-4 py-2 overflow-y-auto">
        {/* Sky Header */}
        <div className="text-center text-white pt-1">
          <div className="flex items-center justify-center gap-1.5 text-sun text-[10px] font-bold uppercase tracking-widest">
            <Moon className="w-3.5 h-3.5" />
            <span>Cielo Limpio de Capilla del Monte</span>
          </div>
          <h2 className="font-serif text-xl font-bold tracking-tight mt-0.5">
            {currentConstellation.name}
          </h2>
          <p className="text-white/70 text-[11px] max-w-xs mx-auto">
            {isCompleted
              ? '¡Constelación alineada en el cielo serrano!'
              : `Tocá las estrellas en orden numérico (1 al ${currentConstellation.stars.length}) para trazarla`}
          </p>
        </div>

        {/* 🌌 Interactive Night Sky Canvas */}
        <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-gradient-to-b from-[#040810] via-[#09152b] to-[#122240] rounded-3xl overflow-hidden shadow-2xl border border-sky/20 my-auto p-2">
          {/* Ambient twinkling background stars */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-[12%] left-[20%] w-1 h-1 bg-white rounded-full animate-ping" />
            <div className="absolute top-[35%] left-[85%] w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute top-[68%] left-[15%] w-1.5 h-1.5 bg-sky-200 rounded-full animate-pulse" />
            <div className="absolute top-[82%] left-[75%] w-1 h-1 bg-white rounded-full animate-ping" />
            <div className="absolute top-[45%] left-[40%] w-1 h-1 bg-white rounded-full" />
            <div className="absolute top-[22%] left-[60%] w-1.5 h-1.5 bg-sun/60 rounded-full" />
          </div>

          {/* SVG Drawn Constellation Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw lines when consecutive stars are connected */}
            {connectedStars.length > 1 &&
              currentConstellation.lines.map(([fromIdx, toIdx], lIdx) => {
                if (
                  connectedStars.includes(fromIdx) &&
                  connectedStars.includes(toIdx)
                ) {
                  const sFrom = currentConstellation.stars[fromIdx];
                  const sTo = currentConstellation.stars[toIdx];
                  return (
                    <motion.line
                      key={lIdx}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                      x1={`${sFrom.x}%`}
                      y1={`${sFrom.y}%`}
                      x2={`${sTo.x}%`}
                      y2={`${sTo.y}%`}
                      stroke="#f4c95d"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="drop-shadow-[0_0_8px_#f4c95d]"
                    />
                  );
                }
                return null;
              })}
          </svg>

          {/* Interactive Star Nodes */}
          {currentConstellation.stars.map((star, sIdx) => {
            const isConnected = connectedStars.includes(sIdx);
            const isNext = connectedStars.length === sIdx;

            return (
              <div
                key={star.id}
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                onClick={() => handleStarClick(sIdx)}
              >
                {/* Glow ring for next target star */}
                {isNext && (
                  <div className="absolute inset-0 -m-2 rounded-full border-2 border-sun animate-ping pointer-events-none" />
                )}

                <motion.div
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xl transition-all ${
                    isConnected
                      ? 'bg-sun text-forest shadow-[0_0_15px_#f4c95d] scale-110'
                      : isNext
                      ? 'bg-white text-forest ring-4 ring-sun/50 animate-pulse'
                      : 'bg-white/30 text-white hover:bg-white/50 border border-white/40'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isConnected ? 'fill-current' : ''}`} />
                </motion.div>

                {/* Star Number Badge */}
                <div
                  className={`absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1 rounded ${
                    isConnected ? 'text-sun' : 'text-white/60'
                  }`}
                >
                  {star.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Astrotourism Information or Next Button */}
        <div className="pt-2 pb-1">
          {isCompleted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-white space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sun font-bold text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  +150 Puntos de Astroturismo
                </span>
                <span className="text-[9px] text-mint">Capilla del Monte</span>
              </div>
              <p className="text-[11px] text-white/90 leading-tight">
                {currentConstellation.lore}
              </p>
              <button
                onClick={handleNextConstellation}
                className="w-full h-10 rounded-xl bg-sun text-forest font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
              >
                <span>
                  {currentIdx + 1 < constellations.length
                    ? 'Siguiente Constelación'
                    : 'Reclamar y Volver a Juegos'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between text-white/70 text-xs px-2">
              <span>
                Estrellas unidas: <strong>{connectedStars.length} / {currentConstellation.stars.length}</strong>
              </span>
              <button
                onClick={handleRestart}
                className="text-[10px] text-mint hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar trazo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
