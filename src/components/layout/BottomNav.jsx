import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Gamepad2, QrCode, BookOpen, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav = ({ active }) => {
  const { navigate } = useApp();

  const navItems = [
    { screen: 'home', label: 'Inicio', icon: Home },
    { screen: 'ecosystem', label: 'Red Trófica', icon: Network },
    { screen: 'scan', label: 'Escanear', icon: QrCode },
    { screen: 'games', label: 'Jugar', icon: Gamepad2 },
    { screen: 'wiki', label: 'Wiki', icon: BookOpen }
  ];

  return (
    <nav
      className="relative z-20 mt-auto grid grid-cols-5 min-h-[64px] px-1 py-1.5 bg-[#fffdf8]/95 backdrop-blur-md border-t border-line"
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
              isActive ? 'text-forest font-bold' : 'text-[#87938e] hover:text-forest/70'
            }`}
          >
            <div
              className={`relative grid place-items-center w-10 h-7 rounded-xl transition-all ${
                isActive
                  ? 'bg-forest text-white shadow-md shadow-forest/20'
                  : 'bg-transparent text-inherit'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-forest rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
