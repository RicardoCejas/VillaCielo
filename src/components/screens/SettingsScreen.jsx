import React from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { User, BookOpen, Gamepad2, Puzzle, Info, Check, Volume2, Music, Vibrate, Lightbulb, ChevronRight } from 'lucide-react';
import { playPop, playSuccess } from '../../utils/audio';

export const SettingsScreen = () => {
  const { settings, updateSetting, goBack, profile, navigate, addToast } = useApp();

  const handleSave = () => {
    playSuccess();
    addToast('Ajustes guardados', 'Preferencias actualizadas con éxito', 'success');
    goBack();
  };

  const languages = [
    ['Español', 'ES'],
    ['English', 'EN'],
    ['Português', 'PT'],
    ['Français', 'FR']
  ];

  const toggles = [
    { key: 'sound', label: 'Sonidos', desc: 'Efectos y respuestas táctiles', icon: Volume2 },
    { key: 'music', label: 'Música', desc: 'Ambiente de la reserva', icon: Music },
    { key: 'vibration', label: 'Vibración', desc: 'Al acertar o escanear', icon: Vibrate },
    { key: 'hints', label: 'Pistas', desc: 'Ayuda durante los desafíos', icon: Lightbulb }
  ];

  return (
    <section className={`relative w-full h-full bg-cream flex flex-col justify-between overflow-hidden ${
      settings.largeText ? 'text-[115%]' : ''
    }`}>
      {/* TopBar */}
      <TopBar
        title="Ajustes"
        onBack={goBack}
        showSoundToggle={false}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Active Profile Card */}
        <button
          onClick={() => navigate('profile')}
          className="w-full text-left bg-forest text-white rounded-2xl p-3 grid grid-cols-[38px_1fr_20px] items-center gap-2.5 shadow-md active:scale-95 transition"
        >
          <span className="w-9 h-9 rounded-xl bg-sun text-forest grid place-items-center">
            <User className="w-5 h-5" />
          </span>
          <div className="flex flex-col">
            <small className="text-[#b4cdc2] text-[8px] font-bold uppercase tracking-wider">
              Perfil Activo
            </small>
            <strong className="text-xs font-bold font-serif text-white">
              Explorador ({profile})
            </strong>
          </div>
          <ChevronRight className="w-4 h-4 text-white/50" />
        </button>

        {/* Idioma Group */}
        <div className="bg-paper border border-line rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-7 h-7 rounded-lg bg-mint text-forest grid place-items-center">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <strong className="text-xs font-bold text-ink block leading-tight">
                Idioma
              </strong>
              <small className="text-muted text-[9px]">Idioma de la aplicación</small>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {languages.map(([name, code]) => (
              <button
                key={code}
                onClick={() => updateSetting('language', code)}
                className={`p-2 rounded-xl text-left border grid grid-cols-[22px_1fr_16px] items-center gap-1.5 transition text-[11px] ${
                  settings.language === code
                    ? 'border-moss bg-mint text-forest font-bold'
                    : 'border-line bg-cream hover:bg-cream-dark text-muted'
                }`}
              >
                <span className="w-5 h-5 rounded-md bg-white text-forest text-[8px] font-bold grid place-items-center shadow-xs">
                  {code}
                </span>
                <span className="truncate">{name}</span>
                {settings.language === code && (
                  <Check className="w-3.5 h-3.5 text-forest stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Experiencia de juego (Toggles) */}
        <div className="bg-paper border border-line rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-7 h-7 rounded-lg bg-mint text-forest grid place-items-center">
              <Gamepad2 className="w-4 h-4" />
            </span>
            <div>
              <strong className="text-xs font-bold text-ink block leading-tight">
                Experiencia de juego
              </strong>
              <small className="text-muted text-[9px]">Personalizá tus partidas</small>
            </div>
          </div>

          <div className="divide-y divide-line/60">
            {toggles.map(t => {
              const Icon = t.icon;
              return (
                <label
                  key={t.key}
                  className="py-2 grid grid-cols-[30px_1fr_40px] items-center gap-2 cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-lg bg-cream text-forest grid place-items-center">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="flex flex-col">
                    <strong className="text-xs text-ink">{t.label}</strong>
                    <small className="text-muted text-[9px]">{t.desc}</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[t.key]}
                    onChange={(e) => updateSetting(t.key, e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      settings[t.key] ? 'bg-forest' : 'bg-[#d8ddd9]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        settings[t.key] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Dificultad Group */}
        <div className="bg-paper border border-line rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-7 h-7 rounded-lg bg-mint text-forest grid place-items-center">
              <Puzzle className="w-4 h-4" />
            </span>
            <div>
              <strong className="text-xs font-bold text-ink block leading-tight">
                Dificultad
              </strong>
              <small className="text-muted text-[9px]">Nivel predeterminado</small>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {['Fácil', 'Normal', 'Difícil'].map(lvl => (
              <button
                key={lvl}
                onClick={() => updateSetting('difficulty', lvl)}
                className={`py-1.5 rounded-xl border text-[11px] font-semibold transition ${
                  settings.difficulty === lvl
                    ? 'bg-forest text-white border-forest font-bold'
                    : 'bg-cream text-muted border-line hover:text-ink'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Texto grande (Accesibilidad) */}
        <label className="bg-paper border border-line rounded-2xl p-3 shadow-sm grid grid-cols-[30px_1fr_40px] items-center gap-2 cursor-pointer">
          <span className="w-7 h-7 rounded-lg bg-mint text-forest grid place-items-center">
            <Info className="w-4 h-4" />
          </span>
          <div className="flex flex-col">
            <strong className="text-xs text-ink">Texto grande</strong>
            <small className="text-muted text-[9px]">Mejora la lectura del contenido</small>
          </div>
          <input
            type="checkbox"
            checked={settings.largeText}
            onChange={(e) => updateSetting('largeText', e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              settings.largeText ? 'bg-forest' : 'bg-[#d8ddd9]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                settings.largeText ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </label>

        {/* Guardar Cambios */}
        <button
          onClick={handleSave}
          className="w-full h-12 rounded-2xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-forest/20 active:scale-95 transition"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>GUARDAR CAMBIOS</span>
        </button>
      </div>
    </section>
  );
};
