import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { IMAGES, SPECIES_LIST } from '../../data/speciesData';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { Camera, Sparkles, QrCode, RefreshCw, ChevronDown, Check } from 'lucide-react';
import { playCameraSnap, playPop } from '../../utils/audio';

export const ScannerScreen = () => {
  const { navigate, scanQRCode, goBack, unlockedSpeciesIds } = useApp();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Apuntá al código QR de una posta en Villa Cielo');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedQRTarget, setSelectedQRTarget] = useState('QR_CORZUELA');

  // Species that have QR codes for direct simulation
  const qrOptions = SPECIES_LIST.filter(s => s.qrCode);

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
      setStatusMessage('Cámara pausada. Podés usar la simulación de postas.');
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
      setStatusMessage('Usá el selector de postas QR para simular.');
    }
  };

  const handleExecuteScan = (codeToScan = selectedQRTarget) => {
    playCameraSnap();
    setIsScanning(true);
    setStatusMessage('¡Decodificando código QR de la reserva...');

    setTimeout(() => {
      setIsScanning(false);
      scanQRCode(codeToScan);
    }, 950);
  };

  return (
    <section className="relative w-full h-full bg-[#081812] flex flex-col justify-between overflow-hidden">
      {/* Media Canvas Area */}
      <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col justify-between">
        {/* Camera Image Fallback */}
        <img
          src={IMAGES.foxField}
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#04140e]/90 via-[#04140e]/25 to-[#04140e]/95 pointer-events-none" />

        {/* TopBar with styled '← Volver' */}
        <TopBar
          title="Escáner QR"
          onBack={goBack}
          backLabel="Volver"
          onSettings={() => navigate('settings')}
          light
        />

        {/* Instructions */}
        <div className="relative z-10 text-center px-6 pt-1 text-white">
          <span className="text-mint text-[9px] font-bold tracking-[2px] uppercase block mb-0.5">
            Posta Interactiva · Villa Cielo
          </span>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Descubrí Especies
          </h2>
          <p className="text-[11px] text-white/80 max-w-xs mx-auto mt-0.5 leading-snug">
            {statusMessage}
          </p>
        </div>

        {/* Viewfinder Target */}
        <div className="relative my-auto w-[210px] h-[210px] mx-auto pointer-events-none">
          {/* 4 Framing Corners */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-2xl shadow-lg" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-2xl shadow-lg" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-2xl shadow-lg" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-2xl shadow-lg" />

          {/* Animated Laser Scan Line */}
          <div className="absolute inset-x-3 h-[2.5px] bg-[#79e5b2] shadow-[0_0_16px_#79e5b2] animate-scan" />
        </div>

        {/* Controls & QR Station Selector */}
        <div className="relative z-20 px-4 pb-4 space-y-2">
          {/* Posta QR Selector (Simulation helper) */}
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

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleToggleCamera}
              className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#071e16]/80 hover:bg-[#071e16] border border-white/30 text-white text-[11px] font-bold transition active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>{cameraActive ? 'Pausar Cámara' : 'Activar Cámara'}</span>
            </button>

            <button
              onClick={() => handleExecuteScan()}
              disabled={isScanning}
              className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-sun text-forest text-[11px] font-bold transition active:scale-95 shadow-md disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Leyendo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simular Hallazgo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* BottomNav */}
      <BottomNav active="scan" />
    </section>
  );
};
