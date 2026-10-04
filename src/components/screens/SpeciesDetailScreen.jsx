import React from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { MapPin, Leaf, Info, Check, BookOpen, Sparkles, Utensils, Sun, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { playSuccess } from '../../utils/audio';

export const SpeciesDetailScreen = ({ isDiscoveryMode = false }) => {
  const { selectedSpecies, goBack, navigate, addToast } = useApp();
  const item = selectedSpecies;

  if (!item) {
    return (
      <div className="p-8 text-center bg-cream h-full flex flex-col items-center justify-center">
        <p className="text-sm font-semibold text-muted">No se seleccionó ninguna especie.</p>
        <button onClick={goBack} className="mt-4 px-4 py-2 bg-forest text-white rounded-xl text-xs font-bold">
          Volver
        </button>
      </div>
    );
  }

  const handleAction = () => {
    if (isDiscoveryMode) {
      playSuccess();
      addToast('¡Especie Registrada!', `${item.name} sumada a tu álbum natural`, 'success');
      navigate('wiki');
    } else {
      goBack();
    }
  };

  return (
    <section className="relative w-full h-full bg-paper flex flex-col justify-between overflow-hidden">
      {/* Hero Media Section */}
      <div className="relative h-[44%] w-full overflow-hidden shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#081913]/60 via-transparent to-[#081913]/90" />

        {/* TopBar with styled '← Volver' */}
        <div className="absolute top-0 inset-x-0 z-20">
          <TopBar
            title={isDiscoveryMode ? 'Nuevo hallazgo' : 'Ficha de especie'}
            onBack={goBack}
            backLabel="Volver"
            light
          />
        </div>

        {/* New Discovery Badge */}
        {isDiscoveryMode && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-16 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sun text-forest font-extrabold text-[10px] shadow-lg tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>¡NUEVA ESPECIE SERRANA!</span>
          </motion.div>
        )}

        {/* Hero Title Overlay */}
        <div className="absolute bottom-4 inset-x-5 text-white">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-mint text-[9px] font-bold tracking-[2px] uppercase">
              {item.category}
            </span>
            {item.rarity && (
              <span className="bg-sun/90 text-forest text-[8px] font-bold px-2 py-0.5 rounded-full">
                {item.rarity}
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {item.name}
          </h1>
          <i className="text-white/80 font-serif text-xs not-italic">
            {item.scientific}
          </i>
        </div>
      </div>

      {/* Detail Body (Scrollable) */}
      <div className="flex-1 bg-paper px-4 py-3 overflow-y-auto space-y-3.5">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Hábitat */}
          <div className="bg-cream rounded-2xl p-2.5 grid grid-cols-[30px_1fr] items-center gap-2 border border-line">
            <span className="w-7 h-7 rounded-xl bg-mint text-forest grid place-items-center">
              <MapPin className="w-4 h-4" />
            </span>
            <div className="flex flex-col overflow-hidden">
              <small className="text-muted text-[8px] font-bold tracking-wider uppercase">
                Hábitat
              </small>
              <strong className="text-[10px] text-ink font-bold leading-tight truncate">
                {item.habitat}
              </strong>
            </div>
          </div>

          {/* Estado de conservación */}
          <div className="bg-cream rounded-2xl p-2.5 grid grid-cols-[30px_1fr] items-center gap-2 border border-line">
            <span className="w-7 h-7 rounded-xl bg-mint text-forest grid place-items-center">
              <Leaf className="w-4 h-4" />
            </span>
            <div className="flex flex-col overflow-hidden">
              <small className="text-muted text-[8px] font-bold tracking-wider uppercase">
                Estado
              </small>
              <strong className="text-[10px] text-ink font-bold leading-tight truncate">
                {item.status}
              </strong>
            </div>
          </div>

          {/* Dieta */}
          {item.diet && (
            <div className="bg-cream rounded-2xl p-2.5 grid grid-cols-[30px_1fr] items-center gap-2 border border-line">
              <span className="w-7 h-7 rounded-xl bg-sun-light text-forest grid place-items-center">
                <Utensils className="w-3.5 h-3.5" />
              </span>
              <div className="flex flex-col overflow-hidden">
                <small className="text-muted text-[8px] font-bold tracking-wider uppercase">
                  Alimentación
                </small>
                <strong className="text-[10px] text-ink font-bold leading-tight truncate">
                  {item.diet}
                </strong>
              </div>
            </div>
          )}

          {/* Actividad */}
          {item.activity && (
            <div className="bg-cream rounded-2xl p-2.5 grid grid-cols-[30px_1fr] items-center gap-2 border border-line">
              <span className="w-7 h-7 rounded-xl bg-sky-light text-forest grid place-items-center">
                <Sun className="w-3.5 h-3.5" />
              </span>
              <div className="flex flex-col overflow-hidden">
                <small className="text-muted text-[8px] font-bold tracking-wider uppercase">
                  Hábito
                </small>
                <strong className="text-[10px] text-ink font-bold leading-tight truncate">
                  {item.activity}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div>
          <h3 className="font-serif text-base font-bold text-forest mb-1">
            Rol en el ecosistema serrano
          </h3>
          <p className="text-[#52635c] text-xs leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Fun Fact Card */}
        <div className="bg-[#fae5cc] text-[#68442f] rounded-2xl p-3 flex items-start gap-2.5 border border-coral-light/60">
          <div className="w-7 h-7 rounded-lg bg-coral/20 text-coral-dark grid place-items-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <strong className="text-xs font-bold font-serif">¿Sabías que?</strong>
            <p className="text-[11px] leading-snug mt-0.5 opacity-95">
              {item.fact}
            </p>
          </div>
        </div>

        {/* Main Action Button */}
        <button
          onClick={handleAction}
          className="w-full h-11 rounded-2xl bg-forest hover:bg-forest-light text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-forest/20 active:scale-95 transition"
        >
          {isDiscoveryMode ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>SUMAR A MI COLECCIÓN SERRANA</span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              <span>VOLVER A LA COLECCIÓN</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
