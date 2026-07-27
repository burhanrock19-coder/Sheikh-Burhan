import React, { useState } from 'react';
import { getYearProgress, getMonthProgress, getWeekNumber } from '../utils/dateUtils';
import { Clock, Copy, Check, Calendar, Zap, Layers, RefreshCw } from 'lucide-react';

interface LiveDateOverviewProps {
  now: Date;
}

export const LiveDateOverview: React.FC<LiveDateOverviewProps> = ({ now }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [showMs, setShowMs] = useState(false);

  const yearProg = getYearProgress(now);
  const monthProg = getMonthProgress(now);
  const weekNum = getWeekNumber(now);

  const unixSec = Math.floor(now.getTime() / 1000);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const formattedWeekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
  const formattedMonthDay = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(now);
  const formattedYear = now.getFullYear();

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(now);

  const msString = (now.getMilliseconds()).toString().padStart(3, '0');

  return (
    <div className="space-y-8">
      {/* Primary Editorial Banner */}
      <div className="relative bg-[#0D0D0D] border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden">
        {/* Editorial Accent Marker */}
        <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Typographic Banner */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.4em] text-amber-500 font-semibold">
                Live Temporal Overview
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/60">
                Week {weekNum} of {now.getFullYear()}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif-editorial font-bold italic tracking-tight text-white leading-tight">
              {formattedWeekday},<br />
              <span className="text-amber-500 not-italic font-normal">{formattedMonthDay}</span> {formattedYear}
            </h1>

            <div className="flex items-baseline gap-3 pt-2">
              <div className="text-4xl sm:text-5xl font-mono font-bold tracking-widest text-white">
                {formattedTime}
              </div>
              {showMs && (
                <span className="text-xl font-mono text-amber-500">
                  .{msString}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                id="toggle-ms-btn"
                onClick={() => setShowMs(!showMs)}
                className="px-4 py-2 border border-white/20 hover:border-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold text-white/80 hover:text-white transition-colors flex items-center gap-2"
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {showMs ? 'Hide Milliseconds' : 'Show Milliseconds'}
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-[#121212] border border-white/10 p-5">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Timezone</div>
              <div className="text-sm font-semibold text-white truncate">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </div>
              <div className="text-[10px] text-amber-500/80 mt-1 font-mono">
                UTC {now.getTimezoneOffset() <= 0 ? '+' : '-'}{Math.abs(Math.round(now.getTimezoneOffset() / 60))}
              </div>
            </div>

            <div className="bg-[#121212] border border-white/10 p-5">
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Day of Year</div>
              <div className="text-lg font-bold text-white font-serif-editorial italic">
                Day {yearProg.dayOfYear} <span className="text-xs font-sans text-white/40 font-normal">/ {yearProg.totalDaysInYear}</span>
              </div>
              <div className="text-[10px] text-amber-500/80 mt-1">
                {yearProg.daysRemaining} days remaining
              </div>
            </div>

            <div className="bg-[#121212] border border-white/10 p-5 col-span-2">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">
                <span>Unix Epoch Timestamp</span>
                <button
                  id="copy-unix-sec-btn"
                  onClick={() => handleCopy(unixSec.toString(), 'unix-sec')}
                  className="hover:text-amber-500 transition-colors flex items-center gap-1"
                >
                  {copied === 'unix-sec' ? <Check className="w-3 h-3 text-amber-500" /> : <Copy className="w-3 h-3" />}
                  {copied === 'unix-sec' ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="text-2xl font-mono font-bold text-amber-500 tracking-wider">
                {unixSec}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Year Progress Card */}
        <div className="bg-[#0D0D0D] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <div>
                <h3 className="font-serif-editorial text-xl italic font-bold text-white">Year Progress ({now.getFullYear()})</h3>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">{yearProg.dayOfYear} of {yearProg.totalDaysInYear} days completed</p>
              </div>
            </div>
            <span className="text-2xl font-mono font-bold text-amber-500">
              {yearProg.percentage}%
            </span>
          </div>

          <div className="w-full bg-zinc-900 h-2 overflow-hidden border border-white/10 p-0.5">
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${yearProg.percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#121212] p-2 border border-white/5">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Passed</span>
              <span className="font-medium text-white">{yearProg.dayOfYear}d</span>
            </div>
            <div className="bg-[#121212] p-2 border border-white/5">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Remaining</span>
              <span className="font-medium text-white">{yearProg.daysRemaining}d</span>
            </div>
            <div className="bg-[#121212] p-2 border border-white/5">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Total</span>
              <span className="font-medium text-white">{yearProg.totalDaysInYear}d</span>
            </div>
          </div>
        </div>

        {/* Month Progress Card */}
        <div className="bg-[#0D0D0D] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <div>
                <h3 className="font-serif-editorial text-xl italic font-bold text-white">Month Progress ({now.toLocaleString('en-US', { month: 'long' })})</h3>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">Day {monthProg.currentDay} of {monthProg.totalDaysInMonth}</p>
              </div>
            </div>
            <span className="text-2xl font-mono font-bold text-amber-500">
              {monthProg.percentage}%
            </span>
          </div>

          <div className="w-full bg-zinc-900 h-2 overflow-hidden border border-white/10 p-0.5">
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${monthProg.percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#121212] p-2 border border-white/5">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Passed</span>
              <span className="font-medium text-white">{monthProg.currentDay}d</span>
            </div>
            <div className="bg-[#121212] p-2 border border-white/5">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Remaining</span>
              <span className="font-medium text-white">{monthProg.daysRemaining}d</span>
            </div>
            <div className="bg-[#121212] p-2 border border-white/5">
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Total</span>
              <span className="font-medium text-white">{monthProg.totalDaysInMonth}d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Date Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D0D0D] border border-white/10 p-5 flex items-center gap-4">
          <Zap className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium">Weekday</div>
            <div className="font-serif-editorial italic text-lg font-bold text-white">{now.toLocaleDateString('en-US', { weekday: 'long' })}</div>
          </div>
        </div>

        <div className="bg-[#0D0D0D] border border-white/10 p-5 flex items-center gap-4">
          <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium">Quarter</div>
            <div className="font-serif-editorial italic text-lg font-bold text-white">Q{Math.floor(now.getMonth() / 3) + 1} ({now.getFullYear()})</div>
          </div>
        </div>

        <div className="bg-[#0D0D0D] border border-white/10 p-5 flex items-center gap-4">
          <Clock className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium">Week Number</div>
            <div className="font-serif-editorial italic text-lg font-bold text-white">Week {weekNum}</div>
          </div>
        </div>

        <div className="bg-[#0D0D0D] border border-white/10 p-5 flex items-center gap-4">
          <RefreshCw className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium">Leap Year</div>
            <div className="font-serif-editorial italic text-lg font-bold text-white">
              {(now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0 ? 'Yes (366d)' : 'No (365d)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
