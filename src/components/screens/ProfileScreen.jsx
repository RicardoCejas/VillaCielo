import React from 'react';
import { useApp } from '../../context/AppContext';
import { IMAGES } from '../../data/speciesData';
import { Settings, ChevronRight, User, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfileScreen = () => {
  const { setProfile, navigate } = useApp();

  return (
    <section className="relative w-full h-full bg-forest overflow-hidden flex flex-col justify-between">
      {/* Background Trail Photo */}
      <img
        src={IMAGES.trail}
        alt="Sendero entre pastizales"
        className="absolute inset-0 w-full h-[60%] object-cover"
      />
      <div className="absolute inset-0 h-[60%] bg-gradient-to-b from-[#0c261e]/30 via-[#0c261e]/60 to-[#0c261e]" />

      {/* Floating Settings Button */}
      <button
        onClick={() => navigate('settings')}
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#102821]/60 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold shadow-lg transition active:scale-95"
      >
        <Settings className="w-3.5 h-3.5" />
        <span>Ajustes</span>
      </button>

      {/* Hero Brand Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-6 pt-12 text-white"
      >
        <div className="w-12 h-12 rounded-2xl bg-sun text-forest grid place-items-center mb-4 shadow-xl">
          <Leaf className="w-6 h-6 stroke-[2.3]" />
        </div>
        <p className="text-[10px] font-bold tracking-[2.2px] uppercase text-white/90 mb-1.5">
          Explorá · Jugá · Aprendé
        </p>
        <h1 className="font-serif text-4xl leading-[0.95] tracking-tight font-bold mb-2">
          Villa<br />Cielo Abierto
        </h1>
        <span className="text-xs text-white/80 block font-light">
          Una aventura en la naturaleza
        </span>
      </motion.div>

      {/* Bottom Profile Sheet */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="relative z-20 bg-paper rounded-t-[32px] p-6 pb-8 shadow-2xl border-t border-white/50"
      >
        <div className="w-10 h-1 bg-[#d9ddd8] rounded-full mx-auto mb-4" />
        <span className="text-forest-light text-[9px] font-bold tracking-[1.6px] uppercase block">
          Comenzar
        </span>
        <h2 className="font-serif text-2xl font-bold text-forest tracking-tight mt-1 mb-1">
          ¿Quién va a explorar?
        </h2>
        <p className="text-muted text-xs mb-5">
          Personalizaremos la experiencia para vos.
        </p>

        <div className="grid gap-3">
          {/* Niños Option */}
          <button
            onClick={() => setProfile('Niños')}
            className="group w-full text-left bg-white hover:bg-cream-light border border-line hover:border-moss rounded-2xl p-3.5 grid grid-cols-[46px_1fr_24px] items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
          >
            <span className="w-11 h-11 rounded-xl bg-[#f8cabb] text-[#6f3f2f] font-serif font-bold text-xl grid place-items-center shadow-inner">
              N
            </span>
            <div className="flex flex-col">
              <strong className="text-sm font-bold text-ink flex items-center gap-1.5">
                Niños
                <span className="bg-sun/30 text-forest text-[9px] px-1.5 py-0.5 rounded font-medium">Recomendado</span>
              </strong>
              <small className="text-muted text-[10px] mt-0.5">
                Misiones, juegos interactivos y lenguaje amigable
              </small>
            </div>
            <ChevronRight className="w-5 h-5 text-forest/40 group-hover:text-forest group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Adultos Option */}
          <button
            onClick={() => setProfile('Adultos')}
            className="group w-full text-left bg-white hover:bg-cream-light border border-line hover:border-moss rounded-2xl p-3.5 grid grid-cols-[46px_1fr_24px] items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
          >
            <span className="w-11 h-11 rounded-xl bg-mint text-forest grid place-items-center shadow-inner">
              <User className="w-5 h-5" />
            </span>
            <div className="flex flex-col">
              <strong className="text-sm font-bold text-ink">Adultos</strong>
              <small className="text-muted text-[10px] mt-0.5">
                Exploración libre, datos científicos y fichas botánicas
              </small>
            </div>
            <ChevronRight className="w-5 h-5 text-forest/40 group-hover:text-forest group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};
