import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Settings, Volume2, VolumeX, Leaf, Sun, Moon } from 'lucide-react';
import { playClick } from '../../utils/audio';

export const TopBar = ({
  title,
  onBack,
  onSettings,
  light = false,
  showSoundToggle = true,
  backLabel
}) => {
  const { settings, toggleSound, theme, toggleTheme, t } = useApp();
  const label = backLabel || t('back');

  const isDarkUi = light || theme === 'dark';

  return (
    <header
      className={`relative z-30 flex items-center justify-between min-h-[56px] px-3.5 py-1.5 transition-colors duration-200 border-b ${
        isDarkUi
          ? 'bg-[#0a1813]/90 backdrop-blur-md border-[#1b3d2f]/70 text-[#e8f2ec]'
          : 'bg-[#f7f3e8]/92 backdrop-blur-md border-[#173b32]/10 text-ink'
      }`}
    >
      {/* Left button: Visible & Stylized "← Volver" button when onBack exists */}
      <div className="flex items-center min-w-[78px]">
        {onBack ? (
          <button
            onClick={() => {
              playClick();
              onBack();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 group ${
              isDarkUi
                ? 'bg-[#153427] hover:bg-[#1b4333] text-white border border-[#275d46]'
                : 'bg-white hover:bg-cream-light text-forest border border-line hover:border-moss'
            }`}
            aria-label="Volver atrás"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
            <span className="tracking-tight">{label}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-forest text-sun grid place-items-center shadow-md">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Center Title */}
      <div className="flex-1 px-2 flex flex-col items-center text-center overflow-hidden">
        <strong className="font-serif text-sm sm:text-base tracking-tight font-bold truncate max-w-[170px]">
          {title}
        </strong>
        {!onBack && (
          <span
            className={`text-[8px] font-bold tracking-[1.6px] uppercase mt-0.5 ${
              isDarkUi ? 'text-[#8ba79b]' : 'text-muted'
            }`}
          >
            Villa Cielo · Capilla del Monte
          </span>
        )}
      </div>

      {/* Right Actions: Theme, Sound & Settings */}
      <div className="flex items-center justify-end gap-1.5 min-w-[78px]">
        {/* Quick Theme Toggle (Day / Night in reserve) */}
        <button
          onClick={toggleTheme}
          className={`w-7 h-7 rounded-xl grid place-items-center transition-all ${
            isDarkUi
              ? 'bg-[#153427] text-sun hover:bg-[#1b4333] border border-[#275d46]'
              : 'bg-white text-forest hover:bg-cream-light border border-line'
          }`}
          title={theme === 'dark' ? 'Modo Día' : 'Modo Noche'}
          aria-label="Alternar modo día y noche"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-sun" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-forest" />
          )}
        </button>

        {showSoundToggle && (
          <button
            onClick={toggleSound}
            className={`w-7 h-7 rounded-xl grid place-items-center transition-all ${
              isDarkUi
                ? 'bg-[#153427] text-white hover:bg-[#1b4333] border border-[#275d46]'
                : 'bg-white text-forest hover:bg-cream-light border border-line'
            }`}
            title={settings.sound ? 'Silenciar sonidos' : 'Activar sonidos'}
            aria-label="Alternar sonido"
          >
            {settings.sound ? (
              <Volume2 className="w-3.5 h-3.5 text-forest dark:text-mint" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-coral" />
            )}
          </button>
        )}

        {onSettings && (
          <button
            onClick={() => {
              playClick();
              onSettings();
            }}
            className={`h-7 px-2 rounded-xl flex items-center justify-center gap-1 text-[9px] font-bold shadow-sm transition-transform active:scale-95 ${
              isDarkUi
                ? 'bg-[#153427] text-white hover:bg-[#1b4333] border border-[#275d46]'
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
