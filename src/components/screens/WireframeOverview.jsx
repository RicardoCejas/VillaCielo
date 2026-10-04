import React from 'react';
import { useApp } from '../../context/AppContext';
import { SPECIES_LIST } from '../../data/speciesData';
import { Leaf, Smartphone, Sparkles, ExternalLink, Play } from 'lucide-react';
import { ProfileScreen } from './ProfileScreen';
import { HomeScreen } from './HomeScreen';
import { ScannerScreen } from './ScannerScreen';
import { WikiScreen } from './WikiScreen';
import { SpeciesDetailScreen } from './SpeciesDetailScreen';
import { GamesMenuScreen } from './GamesMenuScreen';
import { TriviaScreen } from './TriviaScreen';
import { PuzzleScreen } from './PuzzleScreen';
import { ColoringScreen } from './ColoringScreen';
import { MemoryScreen } from './MemoryScreen';
import { SettingsScreen } from './SettingsScreen';
import { playPop } from '../../utils/audio';

export const WireframeOverview = () => {
  const { setViewMode, navigate } = useApp();

  const handleOpenScreen = (screenName, payload = null) => {
    playPop();
    navigate(screenName, payload);
    setViewMode('app');
  };

  const screensConfig = [
    {
      number: '01',
      title: 'Selección de perfil',
      description: 'Ingreso y personalización inicial',
      target: 'profile',
      component: <ProfileScreen />
    },
    {
      number: '02',
      title: 'Inicio y mapa',
      description: 'Recorrido principal de la reserva',
      target: 'home',
      component: <HomeScreen />
    },
    {
      number: '03',
      title: 'Escáner',
      description: 'Captura de códigos y especies',
      target: 'scan',
      component: <ScannerScreen />
    },
    {
      number: '04',
      title: 'Wiki natural',
      description: 'Colección completa de fauna y flora',
      target: 'wiki',
      component: <WikiScreen />
    },
    {
      number: '05',
      title: 'Detalle de especie',
      description: 'Información educativa del animal',
      target: 'species-detail',
      component: <SpeciesDetailScreen isDiscoveryMode={false} />
    },
    {
      number: '06',
      title: 'Nuevo descubrimiento',
      description: 'Confirmación y recompensa',
      target: 'discovery',
      component: <SpeciesDetailScreen isDiscoveryMode={true} />
    },
    {
      number: '07',
      title: 'Menú de juegos',
      description: 'Selección de desafíos educativos',
      target: 'games',
      component: <GamesMenuScreen />
    },
    {
      number: '08',
      title: 'Trivia natural',
      description: 'Pregunta y opciones de respuesta',
      target: 'trivia',
      component: <TriviaScreen />
    },
    {
      number: '09',
      title: 'Puzzle del paisaje',
      description: 'Tablero y referencia visual',
      target: 'puzzle',
      component: <PuzzleScreen />
    },
    {
      number: '10',
      title: 'Colorear',
      description: 'Lienzo creativo y paleta',
      target: 'color',
      component: <ColoringScreen />
    },
    {
      number: '11',
      title: 'Memoria silvestre',
      description: 'Tablero de cartas y progreso',
      target: 'memory',
      component: <MemoryScreen />
    },
    {
      number: '12',
      title: 'Ajustes',
      description: 'Idioma, sonido y accesibilidad',
      target: 'settings',
      component: <SettingsScreen />
    }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_5%,#fffffff2,#0000_26%),linear-gradient(145deg,#e7efe9,#ccdcd3)] p-6 md:p-12 lg:p-16">
      {/* Board Header */}
      <header className="max-w-[1380px] mx-auto pb-10 mb-12 border-b border-[#173b32]/20 flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-forest text-cream grid place-items-center shadow-xl shrink-0">
            <Leaf className="w-8 h-8" />
          </div>
          <div>
            <span className="text-forest-light text-[11px] font-bold tracking-[2px] uppercase block">
              DISEÑO DE ALTA FIDELIDAD · V1.0
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink tracking-tight mt-1 mb-2">
              Villa Cielo Abierto
            </h1>
            <p className="text-muted text-sm max-w-xl leading-relaxed">
              Sistema completo de 12 pantallas para explorar, jugar y aprender sobre la biodiversidad de la reserva. Hacé clic en cualquier pantalla para probarla en el simulador móvil interactivo.
            </p>
          </div>
        </div>

        {/* Aside Stats & Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3">
          <button
            onClick={() => {
              playPop();
              setViewMode('app');
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-forest hover:bg-forest-light text-white text-xs font-bold shadow-lg shadow-forest/20 active:scale-95 transition"
          >
            <Smartphone className="w-4 h-4" />
            <span>Abrir Simulador Móvil</span>
          </button>

          <aside className="bg-white/60 backdrop-blur-md border border-[#173b32]/10 rounded-2xl p-3 px-4 text-xs grid gap-1">
            <small className="text-muted text-[8px] font-bold uppercase tracking-wider">
              Plataforma
            </small>
            <strong className="text-ink font-semibold">Aplicación móvil (PWA/React)</strong>
            <small className="text-muted text-[8px] font-bold uppercase tracking-wider mt-1">
              Identidad
            </small>
            <strong className="text-ink font-semibold">Naturaleza · Educación</strong>
          </aside>
        </div>
      </header>

      {/* Screen Board Grid */}
      <section
        className="max-w-[1380px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 md:gap-14 justify-center"
        aria-label="Pantallas de alta fidelidad"
      >
        {screensConfig.map((item) => (
          <div key={item.number} className="flex flex-col group">
            {/* Frame Caption */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-forest text-white font-serif font-bold text-sm grid place-items-center shadow-md">
                  {item.number}
                </span>
                <div>
                  <h2 className="font-serif text-base font-bold text-ink leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-muted text-[11px] mt-0.5">{item.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenScreen(item.target)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-forest bg-white/80 hover:bg-white px-2.5 py-1 rounded-lg border border-line shadow-xs"
                title="Interactuar con esta pantalla"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Probar</span>
              </button>
            </div>

            {/* Smartphone Shell Mockup */}
            <div
              onClick={() => handleOpenScreen(item.target)}
              className="relative aspect-[390/780] max-h-[700px] w-full bg-[#12241f] border-[6px] border-[#12241f] rounded-[44px] p-2.5 shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(20,48,40,0.35)] overflow-hidden"
            >
              {/* Screen Content Wrapper */}
              <div className="w-full h-full bg-cream rounded-[32px] overflow-hidden pointer-events-none select-none relative">
                {item.component}
              </div>

              {/* Home indicator bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/80 rounded-full pointer-events-none" />

              {/* Hover Overlay Hint */}
              <div className="absolute inset-0 bg-forest/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 rounded-2xl bg-forest/90 text-white text-xs font-bold shadow-xl flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-current text-sun" />
                  <span>Interactuar con Pantalla {item.number}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
