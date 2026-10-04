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
  CheckCircle2
} from 'lucide-react';
import { playPop } from '../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const GamesMenuScreen = () => {
  const { navigate, points, exp, currentRank, goBack } = useApp();
  const [activeTab, setActiveTab] = useState('canonical'); // 'canonical' (4 juegos base) or 'field' (misiones de campo)

  // 🎮 Los 4 Juegos Originales de Figma con sus Nombres Intactos y Misiones Integradas
  const canonicalGames = [
    {
      screen: 'trivia',
      title: 'Trivia natural',
      subtitle: 'Cuestionario contra reloj sobre Villa Cielo',
      mission: 'Misión: Responde las preguntas de flora y fauna serrana',
      reward: '+120 EXP · Desbloquea cartas',
      iconImg: '/icons/trivia.png',
      icon: HelpCircle,
      cardColor: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
      iconBg: 'bg-forest text-white',
      badge: 'Misión Activa'
    },
    {
      screen: 'puzzle',
      title: 'Puzzle del paisaje',
      subtitle: 'Reconstrucción táctil de senderos y miradores',
      mission: 'Misión: Reconstruye el Sendero del Tala y Balcones',
      reward: '+150 EXP · Carta de Tala',
      iconImg: '/icons/puzzle.png',
      icon: Puzzle,
      cardColor: 'bg-amber-50/70 border-amber-200 text-amber-950',
      iconBg: 'bg-amber-700 text-white',
      badge: 'Misión Activa'
    },
    {
      screen: 'color',
      title: 'Coloreá la fauna',
      subtitle: 'Taller de ilustración de especies autóctonas',
      mission: 'Misión: Pinta el pelaje del Zorro Gris Pampeano',
      reward: '+100 EXP · Carta de Zorro',
      iconImg: '/icons/color.png',
      icon: Palette,
      cardColor: 'bg-rose-50/70 border-rose-200 text-rose-950',
      iconBg: 'bg-rose-700 text-white',
      badge: 'Misión Creativa'
    },
    {
      screen: 'memory',
      title: 'Memoria silvestre',
      subtitle: 'Encuentra las parejas de flora y fauna nativa',
      mission: 'Misión: Empareja Calandrias, Molles y Espinillos',
      reward: '+200 EXP · Carta Calandria',
      iconImg: '/icons/memory.png',
      icon: Layers,
      cardColor: 'bg-sky-50/70 border-sky-200 text-sky-950',
      iconBg: 'bg-sky-700 text-white',
      badge: 'Misión Memoria'
    }
  ];

  // 🌿 Misiones de Campo en la Reserva (Safari, Reciclaje, Astroturismo)
  const fieldMissions = [
    {
      screen: 'safari',
      title: 'Safari Fotográfico',
      subtitle: 'Avistamiento veloz de animales en el monte',
      mission: 'Misión: Fotografía a la Corzuela Parda y el Halconcito',
      reward: '+150 EXP · Carta Corzuela',
      icon: Camera,
      cardColor: 'bg-mint/60 border-mint text-forest',
      iconBg: 'bg-forest text-white',
      badge: 'Campo Abierto'
    },
    {
      screen: 'recycling',
      title: 'Guardián del Sendero',
      subtitle: 'Clasificación ecológica de residuos en contenedores',
      mission: 'Misión: Deja limpios los senderos del Uritorco',
      reward: '+180 EXP · Carta Chañar',
      icon: Recycle,
      cardColor: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      iconBg: 'bg-emerald-700 text-white',
      badge: 'Ecológico'
    },
    {
      screen: 'stargazing',
      title: 'Observatorio de Estrellas',
      subtitle: 'Trazado de constelaciones sobre el cielo serrano',
      mission: 'Misión: Conecta la Cruz del Sur y Tres Marías',
      reward: '+150 EXP · Carta Cóndor',
      icon: Sparkles,
      cardColor: 'bg-purple-50 border-purple-200 text-purple-950',
      iconBg: 'bg-purple-900 text-white',
      badge: 'Nocturno'
    }
  ];

  return (
    <section className="relative w-full h-full bg-cream flex flex-col justify-between overflow-hidden">
      {/* TopBar with back to Home */}
      <TopBar
        title="Juegos y Misiones"
        onBack={goBack}
        backLabel="Volver"
        onSettings={() => navigate('settings')}
      />

      <div className="flex-1 flex flex-col overflow-y-auto px-4 py-2 space-y-3">
        {/* Header Heading */}
        <div className="pt-1">
          <div className="flex items-center justify-between">
            <span className="text-forest-light text-[9px] font-bold tracking-[1.6px] uppercase block">
              Desafíos de Villa Cielo
            </span>
            <span className="text-[10px] font-bold text-forest bg-mint px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>Nivel {currentRank.level}</span>
              <span>{currentRank.icon}</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-ink tracking-tight mt-0.5">
            Elegí tu desafío
          </h2>
          <p className="text-muted text-xs mt-0.5">
            Completá misiones interactivas para sumar EXP y desbloquear cartas en tu Wiki.
          </p>
        </div>

        {/* Tab Selector: Juegos Originales vs Misiones de Campo */}
        <div className="flex bg-[#e8eee9] p-1 rounded-2xl border border-line">
          <button
            onClick={() => {
              playPop();
              setActiveTab('canonical');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'canonical'
                ? 'bg-forest text-white shadow-xs'
                : 'text-muted hover:text-forest'
            }`}
          >
            <span>🎮 4 Juegos Originales</span>
          </button>
          <button
            onClick={() => {
              playPop();
              setActiveTab('field');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'field'
                ? 'bg-forest text-white shadow-xs'
                : 'text-muted hover:text-forest'
            }`}
          >
            <span>🧭 Misiones de Campo (3)</span>
          </button>
        </div>

        {/* Game List Display */}
        <div className="grid gap-2.5">
          <AnimatePresence mode="wait">
            {(activeTab === 'canonical' ? canonicalGames : fieldMissions).map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.button
                  key={game.screen}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playPop();
                    navigate(game.screen);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border ${game.cardColor} grid grid-cols-[48px_1fr_20px] items-center gap-3 shadow-xs hover:shadow-md transition-all relative overflow-hidden`}
                >
                  {game.iconImg ? (
                    <div className="w-12 h-12 rounded-2xl overflow-hidden grid place-items-center shadow-xs shrink-0">
                      <img
                        src={game.iconImg}
                        alt={game.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <span className={`w-11 h-11 rounded-xl ${game.iconBg} grid place-items-center shadow-md shrink-0`}>
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </span>
                  )}

                  <div className="flex flex-col pr-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <strong className="font-serif text-[15px] font-bold text-forest leading-tight">
                        {game.title}
                      </strong>
                      <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-white/70 text-forest rounded-full border border-forest/10">
                        {game.badge}
                      </span>
                    </div>

                    {/* Integrated Mission Subtitle */}
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-ink/90 mt-0.5">
                      <Target className="w-3 h-3 text-forest shrink-0" />
                      <span className="line-clamp-1">{game.mission}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted mt-1">
                      <span className="line-clamp-1">{game.subtitle}</span>
                      <span className="font-bold text-forest text-[9px] bg-white/80 px-1.5 py-0.5 rounded shadow-2xs ml-1 whitespace-nowrap">
                        {game.reward}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-forest/50 justify-self-end" />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Level & Points Summary Banner */}
        <div className="bg-forest text-white rounded-2xl p-3 grid grid-cols-[38px_75px_1fr] items-center gap-2.5 shadow-md mt-auto">
          <span className="w-9 h-9 rounded-xl bg-sun text-forest grid place-items-center">
            <Award className="w-5 h-5 stroke-[2.2]" />
          </span>
          <div className="flex flex-col">
            <small className="text-[#a9c5b9] text-[8px] font-bold uppercase tracking-wider">
              Puntos & EXP
            </small>
            <strong className="font-serif text-sm font-bold text-sun leading-none mt-0.5">
              {points.toLocaleString()} pts
            </strong>
            <span className="text-[9px] text-[#c4d6ce] mt-0.5">
              {exp} EXP
            </span>
          </div>
          <div className="border-l border-white/20 pl-2.5 text-[9px] text-[#c4d6ce] leading-tight">
            Completar cada juego desbloquea cartas secretas en tu <strong>Wiki de Villa Cielo</strong>.
          </div>
        </div>
      </div>

      {/* BottomNav */}
      <BottomNav active="games" />
    </section>
  );
};
