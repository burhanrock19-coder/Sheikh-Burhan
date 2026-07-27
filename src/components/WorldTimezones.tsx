import React from 'react';
import { TimezoneInfo } from '../types';
import { Globe, Sun, Moon } from 'lucide-react';

interface WorldTimezonesProps {
  now: Date;
}

const CITIES: TimezoneInfo[] = [
  { id: 'utc', city: 'UTC / GMT', country: 'Coordinated Universal Time', timeZone: 'UTC', flag: '🌐' },
  { id: 'nyc', city: 'New York', country: 'United States (EDT/EST)', timeZone: 'America/New_York', flag: '🇺🇸' },
  { id: 'lon', city: 'London', country: 'United Kingdom (BST/GMT)', timeZone: 'Europe/London', flag: '🇬🇧' },
  { id: 'par', city: 'Paris', country: 'France (CEST/CET)', timeZone: 'Europe/Paris', flag: '🇫🇷' },
  { id: 'tok', city: 'Tokyo', country: 'Japan (JST)', timeZone: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'syd', city: 'Sydney', country: 'Australia (AEST/AEDT)', timeZone: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'sfo', city: 'San Francisco', country: 'United States (PDT/PST)', timeZone: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'dub', city: 'Dubai', country: 'United Arab Emirates (GST)', timeZone: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'sin', city: 'Singapore', country: 'Singapore (SGT)', timeZone: 'Asia/Singapore', flag: '🇸🇬' },
];

export const WorldTimezones: React.FC<WorldTimezonesProps> = ({ now }) => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-3xl font-serif-editorial font-bold italic text-white flex items-center gap-3">
          <Globe className="w-6 h-6 text-amber-500" />
          Global City Timezones & Temporal Matrix
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 mt-1">
          Compare real-time local dates, timestamps, and daylight indicators across global centers
        </p>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CITIES.map((city) => {
          let cityDateStr = '';
          let cityTimeStr = '';
          let hour24 = 12;

          try {
            cityDateStr = new Intl.DateTimeFormat('en-US', {
              timeZone: city.timeZone,
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }).format(now);

            cityTimeStr = new Intl.DateTimeFormat('en-US', {
              timeZone: city.timeZone,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            }).format(now);

            const hStr = new Intl.DateTimeFormat('en-US', {
              timeZone: city.timeZone,
              hour: 'numeric',
              hour12: false,
            }).format(now);
            hour24 = parseInt(hStr, 10);
          } catch (e) {
            cityDateStr = 'Unknown';
            cityTimeStr = '--:--';
          }

          const isDaytime = hour24 >= 6 && hour24 < 18;

          return (
            <div
              key={city.id}
              className="bg-[#0D0D0D] border border-white/10 hover:border-amber-500/50 p-6 shadow-2xl transition-all duration-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{city.flag}</span>
                  <div>
                    <h3 className="font-serif-editorial italic font-bold text-white text-xl">{city.city}</h3>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 truncate max-w-[150px]">{city.country}</p>
                  </div>
                </div>

                <div className={`p-2 border ${
                  isDaytime ? 'border-amber-500/40 text-amber-500 bg-amber-500/10' : 'border-white/20 text-white/50 bg-black'
                }`}>
                  {isDaytime ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
              </div>

              <div className="bg-[#121212] p-4 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-mono font-bold text-white tracking-widest">
                    {cityTimeStr}
                  </div>
                  <div className="text-[10px] text-amber-500 font-semibold uppercase tracking-[0.15em] mt-1">
                    {cityDateStr}
                  </div>
                </div>

                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-1 border border-white/10 text-white/60">
                  {city.timeZone.split('/')[1] || city.timeZone}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
