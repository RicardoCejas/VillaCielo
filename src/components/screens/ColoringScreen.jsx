import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { Check, Palette, Sparkles, Download } from 'lucide-react';
import { playPop, playSuccess } from '../../utils/audio';
import { motion } from 'framer-motion';

export const ColoringScreen = () => {
  const { navigate, addPoints, addToast, triggerCelebration, unlockSpecies } = useApp();
  const palette = ['#E76F51', '#F4C95D', '#68A691', '#4F8FB3', '#9A7BB8', '#7B5C43'];

  // Current active brush color
  const [selectedColor, setSelectedColor] = useState(palette[0]);
  
  // Custom colored parts of the fox
  const [furColor, setFurColor] = useState(palette[0]);
  const [bellyColor, setBellyColor] = useState('#FFF8EB');
  const [earColor, setEarColor] = useState('#f8cabb');

  const handleSave = () => {
    playSuccess();
    triggerCelebration();
    addPoints(100, '¡Tu obra de arte fue guardada!');
    unlockSpecies('zorro-gris', 'color');
    unlockSpecies('lagarto-overo', 'color');
    addToast('Obra de Arte Guardada', 'El zorro pampeano luce espectacular', 'success');
    navigate('games');
  };

  return (
    <section className="relative w-full h-full bg-paper flex flex-col justify-between overflow-hidden">
      {/* TopBar with styled back button */}
      <TopBar
        title="Coloreá la fauna"
        onBack={() => navigate('games')}
        backLabel="Volver"
      />

      <div className="flex-1 flex flex-col justify-between px-5 py-3 overflow-y-auto">
        {/* Topline with Color Icon */}
        <div className="flex items-center justify-between text-xs bg-cream p-2 rounded-2xl border border-line">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-2xs shrink-0">
              <img src="/icons/color.png" alt="Colorear" className="w-full h-full object-contain" />
            </div>
            <div>
              <strong className="text-forest font-bold block text-[11px] leading-tight">Zorro gris pampeano</strong>
              <span className="text-muted text-[9px]">Taller de ilustración serrana</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-forest bg-white px-2 py-1 rounded-xl shadow-2xs">Obra activa</span>
        </div>

        {/* Interactive SVG Coloring Canvas */}
        <div className="relative aspect-[1/0.92] w-full max-w-[270px] mx-auto bg-gradient-to-b from-[#dff3f7] from-60% to-[#dce6b9] rounded-3xl overflow-hidden shadow-inner border border-forest/10 p-2">
          <svg
            viewBox="0 0 300 330"
            role="img"
            aria-label="Ilustración de zorro para colorear"
            className="w-full h-full cursor-pointer"
          >
            {/* Main Fox Head/Body */}
            <motion.path
              fill={furColor}
              d="M74 99 50 39l63 36c24-13 52-13 76 0l62-36-24 61c18 22 25 51 17 81-11 44-48 78-94 78s-83-34-94-78c-8-30 0-60 18-82Z"
              onClick={() => {
                playPop();
                setFurColor(selectedColor);
              }}
              whileHover={{ opacity: 0.92 }}
              transition={{ duration: 0.2 }}
            />

            {/* Inner Ear Accents */}
            <path
              d="M62 52 76 85 96 68 Z"
              fill={earColor}
              onClick={() => {
                playPop();
                setEarColor(selectedColor);
              }}
            />
            <path
              d="M238 52 224 85 204 68 Z"
              fill={earColor}
              onClick={() => {
                playPop();
                setEarColor(selectedColor);
              }}
            />

            {/* Snout & Belly Patch */}
            <path
              fill={bellyColor}
              d="M90 157c23 3 40 18 60 50 20-32 37-47 60-50-6 48-27 76-60 76s-54-28-60-76Z"
              onClick={() => {
                playPop();
                setBellyColor(selectedColor);
              }}
              className="cursor-pointer"
            />

            {/* Eyes */}
            <circle cx="112" cy="137" r="6" fill="#173B32" />
            <circle cx="114" cy="135" r="2" fill="#FFFFFF" />
            <circle cx="188" cy="137" r="6" fill="#173B32" />
            <circle cx="190" cy="135" r="2" fill="#FFFFFF" />

            {/* Nose & Whiskers */}
            <path d="M141 184h18l-9 10z" fill="#173B32" />
            <path
              d="M150 194c-1 12-10 16-20 15m20-15c1 12 10 16 20 15"
              fill="none"
              stroke="#173B32"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M70 270c38 17 122 17 160 0M53 292c52 14 142 14 194 0"
              fill="none"
              stroke="#A8C7A0"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Color Palette Selector */}
        <div>
          <small className="text-center block text-[10px] text-muted mb-2 font-medium">
            Tocá un color y luego tocá el dibujo para pintar
          </small>
          <div className="flex items-center justify-center gap-2.5">
            {palette.map(c => (
              <button
                key={c}
                onClick={() => {
                  playPop();
                  setSelectedColor(c);
                }}
                style={{ backgroundColor: c }}
                className={`w-9 h-9 rounded-full border-[3px] border-white shadow-md transition-transform ${
                  selectedColor === c
                    ? 'scale-110 ring-2 ring-forest ring-offset-2'
                    : 'hover:scale-105'
                }`}
                aria-label={`Elegir color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Save Action */}
        <button
          onClick={handleSave}
          className="w-full h-12 rounded-2xl bg-forest hover:bg-forest-light text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-forest/20 active:scale-95 transition"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>GUARDAR DIBUJO</span>
        </button>
      </div>
    </section>
  );
};
