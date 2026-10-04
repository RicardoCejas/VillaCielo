import React from 'react';
import { useApp } from './context/AppContext';
import { DeviceShell } from './components/layout/DeviceShell';
import { ToastContainer } from './components/ui/ToastContainer';
import { CardUnlockedModal } from './components/ui/CardUnlockedModal';
import { LevelUpModal } from './components/ui/LevelUpModal';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { FullMapScreen } from './components/screens/FullMapScreen';
import { ScannerScreen } from './components/screens/ScannerScreen';
import { WikiScreen } from './components/screens/WikiScreen';
import { TrophicWebScreen } from './components/screens/TrophicWebScreen';
import { SpeciesDetailScreen } from './components/screens/SpeciesDetailScreen';
import { GamesMenuScreen } from './components/screens/GamesMenuScreen';
import { SafariGame } from './components/screens/games/SafariGame';
import { RecyclingGame } from './components/screens/games/RecyclingGame';
import { StargazingGame } from './components/screens/games/StargazingGame';
import { TriviaGame } from './components/screens/games/TriviaGame';
import { PuzzleScreen } from './components/screens/PuzzleScreen';
import { ColoringScreen } from './components/screens/ColoringScreen';
import { MemoryScreen } from './components/screens/MemoryScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { WireframeOverview } from './components/screens/WireframeOverview';
import { AnimatePresence, motion } from 'framer-motion';

export const App = () => {
  const { currentScreen, viewMode } = useApp();

  if (viewMode === 'overview') {
    return (
      <>
        <ToastContainer />
        <CardUnlockedModal />
        <LevelUpModal />
        <WireframeOverview />
      </>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return <ProfileScreen />;
      case 'home':
        return <HomeScreen />;
      case 'map':
        return <FullMapScreen />;
      case 'scan':
        return <ScannerScreen />;
      case 'wiki':
        return <WikiScreen />;
      case 'ecosystem':
        return <TrophicWebScreen />;
      case 'species-detail':
        return <SpeciesDetailScreen isDiscoveryMode={false} />;
      case 'discovery':
        return <SpeciesDetailScreen isDiscoveryMode={true} />;
      case 'games':
        return <GamesMenuScreen />;
      case 'safari':
        return <SafariGame />;
      case 'recycling':
        return <RecyclingGame />;
      case 'stargazing':
        return <StargazingGame />;
      case 'trivia':
        return <TriviaGame />;
      case 'puzzle':
        return <PuzzleScreen />;
      case 'color':
        return <ColoringScreen />;
      case 'memory':
        return <MemoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <>
      <ToastContainer />
      <CardUnlockedModal />
      <LevelUpModal />
      <DeviceShell>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </DeviceShell>
    </>
  );
};

export default App;
