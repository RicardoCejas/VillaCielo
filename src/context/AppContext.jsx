import React, { createContext, useContext, useState, useEffect } from 'react';
import { SPECIES_LIST, RANKS, INITIAL_UNLOCKED_IDS } from '../data/speciesData';
import { setSoundEnabled, playPop, playSuccess, playCelebration } from '../utils/audio';
import { getTranslation } from '../utils/translations';
import confetti from 'canvas-confetti';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('villa_theme') || 'light');

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('villa_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  const [isRegistered, setIsRegistered] = useState(() => localStorage.getItem('villa_registered') === 'true');

  const [currentScreen, setCurrentScreen] = useState(() => {
    return localStorage.getItem('villa_registered') === 'true' ? 'home' : 'register';
  });
  
  const [history, setHistory] = useState(() => {
    return localStorage.getItem('villa_registered') === 'true' ? ['home'] : ['register'];
  });

  const [selectedSpecies, setSelectedSpecies] = useState(SPECIES_LIST[0]);
  const [profile, setProfileState] = useState(() => localStorage.getItem('villa_profile') || 'Niños');
  const [viewMode, setViewMode] = useState('app');

  const [exp, setExp] = useState(() => {
    const saved = localStorage.getItem('villa_exp');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('villa_points');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [unlockedSpeciesIds, setUnlockedSpeciesIds] = useState(() => {
    const saved = localStorage.getItem('villa_unlocked_ids');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_UNLOCKED_IDS;
  });

  const [gameLevels, setGameLevels] = useState(() => {
    const saved = localStorage.getItem('villa_game_levels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      trivia: 1,
      memory: 1,
      puzzle: 1,
      color: 1,
      stars: {}
    };
  });

  const [unlockedCardModal, setUnlockedCardModal] = useState(null);
  const [levelUpModal, setLevelUpModal] = useState(null);
  const [ranksModalOpen, setRanksModalOpen] = useState(false);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('villa_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
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

  const [toasts, setToasts] = useState([]);

  const getCurrentRank = (currentExp = exp) => {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (currentExp >= RANKS[i].minExp) {
        return RANKS[i];
      }
    }
    return RANKS[0];
  };

  const currentRank = getCurrentRank(exp);

  useEffect(() => {
    localStorage.setItem('villa_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('villa_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('villa_profile', profile);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('villa_exp', exp.toString());
  }, [exp]);

  useEffect(() => {
    localStorage.setItem('villa_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('villa_unlocked_ids', JSON.stringify(unlockedSpeciesIds));
  }, [unlockedSpeciesIds]);

  useEffect(() => {
    localStorage.setItem('villa_game_levels', JSON.stringify(gameLevels));
  }, [gameLevels]);

  useEffect(() => {
    setSoundEnabled(settings.sound);
  }, [settings.sound]);

  const t = (key) => getTranslation(settings.language, key);

  const toggleTheme = () => {
    playPop();
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    addToast(
      next === 'dark' ? 'Modo Noche Activado' : 'Modo Día Activado',
      next === 'dark' ? 'Atenuación lumínica para senderos nocturnos' : 'Alto contraste para luz solar',
      'info'
    );
  };

  const addToast = (title, message = '', type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(item => item.id !== id));
    }, 3800);
  };

  const triggerCelebration = () => {
    playCelebration();
    try {
      confetti({
        particleCount: 28,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#285444', '#78a690', '#d8aa40', '#d06042']
      });
    } catch {}
  };

  const registerUser = (userData) => {
    playSuccess();
    const ageNum = parseInt(userData.age, 10) || 12;
    const determinedProfile = ageNum <= 14 ? 'Niños' : 'Adultos';

    const newUser = {
      name: userData.name || 'Explorador',
      age: ageNum,
      email: userData.email || 'explorador@villacielo.org',
      method: userData.method || 'form',
      avatar: userData.avatar || null,
      registeredAt: new Date().toISOString()
    };
    
    setUser(newUser);
    setIsRegistered(true);
    setProfileState(determinedProfile);
    
    localStorage.setItem('villa_user', JSON.stringify(newUser));
    localStorage.setItem('villa_registered', 'true');
    localStorage.setItem('villa_profile', determinedProfile);

    addToast(
      `Bienvenido, ${newUser.name}`,
      `Perfil asignado: ${determinedProfile} (${newUser.age} años)`,
      'success'
    );

    setCurrentScreen('home');
    setHistory(['home']);
  };

  const logoutUser = () => {
    playPop();
    setIsRegistered(false);
    localStorage.removeItem('villa_registered');
    addToast('Sesión cerrada', 'Podés registrar un nuevo usuario', 'info');
    setCurrentScreen('register');
    setHistory(['register']);
  };

  const resetAllProgress = () => {
    playPop();
    setExp(0);
    setPoints(0);
    setUnlockedSpeciesIds(INITIAL_UNLOCKED_IDS);
    setGameLevels({
      trivia: 1,
      memory: 1,
      puzzle: 1,
      color: 1,
      stars: {}
    });

    localStorage.setItem('villa_exp', '0');
    localStorage.setItem('villa_points', '0');
    localStorage.setItem('villa_unlocked_ids', JSON.stringify(INITIAL_UNLOCKED_IDS));
    localStorage.setItem('villa_game_levels', JSON.stringify({
      trivia: 1,
      memory: 1,
      puzzle: 1,
      color: 1,
      stars: {}
    }));

    addToast('Progreso reiniciado', 'Rango 1 con 0 EXP', 'info');
  };

  const completeGameLevel = (gameKey, levelCompleted, earnedExp = 100) => {
    playSuccess();
    triggerCelebration();
    addExp(earnedExp, `Nivel ${levelCompleted} de ${gameKey} completado`);

    setGameLevels(prev => {
      const currentMax = prev[gameKey] || 1;
      const nextMax = Math.max(currentMax, levelCompleted + 1);
      return {
        ...prev,
        [gameKey]: nextMax,
        stars: {
          ...(prev.stars || {}),
          [`${gameKey}_${levelCompleted}`]: 3
        }
      };
    });
  };

  const addExp = (amount, reason = '') => {
    const oldRank = getCurrentRank(exp);
    const newExp = exp + amount;
    const newRank = getCurrentRank(newExp);

    setExp(newExp);
    setPoints(p => p + amount);

    if (amount > 0) {
      playSuccess();
      addToast(`+${amount} EXP`, reason || 'Progreso acumulado', 'success');
    }

    if (newRank.level > oldRank.level) {
      setTimeout(() => {
        triggerCelebration();
        setLevelUpModal({
          oldLevel: oldRank.level,
          newLevel: newRank.level,
          rank: newRank
        });

        // Desbloquear como recompensa de rango solo 1 carta insignia del nuevo nivel alcanzado
        const candidateToUnlock = SPECIES_LIST.find(
          item => item.unlockLevel === newRank.level && !unlockedSpeciesIds.includes(item.id)
        );

        if (candidateToUnlock) {
          setUnlockedSpeciesIds(prev => [...new Set([...prev, candidateToUnlock.id])]);
          addToast(
            `Nueva carta desbloqueada: ${candidateToUnlock.name}`,
            `Alcanzaste el rango ${newRank.title}`,
            'success'
          );
        }
      }, 700);
    }
  };

  const addPoints = (amount, reason = '') => {
    addExp(amount, reason);
  };

  const isSpeciesUnlocked = (speciesId) => unlockedSpeciesIds.includes(speciesId);

  const unlockSpecies = (speciesId, method = 'qr') => {
    const species = SPECIES_LIST.find(item => item.id === speciesId);
    if (!species) return;

    if (!unlockedSpeciesIds.includes(speciesId)) {
      setUnlockedSpeciesIds(prev => [...prev, speciesId]);
      addExp(180, `Carta desbloqueada: ${species.name}`);
      triggerCelebration();
      setUnlockedCardModal(species);
    } else {
      addToast('Carta existente', `${species.name} ya está en tu álbum`, 'info');
    }
  };

  const scanQRCode = (codeString) => {
    const query = (codeString || '').trim().toUpperCase();
    
    const matched = SPECIES_LIST.find(item => 
      (item.qrCode && item.qrCode.toUpperCase() === query) ||
      item.id.toUpperCase() === query ||
      item.id.replace(/-/g, '').toUpperCase() === query.replace(/-/g, '') ||
      item.name.toUpperCase().includes(query)
    );

    if (matched) {
      unlockSpecies(matched.id, 'qr');
      setSelectedSpecies(matched);
      navigate('discovery', matched);
      return { success: true, species: matched };
    }

    const locked = SPECIES_LIST.filter(item => !unlockedSpeciesIds.includes(item.id));
    const target = locked.length > 0 ? locked[0] : SPECIES_LIST[0];
    unlockSpecies(target.id, 'qr');
    setSelectedSpecies(target);
    navigate('discovery', target);
    return { success: true, species: target };
  };

  const navigate = (screen, payload = null) => {
    playPop();
    if (payload && (screen === 'species-detail' || screen === 'discovery')) {
      setSelectedSpecies(payload);
    }
    setHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    playPop();
    if (history.length > 1) {
      const next = [...history];
      next.pop();
      const prevScreen = next[next.length - 1];
      setHistory(next);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen(isRegistered ? 'home' : 'register');
    }
  };

  const setProfile = (newProfile) => {
    playPop();
    setProfileState(newProfile);
    addToast('Perfil actualizado', `Modo ${newProfile}`, 'success');
    navigate('home');
  };

  const updateSetting = (key, value) => {
    playPop();
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSound = () => {
    const next = !settings.sound;
    setSoundEnabled(next);
    if (next) playPop();
    setSettings(prev => ({ ...prev, sound: next }));
    addToast(next ? 'Sonido activado' : 'Sonido silenciado', '', 'info');
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
        resetAllProgress,
        gameLevels,
        completeGameLevel,
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
