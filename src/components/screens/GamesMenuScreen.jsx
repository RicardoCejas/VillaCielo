import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { 
  HelpCircle, 
  Puzzle, 
  Palette, 
  Layers, 
  Camera, 
  Recycle, 
  Sparkles, 
  ChevronRight, 
  Award, 
  Target,
  Star
} from 'lucide-react';
import { playPop } from '../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const GamesMenuScreen = () => {
  const { navigate, points, exp, currentRank, goBack, profile, gameLevels, theme, t } = useApp();

  // Tab: 'kids', 'adults', 'field'
  const [categoryFilter, setCategoryFilter] = useState(() => {
    return profile === 'Niños' ? 'kids' : 'adults';
  });

  const allGames = [
    {
      screen: 'trivia',
      title: 'Trivia natural',
      subtitle: 'Cuestionario progresivo por niveles sobre el monte',
      mission: 'Misión: Responde preguntas y pon a prueba tu saber',
      reward: '+120 EXP',
      iconImg: '/icons/trivia.png',
      icon: HelpCircle,
      audience: 'both',
      audienceBadge: '👨‍👩‍👧 Adultos y Niños',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
    },
    {
      screen: 'color',
      title: 'Coloreá la fauna',
      subtitle: 'Taller progresivo de pintura de especies serranas',
      mission: 'Misión: Pinta el pelaje del Zorro, Picaflor y Corzuela',
      reward: '+100 EXP',
      iconImg: '/icons/color.png',
      icon: Palette,
      audience: 'kids',
      audienceBadge: '🧒 Solo Niños (1-14)',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
    },
    {
      screen: 'puzzle',
      title: 'Puzzle del paisaje',
      subtitle: 'Reconstrucción táctil de miradores con retos progresivos',
      mission: 'Misión: Reconstruye los Balcones del Uritorco',
      reward: '+150 EXP',
      iconImg: '/icons/puzzle.png',
      icon: Puzzle,
      audience: 'kids',
      audienceBadge: '🧒 Solo Niños (1-14)',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
    },
    {
      screen: 'memory',
      title: 'Memoria silvestre',
      subtitle: 'Encuentra parejas con niveles ascendentes de dificultad',
      mission: 'Misión: Empareja especies nativas de Villa Cielo',
      reward: '+180 EXP',
      iconImg: '/icons/memory.png',
      icon: Layers,
      audience: 'both',
      audienceBadge: '👨‍👩‍👧 Adultos y Niños',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
    },
    // Misiones de campo
    {
      screen: 'safari',
      title: 'Safari Fotográfico',
      subtitle: 'Avistamiento veloz de animales en el monte',
      mission: 'Misión: Fotografía a la Corzuela Parda y el Halcón',
      reward: '+150 EXP',
      icon: Camera,
      audience: 'field',
      audienceBadge: '🧭 Misión de Campo',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
    },
    {
      screen: 'recycling',
      title: 'Guardián del Sendero',
      subtitle: 'Clasificación de residuos en contenedores limpios',
      mission: 'Misión: Deja limpios los senderos del parque',
      reward: '+160 EXP',
      icon: Recycle,
      audience: 'field',
      audienceBadge: '🧭 Misión de Campo',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
    },
    {
      screen: 'stargazing',
      title: 'Observatorio de Estrellas',
      subtitle: 'Trazado de constelaciones sobre el cielo limpio',
      mission: 'Misión: Conecta la Cruz del Sur y Tres Marías',
      reward: '+150 EXP',
      icon: Sparkles,
      audience: 'field',
      audienceBadge: '🧭 Misión de Campo',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
    }
  ];

  const filteredGames = allGames.filter(game => {
    if (categoryFilter === 'kids') {
      return game.audience === 'kids' || game.audience === 'both';
    }
    if (categoryFilter === 'adults') {
      return game.audience === 'both';
    }
    if (categoryFilter === 'field') {
      return game.audience === 'field';
    }
    return true;
  });

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-cream text-ink'
    }`}>
      {/* TopBar with back to Home */}
      <TopBar
        title="Juegos Progresivos"
        onBack={goBack}
        backLabel="Volver"
        onSettings={() => navigate('settings')}
      />

      <div className="flex-1 flex flex-col overflow-y-auto px-4 py-2 space-y-2.5">
        {/* Header Heading */}
        <div className="pt-0.5">
          <div className="flex items-center justify-between">
            <span className="text-forest-light text-[9px] font-bold tracking-[1.6px] uppercase block">
              Desafíos de Villa Cielo
            </span>
            <span className="text-[10px] font-bold text-forest bg-sun/30 px-2 py-0.5 rounded-full">
              Rango {currentRank.level} de 6 · {currentRank.icon}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight mt-0.5 leading-tight">
            Elegí tu desafío
          </h2>
          <p className="text-muted text-xs mt-0.5">
            Superá etapas progresivas (Niveles 1, 2 y 3) para acumular estrellas y EXP.
          </p>
        </div>

        {/* 3 Categories Filter Tabs */}
        <div className="flex bg-black/10 dark:bg-white/10 p-1 rounded-2xl gap-1">
          <button
            onClick={() => {
              playPop();
              setCategoryFilter('kids');
            }}
            className={`flex-1 py-1.5 px-1 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 ${
              categoryFilter === 'kids'
                ? 'bg-forest text-white shadow-xs'
                : 'text-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <span>🧒 Niños (1-14)</span>
          </button>

          <button
            onClick={() => {
              playPop();
              setCategoryFilter('adults');
            }}
            className={`flex-1 py-1.5 px-1 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 ${
              categoryFilter === 'adults'
                ? 'bg-forest text-white shadow-xs'
                : 'text-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <span>🌿 Adultos (15-99)</span>
          </button>

          <button
            onClick={() => {
              playPop();
              setCategoryFilter('field');
            }}
            className={`flex-1 py-1.5 px-1 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 ${
              categoryFilter === 'field'
                ? 'bg-forest text-white shadow-xs'
                : 'text-muted hover:text-ink dark:hover:text-white'
            }`}
          >
            <span>🧭 En Sendero</span>
          </button>
        </div>

        {/* Games Grid/List */}
        <div className="grid gap-2">
          <AnimatePresence mode="wait">
            {filteredGames.map((game, index) => {
              const Icon = game.icon;
              const currentLvl = gameLevels?.[game.screen] || 1;

              return (
                <motion.button
                  key={game.screen}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, delay: index * 0.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playPop();
                    navigate(game.screen);
                  }}
                  className={`w-full text-left p-2.5 rounded-2xl border grid grid-cols-[44px_1fr_18px] items-center gap-2.5 shadow-2xs hover:shadow-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-[#11261e] border-[#1e4536] hover:bg-[#163327]'
                      : 'bg-white border-line hover:border-moss/40'
                  }`}
                >
                  {/* Game Icon */}
                  {game.iconImg ? (
                    <div className="w-11 h-11 rounded-xl overflow-hidden grid place-items-center shadow-2xs shrink-0 bg-cream dark:bg-[#193a2c]">
                      <img
                        src={game.iconImg}
                        alt={game.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <span className="w-11 h-11 rounded-xl bg-forest text-sun grid place-items-center shadow-2xs shrink-0">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </span>
                  )}

                  <div className="flex flex-col pr-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <strong className="font-serif text-sm font-bold text-forest leading-tight">
                        {game.title}
                      </strong>
                      <span className={`text-[7.5px] font-bold px-1.5 py-0.2 rounded-full ${game.badgeColor}`}>
                        {game.audienceBadge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-muted font-medium">
                      <span className="line-clamp-1">{game.subtitle}</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-forest font-bold mt-1">
                      <span className="text-muted font-semibold flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 text-sun fill-sun" />
                        <span>Nivel {currentLvl} de 3</span>
                      </span>
                      <span className="bg-forest/10 dark:bg-white/10 px-1.5 py-0.2 rounded shrink-0 ml-1">
                        {game.reward}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted justify-self-end" />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Informative Note */}
        <div className={`p-2.5 rounded-2xl border text-[10px] leading-tight text-muted ${
          theme === 'dark' ? 'bg-[#0a1813]/60 border-[#1a382a]' : 'bg-[#eef3f0] border-line'
        }`}>
          ⭐ <strong>Sistema Progresivo:</strong> Cada juego cuenta con 3 niveles que se desbloquean a medida que los vas superando.
        </div>
      </div>

      {/* BottomNav */}
      <BottomNav active="games" />
    </section>
  );
};
