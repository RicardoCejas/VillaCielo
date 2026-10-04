import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { TopBar } from '../../layout/TopBar';
import { IMAGES, SPECIES_LIST } from '../../../data/speciesData';
import { Camera, Sparkles, Clock, Trophy, RotateCcw, Zap, Image as ImageIcon } from 'lucide-react';
import { playCameraSnap, playCelebration, playSuccess, playPop } from '../../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const SafariGame = () => {
  const { navigate, addPoints, triggerCelebration, unlockSpecies } = useApp();

  // Safari animals that hide in the monte mapped to species IDs
  const safariAnimals = [
    { id: 'corzuela-parda', name: 'Corzuela Parda', image: IMAGES.corzuela, points: 150 },
    { id: 'zorro-gris', name: 'Zorro Gris', image: IMAGES.fox, points: 120 },
    { id: 'halconcito-colorado', name: 'Halconcito Colorado', image: IMAGES.halconcito, points: 140 },
    { id: 'picaflor-comun', name: 'Picaflor Común', image: IMAGES.hummingbird, points: 180 },
    { id: 'jote-cabeza-negra', name: 'Jote Cabeza Negra', image: IMAGES.jote, points: 100 },
  ];

  // 6 specific hiding spots in the brush/rocks (percent coordinates)
  const spots = [
    { x: 18, y: 35, label: 'Molles altos' },
    { x: 50, y: 25, label: 'Rama de tala' },
    { x: 80, y: 38, label: 'Peñasco norte' },
    { x: 22, y: 65, label: 'Pastizal bajo' },
    { x: 54, y: 58, label: 'Sendero de piedra' },
    { x: 82, y: 68, label: 'Chilcas y espinillo' },
  ];

  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'finished'
  const [timeLeft, setTimeLeft] = useState(25);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [activeAnimal, setActiveAnimal] = useState(null); // { animal, spotIdx, id }
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [flash, setFlash] = useState(false);
  const [lastShotText, setLastShotText] = useState('');

  const timerRef = useRef(null);
  const animalTimerRef = useRef(null);

  // Spawn an animal in a random spot
  const spawnAnimal = () => {
    const randomAnimal = safariAnimals[Math.floor(Math.random() * safariAnimals.length)];
    const randomSpotIdx = Math.floor(Math.random() * spots.length);
    const instanceId = Date.now();

    setActiveAnimal({
      animal: randomAnimal,
      spotIdx: randomSpotIdx,
      id: instanceId,
      appearedAt: Date.now()
    });

    // Stay visible between 1.3s and 2.1s
    const stayDuration = Math.random() * 800 + 1300;
    animalTimerRef.current = setTimeout(() => {
      setActiveAnimal(null);
      // Spawn next animal after a brief pause
      const pauseDuration = Math.random() * 400 + 400;
      setTimeout(() => {
        if (gameState === 'playing') {
          spawnAnimal();
        }
      }, pauseDuration);
    }, stayDuration);
  };

  const handleStartGame = () => {
    playPop();
    setScore(0);
    setCombo(0);
    setTimeLeft(25);
    setCapturedPhotos([]);
    setLastShotText('');
    setGameState('playing');
  };

  // Main countdown timer
  useEffect(() => {
    if (gameState === 'playing') {
      spawnAnimal();
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            clearTimeout(animalTimerRef.current);
            setActiveAnimal(null);
            setGameState('finished');
            triggerCelebration();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(animalTimerRef.current);
    };
  }, [gameState]);

  // Click on the animal to snap photo!
  const handleSnap = (e, item) => {
    e.stopPropagation();
    if (!item) return;

    playCameraSnap();
    setFlash(true);
    setTimeout(() => setFlash(false), 120);

    const speedBonus = combo * 20;
    const earned = item.animal.points + speedBonus;
    setScore(s => s + earned);
    setCombo(c => c + 1);
    setLastShotText(`¡Foto nítida! +${earned} pts`);

    // Unlock species in album if not yet collected
    unlockSpecies(item.animal.id, 'safari');

    setCapturedPhotos(prev => [
      ...prev,
      {
        id: item.id,
        name: item.animal.name,
        image: item.animal.image,
        points: earned
      }
    ]);

    // Clear animal immediately
    clearTimeout(animalTimerRef.current);
    setActiveAnimal(null);

    // Spawn next after small interval
    setTimeout(() => {
      if (gameState === 'playing') {
        spawnAnimal();
      }
    }, 450);
  };

  const handleFinishReward = () => {
    addPoints(score, '¡Recompensa del Safari Fotográfico!');
    navigate('games');
  };

  return (
    <section className="relative w-full h-full bg-[#0a1a14] flex flex-col justify-between overflow-hidden">
      {/* TopBar with styled back button */}
      <TopBar
        title="Safari Fotográfico"
        onBack={() => navigate('games')}
        backLabel="Volver"
        light
      />

      {/* Screen Body */}
      {gameState === 'ready' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-sun text-forest grid place-items-center shadow-xl shadow-sun/20">
            <Camera className="w-10 h-10 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-mint text-[10px] font-bold uppercase tracking-wider block">
              Minijuego 01 · Observación Silvestre
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight mt-1">
              Safari Serrano
            </h2>
            <p className="text-white/80 text-xs mt-2 max-w-xs leading-relaxed">
              Los animales del monte serrano se ocultan entre la vegetación. Tocá rápido a la <strong>Corzuela Parda, el Zorro, el Halconcito y el Picaflor</strong> antes de que se escondan.
            </p>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full max-w-xs h-12 rounded-2xl bg-sun hover:bg-sun-light text-forest font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-sun/30 active:scale-95 transition"
          >
            <Camera className="w-4 h-4" />
            <span>Iniciar Safari (25s)</span>
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col justify-between">
          {/* Flash Effect */}
          {flash && (
            <div className="absolute inset-0 bg-white z-40 pointer-events-none animate-ping opacity-90" />
          )}

          {/* Top Heads-up Bar */}
          <div className="relative z-30 px-4 py-2 flex items-center justify-between text-white bg-black/40 backdrop-blur-md border-b border-white/10 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-sun">
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-sun" />
              <span>{score} pts</span>
            </div>
            {combo > 1 && (
              <div className="flex items-center gap-1 text-[#75d6a8] bg-[#75d6a8]/20 px-2 py-0.5 rounded-full text-[10px]">
                <Zap className="w-3 h-3 fill-current" />
                <span>x{combo} Combo</span>
              </div>
            )}
          </div>

          {/* Monte Background & Animal Hiding Field */}
          <div
            onClick={() => {
              playCameraSnap();
              setCombo(0);
              setLastShotText('¡Disparo fallido! Mirá bien.');
            }}
            className="relative flex-1 w-full bg-cover bg-center overflow-hidden cursor-crosshair"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1733063670581-cb44b1c807ec?auto=format&fit=crop&w=1200&q=85')`
            }}
          >
            <div className="absolute inset-0 bg-[#061811]/40" />

            {/* Target Viewfinder overlay centered */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-white/70" />
            </div>

            {/* Floating Feedback Label */}
            {lastShotText && (
              <div className="absolute top-4 inset-x-0 text-center pointer-events-none z-30">
                <span className="inline-block bg-black/75 backdrop-blur-md text-sun text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">
                  {lastShotText}
                </span>
              </div>
            )}

            {/* Animal Appearance Spot */}
            <AnimatePresence>
              {activeAnimal && (
                <motion.div
                  key={activeAnimal.id}
                  initial={{ scale: 0, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  style={{
                    left: `${spots[activeAnimal.spotIdx].x}%`,
                    top: `${spots[activeAnimal.spotIdx].y}%`
                  }}
                  onClick={(e) => handleSnap(e, activeAnimal)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                >
                  <div className="relative group">
                    {/* Ring Indicator */}
                    <div className="absolute inset-0 -m-2 rounded-full border-2 border-sun animate-ping" />

                    {/* Animal Badge */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-sun shadow-2xl bg-cream">
                      <img
                        src={activeAnimal.animal.image}
                        alt={activeAnimal.animal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                      {activeAnimal.animal.name}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Camera Trigger Strip */}
          <div className="p-3 bg-black/60 backdrop-blur-md flex items-center justify-between text-white text-xs">
            <span className="text-[10px] text-white/70">
              Fotos logradas: <strong>{capturedPhotos.length}</strong>
            </span>
            <div className="flex items-center gap-1 text-[10px] text-mint">
              <Camera className="w-3.5 h-3.5" />
              <span>Tocá rápido sobre el animal</span>
            </div>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="flex-1 overflow-y-auto p-6 text-center text-white flex flex-col justify-between">
          <div className="space-y-4 my-auto">
            <div className="w-20 h-20 rounded-3xl bg-sun text-forest grid place-items-center mx-auto shadow-2xl">
              <Trophy className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div>
              <span className="text-mint text-[10px] font-bold uppercase tracking-wider block">
                ¡Safari Completado!
              </span>
              <h2 className="font-serif text-3xl font-bold mt-1 text-white">
                +{score} Puntos
              </h2>
              <p className="text-white/80 text-xs mt-1">
                Capturaste {capturedPhotos.length} fotos nítidas de la fauna de Villa Cielo.
              </p>
            </div>

            {/* Captured Photos Grid */}
            {capturedPhotos.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <span className="text-[9px] font-bold text-mint uppercase tracking-wider block mb-2">
                  Álbum de Avistamientos Logrados
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {capturedPhotos.slice(0, 6).map((pic, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <img
                        src={pic.image}
                        alt={pic.name}
                        className="w-14 h-14 rounded-xl object-cover border border-white/30 shadow-md"
                      />
                      <span className="text-[8px] font-semibold truncate max-w-[70px] mt-1 text-white/90">
                        {pic.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4">
            <button
              onClick={handleFinishReward}
              className="w-full h-11 rounded-2xl bg-sun text-forest font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
            >
              <span>Sumar {score} pts y Salir</span>
            </button>
            <button
              onClick={handleStartGame}
              className="w-full h-11 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar otra vez</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
