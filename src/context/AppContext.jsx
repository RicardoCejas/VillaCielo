import React, { createContext, useContext, useState, useEffect } from 'react';
import { SPECIES_LIST, RANKS, INITIAL_UNLOCKED_IDS } from '../data/speciesData';
import { setSoundEnabled, playPop, playSuccess, playCelebration } from '../utils/audio';
import { getTranslation } from '../utils/translations';
import confetti from 'canvas-confetti';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Theme state: 'light' (Day trail) or 'dark' (Night trail)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('villa_theme') || 'light';
  });

  // User registration / onboarding state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('villa_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem('villa_registered') === 'true';
  });

  // Navigation state: starts on 'register' if not registered, otherwise 'home'
  const [currentScreen, setCurrentScreen] = useState(() => {
    const registered = localStorage.getItem('villa_registered') === 'true';
    return registered ? 'home' : 'register';
  });
  
  const [history, setHistory] = useState(() => {
    const registered = localStorage.getItem('villa_registered') === 'true';
    return registered ? ['home'] : ['register'];
  });

  const [selectedSpecies, setSelectedSpecies] = useState(SPECIES_LIST[0]);
  
  // Profile state ('Niños' or 'Adultos')
  const [profile, setProfileState] = useState(() => {
    const saved = localStorage.getItem('villa_profile');
    return saved || 'Niños';
  });
  
  // App mode: 'app' (Phone shell) or 'overview' (Figma wireframes board)
  const [viewMode, setViewMode] = useState('app');

  // Gamification & Progression State
  const [exp, setExp] = useState(() => {
    const saved = localStorage.getItem('villa_exp');
    return saved ? parseInt(saved, 10) : 350; // starts with some initial progress
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

  // 6 Ranks inspection modal
  const [ranksModalOpen, setRanksModalOpen] = useState(false);

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('villa_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      language: 'ES',
      sound: true,
      music: true,
      vibration: false,
      hints: true,
      difficulty: 'Normal',
      largeText: false,
    };
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Calculate current rank & level from EXP (max 6 ranks)
  const getCurrentRank = (currentExp = exp) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (currentExp >= RANKS[i].minExp) {
        return RANKS[i];
      }
    }
    return RANKS[0];
  };

  const currentRank = getCurrentRank(exp);

  // Persist theme
  useEffect(() => {
    localStorage.setItem('villa_theme', theme);
  }, [theme]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('villa_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist profile
  useEffect(() => {
    localStorage.setItem('villa_profile', profile);
  }, [profile]);

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

  // Translation helper
  const t = (key) => {
    return getTranslation(settings.language, key);
  };

  // Toggle Day / Night mode
  const toggleTheme = () => {
    playPop();
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    addToast(
      nextTheme === 'dark' ? 'Modo Noche Activado 🌙' : 'Modo Día Activado ☀️',
      nextTheme === 'dark' ? 'Atenuación lumínica para senderos nocturnos' : 'Alto contraste para luz solar',
      'info'
    );
  };

  const addToast = (title, message = '', type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Subdued, elegant celebration (less dopamine/confetti spam, respectful to nature)
  const triggerCelebration = () => {
    playCelebration();
    try {
      confetti({
        particleCount: 30, // subtle and restrained
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#285444', '#78a690', '#d8aa40', '#d06042']
      });
    } catch (e) {}
  };

  // Register new user (from onboarding)
  const registerUser = (userData) => {
    playSuccess();
    const newUser = {
      name: userData.name || 'Explorador',
      age: parseInt(userData.age, 10) || 12,
      email: userData.email || 'explorador@villacielo.org',
      method: userData.method || 'form',
      registeredAt: new Date().toISOString()
    };

    // Auto classify profile by age
    const determinedProfile = newUser.age < 13 ? 'Niños' : 'Adultos';
    
    setUser(newUser);
    setIsRegistered(true);
    setProfileState(determinedProfile);
    
    localStorage.setItem('villa_user', JSON.stringify(newUser));
    localStorage.setItem('villa_registered', 'true');
    localStorage.setItem('villa_profile', determinedProfile);

    addToast(
      `¡Bienvenido, ${newUser.name}!`,
      `Perfil configurado para ${determinedProfile} (${newUser.age} años)`,
      'success'
    );

    setCurrentScreen('home');
    setHistory(['home']);
  };

  // Logout / Switch user
  const logoutUser = () => {
    playPop();
    setIsRegistered(false);
    localStorage.removeItem('villa_registered');
    addToast('Sesión reiniciada', 'Podés registrar un nuevo explorador', 'info');
    setCurrentScreen('register');
    setHistory(['register']);
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

  // Unlock species card explicitly
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

  // Scan or Validate QR Code string or manual trail code
  const scanQRCode = (codeString) => {
    const normalized = (codeString || '').trim().toUpperCase();
    
    // Find matching species by qrCode or id
    const matched = SPECIES_LIST.find(s => 
      (s.qrCode && s.qrCode.toUpperCase() === normalized) ||
      s.id.toUpperCase() === normalized ||
      s.id.replace(/-/g, '').toUpperCase() === normalized.replace(/-/g, '') ||
      s.name.toUpperCase().includes(normalized)
    );

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
      setCurrentScreen(isRegistered ? 'home' : 'register');
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
        theme,
        toggleTheme,
        user,
        isRegistered,
        registerUser,
        logoutUser,
        t,
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
        ranks: RANKS,
        ranksModalOpen,
        setRanksModalOpen,
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
