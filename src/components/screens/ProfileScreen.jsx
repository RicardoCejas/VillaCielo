import React from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { 
  User, 
  Award, 
  RotateCcw, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  Gamepad2,
  Calendar
} from 'lucide-react';
import { playPop, playClick } from '../../utils/audio';

export const ProfileScreen = () => {
  const { 
    user, 
    profile, 
    setProfile, 
    exp, 
    points, 
    currentRank, 
    unlockedSpeciesIds, 
    logoutUser, 
    resetAllProgress, 
    setRanksModalOpen, 
    navigate, 
    goBack,
    theme, 
    t 
  } = useApp();

  const userAge = user?.age || (profile === 'Niños' ? 10 : 28);
  const isKidsAge = userAge <= 14;

  const handleToggleProfile = (newProfile) => {
    playClick();
    setProfile(newProfile);
  };

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-cream text-ink'
    }`}>
      {/* TopBar with Volver */}
      <TopBar
        title="Mi Perfil"
        onBack={goBack}
        backLabel="Volver"
        onSettings={() => navigate('settings')}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* User Card Header */}
        <div className={`p-4 rounded-3xl border shadow-sm flex items-center gap-3.5 ${
          theme === 'dark'
            ? 'bg-[#11261e] border-[#1e4536]'
            : 'bg-white border-line'
        }`}>
          <div className="w-14 h-14 rounded-2xl bg-forest text-sun font-bold font-serif text-xl grid place-items-center shadow-md">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'EX'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <strong className="text-sm font-bold truncate">
                {user?.name || 'Explorador del Monte'}
              </strong>
              <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                profile === 'Niños'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
              }`}>
                {profile === 'Niños' ? '🧒 Niños (1-14)' : '🌿 Adultos (15-99)'}
              </span>
            </div>
            <p className="text-[10px] text-muted truncate">
              {user?.email || 'explorador@villacielo.org'}
            </p>
            <span className="text-[9px] text-muted mt-0.5 block">
              Edad declarada: <strong>{userAge} años</strong>
            </span>
          </div>
        </div>

        {/* Profile Mode Switcher (Niño vs Adulto) */}
        <div className={`p-3 rounded-2xl border shadow-2xs space-y-2 ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-paper border-line'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-light">
              Adaptabilidad de Interfaz
            </span>
            <span className="text-[9px] text-muted">
              Criterio: 1-14 niños / 15-99 adultos
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleToggleProfile('Niños')}
              className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                profile === 'Niños'
                  ? 'bg-forest text-white border-forest shadow-xs'
                  : 'bg-black/5 dark:bg-white/5 border-line dark:border-[#1e4536] text-muted hover:text-ink'
              }`}
            >
              <span className="text-base">🧒</span>
              <div>
                <strong className="text-xs font-bold block leading-tight">Modo Niños</strong>
                <span className="text-[8px] opacity-80">1 a 14 años</span>
              </div>
            </button>

            <button
              onClick={() => handleToggleProfile('Adultos')}
              className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                profile === 'Adultos'
                  ? 'bg-forest text-white border-forest shadow-xs'
                  : 'bg-black/5 dark:bg-white/5 border-line dark:border-[#1e4536] text-muted hover:text-ink'
              }`}
            >
              <span className="text-base">🌿</span>
              <div>
                <strong className="text-xs font-bold block leading-tight">Modo Adultos</strong>
                <span className="text-[8px] opacity-80">15 a 99 años</span>
              </div>
            </button>
          </div>
        </div>

        {/* Rank & Stats Card */}
        <div className={`p-3 rounded-2xl border shadow-2xs space-y-2.5 ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-paper border-line'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-forest text-sun grid place-items-center text-lg">
                {currentRank.icon}
              </span>
              <div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-forest-light block">
                  Rango {currentRank.level} de 6
                </span>
                <strong className="text-xs font-bold leading-tight block">
                  {currentRank.title}
                </strong>
              </div>
            </div>

            <button
              onClick={() => {
                playPop();
                setRanksModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-forest/10 dark:bg-white/10 hover:bg-forest hover:text-white text-[9px] font-bold text-forest dark:text-sun transition"
            >
              Ver los 6 Rangos
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-line/60 dark:border-[#1f4335] text-center">
            <div className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5">
              <span className="text-[8px] text-muted block uppercase">Puntos</span>
              <strong className="text-xs font-bold text-forest">{points}</strong>
            </div>
            <div className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5">
              <span className="text-[8px] text-muted block uppercase">Experiencia</span>
              <strong className="text-xs font-bold text-forest">{exp} EXP</strong>
            </div>
            <div className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5">
              <span className="text-[8px] text-muted block uppercase">Cartas</span>
              <strong className="text-xs font-bold text-forest">{unlockedSpeciesIds.length} / 40</strong>
            </div>
          </div>
        </div>

        {/* Account Management & Actions */}
        <div className="space-y-2 pt-1">
          {/* Reset progress */}
          <button
            onClick={() => {
              if (window.confirm('¿Seguro que querés reiniciar tu progreso a Rango 1 con 0 EXP?')) {
                resetAllProgress();
              }
            }}
            className={`w-full p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#162e24] border-[#224b3a] text-rose-300 hover:bg-[#1a382b]'
                : 'bg-white border-line text-rose-700 hover:bg-rose-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>Reiniciar Progreso a Cero (0 EXP)</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
          </button>

          {/* Switch User */}
          <button
            onClick={logoutUser}
            className={`w-full p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#162e24] border-[#224b3a] text-muted hover:text-white'
                : 'bg-white border-line text-muted hover:text-ink'
            }`}
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Cambiar o Registrar Nuevo Usuario</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
          </button>
        </div>
      </div>
    </section>
  );
};
