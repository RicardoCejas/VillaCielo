import React from 'react';
import { useApp } from '../../context/AppContext';
import { SPECIES_LIST } from '../../data/speciesData';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { InteractiveMap } from './InteractiveMap';
import { 
  User, 
  Gamepad2, 
  BookOpen, 
  Map, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Network, 
  Flame,
  QrCode
} from 'lucide-react';
import { playPop } from '../../utils/audio';
import { motion } from 'framer-motion';

export const HomeScreen = () => {
  const { 
    user, 
    profile, 
    points, 
    exp, 
    currentRank, 
    unlockedSpeciesIds, 
    navigate, 
    setRanksModalOpen, 
    theme, 
    t 
  } = useApp();

  const totalSpecies = SPECIES_LIST.length;
  const unlockedCount = unlockedSpeciesIds.length;
  const expProgress = Math.min(
    100,
    Math.round(((exp - currentRank.minExp) / (currentRank.maxExp - currentRank.minExp)) * 100)
  );

  const displayName = user?.name || profile;
  const userAge = user?.age;

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-cream text-ink'
    }`}>
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
            <div className="flex items-center gap-1.5">
              <span className="text-forest-light text-[9px] font-bold tracking-[1.6px] uppercase block">
                {t('greetingMorning')}, {displayName}
              </span>
              {userAge && (
                <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full border ${
                  userAge < 13
                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300'
                }`}>
                  {userAge < 13 ? '🧒 Niños' : '🌿 Adultos'} ({userAge} años)
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight mt-0.5 leading-tight">
              {t('homeQuestion')}
            </h2>
          </div>
          <button
            onClick={() => {
              playPop();
              navigate('profile');
            }}
            className={`w-9 h-9 rounded-2xl grid place-items-center shadow-xs border transition-transform active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#153427] text-sun border-[#285b46]'
                : 'bg-mint text-forest border-moss/20 hover:scale-105'
            }`}
            aria-label="Cambiar perfil"
            title="Cambiar perfil"
          >
            <User className="w-4 h-4" />
          </button>
        </div>

        {/* 🛡️ Guardián Level & EXP Progression Card (6 Ranks with Real Utility) */}
        <div className={`rounded-2xl p-3 border shadow-xs space-y-2.5 transition-colors ${
          theme === 'dark'
            ? 'bg-[#11261e] border-[#1f4535]'
            : 'bg-paper border-line'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-forest text-sun grid place-items-center text-base shadow-xs">
                {currentRank.icon}
              </span>
              <div>
                <span className="text-[8px] font-bold text-forest-light uppercase tracking-wider block">
                  Rango {currentRank.level} de 6 · {currentRank.title}
                </span>
                <strong className="text-xs font-bold leading-none block mt-0.5">
                  {exp} EXP acumulada
                </strong>
              </div>
            </div>

            <button
              onClick={() => {
                playPop();
                setRanksModalOpen(true);
              }}
              className={`text-[9px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1 transition ${
                theme === 'dark'
                  ? 'bg-[#18392d] text-sun border-[#2b614c] hover:bg-[#204939]'
                  : 'bg-cream hover:bg-cream-dark text-forest border-line'
              }`}
            >
              <span>{t('viewAllRanks')}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Unlocked utility of this rank */}
          <div className={`p-2 rounded-xl text-[10px] flex items-center gap-2 ${
            theme === 'dark' ? 'bg-[#0a1813]/60 text-[#a9c7b9]' : 'bg-[#eef4f0] text-forest'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-forest shrink-0" />
            <div className="line-clamp-1 leading-tight">
              <span className="font-bold">Utilidad activa:</span> {currentRank.perk}
            </div>
          </div>

          {/* EXP Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[9px] text-muted mb-1 font-medium">
              <span>{t('nextRankLabel')}</span>
              <span>{exp} / {currentRank.maxExp} EXP</span>
            </div>
            <div className="w-full h-1.5 bg-[#dbe5df] dark:bg-[#1a382b] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-forest rounded-full"
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
          className="w-full text-left bg-gradient-to-r from-[#10241b] via-[#163326] to-[#1c3f30] border border-[#27533f] hover:border-sun/60 rounded-2xl p-3 grid grid-cols-[38px_1fr_20px] items-center gap-3 shadow-md hover:shadow-lg transition-all"
        >
          <span className="w-9 h-9 rounded-xl bg-forest text-sun grid place-items-center shadow-inner border border-sun/25">
            <Network className="w-4 h-4 stroke-[2.2]" />
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-sun">
                {t('trophicBannerTitle')}
              </span>
              <span className="text-[7.5px] bg-rose-500/25 text-rose-300 border border-rose-500/35 px-1 py-0.2 rounded font-bold flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 text-sun" />
                <span>{t('trophicBannerBadge')}</span>
              </span>
            </div>
            <strong className="font-serif text-xs font-bold text-white mt-0.5 leading-tight">
              Red Trófica & Impacto de Ausencia
            </strong>
            <p className="text-[#a5c2b5] text-[10px] line-clamp-1 mt-0.5">
              {t('trophicBannerDesc')}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-sun/70 justify-self-end" />
        </motion.button>

        {/* 🗺️ Real Interactive Map of Villa Cielo & Balcones del Uritorco */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-light flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5" />
              <span>{t('quickMapTitle')}</span>
            </span>
            <button
              onClick={() => {
                playPop();
                navigate('map');
              }}
              className="text-[10px] font-bold text-forest-light hover:underline flex items-center gap-0.5"
            >
              <span>Pantalla completa</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <InteractiveMap isCompact={true} />
        </div>

        {/* Quick Access Grid (Games & Wiki) */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          {/* Juegos según edad */}
          <button
            onClick={() => {
              playPop();
              navigate('games');
            }}
            className={`rounded-2xl p-3 grid grid-cols-[34px_1fr] items-center gap-2 text-left border shadow-xs transition active:scale-[0.98] ${
              theme === 'dark'
                ? 'bg-[#11261e] border-[#1e4536] hover:bg-[#163327]'
                : 'bg-paper hover:bg-white border-line'
            }`}
          >
            <span className="w-8 h-8 rounded-xl bg-forest/20 text-forest dark:text-sun grid place-items-center">
              <Gamepad2 className="w-4 h-4" />
            </span>
            <div className="flex flex-col">
              <strong className="text-xs font-bold">
                Juegos
              </strong>
              <small className="text-muted text-[9px] line-clamp-1">
                {userAge && userAge < 13 ? 'Puzzles & Dibujo' : 'Trivia & Memoria'}
              </small>
            </div>
          </button>

          {/* Álbum Coleccionable */}
          <button
            onClick={() => {
              playPop();
              navigate('wiki');
            }}
            className={`rounded-2xl p-3 grid grid-cols-[34px_1fr] items-center gap-2 text-left border shadow-xs transition active:scale-[0.98] ${
              theme === 'dark'
                ? 'bg-[#11261e] border-[#1e4536] hover:bg-[#163327]'
                : 'bg-paper hover:bg-white border-line'
            }`}
          >
            <span className="w-8 h-8 rounded-xl bg-forest/20 text-forest dark:text-sun grid place-items-center">
              <BookOpen className="w-4 h-4" />
            </span>
            <div className="flex flex-col">
              <strong className="text-xs font-bold">
                Wiki Serrana
              </strong>
              <small className="text-muted text-[9px] line-clamp-1">
                {unlockedCount} / {totalSpecies} cartas
              </small>
            </div>
          </button>
        </div>

        {/* Points & QR Scanner Banner */}
        <div className="bg-forest text-white rounded-2xl p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sun text-forest grid place-items-center">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <small className="text-[8px] text-white/70 uppercase tracking-wider font-bold block">
                Puntos de Explorador
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
            className="flex items-center gap-1 text-[9px] font-bold text-forest bg-sun hover:bg-sun-light px-2.5 py-1.5 rounded-xl shadow-xs transition active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t('navScan')}</span>
          </button>
        </div>
      </div>

      {/* BottomNav */}
      <BottomNav active="home" />
    </section>
  );
};
