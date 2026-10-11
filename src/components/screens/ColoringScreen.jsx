import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { Check, Palette, Sparkles, Download, Lock, Star, ChevronRight } from 'lucide-react';
import { playPop, playSuccess } from '../../utils/audio';
import { motion } from 'framer-motion';

export const ColoringScreen = () => {
  const { 
    navigate, 
    completeGameLevel, 
    gameLevels, 
    unlockSpecies, 
    theme 
  } = useApp();

  const maxUnlockedLevel = gameLevels?.color || 1;
  const [currentLevel, setCurrentLevel] = useState(1);

  const levelAnimals = [
    { level: 1, name: 'Zorro Gris', subtitle: 'Nivel 1: Pelaje del Zorro Pampeano' },
    { level: 2, name: 'Picaflor Cometa', subtitle: 'Nivel 2: Plumaje brillante de las quebradas' },
    { level: 3, name: 'Corzuela Parda', subtitle: 'Nivel 3: Ciervo secreto del monte' }
  ];

  const activeLevelInfo = levelAnimals.find(l => l.level === currentLevel) || levelAnimals[0];

  const palette = ['#E76F51', '#F4C95D', '#68A691', '#4F8FB3', '#9A7BB8', '#7B5C43'];
  const [selectedColor, setSelectedColor] = useState(palette[0]);
  
  // Custom colored parts
  const [part1Color, setPart1Color] = useState(palette[0]);
  const [part2Color, setPart2Color] = useState('#FFF8EB');
  const [part3Color, setPart3Color] = useState('#f8cabb');
  const [levelCompleted, setLevelCompleted] = useState(false);

  const handleSave = () => {
    playSuccess();
    setLevelCompleted(true);
    completeGameLevel('color', currentLevel, currentLevel * 60);
    unlockSpecies('zorro-gris', 'color');
  };

  const handleSelectLevel = (lvlNum) => {
    if (lvlNum > maxUnlockedLevel) return;
    playPop();
    setCurrentLevel(lvlNum);
    setLevelCompleted(false);
    setPart1Color(palette[(lvlNum - 1) % palette.length]);
    setPart2Color('#FFF8EB');
    setPart3Color('#f8cabb');
  };

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-paper text-ink'
    }`}>
      {/* TopBar with styled back button */}
      <TopBar
        title="Coloreá la fauna"
        onBack={() => navigate('games')}
        backLabel="Volver"
      />

      <div className="flex-1 flex flex-col justify-between px-4 py-2 overflow-y-auto">
        {/* Progressive Level Selector */}
        <div className="mb-1.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted">
              Nivel de Ilustración:
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {levelAnimals.map(lvl => {
              const isUnlocked = lvl.level <= maxUnlockedLevel;
              const isActive = lvl.level === currentLevel;

              return (
                <button
                  key={lvl.level}
                  disabled={!isUnlocked}
                  onClick={() => handleSelectLevel(lvl.level)}
                  className={`py-1.5 px-1.5 rounded-xl text-[10px] font-bold border transition flex items-center justify-center gap-1 ${
                    isActive
                      ? 'bg-forest text-white border-forest shadow-xs'
                      : isUnlocked
                      ? 'bg-black/5 dark:bg-white/5 border-line dark:border-[#204535]'
                      : 'bg-black/5 dark:bg-white/5 border-line/40 text-muted/50 cursor-not-allowed'
                  }`}
                >
                  {!isUnlocked && <Lock className="w-2.5 h-2.5" />}
                  <span className="truncate">{lvl.name}</span>
                  {isUnlocked && lvl.level < maxUnlockedLevel && <Star className="w-2.5 h-2.5 text-sun fill-sun" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topline Info */}
        <div className={`flex items-center justify-between p-2 rounded-2xl border text-xs mb-1.5 ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-cream border-line'
        }`}>
          <div>
            <strong className="text-forest font-bold block text-xs leading-tight">{activeLevelInfo.name}</strong>
            <span className="text-muted text-[9px]">{activeLevelInfo.subtitle}</span>
          </div>
          <span className="text-[10px] font-bold text-forest bg-sun/20 px-2 py-0.5 rounded-full">
            Nivel {currentLevel}
          </span>
        </div>

        {/* Interactive SVG Coloring Canvas */}
        <div className="relative aspect-[1/0.9] w-full max-w-[260px] mx-auto bg-gradient-to-b from-[#dff3f7] from-60% to-[#dce6b9] rounded-2xl overflow-hidden shadow-inner border border-forest/10 p-2 my-auto">
          <svg
            viewBox="0 0 300 330"
            role="img"
            aria-label="Ilustración de fauna para colorear"
            className="w-full h-full cursor-pointer"
          >
            {/* Main Animal Body / Head */}
            <motion.path
              fill={part1Color}
              d="M74 99 50 39l63 36c24-13 52-13 76 0l62-36-24 61c18 22 25 51 17 81-11 44-48 78-94 78s-83-34-94-78c-8-30 0-60 18-82Z"
              onClick={() => {
                playPop();
                setPart1Color(selectedColor);
              }}
              whileHover={{ opacity: 0.92 }}
              stroke="#173b32"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Inner Ears */}
            <path
              fill={part3Color}
              d="m62 68 18 24-25 4 7-28Zm176 0-18 24 25 4-7-28Z"
              onClick={() => {
                playPop();
                setPart3Color(selectedColor);
              }}
              stroke="#173b32"
              strokeWidth="3"
            />

            {/* Belly / Snout patch */}
            <path
              fill={part2Color}
              d="M100 178c18-12 34-12 50-12s32 0 50 12c12 28-2 62-50 62s-62-34-50-62Z"
              onClick={() => {
                playPop();
                setPart2Color(selectedColor);
              }}
              stroke="#173b32"
              strokeWidth="3"
            />

            {/* Eyes and Nose (Black outlines) */}
            <ellipse cx="114" cy="148" rx="8" ry="10" fill="#173b32" />
            <ellipse cx="186" cy="148" rx="8" ry="10" fill="#173b32" />
            <polygon points="150,192 140,180 160,180" fill="#173b32" />
            <path d="M150 192v10m-12 0c6 5 18 5 24 0" stroke="#173b32" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Color Palette Selector */}
        <div className="flex items-center justify-center gap-2 py-2">
          {palette.map((color) => (
            <button
              key={color}
              onClick={() => {
                playPop();
                setSelectedColor(color);
              }}
              style={{ backgroundColor: color }}
              className={`w-7 h-7 rounded-full shadow-md transition-transform ${
                selectedColor === color
                  ? 'scale-125 ring-3 ring-forest ring-offset-2'
                  : 'hover:scale-110'
              }`}
              aria-label={`Seleccionar color ${color}`}
            />
          ))}
        </div>

        {/* Action / Next Level Button */}
        {levelCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-center"
          >
            <strong className="text-xs font-bold block">¡Obra de Nivel {currentLevel} Completada!</strong>
            <div className="flex gap-2 mt-2">
              {currentLevel < 3 ? (
                <button
                  onClick={() => handleSelectLevel(currentLevel + 1)}
                  className="w-full py-2 rounded-xl bg-forest text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Pintar Nivel {currentLevel + 1}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('games')}
                  className="w-full py-2 rounded-xl bg-forest text-white text-xs font-bold shadow-xs"
                >
                  Ver Más Juegos
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <button
            onClick={handleSave}
            className="w-full h-10 rounded-xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
          >
            <Check className="w-4 h-4" />
            <span>COMPLETAR Y GUARDAR OBRA</span>
          </button>
        )}
      </div>
    </section>
  );
};
