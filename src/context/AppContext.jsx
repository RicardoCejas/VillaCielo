import React, { createContext, useContext, useState, useEffect } from 'react';
import { SPECIES_LIST, RANKS, INITIAL_UNLOCKED_IDS } from '../data/speciesData';
import { setSoundEnabled, playPop, playSuccess, playCelebration } from '../utils/audio';
import confetti from 'canvas-confetti';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('home');
  const [history, setHistory] = useState(['home']);
  const [selectedSpecies, setSelectedSpecies] = useState(SPECIES_LIST[0]);
  const [profile, setProfileState] = useState('Niños');
  
  // App mode: 'app' (Phone shell) or 'overview' (Figma 12-screen wireframe board)
  const [viewMode, setViewMode] = useState('app');

  // Gamification & Progression State
  const [exp, setExp] = useState(() => {
    const saved = localStorage.getItem('villa_exp');
    return saved ? parseInt(saved, 10) : 350; // starts at level 2 so user already has some progression
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('villa_points');
    return saved ? parseInt(saved, 10) : 1240;
  });

  const [unlockedSpeciesIds, setUnlockedSpeciesIds] = useState(() => {
    const saved = localStorage.getItem('villa_unlocked_ids');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default unlocked based on starting level 2:
    return [
      ...INITIAL_UNLOCKED_IDS,
      'corzuela-parda',
      'peperina',
      'picaflor-comun'
    ];
  });

  // Modal to celebrate newly unlocked card
  const [unlockedCardModal, setUnlockedCardModal] = useState(null);

  // Level Up modal celebration
  const [levelUpModal, setLevelUpModal] = useState(null);

  // Settings
  const [settings, setSettings] = useState({
    language: 'ES',
    sound: true,
    music: true,
    vibration: false,
    hints: true,
    difficulty: 'Normal',
    largeText: false,
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Calculate current rank & level from EXP
  const getCurrentRank = (currentExp = exp) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (currentExp >= RANKS[i].minExp) {
        return RANKS[i];
      }
    }
    return RANKS[0];
  };

  const currentRank = getCurrentRank(exp);

  // Save progression to localStorage
  useEffect(() => {
    localStorage.setItem('villa_exp', exp.toString());
  }, [exp]);

  useEffect(() => {
    localStorage.setItem('villa_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('villa_unlocked_ids', JSON.stringify(unlockedSpeciesIds));
  }, [unlockedSpeciesIds]);

  // Sync audio enabled with settings
  useEffect(() => {
    setSoundEnabled(settings.sound);
  }, [settings.sound]);

  const addToast = (title, message = '', type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const triggerCelebration = () => {
    playCelebration();
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#173b32', '#68a691', '#f4c95d', '#e76f51', '#d9eee4']
      });
    } catch (e) {}
  };

  // Add points and EXP
  const addExp = (amount, reason = '') => {
    const oldRank = getCurrentRank(exp);
    const newExp = exp + amount;
    const newRank = getCurrentRank(newExp);

    setExp(newExp);
    setPoints(p => p + amount);

    if (amount > 0) {
      playSuccess();
      addToast(`+${amount} EXP / Pts`, reason || 'Progreso de Guardián', 'success');
    }

    // Check for Level Up!
    if (newRank.level > oldRank.level) {
      setTimeout(() => {
        triggerCelebration();
        setLevelUpModal({
          oldLevel: oldRank.level,
          newLevel: newRank.level,
          rank: newRank
        });

        // Automatically unlock any species whose unlockLevel <= newRank.level
        const newlyUnlocked = SPECIES_LIST.filter(
          s => s.unlockLevel <= newRank.level && !unlockedSpeciesIds.includes(s.id)
        );

        if (newlyUnlocked.length > 0) {
          const idsToAdd = newlyUnlocked.map(s => s.id);
          setUnlockedSpeciesIds(prev => [...new Set([...prev, ...idsToAdd])]);
          addToast(
            `¡${newlyUnlocked.length} Nuevas Cartas Desbloqueadas!`,
            `Tu rango ${newRank.title} reveló nuevas especies en tu álbum`,
            'success'
          );
        }
      }, 700);
    }
  };

  const addPoints = (amount, reason = '') => {
    addExp(amount, reason);
  };

  // Check if a species card is unlocked
  const isSpeciesUnlocked = (speciesId) => {
    return unlockedSpeciesIds.includes(speciesId);
  };

  // Unlock species card explicitly (via QR scan, safari photo, trivia win, etc.)
  const unlockSpecies = (speciesId, method = 'qr') => {
    const species = SPECIES_LIST.find(s => s.id === speciesId);
    if (!species) return;

    if (!unlockedSpeciesIds.includes(speciesId)) {
      setUnlockedSpeciesIds(prev => [...prev, speciesId]);
      addExp(180, `¡Desbloqueaste la carta de ${species.name}!`);
      triggerCelebration();
      setUnlockedCardModal(species);
    } else {
      addToast('Carta ya coleccionada', `${species.name} ya está en tu álbum`, 'info');
    }
  };

  // Scan QR Code in the reserve
  const scanQRCode = (qrCodeString) => {
    // Find matching species
    const matched = SPECIES_LIST.find(s => s.qrCode === qrCodeString);
    if (matched) {
      unlockSpecies(matched.id, 'qr');
      setSelectedSpecies(matched);
      navigate('discovery', matched);
      return { success: true, species: matched };
    }

    // Default discovery if random scan
    const lockedSpecies = SPECIES_LIST.filter(s => !unlockedSpeciesIds.includes(s.id));
    const target = lockedSpecies.length > 0 ? lockedSpecies[0] : SPECIES_LIST[0];
    unlockSpecies(target.id, 'qr');
    setSelectedSpecies(target);
    navigate('discovery', target);
    return { success: true, species: target };
  };

  const navigate = (screen, payload = null) => {
    playPop();
    if (payload) {
      if (screen === 'species-detail' || screen === 'discovery') {
        setSelectedSpecies(payload);
      }
    }
    setHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    playPop();
    if (history.length > 1) {
      const nextHistory = [...history];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setHistory(nextHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const setProfile = (newProfile) => {
    playPop();
    setProfileState(newProfile);
    addToast('Perfil actualizado', `Explorando en modo ${newProfile}`, 'success');
    navigate('home');
  };

  const updateSetting = (key, value) => {
    playPop();
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSound = () => {
    const nextVal = !settings.sound;
    setSoundEnabled(nextVal);
    if (nextVal) playPop();
    setSettings(prev => ({ ...prev, sound: nextVal }));
    addToast(nextVal ? 'Sonido activado' : 'Sonido silenciado', '', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        history,
        selectedSpecies,
        setSelectedSpecies,
        profile,
        setProfile,
        points,
        exp,
        addExp,
        addPoints,
        currentRank,
        unlockedSpeciesIds,
        isSpeciesUnlocked,
        unlockSpecies,
        scanQRCode,
        unlockedCardModal,
        setUnlockedCardModal,
        levelUpModal,
        setLevelUpModal,
        settings,
        setSettings,
        updateSetting,
        toggleSound,
        navigate,
        goBack,
        toasts,
        addToast,
        viewMode,
        setViewMode,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
