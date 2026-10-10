import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Leaf, Volume2, VolumeX, Moon, Sun, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { playPop } from '../../utils/audio';

export const DeviceShell = ({ children }) => {
  const { 
    viewMode, 
    setViewMode, 
    settings, 
    toggleSound, 
    currentScreen, 
    navigate, 
    points,
    theme,
    toggleTheme,
    t
  } = useApp();
  
  const [currentTime, setCurrentTime] = useState('9:41');
  const [isFullScreenPhone] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const screenOptions = [
    { id: 'register', name: '00. Registro / Bienvenida' },
    { id: 'home', name: '01. Inicio y Dashboard' },
    { id: 'ecosystem', name: '02. Red Trófica e Incendios' },
    { id: 'map', name: '03. Plano y Balcones (Mapa)' },
    { id: 'scan', name: '04. Escáner QR y Códigos' },
    { id: 'wiki', name: '05. Guía de Biodiversidad' },
    { id: 'games', name: '06. Menú de Juegos' },
    { id: 'trivia', name: '🎮 Trivia Serrana' },
    { id: 'color', name: '🎨 Coloreá la Fauna' },
    { id: 'puzzle', name: '🧩 Puzzle del Paisaje' },
    { id: 'memory', name: '🃏 Memoria Silvestre' },
    { id: 'safari', name: '📷 Safari Fotográfico' },
    { id: 'recycling', name: '♻️ Guardián del Sendero' },
    { id: 'stargazing', name: '✨ Observatorio Estelar' },
    { id: 'profile', name: '11. Perfiles de Usuario' },
    { id: 'settings', name: '12. Ajustes e Idiomas' },
  ];

  return (
    <div className={`relative w-full h-[100dvh] flex items-center justify-center p-2 sm:p-6 overflow-hidden transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-[radial-gradient(circle_at_20%_20%,#163228,#050f0c)] text-[#e8f2ec]'
        : 'bg-[radial-gradient(circle_at_20%_20%,#ffffffb3,#0000_34%),linear-gradient(135deg,#dce9e2,#bdcec5)] text-ink'
    }`}>
      {/* Desktop Branding Aside (hidden on small viewports) */}
      <aside className="hidden xl:flex flex-col justify-between max-w-[340px] mr-12 select-none">
        <div>
          <div className="w-14 h-14 rounded-2xl bg-forest text-cream grid place-items-center mb-6 shadow-xl shadow-forest/20">
            <Leaf className="w-7 h-7" />
          </div>
          <span className="text-forest-light text-[11px] font-bold tracking-[2.2px] uppercase">
            RESERVA NATURAL INTERACTIVA
          </span>
          <h1 className={`font-serif text-5xl font-bold tracking-tight leading-[0.95] mt-3 mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-ink'
          }`}>
            Villa<br />Cielo Abierto
          </h1>
          <p className={`text-sm leading-relaxed mb-6 ${
            theme === 'dark' ? 'text-[#9bb5ab]' : 'text-[#52635c]'
          }`}>
            Prototipo interactivo en alta fidelidad diseñado para explorar, aprender y jugar. Incluye simulación de cámara, audio feedback, minijuegos y red trófica con impacto de incendios.
          </p>

          {/* Quick Screen Selector */}
          <div className={`backdrop-blur-md rounded-2xl p-4 border shadow-sm space-y-2.5 ${
            theme === 'dark'
              ? 'bg-[#0f241d]/85 border-[#1e4638]'
              : 'bg-white/70 border-[#173b32]/10'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-light">
                Navegación Rápida
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                theme === 'dark' ? 'bg-[#18392d] text-white border-[#275b47]' : 'bg-white text-muted border-line'
              }`}>
                {points} pts
              </span>
            </div>
            <select
              value={currentScreen}
              onChange={(e) => {
                playPop();
                navigate(e.target.value);
              }}
              className={`w-full text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-forest cursor-pointer shadow-xs border ${
                theme === 'dark'
                  ? 'bg-[#183b2f] text-white border-[#255242]'
                  : 'bg-white text-ink border-line'
              }`}
            >
              {screenOptions.map(opt => (
                <option key={opt.id} value={opt.id} className={theme === 'dark' ? 'bg-[#183b2f] text-white' : 'bg-white text-ink'}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode & Theme Switcher Button */}
        <div className="pt-6 border-t border-[#173b32]/15 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              playPop();
              setViewMode(viewMode === 'app' ? 'overview' : 'app');
            }}
            className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-xl border shadow-sm transition active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#132c22] text-[#d6ede3] border-[#224e3c] hover:bg-[#193a2d]'
                : 'bg-white/80 text-forest border-line hover:bg-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>12 Pantallas</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-xl grid place-items-center transition active:scale-95 border ${
                theme === 'dark'
                  ? 'bg-sun text-forest border-sun'
                  : 'bg-white text-forest border-line'
              }`}
              title={theme === 'dark' ? 'Cambiar a Modo Día' : 'Cambiar a Modo Noche'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`w-10 h-10 rounded-xl grid place-items-center transition active:scale-95 border ${
                settings.sound
                  ? 'bg-forest text-white border-forest'
                  : theme === 'dark'
                  ? 'bg-[#163327] text-muted border-[#254f3d]'
                  : 'bg-white text-muted border-line'
              }`}
              title={settings.sound ? 'Silenciar sonidos' : 'Activar sonidos'}
            >
              {settings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Floating Toolbar on mobile / small screens */}
      <div className={`xl:hidden fixed top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-lg text-xs font-semibold ${
        theme === 'dark' ? 'bg-[#0e241c]/90 border-[#224f3c] text-white' : 'bg-white/90 border-line text-ink'
      }`}>
        <button
          onClick={() => {
            playPop();
            setViewMode(viewMode === 'app' ? 'overview' : 'app');
          }}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-black/10 text-xs font-bold"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{viewMode === 'app' ? '12 Pantallas' : 'Móvil'}</span>
        </button>

        <span className="w-px h-4 bg-line opacity-50" />

        <button
          onClick={toggleTheme}
          className="p-1 rounded-lg hover:bg-black/10"
          title="Alternar día/noche"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-sun" /> : <Moon className="w-3.5 h-3.5 text-forest" />}
        </button>

        <span className="w-px h-4 bg-line opacity-50" />

        <button
          onClick={toggleSound}
          className="p-1 rounded-lg hover:bg-black/10"
          title="Alternar sonido"
        >
          {settings.sound ? <Volume2 className="w-3.5 h-3.5 text-forest dark:text-mint" /> : <VolumeX className="w-3.5 h-3.5 text-coral" />}
        </button>
      </div>

      {/* Smartphone Chassis Frame */}
      <div
        className={`relative transition-all duration-300 ${
          isFullScreenPhone
            ? 'w-full h-full max-w-none max-h-none border-0 rounded-none p-0'
            : theme === 'dark'
            ? 'w-full max-w-[420px] h-[100dvh] max-h-[850px] bg-[#07130e] border-[8px] border-[#07130e] rounded-[50px] p-[26px_8px_16px] shadow-2xl ring-1 ring-[#1b3d30]'
            : 'w-full max-w-[420px] h-[100dvh] max-h-[850px] bg-[#12241f] border-[8px] border-[#12241f] rounded-[50px] p-[26px_8px_16px] shadow-phone'
        }`}
      >
        {/* Status Bar */}
        {!isFullScreenPhone && (
          <div className="absolute top-2.5 inset-x-0 px-7 z-30 flex items-center justify-between text-white text-[10px] font-bold tracking-tight pointer-events-none select-none">
            <span>{currentTime}</span>

            {/* Dynamic Island / Speaker Pill */}
            <div className="w-24 h-4 bg-black/85 rounded-full mx-auto" />

            <div className="flex items-center gap-1.5">
              {/* Cellular Signal bars */}
              <div className="flex items-end gap-[1.5px] h-2.5">
                <span className="w-[2.5px] h-1 bg-white rounded-xs" />
                <span className="w-[2.5px] h-1.5 bg-white rounded-xs" />
                <span className="w-[2.5px] h-2 bg-white rounded-xs" />
                <span className="w-[2.5px] h-2.5 bg-white rounded-xs" />
              </div>

              {/* Battery */}
              <div className="w-4 h-2 border border-white rounded-[2px] p-[0.5px] flex items-center">
                <div className="h-full w-2.5 bg-white rounded-[1px]" />
              </div>
            </div>
          </div>
        )}

        {/* Viewport Content */}
        <div
          className={`relative w-full h-full overflow-hidden shadow-inner ${
            theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec] dark' : 'bg-cream text-ink'
          } ${settings.largeText ? 'large-text' : ''} ${
            isFullScreenPhone ? 'rounded-none' : 'rounded-[34px]'
          }`}
        >
          {children}
        </div>

        {/* Home Indicator Bar */}
        {!isFullScreenPhone && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/70 rounded-full pointer-events-none z-40" />
        )}
      </div>
    </div>
  );
};
