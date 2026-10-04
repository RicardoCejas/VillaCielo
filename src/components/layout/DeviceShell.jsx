import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Leaf, Volume2, VolumeX, Maximize2, Minimize2, LayoutGrid, Smartphone, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { playPop } from '../../utils/audio';

export const DeviceShell = ({ children }) => {
  const { viewMode, setViewMode, settings, toggleSound, currentScreen, navigate, points } = useApp();
  const [currentTime, setCurrentTime] = useState('9:41');
  const [isFullScreenPhone, setIsFullScreenPhone] = useState(false);

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
    { id: 'profile', name: '01. Selección de perfil' },
    { id: 'home', name: '02. Inicio y senderos' },
    { id: 'map', name: '🗺️ Mapa Villa Cielo (Uritorco)' },
    { id: 'scan', name: '03. Escáner QR' },
    { id: 'wiki', name: '04. Fauna & Flora Serrana' },
    { id: 'species-detail', name: '05. Ficha de especie' },
    { id: 'discovery', name: '06. Nuevo hallazgo' },
    { id: 'games', name: '07. Menú de 4 Juegos' },
    { id: 'safari', name: '📷 Safari Fotográfico' },
    { id: 'recycling', name: '♻️ Guardián del Sendero' },
    { id: 'stargazing', name: '✨ Observatorio de Estrellas' },
    { id: 'trivia', name: '🏆 Trivia Serrana' },
    { id: 'settings', name: '12. Ajustes' },
  ];

  return (
    <div className="relative w-full h-[100dvh] bg-[radial-gradient(circle_at_20%_20%,#ffffffb3,#0000_34%),linear-gradient(135deg,#dce9e2,#bdcec5)] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Desktop Branding Aside (hidden on small viewports) */}
      <aside className="hidden xl:flex flex-col justify-between max-w-[340px] mr-12 select-none">
        <div>
          <div className="w-14 h-14 rounded-2xl bg-forest text-cream grid place-items-center mb-6 shadow-xl shadow-forest/20">
            <Leaf className="w-7 h-7" />
          </div>
          <span className="text-forest-light text-[11px] font-bold tracking-[2.2px] uppercase">
            RESERVA NATURAL INTERACTIVA
          </span>
          <h1 className="font-serif text-5xl font-bold text-ink tracking-tight leading-[0.95] mt-3 mb-4">
            Villa<br />Cielo Abierto
          </h1>
          <p className="text-[#52635c] text-sm leading-relaxed mb-6">
            Prototipo interactivo en alta fidelidad diseñado para explorar, aprender y jugar. Incluye simulación de cámara, audio feedback, minijuegos y colección de biodiversidad.
          </p>

          {/* Quick Screen Selector */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-[#173b32]/10 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                Navegación Rápida
              </span>
              <span className="text-[10px] font-bold text-muted bg-white px-2 py-0.5 rounded-full border border-line">
                {points} pts
              </span>
            </div>
            <select
              value={currentScreen}
              onChange={(e) => {
                playPop();
                navigate(e.target.value);
              }}
              className="w-full text-xs font-semibold bg-white border border-line rounded-xl p-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-forest cursor-pointer shadow-xs"
            >
              {screenOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Switcher Button */}
        <div className="pt-8 border-t border-[#173b32]/15 flex items-center justify-between">
          <button
            onClick={() => {
              playPop();
              setViewMode(viewMode === 'app' ? 'overview' : 'app');
            }}
            className="flex items-center gap-2 text-xs font-bold text-forest bg-white/80 hover:bg-white px-4 py-2.5 rounded-xl border border-line shadow-sm transition active:scale-95"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Ver las 12 Pantallas</span>
          </button>

          <button
            onClick={toggleSound}
            className={`w-10 h-10 rounded-xl grid place-items-center transition ${
              settings.sound
                ? 'bg-forest text-white'
                : 'bg-white text-muted border border-line'
            }`}
            title={settings.sound ? 'Silenciar sonidos' : 'Activar sonidos'}
          >
            {settings.sound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Floating Toolbar on mobile / small screens */}
      <div className="xl:hidden fixed top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-line shadow-lg text-xs font-semibold">
        <button
          onClick={() => {
            playPop();
            setViewMode(viewMode === 'app' ? 'overview' : 'app');
          }}
          className="flex items-center gap-1.5 text-forest font-bold px-2 py-1 rounded-lg hover:bg-cream"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{viewMode === 'app' ? 'Ver 12 Pantallas' : 'Modo Móvil'}</span>
        </button>

        <span className="w-px h-4 bg-line" />

        <button
          onClick={toggleSound}
          className="p-1 rounded-lg text-forest hover:bg-cream"
          title="Alternar sonido"
        >
          {settings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-coral" />}
        </button>
      </div>

      {/* Smartphone Chassis Frame */}
      <div
        className={`relative transition-all duration-300 ${
          isFullScreenPhone
            ? 'w-full h-full max-w-none max-h-none border-0 rounded-none p-0'
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
          className={`relative w-full h-full bg-cream overflow-hidden shadow-inner ${
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
