import React from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { 
  User, 
  BookOpen, 
  Gamepad2, 
  Puzzle, 
  Info, 
  Check, 
  Volume2, 
  Lightbulb, 
  Sun,
  Moon,
  LogOut,
  RotateCcw
} from 'lucide-react';
import { playPop, playSuccess } from '../../utils/audio';

export const SettingsScreen = () => {
  const { 
    settings, 
    updateSetting, 
    goBack, 
    profile, 
    navigate, 
    addToast,
    theme,
    toggleTheme,
    user,
    logoutUser,
    resetAllProgress,
    t
  } = useApp();

  const handleSave = () => {
    playSuccess();
    addToast(t('toastSettingsSaved'), '', 'success');
    goBack();
  };

  const languages = [
    ['Español', 'ES'],
    ['English', 'EN'],
    ['Português', 'PT'],
    ['Deutsch', 'DE'],
    ['Français', 'FR'],
    ['Italiano', 'IT']
  ];

  const toggles = [
    { key: 'sound', label: t('settingsSound'), desc: t('settingsSoundDesc'), icon: Volume2 },
    { key: 'hints', label: 'Pistas y Ayudas', desc: 'Sugerencias en los desafíos', icon: Lightbulb }
  ];

  const userAge = user?.age || (profile === 'Niños' ? 10 : 25);

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden transition-colors ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-cream text-ink'
    } ${settings.largeText ? 'large-text' : ''}`}>
      {/* TopBar */}
      <TopBar
        title={t('settingsTitle')}
        onBack={goBack}
        showSoundToggle={false}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {/* Active Profile Card */}
        <div
          className={`rounded-2xl p-3 grid grid-cols-[38px_1fr_auto] items-center gap-2.5 shadow-sm border ${
            theme === 'dark'
              ? 'bg-[#12261e] border-[#1e4536]'
              : 'bg-forest text-white border-forest'
          }`}
        >
          <span className="w-9 h-9 rounded-xl bg-sun text-forest grid place-items-center shadow-xs">
            <User className="w-5 h-5" />
          </span>
          <div className="flex flex-col">
            <small className="text-[#a5c3b6] text-[8px] font-bold uppercase tracking-wider">
              {t('settingsProfile')}
            </small>
            <strong className="text-xs font-bold font-serif leading-none mt-0.5 text-white">
              {user?.name || 'Explorador'} ({profile})
            </strong>
            <span className="text-[9px] text-[#bed8cc] mt-0.5">
              {userAge} años · {userAge <= 14 ? 'Niños (1-14 años)' : 'Adultos (15-99 años)'}
            </span>
          </div>
          <button
            onClick={() => navigate('profile')}
            className="text-[9px] font-bold bg-white/15 hover:bg-white/25 text-white px-2 py-1 rounded-xl transition"
          >
            Ver Perfil
          </button>
        </div>

        {/* Modo de Pantalla: Claro (Día) u Oscuro (Noche) */}
        <div className={`rounded-2xl p-3 border shadow-2xs space-y-2 ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-paper border-line'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-mint text-forest grid place-items-center">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </span>
            <div>
              <strong className="text-xs font-bold block leading-tight">
                {t('settingsTheme')}
              </strong>
              <small className="text-muted text-[9px]">{t('settingsThemeDesc')}</small>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                if (theme !== 'light') toggleTheme();
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                theme === 'light'
                  ? 'bg-forest text-white border-forest shadow-xs'
                  : 'bg-black/5 dark:bg-white/5 border-line dark:border-[#204535] text-muted'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{t('themeLight')}</span>
            </button>

            <button
              onClick={() => {
                if (theme !== 'dark') toggleTheme();
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                theme === 'dark'
                  ? 'bg-forest text-white border-forest shadow-xs'
                  : 'bg-black/5 dark:bg-white/5 border-line dark:border-[#204535] text-muted'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{t('themeDark')}</span>
            </button>
          </div>
        </div>

        {/* Idioma Group: 6 Idiomas */}
        <div className={`rounded-2xl p-3 border shadow-2xs space-y-2 ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-paper border-line'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-mint text-forest grid place-items-center">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <strong className="text-xs font-bold block leading-tight">
                {t('settingsLanguage')}
              </strong>
              <small className="text-muted text-[9px]">Seleccioná tu idioma preferido</small>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {languages.map(([name, code]) => (
              <button
                key={code}
                onClick={() => updateSetting('language', code)}
                className={`py-2 px-1 rounded-xl text-center border transition text-[11px] font-bold ${
                  settings.language === code
                    ? 'border-forest bg-forest text-white shadow-xs'
                    : 'border-line dark:border-[#204535] bg-black/5 dark:bg-white/5 text-muted hover:text-ink dark:hover:text-white'
                }`}
              >
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Texto grande (Accesibilidad real) */}
        <label className={`rounded-2xl p-3 border shadow-2xs grid grid-cols-[30px_1fr_40px] items-center gap-2 cursor-pointer ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-paper border-line'
        }`}>
          <span className="w-7 h-7 rounded-lg bg-mint text-forest grid place-items-center">
            <Info className="w-4 h-4" />
          </span>
          <div className="flex flex-col">
            <strong className="text-xs font-bold">{t('settingsLargeText')}</strong>
            <small className="text-muted text-[9px]">{t('settingsLargeTextDesc')}</small>
          </div>
          <input
            type="checkbox"
            checked={settings.largeText}
            onChange={(e) => updateSetting('largeText', e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              settings.largeText ? 'bg-forest' : 'bg-[#cdd5d1] dark:bg-[#1f3f32]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                settings.largeText ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </label>

        {/* Sonidos Toggle */}
        <div className={`rounded-2xl p-3 border shadow-2xs ${
          theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-paper border-line'
        }`}>
          <div className="divide-y divide-line/60 dark:divide-[#204535]">
            {toggles.map(tgl => {
              const Icon = tgl.icon;
              return (
                <label
                  key={tgl.key}
                  className="py-1.5 grid grid-cols-[30px_1fr_40px] items-center gap-2 cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-lg bg-cream dark:bg-[#17382c] text-forest dark:text-mint grid place-items-center">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="flex flex-col">
                    <strong className="text-xs font-bold">{tgl.label}</strong>
                    <small className="text-muted text-[9px]">{tgl.desc}</small>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[tgl.key]}
                    onChange={(e) => updateSetting(tgl.key, e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      settings[tgl.key] ? 'bg-forest' : 'bg-[#cdd5d1] dark:bg-[#1f3f32]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        settings[tgl.key] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Reiniciar progreso a cero */}
        <button
          onClick={() => {
            if (window.confirm('¿Deseas reiniciar tu progreso a Rango 1 con 0 EXP?')) {
              resetAllProgress();
            }
          }}
          className={`w-full py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 ${
            theme === 'dark'
              ? 'bg-[#183025] border-[#254f3d] text-rose-300 hover:bg-[#1d3d2f]'
              : 'bg-white border-line text-rose-700 hover:bg-rose-50'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
          <span>{t('btnResetProgress')}</span>
        </button>

        {/* Guardar Cambios */}
        <button
          onClick={handleSave}
          className="w-full h-11 rounded-2xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-forest/20 active:scale-95 transition"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{t('btnSaveSettings')}</span>
        </button>
      </div>
    </section>
  );
};
