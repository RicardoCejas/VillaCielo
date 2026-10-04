import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Check, BookOpen, X, Award, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPop } from '../../utils/audio';

export const CardUnlockedModal = () => {
  const { unlockedCardModal, setUnlockedCardModal, navigate } = useApp();

  if (!unlockedCardModal) return null;

  const item = unlockedCardModal;

  const handleInspect = () => {
    playPop();
    setUnlockedCardModal(null);
    navigate('species-detail', item);
  };

  const handleClose = () => {
    playPop();
    setUnlockedCardModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-paper via-white to-cream rounded-3xl p-5 border-2 border-sun shadow-2xl text-center overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-sun/20 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-cream hover:bg-cream-dark text-muted grid place-items-center z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sun text-forest text-[10px] font-extrabold shadow-sm mb-3">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>¡CARTA DESBLOQUEADA!</span>
        </div>

        {/* Card Mockup Showcase */}
        <div className="relative aspect-[4/3] w-48 mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-sun/60 my-2 group">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-2 inset-x-2 text-white text-left">
            <span className="text-[8px] font-bold text-sun uppercase tracking-wider block">
              {item.category} · {item.rarity}
            </span>
            <strong className="font-serif text-sm font-bold block truncate">
              {item.name}
            </strong>
          </div>
        </div>

        <h3 className="font-serif text-xl font-bold text-ink mt-2">
          {item.name}
        </h3>
        <i className="text-muted text-xs font-serif block not-italic">
          {item.scientific}
        </i>

        <p className="text-[11px] text-[#52635c] mt-2 px-2 line-clamp-2 leading-snug">
          {item.description}
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-line">
          <button
            onClick={handleClose}
            className="h-10 rounded-xl bg-cream border border-line text-forest font-bold text-xs hover:bg-cream-dark transition"
          >
            Guardar en Álbum
          </button>
          <button
            onClick={handleInspect}
            className="h-10 rounded-xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ver Ficha</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
