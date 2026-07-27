import React, { useState, useEffect } from 'react';
import { DateEvent, EventCategory } from '../types';
import { getCountdownBreakdown, formatDate } from '../utils/dateUtils';
import { Calendar, Plus, Trash2, Clock, Filter } from 'lucide-react';

interface CountdownManagerProps {
  now: Date;
}

const DEFAULT_EVENTS: DateEvent[] = [
  {
    id: 'evt-1',
    title: 'New Year 2027',
    targetDate: '2027-01-01T00:00:00.000Z',
    category: 'holiday',
    description: 'Welcome to 2027 global countdown!',
    color: 'from-amber-500 to-amber-700',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-2',
    title: 'End of Q3 2026',
    targetDate: '2026-09-30T23:59:59.000Z',
    category: 'deadline',
    description: 'Quarterly reviews and goal completions',
    color: 'from-amber-500 to-amber-700',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-3',
    title: 'Year End 2026 Countdown',
    targetDate: '2026-12-31T23:59:59.000Z',
    category: 'milestone',
    description: 'Final day of 2026',
    color: 'from-amber-500 to-amber-700',
    createdAt: new Date().toISOString(),
  },
];

export const CountdownManager: React.FC<CountdownManagerProps> = ({ now }) => {
  const [events, setEvents] = useState<DateEvent[]>(() => {
    const saved = localStorage.getItem('date_update_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_EVENTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('12:00');
  const [formCategory, setFormCategory] = useState<EventCategory>('personal');
  const [formDesc, setFormDesc] = useState('');

  useEffect(() => {
    localStorage.setItem('date_update_events', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate) return;

    const fullISO = new Date(`${formDate}T${formTime || '00:00'}:00`).toISOString();

    const newEvt: DateEvent = {
      id: `evt-${Date.now()}`,
      title: formTitle,
      targetDate: fullISO,
      category: formCategory,
      description: formDesc,
      color: 'from-amber-500 to-amber-700',
      createdAt: new Date().toISOString(),
    };

    setEvents((prev) => [newEvt, ...prev]);
    setIsModalOpen(false);

    // Reset Form
    setFormTitle('');
    setFormDate('');
    setFormTime('12:00');
    setFormCategory('personal');
    setFormDesc('');
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const addPreset = (title: string, dateStr: string, category: EventCategory) => {
    const newEvt: DateEvent = {
      id: `evt-${Date.now()}`,
      title,
      targetDate: new Date(dateStr).toISOString(),
      category,
      color: 'from-amber-500 to-amber-700',
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [newEvt, ...prev]);
  };

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif-editorial font-bold italic text-white flex items-center gap-3">
            <Calendar className="w-6 h-6 text-amber-500" />
            Date Reminders & Live Countdowns
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 mt-1">
            Track key temporal milestones and deadlines with dynamic auto-updating countdowns
          </p>
        </div>

        <button
          id="open-add-event-modal"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-amber-500 text-black hover:bg-amber-400 font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 shrink-0 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Reminder
        </button>
      </div>

      {/* Category Filter & Quick Presets */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D0D0D] border border-white/10 p-4">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-amber-500 mr-2" />
          {['all', 'work', 'personal', 'holiday', 'milestone', 'deadline'].map((cat) => (
            <button
              key={cat}
              id={`filter-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border ${
                selectedCategory === cat
                  ? 'border-amber-500 bg-amber-500 text-black'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Quick Presets:</span>
          <button
            onClick={() => addPreset('Next Weekend', new Date(now.getTime() + (6 - now.getDay()) * 86400000).toISOString(), 'personal')}
            className="px-3 py-1 border border-white/10 hover:border-amber-500 text-[10px] font-mono text-white/80 transition-colors"
          >
            + Next Weekend
          </button>
          <button
            onClick={() => addPreset('End of Month', new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(), 'deadline')}
            className="px-3 py-1 border border-white/10 hover:border-amber-500 text-[10px] font-mono text-white/80 transition-colors"
          >
            + Month End
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-[#0D0D0D] border border-dashed border-white/10 p-12 text-center space-y-3">
          <Clock className="w-8 h-8 text-amber-500/50 mx-auto" />
          <h3 className="text-xl font-serif-editorial italic font-bold text-white">No date reminders found</h3>
          <p className="text-xs uppercase tracking-[0.15em] text-white/40 max-w-sm mx-auto">
            There are no countdowns matching this filter. Click above to add a new event or select 'All'.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const cd = getCountdownBreakdown(event.targetDate, now);
            const targetObj = new Date(event.targetDate);

            return (
              <div
                key={event.id}
                className="group relative bg-[#0D0D0D] border border-white/10 hover:border-amber-500/50 p-6 shadow-2xl transition-all duration-200 flex flex-col justify-between"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-black text-amber-500 border border-amber-500/30">
                      {event.category}
                    </span>

                    <button
                      id={`delete-evt-${event.id}`}
                      onClick={() => handleDelete(event.id)}
                      className="text-white/30 hover:text-amber-500 p-1 transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-serif-editorial italic font-bold text-white group-hover:text-amber-500 transition-colors">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-xs text-white/50 mt-1 line-clamp-2">{event.description}</p>
                  )}

                  <div className="text-[10px] text-white/40 mt-3 font-mono flex items-center gap-1.5 border-t border-white/5 pt-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    {formatDate(targetObj, 'long')}
                  </div>
                </div>

                {/* Countdown Display Block */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                    {cd.isPast ? 'Time Elapsed' : 'Time Remaining'}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-[#121212] p-2 border border-white/5">
                      <div className="text-xl font-bold font-mono text-white">{cd.days}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40">Days</div>
                    </div>
                    <div className="bg-[#121212] p-2 border border-white/5">
                      <div className="text-xl font-bold font-mono text-white">{cd.hours}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40">Hrs</div>
                    </div>
                    <div className="bg-[#121212] p-2 border border-white/5">
                      <div className="text-xl font-bold font-mono text-white">{cd.minutes}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40">Min</div>
                    </div>
                    <div className="bg-[#121212] p-2 border border-white/5">
                      <div className="text-xl font-bold font-mono text-amber-500">{cd.seconds}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40">Sec</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/20 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-serif-editorial italic font-bold text-white">Add Date Countdown</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/50 hover:text-white text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-sm">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Launch, Vacation"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Time</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                  className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500 capitalize"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="holiday">Holiday</option>
                  <option value="milestone">Milestone</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional details..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-400"
                >
                  Save Countdown
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
