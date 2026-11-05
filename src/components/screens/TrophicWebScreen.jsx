import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { 
  TROPHIC_LEVELS, 
  TROPHIC_SPECIES, 
  CRISIS_SCENARIOS 
} from '../../data/trophicData';
import { 
  Flame, 
  ShieldAlert, 
  RefreshCw, 
  Info, 
  ArrowDown, 
  ArrowUp, 
  AlertTriangle, 
  Heart, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  PhoneCall, 
  Droplets,
  Network,
  Eye,
  SlidersHorizontal,
  Sparkles,
  CircleDot,
  ListFilter,
  Zap
} from 'lucide-react';
import { playClick, playPop, playSuccess, playError, playCelebration } from '../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const TrophicWebScreen = () => {
  const { navigate, goBack, addPoints, triggerCelebration } = useApp();

  const [activeTab, setActiveTab] = useState('web');
  const [viewMode, setViewMode] = useState('circles');
  const [disabledSpeciesIds, setDisabledSpeciesIds] = useState([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(null);
  const [activeCrisisId, setActiveCrisisId] = useState(null);

  const totalSpecies = TROPHIC_SPECIES.length;
  const activeCount = totalSpecies - disabledSpeciesIds.length;
  const ecosystemHealth = Math.round((activeCount / totalSpecies) * 100);

  const selectedSpecies = TROPHIC_SPECIES.find(s => s.id === selectedSpeciesId);
  const activeCrisis = CRISIS_SCENARIOS.find(c => c.id === activeCrisisId);

  const handleToggleSpecies = (id, e) => {
    if (e) e.stopPropagation();
    setActiveCrisisId(null);
    // Mostrar inmediatamente el cuadrito explicativo de qué pasa si desaparece
    setSelectedSpeciesId(id);

    setDisabledSpeciesIds(prev => {
      const isCurrentlyDisabled = prev.includes(id);
      if (isCurrentlyDisabled) {
        playSuccess();
        const next = prev.filter(x => x !== id);
        if (next.length === 0) {
          triggerCelebration();
          addPoints(50, '¡Ecosistema serrano 100% equilibrado!');
        }
        return next;
      } else {
        playError();
        return [...prev, id];
      }
    });
  };

  const handleSelectScenario = (scenario) => {
    playError();
    setActiveCrisisId(scenario.id);
    setDisabledSpeciesIds(scenario.disabledSpeciesIds);
    setSelectedSpeciesId(null);
  };

  const handleRestoreEcosystem = () => {
    playSuccess();
    triggerCelebration();
    setDisabledSpeciesIds([]);
    setActiveCrisisId(null);
    addPoints(100, '¡Red Trófica de Villa Cielo restaurada!');
  };

  const connections = [];
  TROPHIC_SPECIES.forEach(predator => {
    predator.eats.forEach(preyId => {
      const prey = TROPHIC_SPECIES.find(s => s.id === preyId);
      if (prey) {
        connections.push({
          from: prey,
          to: predator,
          id: `${prey.id}->${predator.id}`
        });
      }
    });
  });

  return (
    <section className="relative w-full h-full bg-[#081510] text-[#e8f1ec] flex flex-col justify-between overflow-hidden">
      {/* TopBar with back to Home */}
      <TopBar
        title="Red Trófica Serrana"
        onBack={goBack}
        backLabel="Volver"
        light
        onSettings={() => navigate('settings')}
      />

      {/* Main scrollable view */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-3.5 py-2 space-y-3 pb-28">
        {/* Ecological Health Meter Header */}
        <div className="bg-[#10241b] border border-[#1b3d2e] rounded-3xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-sun text-[9px] font-bold uppercase tracking-widest">
                <Network className="w-3.5 h-3.5" />
                <span>Equilibrio Ecosistémico · Villa Cielo</span>
              </div>
              <h2 className="font-serif text-lg font-bold text-white mt-0.5">
                {ecosystemHealth === 100
                  ? 'Red Trófica en Plena Armonía'
                  : ecosystemHealth > 65
                  ? 'Desbalance Ecológico Moderado'
                  : '¡Alerta de Colapso Ecosistémico!'}
              </h2>
            </div>

            {/* Health Badge */}
            <div className={`px-3 py-1 rounded-2xl flex flex-col items-center justify-center font-bold text-xs border ${
              ecosystemHealth === 100
                ? 'bg-emerald-900/60 border-emerald-500/50 text-emerald-300'
                : ecosystemHealth > 65
                ? 'bg-amber-900/60 border-amber-500/50 text-sun'
                : 'bg-rose-900/60 border-rose-500/50 text-rose-300 animate-pulse'
            }`}>
              <span className="text-[14px] font-serif leading-none">{ecosystemHealth}%</span>
              <span className="text-[7px] tracking-wider uppercase opacity-80">Salud</span>
            </div>
          </div>

          {/* Health Bar */}
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <motion.div
              className={`h-full rounded-full transition-all duration-500 ${
                ecosystemHealth === 100
                  ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]'
                  : ecosystemHealth > 65
                  ? 'bg-sun shadow-[0_0_10px_#f4c95d]'
                  : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
              }`}
              animate={{ width: `${ecosystemHealth}%` }}
            />
          </div>

          {/* Reset / Notice row */}
          {disabledSpeciesIds.length > 0 && (
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[10px]">
              <span className="text-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>{disabledSpeciesIds.length} especies ausentes en la red</span>
              </span>
              <button
                onClick={handleRestoreEcosystem}
                className="text-[9px] font-bold text-sun hover:text-white bg-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1 transition"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Restaurar Red</span>
              </button>
            </div>
          )}
        </div>

        {/* View Mode Tab Switcher */}
        <div className="flex bg-[#10241b] p-1 rounded-2xl border border-[#1b3d2e] shrink-0">
          <button
            onClick={() => {
              playPop();
              setActiveTab('web');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'web'
                ? 'bg-forest text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Red & Niveles Tróficos</span>
          </button>
          <button
            onClick={() => {
              playPop();
              setActiveTab('scenarios');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'scenarios'
                ? 'bg-rose-900/80 text-white shadow-md border border-rose-500/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-sun" />
            <span>Simulador de Incendios & Crisis</span>
          </button>
        </div>

        {/* TAB 1: GRAFO DE CÍRCULOS Y RED TRÓFICA */}
        {activeTab === 'web' && (
          <div className="space-y-2.5 pb-4">
            {/* View Sub-Toggle: Red de Círculos vs Vista Lista */}
            <div className="flex items-center justify-between bg-black/30 p-1.5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1 text-[10px] text-white/80 pl-1 font-semibold">
                <Zap className="w-3 h-3 text-sun" />
                <span>Modo de Visualización:</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    playPop();
                    setViewMode('circles');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 ${
                    viewMode === 'circles'
                      ? 'bg-sun text-forest shadow'
                      : 'text-white/60 hover:text-white bg-white/5'
                  }`}
                >
                  <CircleDot className="w-3 h-3" />
                  <span>Red de Círculos</span>
                </button>
                <button
                  onClick={() => {
                    playPop();
                    setViewMode('list');
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 ${
                    viewMode === 'list'
                      ? 'bg-emerald-700 text-white shadow'
                      : 'text-white/60 hover:text-white bg-white/5'
                  }`}
                >
                  <ListFilter className="w-3 h-3" />
                  <span>Lista por Niveles</span>
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: RED DE NODOS CIRCULARES INTERACTIVA (GRAFO SVG DE RETROALIMENTACIÓN) */}
            {viewMode === 'circles' && (
              <div className="space-y-2">
                <p className="text-[10.5px] text-white/80 px-1 leading-tight flex items-center gap-1">
                  <span>Tocá cualquier <strong>círculo</strong> para iluminar su red de alimentación y predación.</span>
                </p>

                {/* SVG & Circle Nodes Board Container */}
                <div 
                  onClick={() => setSelectedSpeciesId(null)}
                  className="relative w-full h-[560px] bg-gradient-to-b from-[#0b1d15] via-[#091811] to-[#050f0b] border border-[#1b3d2e] rounded-3xl p-2 overflow-hidden shadow-2xl select-none"
                >
                  {/* Layer Background Badges for Trophic Tiers */}
                  <div className="absolute top-2 left-3 text-[8.5px] font-extrabold uppercase tracking-wider text-rose-400/50 pointer-events-none">
                    ▲ Nivel 4 · Depredadores Tope
                  </div>
                  <div className="absolute top-[26%] left-3 text-[8.5px] font-extrabold uppercase tracking-wider text-amber-400/50 pointer-events-none">
                    ▲ Nivel 3 · Mesodepredadores
                  </div>
                  <div className="absolute top-[49%] left-3 text-[8.5px] font-extrabold uppercase tracking-wider text-emerald-400/50 pointer-events-none">
                    ▲ Nivel 2 · Herbívoros
                  </div>
                  <div className="absolute top-[69%] left-3 text-[8.5px] font-extrabold uppercase tracking-wider text-teal-400/50 pointer-events-none">
                    ▲ Nivel 1 · Productores (Flora)
                  </div>

                  {/* SVG Canvas for Feedback Arrows and Connection Lines */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  >
                    <defs>
                      <marker
                        id="arrow-default"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="4.5"
                        markerHeight="4.5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(255,255,255,0.4)" />
                      </marker>
                      <marker
                        id="arrow-prey"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="5.5"
                        markerHeight="5.5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                      </marker>
                      <marker
                        id="arrow-predator"
                        viewBox="0 0 10 10"
                        refX="7"
                        refY="5"
                        markerWidth="5.5"
                        markerHeight="5.5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
                      </marker>
                      <marker
                        id="arrow-alert"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6.5"
                        markerHeight="6.5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
                      </marker>
                      <marker
                        id="arrow-amber"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6.5"
                        markerHeight="6.5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb923c" />
                      </marker>
                    </defs>

                    {/* Render Connection Lines */}
                    {connections.map(conn => {
                      const fromDisabled = disabledSpeciesIds.includes(conn.from.id);
                      const toDisabled = disabledSpeciesIds.includes(conn.to.id);

                      const isSelectedPrey = selectedSpeciesId === conn.to.id && selectedSpecies?.eats?.includes(conn.from.id);
                      const isSelectedPredator = selectedSpeciesId === conn.from.id && selectedSpecies?.eatenBy?.includes(conn.to.id);

                      const dx = conn.to.x - conn.from.x;
                      const dy = conn.to.y - conn.from.y;
                      const cx = (conn.from.x + conn.to.x) / 2 + (dx === 0 ? 8 : -dy * 0.12);
                      const cy = (conn.from.y + conn.to.y) / 2 + (dy === 0 ? 8 : dx * 0.12);

                      const pathD = `M ${conn.from.x} ${conn.from.y} Q ${cx} ${cy} ${conn.to.x} ${conn.to.y}`;

                      if (fromDisabled && !toDisabled) {
                        return (
                          <g key={conn.id}>
                            <path
                              d={pathD}
                              fill="none"
                              stroke="#f43f5e"
                              strokeWidth="1.8"
                              strokeDasharray="3 3"
                              markerEnd="url(#arrow-alert)"
                              className="animate-pulse"
                              style={{ filter: 'drop-shadow(0 0 5px #f43f5e)' }}
                            />
                          </g>
                        );
                      }

                      if (toDisabled && !fromDisabled) {
                        return (
                          <g key={conn.id}>
                            <path
                              d={`M ${conn.to.x} ${conn.to.y} Q ${cx} ${cy} ${conn.from.x} ${conn.from.y}`}
                              fill="none"
                              stroke="#fb923c"
                              strokeWidth="1.8"
                              strokeDasharray="3 3"
                              markerEnd="url(#arrow-amber)"
                              className="animate-pulse"
                              style={{ filter: 'drop-shadow(0 0 5px #fb923c)' }}
                            />
                          </g>
                        );
                      }

                      if (fromDisabled && toDisabled) {
                        return (
                          <path
                            key={conn.id}
                            d={pathD}
                            fill="none"
                            stroke="rgba(244,63,94,0.2)"
                            strokeWidth="0.5"
                            strokeDasharray="1.5 1.5"
                          />
                        );
                      }

                      if (isSelectedPrey) {
                        return (
                          <g key={conn.id}>
                            <path
                              d={pathD}
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="1.8"
                              markerEnd="url(#arrow-prey)"
                              className="animate-pulse"
                              style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}
                            />
                          </g>
                        );
                      }

                      if (isSelectedPredator) {
                        return (
                          <g key={conn.id}>
                            <path
                              d={pathD}
                              fill="none"
                              stroke="#f43f5e"
                              strokeWidth="1.8"
                              markerEnd="url(#arrow-predator)"
                              className="animate-pulse"
                              style={{ filter: 'drop-shadow(0 0 6px #f43f5e)' }}
                            />
                          </g>
                        );
                      }

                      // Default background line when no active filter or unrelated
                      const opacity = selectedSpeciesId ? 0.08 : 0.28;
                      return (
                        <path
                          key={conn.id}
                          d={pathD}
                          fill="none"
                          stroke="rgba(255,255,255,0.45)"
                          strokeWidth="0.7"
                          strokeOpacity={opacity}
                          markerEnd="url(#arrow-default)"
                        />
                      );
                    })}
                  </svg>

                  {/* Species Circular Nodes Layer */}
                  {TROPHIC_SPECIES.map(sp => {
                    const isDisabled = disabledSpeciesIds.includes(sp.id);
                    const isSelected = selectedSpeciesId === sp.id;
                    const isPreyOfSelected = selectedSpecies?.eats?.includes(sp.id);
                    const isPredatorOfSelected = selectedSpecies?.eatenBy?.includes(sp.id);

                    const hasMissingFood = sp.eats.some(eId => disabledSpeciesIds.includes(eId));
                    const hasMissingPredator = sp.eatenBy.some(pId => disabledSpeciesIds.includes(pId));

                    // Border style based on trophic level
                    let ringBorder = 'border-teal-400 shadow-[0_0_10px_#2dd4bf66]';
                    if (sp.level === 'apex') ringBorder = 'border-rose-500 shadow-[0_0_14px_#f43f5e88]';
                    if (sp.level === 'carnivores') ringBorder = 'border-amber-400 shadow-[0_0_12px_#f59e0b88]';
                    if (sp.level === 'herbivores') ringBorder = 'border-emerald-400 shadow-[0_0_12px_#10b98188]';

                    if (isDisabled) {
                      ringBorder = 'border-rose-700 ring-2 ring-rose-500/60 shadow-[0_0_15px_#f43f5e99]';
                    } else if (isSelected) {
                      ringBorder = 'ring-4 ring-sun border-sun shadow-[0_0_24px_#f4c95d] scale-110 z-30';
                    } else if (hasMissingFood) {
                      ringBorder = 'ring-4 ring-rose-500 border-rose-500 shadow-[0_0_18px_#f43f5e] z-20 animate-pulse';
                    } else if (isPreyOfSelected) {
                      ringBorder = 'ring-4 ring-emerald-400 border-emerald-400 shadow-[0_0_16px_#10b981] z-20';
                    } else if (isPredatorOfSelected) {
                      ringBorder = 'ring-4 ring-rose-400 border-rose-400 shadow-[0_0_16px_#f43f5e] z-20';
                    }



                    return (
                      <div
                        key={sp.id}
                        style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          playClick();
                          setSelectedSpeciesId(isSelected ? null : sp.id);
                        }}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all duration-300 flex flex-col items-center ${
                          isDisabled ? 'opacity-85 hover:scale-105' : 'hover:scale-105'
                        }`}
                      >
                        {/* Feedback Badge overlay */}
                        {isDisabled && (
                          <span className="absolute -top-3.5 bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-lg z-30 whitespace-nowrap border border-rose-300">
                            ❌ Extinta
                          </span>
                        )}
                        {!isDisabled && hasMissingFood && (
                          <span className="absolute -top-3.5 bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-lg z-30 whitespace-nowrap animate-bounce border border-rose-300">
                            ⚠️ Sin Alimento
                          </span>
                        )}
                        {!isDisabled && !hasMissingFood && hasMissingPredator && (
                          <span className="absolute -top-3.5 bg-amber-500 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-lg z-30 whitespace-nowrap animate-pulse border border-amber-200">
                            ⚠️ Sobrepoblación
                          </span>
                        )}
                        {!isDisabled && isPreyOfSelected && !hasMissingFood && (
                          <span className="absolute -top-3.5 bg-emerald-500 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow z-30 whitespace-nowrap border border-emerald-300">
                            🟢 Alimento
                          </span>
                        )}
                        {!isDisabled && isPredatorOfSelected && !hasMissingFood && (
                          <span className="absolute -top-3.5 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow z-30 whitespace-nowrap border border-rose-300">
                            🔴 Depredador
                          </span>
                        )}

                        {/* Circular Avatar Button with strict sizing */}
                        <div
                          className={`trophic-node-avatar ${sp.level === 'apex' ? 'apex' : ''} border-2 bg-black flex items-center justify-center transition-all ${ringBorder}`}
                        >
                          <img
                            src={sp.image}
                            alt={sp.name}
                            className={`w-full h-full object-cover object-center rounded-full pointer-events-none ${isDisabled ? 'grayscale opacity-40' : ''}`}
                          />

                          {/* Extinction overlay indicator */}
                          {isDisabled && (
                            <div className="absolute inset-0 bg-rose-950/75 flex items-center justify-center pointer-events-none">
                              <X className="w-5 h-5 text-rose-400 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Species Name Tag & Quick Toggle Button Below Circle */}
                        <div className="flex items-center gap-1 mt-1 z-30">
                          <span className={`text-[11.5px] sm:text-xs font-black px-2 py-0.5 rounded-full backdrop-blur border whitespace-nowrap shadow-md tracking-tight ${
                            isSelected
                              ? 'bg-sun text-forest border-sun ring-2 ring-sun/80 scale-105'
                              : isDisabled
                              ? 'bg-rose-950 text-rose-200 border-rose-600 line-through'
                              : 'bg-black/90 text-white border-white/30'
                          }`}>
                            {sp.shortName || sp.name.split(' ')[0]}
                          </span>

                          {/* Quick Apagar / Restaurar Power Button */}
                          <button
                            onClick={(e) => handleToggleSpecies(sp.id, e)}
                            title={isDisabled ? 'Restaurar especie' : 'Simular falta de esta especie'}
                            className={`w-5 h-5 rounded-full text-[10.5px] font-black shadow-md flex items-center justify-center transition active:scale-90 ${
                              isDisabled
                                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                                : 'bg-rose-600 hover:bg-rose-500 text-white'
                            }`}
                          >
                            {isDisabled ? '+' : '✕'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 🌿 CUADRO INFORMATIVO: SOLO APARECE AL TOCAR UN ANIMAL O SU CRUCECITA ✕ */}
                <AnimatePresence>
                  {selectedSpecies && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="bg-[#0e241b] rounded-3xl p-4 sm:p-5 border-2 border-[#1f4a36] shadow-xl space-y-3.5 transition-all"
                    >
                      <div className="space-y-3">
                        {/* Header de la Especie Seleccionada */}
                        <div className="flex items-start justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl overflow-hidden border-2 border-sun shadow-md shrink-0 bg-black">
                              <img
                                src={selectedSpecies.image}
                                alt={selectedSpecies.name}
                                className={`w-full h-full object-cover ${disabledSpeciesIds.includes(selectedSpecies.id) ? 'grayscale opacity-50' : ''}`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  selectedSpecies.level === 'apex'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                                    : selectedSpecies.level === 'carnivores'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                                    : selectedSpecies.level === 'herbivores'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                                    : 'bg-teal-950 text-teal-300 border border-teal-700/60'
                                }`}>
                                  {selectedSpecies.role}
                                </span>
                                {disabledSpeciesIds.includes(selectedSpecies.id) && (
                                  <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full border border-rose-300 animate-pulse">
                                    ✕ Actualmente Ausente
                                  </span>
                                )}
                              </div>
                              <h3 className="font-serif text-base sm:text-lg font-bold text-white mt-1 leading-tight">
                                {selectedSpecies.name}
                              </h3>
                              <span className="text-xs text-mint/80 italic font-mono block">
                                {selectedSpecies.scientific} · {selectedSpecies.status}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedSpeciesId(null)}
                            className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white grid place-items-center text-xs font-bold transition"
                            title="Cerrar detalle"
                          >
                            ✕
                          </button>
                        </div>

                        {/* 🚨 CUADRO DESTACADO: ¿QUÉ PASA SI DESAPARECE? (Impacto de Colapso) */}
                        <div className="bg-rose-950/60 border-2 border-rose-600/70 rounded-2xl p-3.5 space-y-1.5 shadow-md">
                          <div className="flex items-center gap-2 text-rose-300 text-xs font-extrabold uppercase tracking-wide">
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
                            <span>¿Qué pasa si desaparece de Villa Cielo?</span>
                          </div>
                          <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
                            {selectedSpecies.collapseEffect}
                          </p>
                        </div>

                        {/* 🌱 SERVICIO ECOLÓGICO */}
                        <div className="bg-[#143224] border border-[#23533c] rounded-2xl p-3.5 space-y-1">
                          <div className="flex items-center gap-1.5 text-sun text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-sun shrink-0" />
                            <span>Servicio Ecosistémico en el Monte:</span>
                          </div>
                          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                            {selectedSpecies.ecologicalService}
                          </p>
                        </div>

                        {/* 🍽️ CADENA ALIMENTARIA: QUÉ COME Y QUIÉN SE LA COME */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-black/30 border border-emerald-500/30 rounded-xl p-2.5 space-y-1">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                              <ArrowDown className="w-3 h-3" />
                              <span>Alimento (Presas):</span>
                            </span>
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {selectedSpecies.eats.length > 0 ? (
                                selectedSpecies.eats.map(eatId => {
                                  const target = TROPHIC_SPECIES.find(s => s.id === eatId);
                                  return (
                                    <span key={eatId} className="bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                                      {target?.name || eatId}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="text-[11px] text-white/60 italic">Autótrofo (Fotosíntesis)</span>
                              )}
                            </div>
                          </div>

                          <div className="bg-black/30 border border-rose-500/30 rounded-xl p-2.5 space-y-1">
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                              <ArrowUp className="w-3 h-3" />
                              <span>Depredadores:</span>
                            </span>
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {selectedSpecies.eatenBy.length > 0 ? (
                                selectedSpecies.eatenBy.map(predId => {
                                  const target = TROPHIC_SPECIES.find(s => s.id === predId);
                                  return (
                                    <span key={predId} className="bg-rose-950 border border-rose-500/50 text-rose-200 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                                      {target?.name || predId}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="text-[11px] text-white/60 italic">Sin depredadores (Tope)</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* BOTÓN DE ACCIÓN FUNCIONAL (Elemento Interactivo de la Unidad 4) */}
                        <div className="pt-1">
                          <button
                            onClick={(e) => handleToggleSpecies(selectedSpecies.id, e)}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98 ${
                              disabledSpeciesIds.includes(selectedSpecies.id)
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-rose-600 hover:bg-rose-500 text-white'
                            }`}
                          >
                            {disabledSpeciesIds.includes(selectedSpecies.id) ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Restaurar {selectedSpecies.name} a la Red</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-4 h-4" />
                                <span>Simular Extinción / Apagar {selectedSpecies.name}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Leyenda concisa de bordes y niveles */}
                <div className="bg-[#0f271c] rounded-3xl p-3 border border-[#204e38] space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="font-serif text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sun" />
                      <span>Guía de Niveles Tróficos (Bordes)</span>
                    </span>
                    <span className="text-[10px] text-white/60">Tocá ✕ en un círculo para apagar</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-rose-500/40">
                      <span className="w-2.5 h-2.5 rounded-full border border-rose-500 bg-rose-950 shrink-0" />
                      <span className="text-rose-200 truncate">Rojo: Tope</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-amber-500/40">
                      <span className="w-2.5 h-2.5 rounded-full border border-amber-400 bg-amber-950 shrink-0" />
                      <span className="text-amber-200 truncate">Amarillo: Carnívoro</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-emerald-500/40">
                      <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 bg-emerald-950 shrink-0" />
                      <span className="text-emerald-200 truncate">Verde: Herbívoro</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-teal-500/40">
                      <span className="w-2.5 h-2.5 rounded-full border border-teal-400 bg-teal-950 shrink-0" />
                      <span className="text-teal-200 truncate">Celeste: Flora</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: VISTA LISTA TRADICIONAL POR NIVELES */}
            {viewMode === 'list' && (
              <div className="space-y-3">
                <p className="text-[11px] text-white/70 px-1 leading-snug">
                  Exploración de la pirámide ecológica desglosada por niveles. Tocá una tarjeta para ver sus detalles.
                </p>

                {TROPHIC_LEVELS.map(level => {
                  const levelSpecies = TROPHIC_SPECIES.filter(s => s.level === level.id);

                  return (
                    <div
                      key={level.id}
                      className={`rounded-3xl p-3 border ${level.color} bg-black/30 backdrop-blur-sm space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-xs font-bold text-white block">
                            {level.name}
                          </strong>
                          <small className="text-[9px] opacity-75 text-white/80 block">
                            {level.subtitle}
                          </small>
                        </div>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${level.badgeBg}`}>
                          {levelSpecies.length} Especies
                        </span>
                      </div>

                      {/* Species Grid for this Level */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {levelSpecies.map(sp => {
                          const isDisabled = disabledSpeciesIds.includes(sp.id);
                          const isSelected = selectedSpeciesId === sp.id;
                          const isPreyOfSelected = selectedSpecies?.eats?.includes(sp.id);
                          const isPredatorOfSelected = selectedSpecies?.eatenBy?.includes(sp.id);

                          let borderClass = 'border-white/10';
                          if (isSelected) borderClass = 'ring-2 ring-sun border-sun shadow-[0_0_15px_#f4c95d55]';
                          else if (isPreyOfSelected) borderClass = 'ring-2 ring-emerald-400 border-emerald-400';
                          else if (isPredatorOfSelected) borderClass = 'ring-2 ring-rose-400 border-rose-400';

                          return (
                            <div
                              key={sp.id}
                              onClick={() => {
                                playClick();
                                setSelectedSpeciesId(isSelected ? null : sp.id);
                              }}
                              className={`relative rounded-2xl p-2 border transition-all cursor-pointer flex flex-col justify-between ${borderClass} ${
                                isDisabled
                                  ? 'bg-rose-950/40 opacity-40 grayscale'
                                  : isSelected
                                  ? 'bg-[#1b3d2e]'
                                  : 'bg-[#10241b] hover:bg-[#163024]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20 bg-black">
                                  <img
                                    src={sp.image}
                                    alt={sp.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="overflow-hidden flex-1">
                                  <strong className="text-[11px] font-bold text-white block truncate leading-tight">
                                    {sp.name}
                                  </strong>
                                  <span className="text-[8px] text-white/60 italic block truncate">
                                    {sp.scientific}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-1.5 flex items-center justify-between text-[8px]">
                                <span className="text-mint font-semibold truncate max-w-[100px]">
                                  {sp.role}
                                </span>
                                
                                <button
                                  onClick={(e) => handleToggleSpecies(sp.id, e)}
                                  title={isDisabled ? 'Restaurar especie' : 'Simular desaparición'}
                                  className={`px-1.5 py-0.5 rounded text-[7.5px] font-bold transition ${
                                    isDisabled
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                                  }`}
                                >
                                  {isDisabled ? 'Extinta' : 'Activa'}
                                </button>
                              </div>

                              {isPreyOfSelected && (
                                <span className="absolute -top-1.5 right-2 bg-emerald-500 text-black text-[7px] font-extrabold px-1.5 py-0.2 rounded-full shadow">
                                  Alimento
                                </span>
                              )}
                              {isPredatorOfSelected && (
                                <span className="absolute -top-1.5 right-2 bg-rose-500 text-white text-[7px] font-extrabold px-1.5 py-0.2 rounded-full shadow">
                                  Depredador
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SIMULADOR DE CRISIS E INCENDIOS SERRANOS */}
        {activeTab === 'scenarios' && (
          <div className="space-y-3 pb-4">
            <div className="bg-gradient-to-r from-rose-950 via-[#260e0e] to-[#1a0a0a] border border-rose-800/60 rounded-3xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-rose-300">
                <Flame className="w-5 h-5 text-sun animate-pulse" />
                <h3 className="font-serif text-base font-bold text-white">
                  Simulaciones de Perturbación Real
                </h3>
              </div>
              <p className="text-[11px] text-rose-100/80 leading-relaxed">
                El ecosistema serrano de Capilla del Monte es extremadamente frágil. Tocá una crisis para ver el <strong>Efecto Cascada</strong> y cómo se altera la red trófica.
              </p>
            </div>

            {/* Scenarios List */}
            <div className="grid gap-2.5">
              {CRISIS_SCENARIOS.map(sc => {
                const isActive = activeCrisisId === sc.id;

                return (
                  <motion.div
                    key={sc.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectScenario(sc)}
                    className={`p-3.5 rounded-3xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-950/80 border-rose-500 shadow-xl'
                        : 'bg-[#10241b] border-[#1b3d2e] hover:border-sun/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl">{sc.icon}</span>
                        <div>
                          <strong className="text-xs font-bold text-white block leading-tight">
                            {sc.title}
                          </strong>
                          <span className="text-[9px] text-sun block mt-0.5">
                            {sc.subtitle}
                          </span>
                        </div>
                      </div>
                      <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap">
                        {sc.severity}
                      </span>
                    </div>

                    <p className="text-[10px] text-white/70 mt-2 leading-tight">
                      {sc.description}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[9px]">
                      <span className="text-white/60">
                        Afecta a: <strong className="text-rose-300">{sc.disabledSpeciesIds.length} especies clave</strong>
                      </span>
                      <span className="text-sun font-bold flex items-center gap-0.5">
                        <span>{isActive ? 'Simulación en curso' : 'Simular impacto'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 🚨 MODAL DE IMPACTO: DETALLE DE CRISIS AMBIENTAL (INCENDIOS, CAZA, ETC.) */}
      <AnimatePresence>
        {activeCrisis && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="w-full max-w-sm bg-[#160b0b] border border-rose-700/60 rounded-t-3xl sm:rounded-3xl p-5 text-white max-h-[85vh] overflow-y-auto space-y-3.5 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{activeCrisis.icon}</span>
                  <div>
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">
                      {activeCrisis.severity}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white leading-tight">
                      {activeCrisis.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCrisisId(null)}
                  className="w-7 h-7 rounded-full bg-white/10 grid place-items-center text-white/70 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Causas Reales */}
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10 text-xs space-y-1">
                <span className="text-[9px] font-bold text-sun uppercase tracking-wider block">
                  Causa Principal en la Zona:
                </span>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  {activeCrisis.causes}
                </p>
              </div>

              {/* Efectos Inmediatos */}
              <div className="bg-rose-950/50 rounded-2xl p-3 border border-rose-800/50 space-y-1.5">
                <span className="text-[9px] font-bold text-rose-300 uppercase tracking-wider block">
                  Efectos Inmediatos en Villa Cielo:
                </span>
                <ul className="space-y-1 text-[11px] text-rose-100/90 list-disc pl-4 leading-tight">
                  {activeCrisis.immediateEffects.map((eff, idx) => (
                    <li key={idx}>{eff}</li>
                  ))}
                </ul>
              </div>

              {/* Efecto Cascada */}
              <div className="bg-black/40 rounded-2xl p-3 border border-white/10 space-y-1">
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                  Efecto Cascada en toda la Red:
                </span>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  {activeCrisis.chainReaction}
                </p>
              </div>

              {/* Guía de Acción Ciudadana */}
              <div className="bg-emerald-950/60 rounded-2xl p-3 border border-emerald-600/40 space-y-1">
                <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  <span>¿Cómo Ayudar / Prevención?</span>
                </span>
                <p className="text-[11px] text-emerald-100 leading-relaxed">
                  {activeCrisis.actionGuide}
                </p>
              </div>

              {/* Restore Button */}
              <button
                onClick={handleRestoreEcosystem}
                className="w-full h-11 rounded-2xl bg-sun text-forest font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar Ecosistema y Sumar EXP</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BottomNav */}
      <BottomNav active="ecosystem" />
    </section>
  );
};
