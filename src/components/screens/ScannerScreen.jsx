import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { IMAGES, SPECIES_LIST } from '../../data/speciesData';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { Camera, Sparkles, QrCode, RefreshCw, KeyRound, Check, ArrowRight } from 'lucide-react';
import { playCameraSnap, playPop, playSuccess } from '../../utils/audio';

export const ScannerScreen = () => {
  const { navigate, scanQRCode, goBack, unlockedSpeciesIds, theme, t } = useApp();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [activeTab, setActiveTab] = useState('camera');
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Apuntá al código QR de una posta en Villa Cielo');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedQRTarget, setSelectedQRTarget] = useState('QR_CORZUELA');

  const qrOptions = SPECIES_LIST.filter(s => s.qrCode);
  const trailPostChips = [
    { code: 'VC-ZORRO', name: 'Zorro Gris (Posta 1)' },
    { code: 'VC-CORZUELA', name: 'Corzuela Parda (Posta 2)' },
    { code: 'VC-PEPERINA', name: 'Peperina Serrana (Posta 3)' },
    { code: 'VC-MOLLE', name: 'Molle de Beber (Posta 4)' },
    { code: 'VC-ALGARROBO', name: 'Algarrobo Blanco (Posta 5)' },
    { code: 'VC-HALCON', name: 'Halconcito Colorado (Posta 6)' },
  ];

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleToggleCamera = async () => {
    playPop();
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
      setStatusMessage('Cámara pausada.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setStatusMessage('Cámara lista. Centrá el código QR de la reserva.');
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      setStatusMessage('Cámara no disponible. Podés ingresar el código manual.');
      setActiveTab('manual');
    }
  };

  const handleExecuteScan = (codeToScan = selectedQRTarget) => {
    playCameraSnap();
    setIsScanning(true);
    setStatusMessage('¡Decodificando posta de la reserva...');

    setTimeout(() => {
      setIsScanning(false);
      scanQRCode(codeToScan);
    }, 850);
  };

  const handleManualSubmit = (e) => {
    e?.preventDefault();
    if (!manualCode.trim()) {
      setManualError('Por favor ingresá un código.');
      return;
    }

    setManualError('');
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      scanQRCode(manualCode.trim());
    }, 600);
  };

  const handleSelectChip = (code) => {
    playPop();
    setManualCode(code);
    setManualError('');
  };

  return (
    <section className="relative w-full h-full bg-[#081812] flex flex-col justify-between overflow-hidden">
      {/* TopBar with styled '← Volver' */}
      <TopBar
        title={t('scanTitle')}
        onBack={goBack}
        backLabel={t('back')}
        onSettings={() => navigate('settings')}
        light
      />

      {/* Tab Switcher: Cámara vs Código Manual */}
      <div className="relative z-30 px-4 pt-1 pb-2">
        <div className="flex bg-black/50 backdrop-blur-md p-1 rounded-2xl border border-white/20">
          <button
            onClick={() => {
              playPop();
              setActiveTab('camera');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'camera'
                ? 'bg-forest text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Cámara en Vivo</span>
          </button>

          <button
            onClick={() => {
              playPop();
              setActiveTab('manual');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'manual'
                ? 'bg-forest text-white shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Código Manual</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'camera' ? (
        <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col justify-between">
          {/* Camera Image Fallback */}
          <img
            src={IMAGES.trail}
            alt="Monte serrano de Villa Cielo"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              cameraActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />

          {/* Real Live Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              cameraActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Ambient Dark Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#04140e]/90 via-[#04140e]/20 to-[#04140e]/95 pointer-events-none" />

          {/* Instructions */}
          <div className="relative z-10 text-center px-6 text-white pt-1">
            <span className="text-mint text-[9px] font-bold tracking-[2px] uppercase block mb-0.5">
              Posta Interactiva · Villa Cielo
            </span>
            <h2 className="font-serif text-xl font-bold tracking-tight">
              Escanear Tótem de Sendero
            </h2>
            <p className="text-[11px] text-white/80 max-w-xs mx-auto mt-0.5 leading-snug">
              {statusMessage}
            </p>
          </div>

          {/* Viewfinder Target */}
          <div className="relative my-auto w-[190px] h-[190px] mx-auto pointer-events-none">
            {/* 4 Framing Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl shadow-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl shadow-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl shadow-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl shadow-lg" />

            {/* Animated Laser Scan Line */}
            <div className="absolute inset-x-3 h-[2px] bg-[#79e5b2] shadow-[0_0_14px_#79e5b2] animate-scan" />
          </div>

          {/* Controls & QR Station Selector */}
          <div className="relative z-20 px-4 pb-3 space-y-2">
            {/* Quick selector of stations for simulation */}
            <div className="bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <span className="text-[8px] font-bold uppercase tracking-wider text-mint block mb-1 px-1">
                Simular Posta QR de la Reserva:
              </span>
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedQRTarget}
                  onChange={(e) => setSelectedQRTarget(e.target.value)}
                  className="flex-1 bg-white/15 border border-white/30 text-white text-[11px] font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  {qrOptions.map(opt => {
                    const isUnlocked = unlockedSpeciesIds.includes(opt.id);
                    return (
                      <option key={opt.qrCode} value={opt.qrCode} className="bg-forest text-white">
                        {isUnlocked ? '✓ ' : '🔒 '} {opt.name} ({opt.category})
                      </option>
                    );
                  })}
                </select>

                <button
                  onClick={() => handleExecuteScan(selectedQRTarget)}
                  disabled={isScanning}
                  className="px-3 py-1.5 rounded-xl bg-sun hover:bg-sun-light text-forest font-bold text-xs shadow-md shrink-0 active:scale-95 transition"
                >
                  Escanear
                </button>
              </div>
            </div>

            {/* Camera Switcher Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleToggleCamera}
                className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#071e16]/80 hover:bg-[#071e16] border border-white/30 text-white text-[11px] font-bold transition active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>{cameraActive ? 'Pausar Cámara' : 'Activar Cámara'}</span>
              </button>

              <button
                onClick={() => setActiveTab('manual')}
                className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-[11px] font-bold transition active:scale-95"
              >
                <KeyRound className="w-4 h-4" />
                <span>Escribir Código</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Manual Code View (when camera doesn't work or user prefers typing) */
        <div className="relative flex-1 min-h-0 overflow-y-auto px-5 py-3 flex flex-col justify-between text-white">
          <div>
            <div className="text-center max-w-xs mx-auto mb-4">
              <span className="w-12 h-12 rounded-2xl bg-forest border border-white/20 text-sun grid place-items-center mx-auto mb-2 shadow-lg">
                <KeyRound className="w-6 h-6" />
              </span>
              <h2 className="font-serif text-xl font-bold tracking-tight">
                Ingresá el Código del Poste
              </h2>
              <p className="text-xs text-white/70 mt-1">
                ¿No anda la cámara o no tenés permisos? Ingresá el código alfanumérico grabado en los postes físicos de Villa Cielo.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-mint mb-1">
                  Código del Poste o Especie
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => {
                    setManualCode(e.target.value);
                    setManualError('');
                  }}
                  placeholder="Ej: VC-ZORRO o VC-01"
                  className="w-full px-3 py-2.5 text-sm uppercase font-mono font-bold tracking-wider rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sun"
                />
                {manualError && (
                  <p className="text-[10px] text-rose-300 font-bold mt-1">
                    {manualError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full h-11 rounded-xl bg-sun hover:bg-sun-light text-forest font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95 disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Validando Código...</span>
                  </>
                ) : (
                  <>
                    <span>VALIDAR Y SUMAR EXP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Suggested quick codes from reserve trail signs */}
            <div className="mt-5 pt-3 border-t border-white/15">
              <span className="text-[9px] font-bold uppercase tracking-wider text-mint block mb-2">
                Códigos frecuentes en la cartelería de Villa Cielo:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {trailPostChips.map(chip => (
                  <button
                    key={chip.code}
                    onClick={() => handleSelectChip(chip.code)}
                    className="text-left p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition active:scale-95"
                  >
                    <code className="text-sun font-bold text-[10px] block">
                      {chip.code}
                    </code>
                    <span className="text-[9px] text-white/80 truncate block">
                      {chip.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center pt-3 pb-1">
            <button
              onClick={() => setActiveTab('camera')}
              className="text-xs text-mint underline hover:text-white"
            >
              Volver a la cámara de escaneo
            </button>
          </div>
        </div>
      )}

      {/* BottomNav */}
      <BottomNav active="scan" />
    </section>
  );
};
