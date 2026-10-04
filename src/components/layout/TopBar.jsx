import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Settings, Volume2, VolumeX, Leaf } from 'lucide-react';
import { playClick } from '../../utils/audio';

export const TopBar = ({
  title,
  onBack,
  onSettings,
  light = false,
  showSoundToggle = true,
  backLabel = 'Volver'
}) => {
  const { settings, toggleSound } = useApp();

  return (
    <header
      className={`relative z-30 flex items-center justify-between min-h-[58px] px-3.5 py-2 transition-colors duration-200 ${
        light
          ? 'bg-transparent text-white border-b-0'
          : 'bg-[#f7f3e8]/92 backdrop-blur-md border-b border-[#173b32]/10 text-ink'
      }`}
    >
      {/* Left button: Visible & Stylized "← Volver" button when onBack exists */}
      <div className="flex items-center min-w-[84px]">
        {onBack ? (
          <button
            onClick={() => {
              playClick();
              onBack();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 group ${
              light
                ? 'bg-black/35 hover:bg-black/50 text-white backdrop-blur-md border border-white/20'
                : 'bg-white hover:bg-cream-light text-forest border border-line hover:border-moss'
            }`}
            aria-label="Volver atrás"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
            <span className="tracking-tight">{backLabel}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-forest text-white grid place-items-center shadow-md">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Center Title */}
      <div className="flex-1 px-2 flex flex-col items-center text-center overflow-hidden">
        <strong className="font-serif text-sm sm:text-base tracking-tight font-bold truncate max-w-[190px]">
          {title}
        </strong>
        {!onBack && (
          <span
            className={`text-[8px] font-bold tracking-[1.6px] uppercase mt-0.5 ${
              light ? 'text-white/80' : 'text-muted'
            }`}
          >
            Villa Cielo · Capilla del Monte
          </span>
        )}
      </div>

      {/* Right Actions: Sound & Settings */}
      <div className="flex items-center justify-end gap-1.5 min-w-[84px]">
        {showSoundToggle && (
          <button
            onClick={toggleSound}
            className={`w-8 h-8 rounded-xl grid place-items-center transition-all ${
              light
                ? 'bg-black/35 text-white hover:bg-black/50 border border-white/20'
                : 'bg-white text-forest hover:bg-cream-light border border-line'
            }`}
            title={settings.sound ? 'Silenciar sonidos' : 'Activar sonidos'}
            aria-label="Alternar sonido"
          >
            {settings.sound ? (
              <Volume2 className="w-4 h-4 text-forest" />
            ) : (
              <VolumeX className="w-4 h-4 text-coral" />
            )}
          </button>
        )}

        {onSettings && (
          <button
            onClick={() => {
              playClick();
              onSettings();
            }}
            className={`h-8 px-2.5 rounded-xl flex items-center justify-center gap-1 text-[9px] font-bold shadow-sm transition-transform active:scale-95 ${
              light
                ? 'bg-black/35 text-white backdrop-blur-md hover:bg-black/50 border border-white/20'
                : 'bg-white text-forest hover:bg-cream-light border border-line'
            }`}
            aria-label="Ajustes"
            title="Ajustes"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
