import React from 'react';
import { ActiveTab } from '../types';
import { Calendar, Clock, Calculator, Globe, Code } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  now: Date;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, now }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'live', label: 'Live Overview', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'calculator', label: 'Date Calculator', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'events', label: 'Countdowns', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'timezones', label: 'World Timezones', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'converter', label: 'Format & Epoch', icon: <Code className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tighter font-serif-editorial italic text-white">
                UPDATE<span className="text-amber-500">.</span>
              </span>
              <span className="hidden lg:inline-block text-[9px] uppercase tracking-[0.3em] font-semibold text-amber-500">
                Editorial Engine
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-btn-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium py-2 transition-all border-b-2 ${
                      isActive
                        ? 'border-amber-500 text-amber-500'
                        : 'border-transparent text-white/60 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Editorial Tag / Live Clock */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <div className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-mono">
                System Time UTC{now.getTimezoneOffset() <= 0 ? '+' : '-'}{Math.abs(Math.round(now.getTimezoneOffset() / 60))}
              </div>
              <div className="text-xs font-mono font-bold text-amber-500 tracking-widest mt-0.5">
                {now.toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>

            <div className="flex items-center gap-2 border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium text-white/80">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex overflow-x-auto gap-2 py-3 border-t border-white/10 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-900 border border-white/10 text-white/70 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
