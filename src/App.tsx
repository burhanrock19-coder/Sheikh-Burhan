import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { LiveDateOverview } from './components/LiveDateOverview';
import { DateCalculator } from './components/DateCalculator';
import { CountdownManager } from './components/CountdownManager';
import { WorldTimezones } from './components/WorldTimezones';
import { FormatConverter } from './components/FormatConverter';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('live');
  const [now, setNow] = useState<Date>(new Date());

  // Live clock tick interval
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans selection:bg-amber-500 selection:text-black antialiased">
      {/* Top Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} now={now} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'live' && <LiveDateOverview now={now} />}
        {activeTab === 'calculator' && <DateCalculator />}
        {activeTab === 'events' && <CountdownManager now={now} />}
        {activeTab === 'timezones' && <WorldTimezones now={now} />}
        {activeTab === 'converter' && <FormatConverter now={now} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0A0A0A] py-8 mt-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-bold uppercase tracking-[0.2em] text-white/70">Date Update Engine</span>
            <span>— Precision Temporal Tracking & Analytics</span>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em]">
            <span>Client-side Clock Synchronization</span>
            <span>•</span>
            <span>UTC & Local Matrix</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
