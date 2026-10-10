import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Check, Lock, Star, X, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPop } from '../../utils/audio';

export const RanksModal = () => {
  const { ranksModalOpen, setRanksModalOpen, currentRank, exp, ranks, theme, t } = useApp();

  if (!ranksModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-[390px] max-h-[90dvh] rounded-[28px] border shadow-2xl flex flex-col overflow-hidden ${
            theme === 'dark'
              ? 'bg-[#0e221b] border-[#204536] text-[#e8f2ec]'
              : 'bg-[#fffdfa] border-line text-ink'
          }`}
        >
          {/* Header */}
          <div className="p-4 pb-3 border-b border-line/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-forest text-sun grid place-items-center shadow-md">
                <Award className="w-5 h-5 stroke-[2.2]" />
              </span>
              <div>
                <strong className="font-serif text-sm font-bold block leading-tight">
                  {t('ranksModalTitle')}
                </strong>
                <span className="text-[9px] text-muted block mt-0.5">
                  Tope máximo: 6 Rangos de Honor
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                playPop();
                setRanksModalOpen(false);
              }}
              className="w-8 h-8 rounded-xl bg-black/10 dark:bg-white/10 grid place-items-center hover:bg-black/20 text-muted transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Rank Banner */}
          <div className={`mx-4 mt-3 p-3 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-[#153428] border-[#295c47]'
              : 'bg-[#edf4f0] border-[#bed7cb]'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-forest-light">
                Tu progreso actual
              </span>
              <span className="text-[10px] font-bold text-forest bg-sun/30 px-2 py-0.2 rounded-full">
                {exp} EXP Total
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentRank.icon}</span>
              <div>
                <strong className="text-xs font-bold leading-tight block">
                  Nivel {currentRank.level} · {currentRank.title}
                </strong>
                <span className="text-[9px] text-muted">
                  {currentRank.level === 6
                    ? '¡Has alcanzado el tope máximo de Guardaparque!'
                    : `Próximo ascenso a los ${currentRank.maxExp} EXP`}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable list of 6 Ranks */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {ranks.map((rank) => {
              const isPassed = currentRank.level > rank.level;
              const isCurrent = currentRank.level === rank.level;
              const isLocked = currentRank.level < rank.level;

              return (
                <div
                  key={rank.level}
                  className={`p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? theme === 'dark'
                        ? 'bg-[#1b4334] border-sun/70 shadow-md ring-1 ring-sun/40'
                        : 'bg-white border-forest shadow-md ring-1 ring-forest/30'
                      : isPassed
                      ? theme === 'dark'
                        ? 'bg-[#112920] border-[#204435] opacity-90'
                        : 'bg-[#f6f9f7] border-line/80'
                      : theme === 'dark'
                      ? 'bg-[#0a1813]/60 border-[#1a3529] opacity-60'
                      : 'bg-cream/40 border-line/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-forest/20 grid place-items-center text-lg shrink-0">
                        {rank.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-bold uppercase tracking-wider text-muted">
                            Rango {rank.level} de 6
                          </span>
                          {isCurrent && (
                            <span className="text-[7.5px] font-bold bg-sun text-forest px-1.5 py-0.2 rounded-full">
                              ACTUAL
                            </span>
                          )}
                          {isPassed && (
                            <span className="text-[7.5px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                              <Check className="w-2 h-2" /> superado
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-[7.5px] font-bold bg-stone-500/20 text-muted px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                              <Lock className="w-2 h-2" /> {rank.minExp} EXP
                            </span>
                          )}
                        </div>
                        <strong className="text-xs font-bold font-serif leading-tight block mt-0.5">
                          {rank.title}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Practical utility explanation */}
                  <div className={`mt-2 pt-2 border-t text-[10px] leading-snug ${
                    isCurrent
                      ? 'border-forest/20 text-ink dark:text-cream'
                      : 'border-line/40 text-muted'
                  }`}>
                    <div className="font-bold text-[8.5px] uppercase tracking-wider text-forest-light flex items-center gap-1 mb-0.5">
                      <ShieldCheck className="w-3 h-3 text-forest" />
                      <span>Utilidad en la reserva:</span>
                    </div>
                    <p className="font-semibold">{rank.perk}</p>
                    <p className="text-[9px] text-muted mt-0.5">{rank.perkDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Close button */}
          <div className="p-3 border-t border-line/60 bg-black/5 dark:bg-white/5">
            <button
              onClick={() => {
                playPop();
                setRanksModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-forest hover:bg-forest-light text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              CERRAR
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
