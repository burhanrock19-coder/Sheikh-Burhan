import React, { useState } from 'react';
import { generateFormatObject, formatDate } from '../utils/dateUtils';
import { Code, Copy, Check, ArrowRight, Clock, Sparkles } from 'lucide-react';

interface FormatConverterProps {
  now: Date;
}

export const FormatConverter: React.FC<FormatConverterProps> = ({ now }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => now.toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState<string>(() => `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Epoch Converter state
  const [epochInput, setEpochInput] = useState<string>(Math.floor(now.getTime() / 1000).toString());

  const activeDateObj = new Date(`${selectedDate}T${selectedTime}:00`);
  const formats = generateFormatObject(isNaN(activeDateObj.getTime()) ? now : activeDateObj);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Convert Epoch
  let epochResultDate: Date | null = null;
  const numEpoch = Number(epochInput);
  if (!isNaN(numEpoch) && numEpoch > 0) {
    // If < 10000000000 assume seconds, else ms
    epochResultDate = new Date(numEpoch < 10000000000 ? numEpoch * 1000 : numEpoch);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif-editorial font-bold italic text-white flex items-center gap-3">
          <Code className="w-6 h-6 text-amber-500" />
          Format Converter & Epoch Engine
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 mt-1">
          Inspect, convert, and output multi-standard temporal strings for software engineering and database schemas
        </p>
      </div>

      {/* Epoch Converter Tool */}
      <div className="bg-[#0D0D0D] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="border-b border-white/10 pb-3">
          <h3 className="text-xl font-serif-editorial italic font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Unix Epoch Timestamp Converter
          </h3>
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">Parse raw Unix seconds or milliseconds into human-readable strings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5">
            <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Enter Epoch Timestamp</label>
            <input
              type="text"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              placeholder="e.g. 1785149805 or 1785149805000"
              className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-amber-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="hidden md:flex md:col-span-1 justify-center text-white/30">
            <ArrowRight className="w-5 h-5 text-amber-500" />
          </div>

          <div className="md:col-span-6 bg-[#121212] border border-white/10 p-4">
            <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Converted Date</div>
            {epochResultDate && !isNaN(epochResultDate.getTime()) ? (
              <div>
                <div className="text-lg font-serif-editorial italic font-bold text-white">
                  {formatDate(epochResultDate, 'full')}
                </div>
                <div className="text-[10px] font-mono text-amber-500 mt-1">
                  ISO: {epochResultDate.toISOString()}
                </div>
              </div>
            ) : (
              <div className="text-xs text-rose-400 font-mono">Invalid Timestamp</div>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Format Generator */}
      <div className="bg-[#0D0D0D] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-serif-editorial italic font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Multi-Format Date Output List
            </h3>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">Select target timestamp to inspect and copy standardized output formats</p>
          </div>

          {/* Date & Time Selectors */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#121212] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="bg-[#121212] border border-white/10 px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Format Output List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formats).map(([label, val]) => (
            <div
              key={label}
              className="bg-[#121212] border border-white/10 p-4 flex items-center justify-between gap-3 hover:border-amber-500/50 transition-colors"
            >
              <div className="overflow-hidden">
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">
                  {label}
                </div>
                <div className="font-mono text-xs text-white truncate select-all">
                  {val}
                </div>
              </div>

              <button
                id={`copy-fmt-${label.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleCopy(val, label)}
                className="px-3 py-1.5 border border-white/20 hover:border-amber-500 hover:text-amber-500 text-white text-[9px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedKey === label ? (
                  <>
                    <Check className="w-3 h-3 text-amber-500" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
