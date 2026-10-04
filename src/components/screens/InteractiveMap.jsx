import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MAP_LANDMARKS } from '../../data/mapData';
import {
  Compass,
  MapPin,
  Trees,
  Mountain,
  QrCode,
  Sparkles,
  ChevronRight,
  X,
  Layers,
  Clock,
  TrendingUp,
  Navigation,
  ExternalLink,
  Info
} from 'lucide-react';
import { playClick, playPop } from '../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const InteractiveMap = ({ isCompact = false }) => {
  const { navigate } = useApp();
  const [selectedLandmark, setSelectedLandmark] = useState(MAP_LANDMARKS[0]);
  const [mapMode, setMapMode] = useState('illustrated'); // 'illustrated' or 'satellite'
  const [showDetailModal, setShowDetailModal] = useState(!isCompact);

  const getPinIcon = (id) => {
    switch (id) {
      case 'sendero-bosque-serrano':
        return <Trees className="w-4 h-4" />;
      case 'mirador-balcones':
        return <Mountain className="w-4 h-4" />;
      case 'estacion-qr':
        return <QrCode className="w-4 h-4" />;
      case 'observatorio-estrellas':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getPinColors = (id) => {
    switch (id) {
      case 'sendero-bosque-serrano':
        return 'bg-forest text-mint border-white';
      case 'mirador-balcones':
        return 'bg-coral text-white border-white';
      case 'estacion-qr':
        return 'bg-sun text-forest border-white';
      case 'observatorio-estrellas':
        return 'bg-purple-700 text-white border-white';
      default:
        return 'bg-forest text-white border-white';
    }
  };

  const handleSelectLandmark = (landmark) => {
    playClick();
    setSelectedLandmark(landmark);
    setShowDetailModal(true);
  };

  return (
    <div className={`relative w-full overflow-hidden select-none ${
      isCompact
        ? 'h-[310px] rounded-3xl border border-forest/10 shadow-lg'
        : 'h-full flex flex-col bg-[#0e241c]'
    }`}>
      {/* Map Graphic Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#244638]">
        {/* Map Background Layer: Illustrated Topo or Satellite */}
        {mapMode === 'illustrated' ? (
          <div className="absolute inset-0 bg-[#28483b]">
            {/* Topographic Elevation Contours */}
            <svg
              className="absolute inset-0 w-full h-full opacity-35"
              viewBox="0 0 500 500"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Mountain ridges (Uritorco massif) */}
              <path
                d="M 50 120 Q 220 50 480 90 T 520 280 Q 320 380 80 340 Z"
                fill="#1f3b30"
                stroke="#4a7a67"
                strokeWidth="1.5"
              />
              <path
                d="M 100 150 Q 260 90 440 120 T 470 250 Q 300 320 120 290 Z"
                fill="#244437"
                stroke="#588b77"
                strokeWidth="1"
              />
              <path
                d="M 180 180 Q 300 140 400 160 T 420 230 Q 310 270 200 240 Z"
                fill="#2c5142"
                stroke="#6fa48f"
                strokeWidth="1"
              />
              <path
                d="M 280 200 Q 340 180 390 190 T 390 220 Z"
                fill="#345e4d"
                stroke="#88bea9"
                strokeWidth="1.5"
              />

              {/* Río Calabalumba stream path */}
              <path
                d="M 10 380 Q 90 350 180 370 T 340 430 T 490 480"
                fill="none"
                stroke="#70b7d8"
                strokeWidth="6"
                strokeLinecap="round"
                className="opacity-90"
              />
              <text x="110" y="360" fill="#70b7d8" fontSize="10" fontWeight="bold" letterSpacing="1">
                RÍO CALABALUMBA
              </text>

              {/* Cerro Uritorco peak landmark */}
              <text x="310" y="85" fill="#f4c95d" fontSize="11" fontWeight="bold" letterSpacing="1.2">
                ▲ C° URITORCO (1.949m)
              </text>
            </svg>

            {/* Main Trail Path (Sendero del Bosque Serrano) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Animated trail dashed path */}
              <path
                d="M 15 85 Q 28 64 42 44 T 64 74 T 74 26"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeDasharray="3 2"
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
            </svg>
          </div>
        ) : (
          /* Satellite Terrain Mode */
          <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85')`
          }}>
            <div className="absolute inset-0 bg-[#0e261e]/55" />
          </div>
        )}

        {/* Top Floating Map Controls */}
        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-auto">
          {/* Geographic Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest/85 backdrop-blur-md text-white text-[9px] font-bold shadow-md border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#75d6a8] ring-4 ring-[#75d6a8]/30 animate-pulse" />
            <span>VILLA CIELO · CAPILLA DEL MONTE</span>
          </div>

          {/* Layer switcher button */}
          <button
            onClick={() => {
              playClick();
              setMapMode(prev => (prev === 'illustrated' ? 'satellite' : 'illustrated'));
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/85 hover:bg-white backdrop-blur-md text-forest text-[10px] font-bold shadow-md border border-line transition active:scale-95"
            title="Cambiar capa de mapa"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {mapMode === 'illustrated' ? 'Satelital' : 'Plano'}
            </span>
          </button>
        </div>

        {/* Compass Rosette */}
        <div className="absolute bottom-4 left-3 z-10 w-9 h-9 rounded-full bg-forest/80 backdrop-blur-md border border-white/20 text-white flex flex-col items-center justify-center shadow-lg pointer-events-none">
          <Compass className="w-4 h-4 text-sun" />
          <span className="text-[7px] font-bold tracking-tighter leading-none mt-0.5">N</span>
        </div>

        {/* 📍 Interactive Pins on the Map */}
        {MAP_LANDMARKS.map((landmark) => {
          const isSelected = selectedLandmark?.id === landmark.id;
          const pinColor = getPinColors(landmark.id);

          return (
            <div
              key={landmark.id}
              style={{
                left: `${landmark.coords.x}%`,
                top: `${landmark.coords.y}%`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              {/* Pulse ripple for selected pin */}
              {isSelected && (
                <div className="absolute inset-0 -m-2 rounded-full bg-sun/40 animate-ping pointer-events-none" />
              )}

              {/* Interactive Pin Button */}
              <motion.button
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelectLandmark(landmark)}
                className={`relative w-9 h-9 rounded-2xl border-[2.5px] grid place-items-center shadow-xl rotate-[-45deg] cursor-pointer transition-all ${pinColor} ${
                  isSelected ? 'ring-4 ring-sun shadow-2xl scale-110 z-30' : ''
                }`}
                aria-label={landmark.title}
                title={landmark.title}
              >
                <div className="rotate-45">
                  {getPinIcon(landmark.id)}
                </div>
              </motion.button>

              {/* Pin Label Tooltip */}
              <div
                onClick={() => handleSelectLandmark(landmark)}
                className={`absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[9px] font-bold shadow-md cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sun text-forest scale-105 border border-forest/20'
                    : 'bg-black/65 text-white backdrop-blur-xs hover:bg-black/85'
                }`}
              >
                {landmark.title}
              </div>
            </div>
          );
        })}

        {/* User Location Pulse Marker ("Estás acá") */}
        <div
          style={{ left: '20%', top: '78%' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-[#4d9ed1] border-2 border-white ring-8 ring-[#4d9ed1]/40 animate-pulse" />
          <span className="text-[8px] font-bold text-white text-shadow mt-1 bg-black/50 px-1.5 py-0.2 rounded">
            Ingreso
          </span>
        </div>
      </div>

      {/* 📋 Interactive Landmark Detail Card (Sheet) */}
      <AnimatePresence>
        {selectedLandmark && showDetailModal && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className={`z-30 bg-paper border-t border-line shadow-2xl flex flex-col ${
              isCompact
                ? 'absolute bottom-0 inset-x-0 rounded-t-3xl max-h-[175px] p-3'
                : 'relative rounded-t-3xl p-4'
            }`}
          >
            {/* Handle & Close */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[8px] font-bold text-forest-light uppercase tracking-wider">
                {selectedLandmark.type} · Capilla del Monte
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-6 h-6 rounded-full bg-cream hover:bg-cream-dark text-muted grid place-items-center"
                title="Minimizar ficha"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-start gap-3">
              {/* Landmark Thumbnail */}
              <img
                src={selectedLandmark.image}
                alt={selectedLandmark.title}
                className="w-16 h-16 rounded-xl object-cover border border-line shadow-sm shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-sm font-bold text-forest leading-tight truncate">
                  {selectedLandmark.title}
                </h3>
                <p className="text-[10px] text-muted line-clamp-2 mt-0.5 leading-snug">
                  {selectedLandmark.description}
                </p>

                {/* Quick Stats Badges */}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-ink bg-cream px-2 py-0.5 rounded-md border border-line">
                    <Clock className="w-3 h-3 text-forest" />
                    {selectedLandmark.time}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-ink bg-cream px-2 py-0.5 rounded-md border border-line">
                    <TrendingUp className="w-3 h-3 text-coral" />
                    {selectedLandmark.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-2.5 pt-2 border-t border-line flex items-center justify-between">
              <span className="text-[9px] text-muted font-medium truncate max-w-[150px]">
                {selectedLandmark.subtitle}
              </span>
              <button
                onClick={() => {
                  playPop();
                  navigate(selectedLandmark.targetScreen);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest hover:bg-forest-light text-white text-[10px] font-bold shadow-md active:scale-95 transition"
              >
                <span>{selectedLandmark.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
