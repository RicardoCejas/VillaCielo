import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IMAGES } from '../../data/speciesData';
import { Leaf, User, Mail, Lock, Shield, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPop, playClick } from '../../utils/audio';

export const RegisterScreen = () => {
  const { registerUser, theme, t } = useApp();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Social modal state
  const [socialModal, setSocialModal] = useState(null); // 'Google' | 'Facebook' | null
  const [socialAge, setSocialAge] = useState('12');
  const [socialName, setSocialName] = useState('');

  const numericAge = parseInt(age, 10);
  const isKidsProfile = !isNaN(numericAge) && numericAge >= 1 && numericAge <= 14;
  const isAdultsProfile = !isNaN(numericAge) && numericAge >= 15 && numericAge <= 99;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Por favor ingresá tu nombre o apodo.');
      return;
    }
    if (!age || isNaN(numericAge) || numericAge < 1 || numericAge > 99) {
      setErrorMsg('Por favor ingresá una edad válida entre 1 y 99 años.');
      return;
    }

    setErrorMsg('');
    registerUser({
      name: name.trim(),
      age: numericAge,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@villacielo.org`,
      method: 'form'
    });
  };

  const handleOpenSocialModal = (provider) => {
    playClick();
    setSocialModal(provider);
    setSocialName(provider === 'Google' ? 'Lucas Cejas' : 'Lucas Cejas (FB)');
    setSocialAge('12'); // default
  };

  const handleConfirmSocialRegister = () => {
    playClick();
    const finalAge = parseInt(socialAge, 10) || 12;
    registerUser({
      name: socialName || (socialModal === 'Google' ? 'Explorador Google' : 'Explorador Facebook'),
      age: finalAge,
      email: `${socialModal.toLowerCase()}.user@ejemplo.com`,
      method: socialModal
    });
    setSocialModal(null);
  };

  const numericSocialAge = parseInt(socialAge, 10);
  const isSocialKids = !isNaN(numericSocialAge) && numericSocialAge >= 1 && numericSocialAge <= 14;

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-[#f7f5ee] text-[#18302a]'
    }`}>
      {/* Background Header Trail */}
      <div className="relative h-[27%] w-full overflow-hidden shrink-0">
        <img
          src={IMAGES.uritorco}
          alt="Cerro Uritorco y Villa Cielo"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${
          theme === 'dark'
            ? 'from-[#071610]/40 via-[#0a1813]/80 to-[#0a1813]'
            : 'from-[#173b32]/40 via-[#f7f5ee]/80 to-[#f7f5ee]'
        }`} />

        {/* Brand badge over header */}
        <div className="absolute top-4 left-5 right-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-forest text-sun grid place-items-center shadow-md border border-white/20">
              <Leaf className="w-4 h-4 stroke-[2.3]" />
            </div>
            <div>
              <span className="text-[8px] font-bold tracking-[1.8px] uppercase text-white drop-shadow block">
                Reserva Natural Municipal
              </span>
              <strong className="font-serif text-sm font-bold text-white drop-shadow leading-none">
                Villa Cielo
              </strong>
            </div>
          </div>
          <span className="text-[9px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
            Capilla del Monte
          </span>
        </div>
      </div>

      {/* Main Registration Form */}
      <div className="flex-1 flex flex-col justify-between px-5 pb-4 pt-1 overflow-y-auto">
        <div>
          <div className="mb-2.5">
            <span className="text-[9px] font-bold tracking-[1.6px] uppercase text-forest-light block">
              Bienvenida & Registro
            </span>
            <h1 className="font-serif text-2xl font-bold tracking-tight leading-tight">
              Creá tu perfil de Guardián
            </h1>
            <p className="text-xs text-muted mt-0.5 leading-snug">
              Tu edad define automáticamente si explorás en <strong>Perfil Niños (1-14)</strong> o <strong>Perfil Adultos (15-99)</strong>.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Input: Nombre */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
                Nombre o Apodo *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Mateo, Valentina, Carlos..."
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 transition ${
                    theme === 'dark'
                      ? 'bg-[#12261e] border-[#224637] text-white focus:ring-forest-light'
                      : 'bg-white border-line text-ink focus:ring-forest'
                  }`}
                />
              </div>
            </div>

            {/* Input: Edad con Auto-detección: 1-14 = Niños, 15-99 = Adultos */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Edad (1 a 99 años) *
                </label>
                {isKidsProfile && (
                  <span className="text-[8.5px] font-bold text-amber-800 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    🧒 Perfil Niños (1 a 14)
                  </span>
                )}
                {isAdultsProfile && (
                  <span className="text-[8.5px] font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    🌿 Perfil Adultos (15 a 99)
                  </span>
                )}
              </div>
              <input
                type="number"
                min="1"
                max="99"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ej: 8 para chicos, 32 para adultos"
                className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 transition ${
                  theme === 'dark'
                    ? 'bg-[#12261e] border-[#224637] text-white focus:ring-forest-light'
                    : 'bg-white border-line text-ink focus:ring-forest'
                }`}
              />
              <p className="text-[9px] text-muted mt-1 leading-tight">
                {isKidsProfile
                  ? '🎮 Recibirás desafíos visuales: Colorear, Puzzles simples y Trivia ilustrada.'
                  : isAdultsProfile
                  ? '🔬 Recibirás desafíos profundos: Red trófica, botánica serrana y prevención de incendios.'
                  : 'Ingresá tu edad: 1-14 niños, 15-99 adultos.'}
              </p>
            </div>

            {/* Input: Correo */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
                Correo Electrónico (opcional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorador@villacielo.org"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 transition ${
                    theme === 'dark'
                      ? 'bg-[#12261e] border-[#224637] text-white focus:ring-forest-light'
                      : 'bg-white border-line text-ink focus:ring-forest'
                  }`}
                />
              </div>
            </div>

            {/* Input: Contraseña */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 transition ${
                    theme === 'dark'
                      ? 'bg-[#12261e] border-[#224637] text-white focus:ring-forest-light'
                      : 'bg-white border-line text-ink focus:ring-forest'
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2.5 h-10 rounded-xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
            >
              <span>COMENZAR AVENTURA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social login divider */}
          <div className="relative my-2.5 text-center">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-line" />
            <span className={`relative px-3 text-[10px] uppercase font-bold text-muted ${
              theme === 'dark' ? 'bg-[#0a1813]' : 'bg-[#f7f5ee]'
            }`}>
              o ingresá con
            </span>
          </div>

          {/* Social login buttons (open interactive age selector modal) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOpenSocialModal('Google')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold shadow-2xs transition active:scale-95 ${
                theme === 'dark'
                  ? 'bg-[#142c22] border-[#254d3d] text-white hover:bg-[#1a382c]'
                  : 'bg-white border-line text-ink hover:bg-cream'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenSocialModal('Facebook')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold shadow-2xs transition active:scale-95 ${
                theme === 'dark'
                  ? 'bg-[#142c22] border-[#254d3d] text-white hover:bg-[#1a382c]'
                  : 'bg-white border-line text-ink hover:bg-cream'
              }`}
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Footer conservation pledge */}
        <div className="mt-3 pt-2 border-t border-line/60 text-center">
          <small className="text-[9px] text-muted flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-forest" />
            <span>Reserva Natural Villa Cielo · Inicio limpio en Rango 1 (0 EXP)</span>
          </small>
        </div>
      </div>

      {/* Interactive Social Login Age Selection Modal */}
      <AnimatePresence>
        {socialModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className={`w-full max-w-xs p-5 rounded-3xl border shadow-2xl ${
                theme === 'dark'
                  ? 'bg-[#0f241d] border-[#224d3c] text-white'
                  : 'bg-white border-line text-ink'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-forest/20 grid place-items-center">
                    {socialModal === 'Google' ? '🌐' : '📘'}
                  </span>
                  <div>
                    <strong className="text-xs font-bold block leading-tight">
                      Acceso con {socialModal}
                    </strong>
                    <span className="text-[9px] text-muted">
                      Configurá tu edad de explorador
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSocialModal(null)}
                  className="p-1 rounded-lg text-muted hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulated user identity */}
              <div className={`p-2.5 rounded-xl border mb-3 flex items-center gap-2.5 ${
                theme === 'dark' ? 'bg-[#153428] border-[#275a45]' : 'bg-[#eef4f0] border-line'
              }`}>
                <div className="w-9 h-9 rounded-full bg-forest text-sun font-bold text-xs grid place-items-center">
                  LC
                </div>
                <div>
                  <strong className="text-xs font-bold block leading-none">
                    {socialName}
                  </strong>
                  <span className="text-[9px] text-muted">
                    {socialModal.toLowerCase()}.user@ejemplo.com
                  </span>
                </div>
              </div>

              {/* Age selection */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
                  ¿Cuántos años tenés? (1 a 99)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={socialAge}
                  onChange={(e) => setSocialAge(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-bold rounded-xl border focus:outline-none focus:ring-2 focus:ring-forest text-center ${
                    theme === 'dark'
                      ? 'bg-[#18392d] border-[#2b614c] text-white'
                      : 'bg-cream border-line text-ink'
                  }`}
                />

                <div className="mt-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-line/60 text-[10px] leading-tight">
                  {isSocialKids ? (
                    <span className="text-amber-700 dark:text-amber-300 font-bold block">
                      🧒 Perfil Niños (1-14 años): Juegos visuales, puzzles y dibujo.
                    </span>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold block">
                      🌿 Perfil Adultos (15-99 años): Datos analíticos, botánica y red trófica.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSocialModal(null)}
                  className="flex-1 py-2 rounded-xl border border-line text-xs font-bold text-muted hover:text-ink transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSocialRegister}
                  className="flex-1 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-bold shadow-md transition active:scale-95"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
