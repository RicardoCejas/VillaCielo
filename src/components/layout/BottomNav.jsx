import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Gamepad2, QrCode, BookOpen, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav = ({ active }) => {
  const { navigate, theme, t } = useApp();

  const navItems = [
    { screen: 'home', label: t('navHome'), icon: Home },
    { screen: 'ecosystem', label: t('navTrophic'), icon: Network },
    { screen: 'scan', label: t('navScan'), icon: QrCode },
    { screen: 'games', label: t('navGames'), icon: Gamepad2 },
    { screen: 'wiki', label: t('navWiki'), icon: BookOpen }
  ];

  return (
    <nav
      className={`relative z-20 mt-auto grid grid-cols-5 min-h-[62px] px-1 py-1.5 backdrop-blur-md border-t transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-[#0a1813]/95 border-[#1c3d2e] text-[#a5c2b5]'
          : 'bg-[#fffdf8]/95 border-line text-[#6d7e76]'
      }`}
      aria-label="Navegación principal"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = active === item.screen;

        return (
          <button
            key={item.screen}
            onClick={() => navigate(item.screen)}
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] font-semibold transition-colors ${
              isActive
                ? theme === 'dark'
                  ? 'text-white font-bold'
                  : 'text-forest font-bold'
                : 'hover:opacity-80'
            }`}
          >
            <div
              className={`relative grid place-items-center w-10 h-7 rounded-xl transition-all ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-[#1b4334] text-white shadow-md'
                    : 'bg-forest text-white shadow-md shadow-forest/20'
                  : 'bg-transparent text-inherit'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={`absolute inset-0 rounded-xl -z-10 ${
                    theme === 'dark' ? 'bg-[#1b4334]' : 'bg-forest'
                  }`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </div>
            <span className="truncate max-w-[54px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
