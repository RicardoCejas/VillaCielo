import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Sparkles, ArrowUpRight, Check, X, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { playPop } from '../../utils/audio';

export const LevelUpModal = () => {
  const { levelUpModal, setLevelUpModal, navigate } = useApp();

  if (!levelUpModal) return null;

  const { newLevel, rank } = levelUpModal;

  const handleClose = () => {
    playPop();
    setLevelUpModal(null);
  };

  const handleGoToAlbum = () => {
    playPop();
    setLevelUpModal(null);
    navigate('wiki');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-[#173b32] via-[#102b24] to-[#0c1f1a] text-white rounded-3xl p-6 border-2 border-sun shadow-2xl text-center overflow-hidden"
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sun/25 to-transparent pointer-events-none" />

        {/* Level Emblem */}
        <div className="relative w-20 h-20 mx-auto rounded-3xl bg-sun text-forest grid place-items-center shadow-xl shadow-sun/30 mb-3 border-2 border-white">
          <span className="text-3xl">{rank.icon}</span>
        </div>

        <span className="text-sun text-[10px] font-extrabold tracking-[2px] uppercase block">
          ¡SUBISTE DE NIVEL!
        </span>

        <h3 className="font-serif text-2xl font-bold tracking-tight mt-1">
          Nivel {newLevel} · {rank.title}
        </h3>

        <p className="text-white/80 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
          Tu experiencia en los senderos de Villa Cielo te asciende a <strong>{rank.title}</strong>. ¡Nuevas cartas y secretos de la reserva han sido desbloqueados en tu álbum!
        </p>

        {/* Unlocked perks badge */}
        <div className="bg-white/10 rounded-2xl p-3 my-4 border border-white/15 text-left text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-sun font-bold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Beneficios del Rango:</span>
          </div>
          <p className="text-[11px] text-white/90">
            • Nuevas cartas desbloqueadas en tu Wiki Serrana.
          </p>
          <p className="text-[11px] text-white/90">
            • Reconocimiento como Guardián de Capilla del Monte.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleClose}
            className="h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition"
          >
            Continuar
          </button>
          <button
            onClick={handleGoToAlbum}
            className="h-10 rounded-xl bg-sun text-forest font-bold text-xs flex items-center justify-center gap-1 shadow-lg active:scale-95 transition"
          >
            <span>Ver Álbum</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
