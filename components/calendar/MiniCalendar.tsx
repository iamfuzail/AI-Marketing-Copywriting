'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Flame, Zap } from 'lucide-react';
import { getEventsForMonth, getEventsForDate } from '@/lib/festivals';
import type { FestivalEvent } from '@/types';

interface MiniCalendarProps {
  onSelectEvent?: (event: FestivalEvent) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function MiniCalendar({ onSelectEvent }: MiniCalendarProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const events = useMemo(() => getEventsForMonth(month), [month]);

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

  return (
    <div>
      {/* Month navigator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <button onClick={prevMonth} style={navBtnStyle}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
          {MONTHS[month]} {year}
        </span>
        <button onClick={nextMonth} style={navBtnStyle}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '4px 0',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dayEvents = getEventsForDate(day, month);
          const hasHigh = dayEvents.some((e) => e.priority === 'high');
          const hasEvent = dayEvents.length > 0;

          return (
            <button
              key={day}
              onClick={() => {
                if (dayEvents.length > 0 && onSelectEvent) {
                  onSelectEvent(dayEvents[0]);
                }
              }}
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                border: `1px solid ${hasHigh ? 'rgba(255,107,53,0.35)' : hasEvent ? 'rgba(255,184,48,0.30)' : 'var(--border-faint)'}`,
                background: hasHigh ? 'rgba(255,107,53,0.07)' : hasEvent ? 'rgba(255,184,48,0.05)' : 'var(--bg-surface)',
                fontSize: 11,
                fontWeight: hasEvent ? 600 : 400,
                color: hasEvent ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: hasEvent ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
                padding: 2,
              }}
              onMouseEnter={(e) => {
                if (hasEvent) {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  if (hasHigh) {
                    e.currentTarget.style.borderColor = 'var(--accent-saffron)';
                    e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)';
                  } else {
                    e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  }
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = hasHigh ? 'rgba(255,107,53,0.35)' : hasEvent ? 'rgba(255,184,48,0.30)' : 'var(--border-faint)';
              }}
            >
              <span>{day}</span>
              {hasEvent && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: hasHigh ? 'var(--accent-saffron)' : 'var(--accent-gold)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Event list */}
      {events.length > 0 && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 4,
            }}
          >
            This month
          </div>
          {events
            .sort((a, b) => a.day - b.day)
            .map((event, i) => (
              <button
                key={`${event.name}-${i}`}
                onClick={() => onSelectEvent?.(event)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-faint)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-faint)';
                  e.currentTarget.style.background = 'var(--bg-surface)';
                }}
              >
                {/* Date badge */}
                <div
                  style={{
                    minWidth: 40,
                    height: 40,
                    borderRadius: 8,
                    background: 'rgba(255,184,48,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-gold)', lineHeight: 1 }}>
                    {event.day}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                    {MONTHS[event.month].slice(0, 3)}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {event.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span className={`badge badge-${event.type.toLowerCase().replace(' ', '-')}`}>
                      {event.type}
                    </span>
                    {event.priority === 'high' ? (
                      <Flame size={12} color="var(--accent-saffron)" />
                    ) : (
                      <Zap size={12} color="var(--text-muted)" />
                    )}
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 8,
  border: '1px solid var(--border-default)',
  background: 'var(--bg-surface)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all 0.15s',
};
