'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Flame, Zap, ArrowRight, Download, CalendarCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getEventsForMonth } from '@/lib/festivals';
import { useHistoryStore } from '@/store/historyStore';
import { formatDate } from '@/lib/utils';
import type { FestivalEvent, FestivalType, Priority } from '@/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TYPES: FestivalType[] = ['Festival', 'National day', 'Topical', 'Seasonal'];

export default function CalendarPage() {
  const router = useRouter();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedEvent, setSelectedEvent] = useState<FestivalEvent | null>(null);
  const [filterPriority, setFilterPriority] = useState<'all' | Priority>('all');
  const [filterType, setFilterType] = useState<'all' | FestivalType>('all');
  
  const savedEntries = useHistoryStore((s) => s.entries);

  const allEvents = useMemo(() => getEventsForMonth(month), [month]);

  const events = useMemo(() => {
    return allEvents.filter((e) => {
      if (filterPriority !== 'all' && e.priority !== filterPriority) return false;
      if (filterType !== 'all' && e.type !== filterType) return false;
      return true;
    });
  }, [allEvents, filterPriority, filterType]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const jumpToToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  const getEventsForDay = (day: number) => events.filter((e) => e.day === day);

  const handleGenerate = (event: FestivalEvent) => {
    const params = new URLSearchParams({ occasion: event.name, auto: 'true' });
    router.push(`/generate?${params}`);
  };

  const exportCSV = () => {
    const rows = [['Event', 'Date', 'Type', 'Priority']];
    events.forEach((e) => {
      rows.push([e.name, `${e.day} ${MONTHS[e.month]} ${year}`, e.type, e.priority]);
    });
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copycraft-calendar-${MONTHS[month].toLowerCase()}-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="hero-bg" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '28px 32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ═══════ LEFT PANEL ═══════ */}
        <div className="sidebar left-panel sticky-sidebar animate-fade-up stagger-1" style={{ opacity: 0, marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 6,
            }}
          >
            Content Calendar
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            India&apos;s festivals, events, and marketing moments — plan your copy ahead.
          </p>
        </div>

        {/* Filters */}
        <div
          className="animate-fade-up stagger-2"
          style={{
            opacity: 0,
            display: 'flex',
            gap: 10,
            marginBottom: 24,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Priority filter */}
          {(['all', 'high', 'medium'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 600,
                border: `1px solid ${filterPriority === p ? 'var(--accent-saffron)' : 'var(--border-default)'}`,
                background: filterPriority === p ? 'rgba(255,107,53,0.08)' : 'transparent',
                color: filterPriority === p ? 'var(--accent-saffron)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                textTransform: 'capitalize',
              }}
            >
              {p === 'all' ? 'All priorities' : p === 'high' ? '🔥 High' : '⚡ Medium'}
            </button>
          ))}

          <div style={{ width: 1, height: 20, background: 'var(--border-default)', margin: '0 4px' }} />

          {/* Type filter */}
          {(['all', ...TYPES] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t as typeof filterType)}
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 600,
                border: `1px solid ${filterType === t ? 'var(--accent-saffron)' : 'var(--border-default)'}`,
                background: filterType === t ? 'rgba(255,107,53,0.08)' : 'transparent',
                color: filterType === t ? 'var(--accent-saffron)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              {t === 'all' ? 'All types' : t}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          <button
            onClick={exportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 8,
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="app-container" style={{ padding: 0, maxWidth: 'none' }}>
          {/* Calendar grid */}
          <div className="content-area animate-fade-up stagger-3"
            style={{
              opacity: 0,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 14,
              padding: 24,
            }}
          >
            {/* Month nav */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <button onClick={prevMonth} style={navBtnStyle}>
                <ChevronLeft size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {MONTHS[month]} {year}
                </span>
                <button
                  onClick={jumpToToday}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid var(--border-default)',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Today
                </button>
              </div>
              <button onClick={nextMonth} style={navBtnStyle}>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
              {DAYS.map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '6px 0',
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const dayEvents = getEventsForDay(day);
                const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
                const customOccasionName = `${day} ${MONTHS[month]} ${year}`;
                const hasCustomSaved = savedEntries.some(e => e.occasion === customOccasionName);
                const hasEvent = dayEvents.length > 0 || hasCustomSaved;
                const hasHigh = dayEvents.some((e) => e.priority === 'high');

                return (
                  <button
                    key={day}
                    onClick={() => {
                      if (dayEvents.length > 0) {
                        setSelectedEvent(dayEvents[0]);
                      } else {
                        setSelectedEvent({
                          name: customOccasionName,
                          day,
                          month,
                          type: 'Topical',
                          priority: 'medium'
                        });
                      }
                    }}
                    className="calendar-day-btn"
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${isToday ? 'var(--accent-saffron)' : hasHigh ? 'rgba(255,107,53,0.35)' : hasEvent ? 'rgba(255,184,48,0.30)' : 'var(--border-faint)'}`,
                      background: hasHigh ? 'rgba(255,107,53,0.05)' : hasEvent ? 'rgba(255,184,48,0.03)' : 'var(--bg-surface)',
                      padding: '6px 8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      transition: 'all 0.15s',
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.04)';
                      if (hasHigh) {
                        e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)';
                      } else if (!hasEvent) {
                        e.currentTarget.style.borderColor = 'var(--text-muted)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                      if (!hasEvent && !isToday) {
                        e.currentTarget.style.borderColor = 'var(--border-faint)';
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: isToday ? 700 : 500,
                        color: isToday ? 'var(--accent-saffron)' : 'var(--text-secondary)',
                      }}
                    >
                      {day}
                    </span>
                    {dayEvents.map((ev, j) => (
                      <div
                        key={j}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: ev.priority === 'high' ? 'var(--accent-saffron)' : 'var(--accent-gold)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.3,
                        }}
                      >
                        {ev.name}
                      </div>
                    ))}
                    {dayEvents.length === 0 && hasCustomSaved && (
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.3,
                          opacity: 0.8,
                        }}
                      >
                        ✓ Saved Copy
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slide-in detail panel */}
          {selectedEvent && (
            <div
              className="sidebar sticky-sidebar animate-fade-up"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  Event details
                </span>
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                >
                  ×
                </button>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                }}
              >
                {selectedEvent.name}
              </h3>

              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <span className={`badge badge-${selectedEvent.type.toLowerCase().replace(' ', '-')}`}>
                  {selectedEvent.type}
                </span>
                <span className={`badge badge-${selectedEvent.priority}`}>
                  {selectedEvent.priority === 'high' ? (
                    <><Flame size={10} style={{ marginRight: 4 }} /> High priority</>
                  ) : (
                    <><Zap size={10} style={{ marginRight: 4 }} /> Medium</>
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date</div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                    {selectedEvent.day} {MONTHS[selectedEvent.month]} {year}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plan ahead</div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                    {selectedEvent.priority === 'high' ? '7–10 days before' : '3–5 days before'}
                  </div>
                </div>
                {selectedEvent.regions && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Regions</div>
                    <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                      {selectedEvent.regions.join(', ')}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleGenerate(selectedEvent)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'var(--accent-saffron)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-ember)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent-saffron)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Generate copy <ArrowRight size={16} />
              </button>

              {/* Saved Copies for this event */}
              {savedEntries.filter(e => e.occasion === selectedEvent.name).length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
                    Saved copies for this event:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {savedEntries
                      .filter(e => e.occasion === selectedEvent.name)
                      .slice(0, 3)
                      .map((entry) => (
                        <div
                          key={entry.id}
                          style={{
                            background: 'var(--bg-elevated)',
                            borderRadius: 8,
                            padding: 12,
                            border: '1px solid var(--border-default)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                              {entry.brandName}
                            </span>
                            <span className={`badge badge-${entry.format}`}>{entry.format}</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            Saved {formatDate(entry.savedAt)}
                          </div>
                        </div>
                      ))}
                    {savedEntries.filter(e => e.occasion === selectedEvent.name).length > 3 && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                        + {savedEntries.filter(e => e.occasion === selectedEvent.name).length - 3} more in History
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Event list below grid */}
        <div
          className="animate-fade-up stagger-4"
          style={{
            opacity: 0,
            marginTop: 28,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 14,
            padding: 24,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CalendarCheck size={18} color="var(--accent-gold)" />
            All events in {MONTHS[month]}
          </h3>

          {events.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              No events match your filters this month.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
              {events.sort((a, b) => a.day - b.day).map((event, i) => (
                <div
                  key={`${event.name}-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border-faint)',
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedEvent(event)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-faint)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* Date circle */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: event.priority === 'high' ? 'rgba(255,107,53,0.10)' : 'rgba(255,184,48,0.10)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: event.priority === 'high' ? 'var(--accent-saffron)' : 'var(--accent-gold)',
                      lineHeight: 1,
                    }}>
                      {event.day}
                    </span>
                    <span style={{
                      fontSize: 9,
                      color: event.priority === 'high' ? 'var(--accent-saffron)' : 'var(--accent-gold)',
                      textTransform: 'uppercase',
                    }}>
                      {MONTHS[month].slice(0, 3)}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>
                      {event.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={`badge badge-${event.type.toLowerCase().replace(' ', '-')}`}>
                        {event.type}
                      </span>
                      {event.priority === 'high' && <Flame size={12} color="var(--accent-saffron)" />}
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {event.priority === 'high' ? 'Plan 7–10 days ahead' : 'Plan 3–5 days ahead'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerate(event);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border-default)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-saffron)';
                      e.currentTarget.style.color = 'var(--accent-saffron)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    Generate →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 10,
  border: '1px solid var(--border-default)',
  background: 'var(--bg-surface)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all 0.15s',
  fontFamily: 'var(--font-body)',
};
