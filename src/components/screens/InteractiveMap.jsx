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
  Plus,
  Minus,
  LocateFixed,
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { playClick, playPop } from '../../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const InteractiveMap = ({ isCompact = false }) => {
  const { navigate, theme, t } = useApp();
  const [selectedLandmark, setSelectedLandmark] = useState(MAP_LANDMARKS[0]);
  const [showDetailModal, setShowDetailModal] = useState(!isCompact);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [trailFilter, setTrailFilter] = useState('all'); // 'all', 'bajo', 'balcones', 'noche'
  const [gpsSimulated, setGpsSimulated] = useState(false);
  const [gpsPos, setGpsPos] = useState({ x: 28, y: 64 });
  const [mapDayNight, setMapDayNight] = useState(theme === 'dark' ? 'night' : 'day');

  const getPinIcon = (id) => {
    switch (id) {
      case 'sendero-bosque-serrano':
        return <Trees className="w-3.5 h-3.5" />;
      case 'mirador-balcones':
        return <Mountain className="w-3.5 h-3.5" />;
      case 'estacion-qr':
        return <QrCode className="w-3.5 h-3.5" />;
      case 'observatorio-estrellas':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const getPinColors = (id) => {
    switch (id) {
      case 'sendero-bosque-serrano':
        return 'bg-emerald-700 text-white';
      case 'mirador-balcones':
        return 'bg-amber-600 text-white';
      case 'estacion-qr':
        return 'bg-forest text-sun';
      case 'observatorio-estrellas':
        return 'bg-indigo-700 text-white';
      default:
        return 'bg-forest text-white';
    }
  };

  const handleSelectLandmark = (landmark) => {
    playClick();
    setSelectedLandmark(landmark);
    setShowDetailModal(true);
  };

  const handleZoomIn = () => {
    playPop();
    setZoomLevel(z => Math.min(1.6, Number((z + 0.2).toFixed(1))));
  };

  const handleZoomOut = () => {
    playPop();
    setZoomLevel(z => Math.max(0.9, Number((z - 0.2).toFixed(1))));
  };

  const handleToggleGps = () => {
    playClick();
    if (!gpsSimulated) {
      setGpsSimulated(true);
      // Move GPS marker along trail
      const positions = [
        { x: 22, y: 75 },
        { x: 38, y: 52 },
        { x: 58, y: 65 },
        { x: 72, y: 32 }
      ];
      let step = 0;
      const interval = setInterval(() => {
        step = (step + 1) % positions.length;
        setGpsPos(positions[step]);
      }, 4000);
      return () => clearInterval(interval);
    } else {
      setGpsSimulated(false);
    }
  };

  return (
    <div className={`relative w-full overflow-hidden select-none ${
      isCompact
        ? 'h-[310px] rounded-3xl border border-line dark:border-[#224636] shadow-md'
        : 'h-full flex flex-col bg-[#0e241c]'
    }`}>
      {/* Floating Trail Filter Buttons */}
      <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between gap-1 pointer-events-none">
        <div className="flex bg-black/60 backdrop-blur-md p-0.5 rounded-xl border border-white/20 pointer-events-auto text-[9px] font-bold">
          <button
            onClick={() => setTrailFilter('all')}
            className={`px-2 py-1 rounded-lg transition ${
              trailFilter === 'all' ? 'bg-forest text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setTrailFilter('bajo')}
            className={`px-2 py-1 rounded-lg transition ${
              trailFilter === 'bajo' ? 'bg-forest text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Sendero Bajo
          </button>
          <button
            onClick={() => setTrailFilter('balcones')}
            className={`px-2 py-1 rounded-lg transition ${
              trailFilter === 'balcones' ? 'bg-forest text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Balcones
          </button>
          <button
            onClick={() => setTrailFilter('noche')}
            className={`px-2 py-1 rounded-lg transition ${
              trailFilter === 'noche' ? 'bg-forest text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Astroturismo
          </button>
        </div>

        {/* Day / Night map toggle */}
        <button
          onClick={() => {
            playPop();
            setMapDayNight(m => m === 'day' ? 'night' : 'day');
          }}
          className="p-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white pointer-events-auto hover:bg-black/80 transition"
          title="Alternar plano día/noche"
        >
          {mapDayNight === 'night' ? <Sun className="w-3.5 h-3.5 text-sun" /> : <Moon className="w-3.5 h-3.5 text-white" />}
        </button>
      </div>

      {/* Map Graphic Area with Zoom Transform */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#244638]">
        <div
          className={`absolute inset-0 transition-transform duration-300 origin-center ${
            mapDayNight === 'night' ? 'bg-[#0b1c16]' : 'bg-[#294a3d]'
          }`}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Topographic Contours SVG */}
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 500 500"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Uritorco mountain ridges */}
            <path
              d="M 50 120 Q 220 50 480 90 T 520 280 Q 320 380 80 340 Z"
              fill={mapDayNight === 'night' ? '#0d241c' : '#1f3b30'}
              stroke="#538270"
              strokeWidth="1.5"
            />
            <path
              d="M 100 150 Q 260 90 440 120 T 470 250 Q 300 320 120 290 Z"
              fill={mapDayNight === 'night' ? '#122c22' : '#25473a'}
              stroke="#689f8b"
              strokeWidth="1"
            />
            <path
              d="M 180 180 Q 300 140 400 160 T 420 230 Q 310 270 200 240 Z"
              fill={mapDayNight === 'night' ? '#17362b' : '#2e5545'}
              stroke="#83baa7"
              strokeWidth="1"
            />

            {/* Río Calabalumba stream path */}
            <path
              d="M 10 380 Q 90 350 180 370 T 340 430 T 490 480"
              fill="none"
              stroke="#5faed6"
              strokeWidth="5"
              strokeLinecap="round"
              className="opacity-90"
            />
            <text x="110" y="360" fill="#70b7d8" fontSize="9" fontWeight="bold" letterSpacing="1">
              RÍO CALABALUMBA
            </text>

            {/* Cerro Uritorco peak */}
            <text x="310" y="85" fill="#f4c95d" fontSize="10" fontWeight="bold" letterSpacing="1.2">
              ▲ C° URITORCO (1.949m)
            </text>

            {/* Stars if night mode */}
            {mapDayNight === 'night' && (
              <g fill="#ffffff" opacity="0.8">
                <circle cx="80" cy="50" r="1.5" />
                <circle cx="140" cy="70" r="2" />
                <circle cx="240" cy="40" r="1.5" />
                <circle cx="360" cy="35" r="2.5" />
                <circle cx="430" cy="60" r="1.5" />
                <circle cx="470" cy="90" r="2" />
              </g>
            )}
          </svg>

          {/* Trail Paths */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Trail 1: Sendero del Bosque (Lower) */}
            {(trailFilter === 'all' || trailFilter === 'bajo') && (
              <path
                d="M 15 85 Q 26 68 42 50 T 64 74"
                fill="none"
                stroke="#6be0ac"
                strokeWidth="2.2"
                strokeDasharray="3 2"
                strokeLinecap="round"
              />
            )}

            {/* Trail 2: Mirador de los Balcones (Upper) */}
            {(trailFilter === 'all' || trailFilter === 'balcones') && (
              <path
                d="M 42 50 Q 56 40 74 26"
                fill="none"
                stroke="#f4c95d"
                strokeWidth="2.2"
                strokeDasharray="3 2"
                strokeLinecap="round"
              />
            )}

            {/* Trail 3: Astroturismo nocturno */}
            {(trailFilter === 'all' || trailFilter === 'noche') && (
              <path
                d="M 64 74 Q 68 84 82 82"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.2"
                strokeDasharray="2 2"
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Interactive Landmark Pins */}
          {MAP_LANDMARKS.map(item => {
            const isSelected = selectedLandmark?.id === item.id;
            const pinColor = getPinColors(item.id);

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelectLandmark(item)}
                style={{ left: `${item.coords.x}%`, top: `${item.coords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer`}
              >
                <div
                  className={`relative p-1.5 rounded-full shadow-lg border-2 border-white transition-transform ${
                    isSelected ? 'scale-125 ring-4 ring-sun/60' : 'group-hover:scale-110'
                  } ${pinColor}`}
                >
                  {getPinIcon(item.id)}
                </div>

                <span className="mt-1 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[8px] font-bold tracking-tight shadow-md whitespace-nowrap pointer-events-none">
                  {item.title}
                </span>
              </motion.button>
            );
          })}

          {/* Simulated User GPS Location Pin */}
          {gpsSimulated && (
            <motion.div
              animate={{ left: `${gpsPos.x}%`, top: `${gpsPos.y}%` }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div className="relative">
                <span className="w-5 h-5 rounded-full bg-sky-400 opacity-60 animate-ping absolute inset-0" />
                <span className="w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-lg grid place-items-center text-white">
                  <Navigation className="w-2.5 h-2.5 fill-white" />
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Map Floating Controls (Zoom & GPS) */}
        <div className="absolute right-2.5 bottom-3 z-30 flex flex-col gap-1.5">
          {/* Simulate GPS Button */}
          <button
            onClick={handleToggleGps}
            className={`w-8 h-8 rounded-xl backdrop-blur-md border shadow-md grid place-items-center transition active:scale-95 ${
              gpsSimulated
                ? 'bg-sky-500 text-white border-white'
                : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
            }`}
            title="Simular mi posición GPS en el sendero"
          >
            <LocateFixed className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-md grid place-items-center hover:bg-black/80 transition active:scale-95"
            title="Acercar plano"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-md grid place-items-center hover:bg-black/80 transition active:scale-95"
            title="Alejar plano"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Landmark Info Sheet */}
      {selectedLandmark && showDetailModal && (
        <div className={`p-3 border-t transition-colors ${
          theme === 'dark' ? 'bg-[#10241c] border-[#1d4133]' : 'bg-paper border-line'
        }`}>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <img
                src={selectedLandmark.image}
                alt={selectedLandmark.title}
                className="w-10 h-10 rounded-xl object-cover border border-line shrink-0"
              />
              <div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-forest-light block">
                  {selectedLandmark.type} · {selectedLandmark.distance}
                </span>
                <strong className="font-serif text-xs font-bold leading-tight block">
                  {selectedLandmark.title}
                </strong>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="p-1 text-muted hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-muted line-clamp-1 mb-2">
            {selectedLandmark.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[9px] text-muted">
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" /> {selectedLandmark.time}
              </span>
              <span className="flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {selectedLandmark.elevation}
              </span>
            </div>

            <button
              onClick={() => {
                playPop();
                navigate(selectedLandmark.targetScreen);
              }}
              className="px-2.5 py-1 rounded-xl bg-forest hover:bg-forest-light text-white text-[10px] font-bold shadow-xs flex items-center gap-1 active:scale-95 transition"
            >
              <span>{selectedLandmark.actionText}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
