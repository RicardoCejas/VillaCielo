import React from 'react';
import { useApp } from '../../context/AppContext';
import { SPECIES_LIST } from '../../data/speciesData';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { InteractiveMap } from './InteractiveMap';
import { User, Gamepad2, BookOpen, Map, Award, ChevronRight, Sparkles, Shield, Lock, Network, Flame } from 'lucide-react';
import { playPop } from '../../utils/audio';
import { motion } from 'framer-motion';

export const HomeScreen = () => {
  const { profile, points, exp, currentRank, unlockedSpeciesIds, navigate } = useApp();

  const totalSpecies = SPECIES_LIST.length;
  const unlockedCount = unlockedSpeciesIds.length;
  const expProgress = Math.min(
    100,
    Math.round(((exp - currentRank.minExp) / (currentRank.maxExp - currentRank.minExp)) * 100)
  );

  return (
    <section className="relative w-full h-full bg-cream flex flex-col justify-between overflow-hidden">
      {/* TopBar */}
      <TopBar
        title="Villa Cielo"
        onSettings={() => navigate('settings')}
      />

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 pb-3">
        {/* Welcome Row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-forest-light text-[9px] font-bold tracking-[1.6px] uppercase block">
              Buen día, {profile}
            </span>
            <h2 className="font-serif text-2xl font-bold text-ink tracking-tight mt-0.5">
              ¿Qué descubrimos hoy?
            </h2>
          </div>
          <button
            onClick={() => {
              playPop();
              navigate('profile');
            }}
            className="w-10 h-10 rounded-2xl bg-mint text-forest grid place-items-center shadow-sm border border-moss/20 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Cambiar perfil"
            title="Cambiar perfil"
          >
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* 🛡️ Guardián Level & EXP Progression Card */}
        <div className="bg-paper border border-line rounded-2xl p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-forest text-white grid place-items-center text-base shadow-xs">
                {currentRank.icon}
              </span>
              <div>
                <span className="text-[8px] font-bold text-forest-light uppercase tracking-wider block">
                  Nivel {currentRank.level} · {currentRank.title}
                </span>
                <strong className="text-xs font-bold text-ink leading-none">
                  {exp} EXP acumulada
                </strong>
              </div>
            </div>

            <button
              onClick={() => {
                playPop();
                navigate('wiki');
              }}
              className="text-[10px] font-bold text-forest hover:text-forest-light bg-cream hover:bg-cream-dark px-2.5 py-1 rounded-xl border border-line flex items-center gap-1"
            >
              <span>{unlockedCount} / {totalSpecies} Cartas</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* EXP Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[9px] text-muted mb-1 font-medium">
              <span>Próximo Rango</span>
              <span>{exp} / {currentRank.maxExp} EXP</span>
            </div>
            <div className="w-full h-1.5 bg-[#e8ece7] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sun to-forest rounded-full"
                animate={{ width: `${expProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* 🌐 Red Trófica & Simulador Ecológico Banner */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playPop();
            navigate('ecosystem');
          }}
          className="w-full text-left bg-gradient-to-r from-[#10241b] via-[#163326] to-[#1c3f30] border border-[#27533f] hover:border-sun/60 rounded-2xl p-3 grid grid-cols-[40px_1fr_20px] items-center gap-3 shadow-md hover:shadow-lg transition-all"
        >
          <span className="w-10 h-10 rounded-xl bg-forest text-sun grid place-items-center shadow-inner border border-sun/25">
            <Network className="w-5 h-5 stroke-[2.2]" />
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-sun">
                Concientización Serrana
              </span>
              <span className="text-[7.5px] bg-rose-500/25 text-rose-300 border border-rose-500/35 px-1 py-0.2 rounded font-bold flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 text-sun" />
                <span>Simulador de Incendios</span>
              </span>
            </div>
            <strong className="font-serif text-[13px] font-bold text-white mt-0.5 leading-tight">
              Red Trófica & Equilibrio
            </strong>
            <p className="text-[#a5c2b5] text-[10px] line-clamp-1 mt-0.5">
              Simulá qué sucede si falta una especie o ante los fuegos del Uritorco.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-sun/70" />
        </motion.button>

        {/* 🗺️ Real Interactive Map of Villa Cielo & Balcones del Uritorco */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-forest" />
              <span>Senderos y Balcones del Uritorco</span>
            </span>
            <button
              onClick={() => {
                playPop();
                navigate('map');
              }}
              className="text-[10px] font-bold text-forest hover:text-forest-light flex items-center gap-0.5"
            >
              <span>Pantalla completa</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <InteractiveMap isCompact={true} />
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 gap-3 pt-0.5">
          {/* Mini-juegos */}
          <button
            onClick={() => {
              playPop();
              navigate('games');
            }}
            className="bg-paper hover:bg-white border border-line hover:border-coral/50 rounded-2xl p-3 grid grid-cols-[38px_1fr] items-center gap-2.5 text-left shadow-xs hover:shadow-md transition active:scale-[0.98]"
          >
            <span className="w-10 h-10 rounded-xl bg-coral-light text-[#7c3827] grid place-items-center shadow-inner">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <strong className="text-[11px] font-bold text-ink">
                4 Desafíos
              </strong>
              <small className="text-muted text-[9px]">Gana EXP y desbloquea cartas</small>
            </div>
          </button>

          {/* Álbum Coleccionable */}
          <button
            onClick={() => {
              playPop();
              navigate('wiki');
            }}
            className="bg-paper hover:bg-white border border-line hover:border-moss/50 rounded-2xl p-3 grid grid-cols-[38px_1fr] items-center gap-2.5 text-left shadow-xs hover:shadow-md transition active:scale-[0.98]"
          >
            <span className="w-10 h-10 rounded-xl bg-mint text-forest grid place-items-center shadow-inner">
              <BookOpen className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <strong className="text-[11px] font-bold text-ink">
                Álbum Serrana
              </strong>
              <small className="text-muted text-[9px]">
                {unlockedCount} / {totalSpecies} cartas coleccionadas
              </small>
            </div>
          </button>
        </div>

        {/* Points & QR Scanner Banner */}
        <div className="bg-forest text-white rounded-2xl p-3 px-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sun text-forest grid place-items-center">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <small className="text-[8px] text-white/70 uppercase tracking-wider font-bold block">
                Puntos de Guardián
              </small>
              <strong className="text-xs font-serif font-bold text-sun">
                {points.toLocaleString()} pts
              </strong>
            </div>
          </div>
          <button
            onClick={() => {
              playPop();
              navigate('scan');
            }}
            className="text-[9px] font-bold text-forest bg-sun hover:bg-sun-light px-2.5 py-1 rounded-xl shadow-xs"
          >
            Escanear QR
          </button>
        </div>
      </div>

      {/* BottomNav */}
      <BottomNav active="home" />
    </section>
  );
};
