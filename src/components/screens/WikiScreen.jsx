import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SPECIES_LIST, RANKS } from '../../data/speciesData';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import {
  Lock,
  Unlock,
  ChevronRight,
  Search,
  Sparkles,
  QrCode,
  Trophy,
  Camera,
  X,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playPop, playClick } from '../../utils/audio';

export const WikiScreen = () => {
  const {
    navigate,
    isSpeciesUnlocked,
    unlockedSpeciesIds,
    exp,
    currentRank,
    goBack
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('Todas'); // 'Todas', 'Fauna', 'Flora', 'Desbloqueadas', 'Bloqueadas'
  const [searchQuery, setSearchQuery] = useState('');
  const [lockedItemModal, setLockedItemModal] = useState(null);

  const totalCount = SPECIES_LIST.length;
  const unlockedCount = unlockedSpeciesIds.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Filter species
  const filteredSpecies = SPECIES_LIST.filter(item => {
    const isUnlocked = isSpeciesUnlocked(item.id);

    // Tab filter
    if (activeFilter === 'Fauna' && item.category !== 'Fauna') return false;
    if (activeFilter === 'Flora' && item.category !== 'Flora') return false;
    if (activeFilter === 'Desbloqueadas' && !isUnlocked) return false;
    if (activeFilter === 'Bloqueadas' && isUnlocked) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSci = item.scientific.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      return matchName || matchSci || matchDesc;
    }

    return true;
  });

  const handleCardClick = (species) => {
    const isUnlocked = isSpeciesUnlocked(species.id);
    if (isUnlocked) {
      playPop();
      navigate('species-detail', species);
    } else {
      playClick();
      setLockedItemModal(species);
    }
  };

  const handleLockedAction = (targetMethod) => {
    playPop();
    setLockedItemModal(null);
    if (targetMethod === 'qr' || targetMethod.includes('QR')) {
      navigate('scan');
    } else if (targetMethod.includes('Safari')) {
      navigate('safari');
    } else if (targetMethod.includes('Trivia')) {
      navigate('trivia');
    } else {
      navigate('games');
    }
  };

  return (
    <section className="relative w-full h-full bg-cream flex flex-col justify-between overflow-hidden">
      {/* TopBar with styled back button */}
      <TopBar
        title="Álbum de la Reserva"
        onBack={goBack}
        backLabel="Volver"
        onSettings={() => navigate('settings')}
      />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header Progress & Rank Banner */}
        <div className="px-4 pt-2.5 pb-2 bg-paper border-b border-line space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-forest-light text-[9px] font-bold tracking-[1.6px] uppercase block">
                Álbum de Villa Cielo · Capilla del Monte
              </span>
              <h2 className="font-serif text-xl font-bold text-ink tracking-tight mt-0.5">
                Fauna y Flora Autóctona
              </h2>
            </div>

            {/* Current Level Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-forest text-white shadow-xs">
              <span className="text-sm">{currentRank.icon}</span>
              <div className="flex flex-col text-left">
                <span className="text-[8px] text-mint uppercase font-bold tracking-wider leading-none">
                  Nivel {currentRank.level}
                </span>
                <strong className="text-[10px] text-sun leading-tight font-serif truncate max-w-[100px]">
                  {currentRank.title}
                </strong>
              </div>
            </div>
          </div>

          {/* Collection Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-muted font-medium">
                Coleccionadas: <strong>{unlockedCount} / {totalCount}</strong> especies
              </span>
              <strong className="text-forest font-bold">{progressPercent}% completado</strong>
            </div>
            <div className="w-full h-2 bg-[#e8ece7] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-forest to-moss rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 overflow-x-auto no-scrollbar shrink-0 bg-cream border-b border-line/60">
          {['Todas', 'Fauna', 'Flora', 'Desbloqueadas', 'Bloqueadas'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                playPop();
                setActiveFilter(cat);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 ${
                activeFilter === cat
                  ? 'bg-forest text-white shadow-xs font-bold'
                  : 'bg-paper text-muted hover:text-ink border border-line'
              }`}
            >
              {cat === 'Bloqueadas' ? '🔒 Bloqueadas' : cat === 'Desbloqueadas' ? '🔓 Coleccionadas' : cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-3.5 py-1.5 shrink-0 bg-cream">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar especie, nombre científico o planta..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-line text-xs placeholder:text-muted/70 focus:outline-none focus:ring-1 focus:ring-forest text-ink"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-muted hover:text-ink"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Species Cards Grid */}
        <div className="flex-1 overflow-y-auto px-3.5 pb-8 pt-1">
          <div className="grid grid-cols-2 gap-3.5 items-stretch">
            {filteredSpecies.map(species => {
              const isUnlocked = isSpeciesUnlocked(species.id);

              return (
                <motion.div
                  key={species.id}
                  role="button"
                  tabIndex={0}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCardClick(species)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(species);
                    }
                  }}
                  className={`group relative text-left rounded-3xl overflow-hidden shadow-sm border flex flex-col justify-between transition-all min-h-[235px] cursor-pointer select-none ${
                    isUnlocked
                      ? 'bg-paper hover:bg-white border-line hover:border-moss/40 hover:shadow-md'
                      : 'bg-[#182620] border-[#223930] hover:border-sun/40 shadow-xs'
                  }`}
                >
                  {/* Photo or Locked Silhouette */}
                  <div className="relative h-32 w-full overflow-hidden bg-cream-dark shrink-0">
                    {isUnlocked ? (
                      <>
                        <img
                          src={species.image}
                          alt={species.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-forest/85 backdrop-blur-md text-white text-[8px] font-bold">
                          {species.category}
                        </span>
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 text-white grid place-items-center shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                        {species.rarity && (
                          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-sun/95 text-forest text-[7.5px] font-bold truncate max-w-[125px] shadow-xs">
                            {species.rarity}
                          </span>
                        )}
                      </>
                    ) : (
                      /* Locked Card Visual */
                      <div className="w-full h-full bg-gradient-to-b from-[#14261f] to-[#0c1914] flex flex-col items-center justify-center p-2 text-center relative">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 grid place-items-center mb-1 text-sun shadow-inner">
                          <Lock className="w-5 h-5" />
                        </div>
                        <span className="text-[8px] font-bold text-sun uppercase tracking-wider">
                          Carta Oculta
                        </span>
                        <span className="text-[7.5px] text-white/60 mt-0.5 truncate max-w-[130px]">
                          Nivel {species.unlockLevel} · {species.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Meta Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    {isUnlocked ? (
                      <div>
                        <strong className="font-serif text-[13px] font-bold text-ink leading-tight block line-clamp-1">
                          {species.name}
                        </strong>
                        <small className="text-muted text-[9.5px] italic block mt-0.5 line-clamp-1">
                          {species.scientific}
                        </small>
                      </div>
                    ) : (
                      <div>
                        <strong className="font-serif text-[13px] font-bold text-white/90 leading-tight block truncate">
                          🔒 {species.name}
                        </strong>
                        <span className="text-[8.5px] text-sun/80 block mt-1 line-clamp-2 leading-tight">
                          {species.unlockHint}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-line/40">
                      <span className={`text-[9px] font-bold ${
                        isUnlocked ? 'text-forest' : 'text-sun'
                      }`}>
                        {isUnlocked ? 'Ver ficha' : 'Cómo desbloquear'}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${
                        isUnlocked ? 'text-forest/60' : 'text-sun/60'
                      }`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🔒 Mission Modal when clicking on a Locked Card */}
      <AnimatePresence>
        {lockedItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative w-full max-w-sm bg-gradient-to-b from-[#173b32] to-[#0e241c] text-white rounded-3xl p-5 border-2 border-sun shadow-2xl text-center"
            >
              <button
                onClick={() => setLockedItemModal(null)}
                className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-sun text-forest grid place-items-center mx-auto mb-3 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>

              <span className="text-sun text-[10px] font-extrabold uppercase tracking-widest block">
                Misión de Desbloqueo
              </span>

              <h3 className="font-serif text-xl font-bold tracking-tight mt-1 text-white">
                {lockedItemModal.name}
              </h3>
              <i className="text-mint text-xs font-serif not-italic block mt-0.5">
                {lockedItemModal.scientific}
              </i >

              <div className="bg-white/10 rounded-2xl p-3 my-3 text-left border border-white/15 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-sun uppercase tracking-wider block">
                  Requisito de la Reserva:
                </span>
                <p className="text-white/95 text-xs leading-snug">
                  {lockedItemModal.unlockHint}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-mint">
                  <span>Rango necesario: Nivel {lockedItemModal.unlockLevel}</span>
                  <span>Categoría: {lockedItemModal.category}</span>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="space-y-2 pt-1">
                {lockedItemModal.qrCode && (
                  <button
                    onClick={() => handleLockedAction('qr')}
                    className="w-full h-10 rounded-xl bg-sun text-forest font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Escanear Código QR en Sendero</span>
                  </button>
                )}

                <button
                  onClick={() => handleLockedAction('games')}
                  className="w-full h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Jugar para Ganar EXP y Desbloquear</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BottomNav */}
      <BottomNav active="wiki" />
    </section>
  );
};
