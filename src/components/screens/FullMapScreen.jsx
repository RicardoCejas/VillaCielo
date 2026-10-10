import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopBar } from '../layout/TopBar';
import { BottomNav } from '../layout/BottomNav';
import { InteractiveMap } from './InteractiveMap';
import { MAP_LANDMARKS } from '../../data/mapData';
import { ChevronRight } from 'lucide-react';
import { playPop } from '../../utils/audio';

export const FullMapScreen = () => {
  const { goBack, navigate, theme, t } = useApp();
  const [activeTab, setActiveTab] = useState('map'); // 'map' or 'landmarks'

  return (
    <section className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${
      theme === 'dark' ? 'bg-[#0a1813] text-[#e8f2ec]' : 'bg-cream text-ink'
    }`}>
      {/* TopBar with clear styled back button */}
      <TopBar
        title={t('mapTitle')}
        onBack={goBack}
        onSettings={() => navigate('settings')}
      />

      {/* Tabs */}
      <div className={`flex items-center gap-2 px-4 py-1.5 border-b text-xs font-semibold ${
        theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-paper border-line'
      }`}>
        <button
          onClick={() => {
            playPop();
            setActiveTab('map');
          }}
          className={`flex-1 py-1.5 rounded-xl transition ${
            activeTab === 'map'
              ? 'bg-forest text-white font-bold shadow-xs'
              : 'text-muted hover:text-ink dark:hover:text-white'
          }`}
        >
          {t('mapTabTrails')}
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('landmarks');
          }}
          className={`flex-1 py-1.5 rounded-xl transition ${
            activeTab === 'landmarks'
              ? 'bg-forest text-white font-bold shadow-xs'
              : 'text-muted hover:text-ink dark:hover:text-white'
          }`}
        >
          {t('mapTabLandmarks')} ({MAP_LANDMARKS.length})
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === 'map' ? (
          <InteractiveMap isCompact={false} />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {MAP_LANDMARKS.map(item => (
              <div
                key={item.id}
                className={`rounded-2xl p-3.5 border shadow-2xs space-y-2 ${
                  theme === 'dark' ? 'bg-[#11261e] border-[#1e4536]' : 'bg-paper border-line'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover border border-line dark:border-[#224636] shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-bold text-forest-light uppercase tracking-wider block">
                      {item.type}
                    </span>
                    <h3 className="font-serif text-sm font-bold truncate mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-muted line-clamp-2 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-line dark:border-[#1e4536] flex items-center justify-between">
                  <div className="text-[10px] text-muted">
                    <strong className="text-forest-light">{item.distance}</strong> · {item.time}
                  </div>
                  <button
                    onClick={() => {
                      playPop();
                      navigate(item.targetScreen);
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-forest hover:bg-forest-light text-white text-[10px] font-bold shadow-xs active:scale-95 transition"
                  >
                    <span>{item.actionText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BottomNav */}
      <BottomNav active="home" />
    </section>
  );
};
