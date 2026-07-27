import React, { useState } from 'react';
import { DateMathInput } from '../types';
import { calculateDateShift, calculateDateDifference, formatDate } from '../utils/dateUtils';
import { Calculator, Calendar, Plus, Minus, RefreshCw } from 'lucide-react';

export const DateCalculator: React.FC = () => {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Section 1: Date Shift State
  const [shiftInput, setShiftInput] = useState<DateMathInput>({
    startDate: todayStr,
    years: 0,
    months: 0,
    weeks: 0,
    days: 30,
    hours: 0,
    minutes: 0,
    operation: 'add',
  });

  // Section 2: Date Difference State
  const [diffStart, setDiffStart] = useState<string>(todayStr);
  const [diffEnd, setDiffEnd] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });

  const shiftResult = calculateDateShift(shiftInput);
  const diffResult = calculateDateDifference(new Date(diffStart), new Date(diffEnd));

  const setPresetShift = (days: number, op: 'add' | 'subtract' = 'add') => {
    setShiftInput((prev) => ({
      ...prev,
      startDate: todayStr,
      years: 0,
      months: 0,
      weeks: 0,
      days,
      operation: op,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-serif-editorial font-bold italic text-white flex items-center gap-3">
          <Calculator className="w-6 h-6 text-amber-500" />
          Interactive Date Mathematics
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 mt-1">
          Perform precise temporal shifts, duration calculations, and business day metrics
        </p>
      </div>

      {/* Tool 1: Date Shift / Addition / Subtraction */}
      <div className="bg-[#0D0D0D] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-serif-editorial italic font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              Date Shift (Add / Subtract Duration)
            </h3>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">Calculate target future or past dates with custom parameters</p>
          </div>

          <div className="flex items-center border border-white/20 p-1 bg-black">
            <button
              id="op-add-btn"
              onClick={() => setShiftInput((prev) => ({ ...prev, operation: 'add' }))}
              className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${
                shiftInput.operation === 'add'
                  ? 'bg-amber-500 text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              + Add
            </button>
            <button
              id="op-sub-btn"
              onClick={() => setShiftInput((prev) => ({ ...prev, operation: 'subtract' }))}
              className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${
                shiftInput.operation === 'subtract'
                  ? 'bg-amber-500 text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              - Subtract
            </button>
          </div>
        </div>

        {/* Preset Quick Buttons */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 self-center font-medium mr-1">Presets:</span>
          {[
            { label: '+7 Days', days: 7, op: 'add' as const },
            { label: '+30 Days', days: 30, op: 'add' as const },
            { label: '+90 Days', days: 90, op: 'add' as const },
            { label: '+180 Days', days: 180, op: 'add' as const },
            { label: '+1 Year', days: 365, op: 'add' as const },
            { label: '-30 Days', days: 30, op: 'subtract' as const },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setPresetShift(preset.days, preset.op)}
              className="px-3 py-1 border border-white/10 hover:border-amber-500 text-[10px] font-mono text-white/80 hover:text-amber-500 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Start Date</label>
            <input
              type="date"
              value={shiftInput.startDate}
              onChange={(e) => setShiftInput((p) => ({ ...p, startDate: e.target.value }))}
              className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Years</label>
            <input
              type="number"
              min="0"
              value={shiftInput.years}
              onChange={(e) => setShiftInput((p) => ({ ...p, years: parseInt(e.target.value) || 0 }))}
              className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Months</label>
            <input
              type="number"
              min="0"
              value={shiftInput.months}
              onChange={(e) => setShiftInput((p) => ({ ...p, months: parseInt(e.target.value) || 0 }))}
              className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Weeks</label>
            <input
              type="number"
              min="0"
              value={shiftInput.weeks}
              onChange={(e) => setShiftInput((p) => ({ ...p, weeks: parseInt(e.target.value) || 0 }))}
              className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Days</label>
            <input
              type="number"
              min="0"
              value={shiftInput.days}
              onChange={(e) => setShiftInput((p) => ({ ...p, days: parseInt(e.target.value) || 0 }))}
              className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Hours</label>
            <input
              type="number"
              min="0"
              value={shiftInput.hours}
              onChange={(e) => setShiftInput((p) => ({ ...p, hours: parseInt(e.target.value) || 0 }))}
              className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Calculated Shift Output Card */}
        <div className="bg-[#121212] border border-amber-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-[9px] text-amber-500 font-bold uppercase tracking-[0.25em] mb-1">
              Resulting Target Date
            </div>
            <div className="text-2xl sm:text-3xl font-serif-editorial italic font-bold text-white">
              {formatDate(shiftResult, 'full')}
            </div>
            <div className="text-xs text-white/40 mt-1 font-mono">
              ISO Standard: <span className="text-white/80">{shiftResult.toISOString().slice(0, 10)}</span>
            </div>
          </div>

          <button
            onClick={() => setShiftInput((p) => ({ ...p, startDate: todayStr, years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0 }))}
            className="px-4 py-2 bg-white text-black hover:bg-amber-500 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Date
          </button>
        </div>
      </div>

      {/* Tool 2: Date Difference & Business Days Counter */}
      <div className="bg-[#0D0D0D] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-xl font-serif-editorial italic font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            Date Span & Duration Metrics
          </h3>
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">Calculate exact total days, business working days, and exact calendar breakdown</p>
        </div>

        {/* Start / End Date Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Start Date</label>
            <input
              type="date"
              value={diffStart}
              onChange={(e) => setDiffStart(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">End Date</label>
            <input
              type="date"
              value={diffEnd}
              onChange={(e) => setDiffEnd(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121212] border border-white/10 p-5">
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40">Total Days Span</div>
            <div className="text-3xl font-serif-editorial italic font-bold text-amber-500 mt-1">
              {diffResult.totalDays.toLocaleString()} <span className="text-xs font-sans not-italic text-white/40">days</span>
            </div>
            <div className="text-[10px] text-white/40 mt-2 font-mono">
              ≈ {diffResult.weeksAndDays.weeks}w + {diffResult.weeksAndDays.days}d
            </div>
          </div>

          <div className="bg-[#121212] border border-white/10 p-5">
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40">Business Working Days</div>
            <div className="text-3xl font-serif-editorial italic font-bold text-white mt-1">
              {diffResult.businessDays.toLocaleString()} <span className="text-xs font-sans not-italic text-white/40">days</span>
            </div>
            <div className="text-[10px] text-white/40 mt-2 font-mono">
              Excludes {diffResult.weekendDays} weekend days
            </div>
          </div>

          <div className="bg-[#121212] border border-white/10 p-5">
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40">Exact Breakdown</div>
            <div className="text-lg font-serif-editorial italic font-bold text-amber-500 mt-1">
              {diffResult.yearsMonthsDays.years > 0 && `${diffResult.yearsMonthsDays.years}y `}
              {diffResult.yearsMonthsDays.months}m {diffResult.yearsMonthsDays.days}d
            </div>
            <div className="text-[10px] text-white/40 mt-2 font-mono">
              Calendar Year/Month/Day
            </div>
          </div>

          <div className="bg-[#121212] border border-white/10 p-5">
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40">Total Units</div>
            <div className="text-xs font-mono font-semibold text-white/90 mt-2 space-y-1">
              <div>{diffResult.totalHours.toLocaleString()} Hours</div>
              <div>{diffResult.totalMinutes.toLocaleString()} Minutes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
