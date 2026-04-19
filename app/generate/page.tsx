'use client';

import { useState, useCallback, useEffect } from 'react';
import { Save, RefreshCw, Copy, Sparkles, CalendarDays, History, CalendarPlus } from 'lucide-react';
import { BrandPanel } from '@/components/generator/BrandPanel';
import { FormatSelector } from '@/components/generator/FormatSelector';
import { OccasionPicker } from '@/components/generator/OccasionPicker';
import { ContextInput } from '@/components/generator/ContextInput';
import { GenerateButton } from '@/components/generator/GenerateButton';
import { OutputCard } from '@/components/output/OutputCard';
import { SkeletonLoader } from '@/components/output/SkeletonLoader';
import { EmptyOutput } from '@/components/output/EmptyOutput';
import { MiniCalendar } from '@/components/calendar/MiniCalendar';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { useBrandStore } from '@/store/brandStore';
import { useHistoryStore } from '@/store/historyStore';
import { useGenerate } from '@/hooks/useGenerate';
import { copyToClipboard } from '@/lib/utils';
import { INDIA_FESTIVALS } from '@/lib/festivals';
import { showToast } from '@/components/ui/Toast';
import type { CreativeFormat, OccasionType, FestivalEvent } from '@/types';

type RightTab = 'output' | 'calendar' | 'history';

export default function GeneratePage() {
  const profile = useBrandStore((s) => s.profile);
  const addToHistory = useHistoryStore((s) => s.add);

  const [format, setFormat] = useState<CreativeFormat>('emailer');
  const [occasionType, setOccasionType] = useState<OccasionType>('festival');
  const [occasionName, setOccasionName] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [rightTab, setRightTab] = useState<RightTab>('output');
  const [autoStart, setAutoStart] = useState(false);

  const { generate, isGenerating, streamText, fields, error } = useGenerate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const occasion = params.get('occasion');
    if (occasion) {
      setOccasionName(occasion);
      if (params.get('auto') === 'true') {
        setAutoStart(true);
      }
      window.history.replaceState({}, '', '/generate');
    }
  }, []);


  const handleGenerate = useCallback(() => {
    if (!profile.name) {
      showToast('Add your brand name first', 'error');
      return;
    }
    if (!occasionName) {
      showToast('Pick an occasion to continue', 'error');
      return;
    }

    setRightTab('output');
    generate({
      brand: profile,
      format,
      occasionType,
      occasionName,
      extraContext,
    });
  }, [profile, format, occasionType, occasionName, extraContext, generate]);

  useEffect(() => {
    if (autoStart && occasionName && profile.name) {
      handleGenerate();
      setAutoStart(false);
    }
  }, [autoStart, occasionName, profile.name, handleGenerate]);

  const handleSave = useCallback(() => {
    if (fields.length === 0) return;
    addToHistory({
      brandName: profile.name,
      format,
      occasion: occasionName,
      preview: fields[0]?.value.slice(0, 120) || '',
      fields,
    });
    showToast('Saved to history!', 'success');
  }, [fields, profile.name, format, occasionName, addToHistory]);

  const handleCopyAll = useCallback(() => {
    const text = fields.map((f) => `${f.label}:\n${f.value}`).join('\n\n');
    copyToClipboard(text);
    showToast('All fields copied!', 'success');
  }, [fields]);

  const handleAddReminder = useCallback(() => {
    const event = INDIA_FESTIVALS.find(e => e.name === occasionName);
    if (!event) {
      showToast('No exact date found for this occasion.', 'info');
      return;
    }
    
    // Calculate publishing date (e.g. 3 days before festival)
    const year = 2026;
    let d = new Date(year, event.month, event.day);
    const daysBefore = event.priority === 'high' ? 7 : event.priority === 'medium' ? 3 : 1;
    d.setDate(d.getDate() - daysBefore);
    
    const fmt = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('T')[0];
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CopyCraft//Calendar//EN',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${fmt(d)}`,
      `SUMMARY:Publish ${profile.name} campaign for ${occasionName}`,
      `DESCRIPTION:Your CopyCraft marketing copy for ${occasionName} needs to be scheduled!`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\\r\\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copycraft-${occasionName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Calendar reminder downloaded!', 'success');
  }, [occasionName, profile.name]);

  const handleCalendarEvent = useCallback((event: FestivalEvent) => {
    setOccasionType('festival');
    setOccasionName(event.name);
    setRightTab('output');
    showToast(`Selected: ${event.name}`, 'info');
  }, []);

  const hasOutput = fields.length > 0;
  const isStreaming = isGenerating && streamText.length > 0;

  return (
    <div className="hero-bg" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '28px 32px',
          display: 'flex',
          gap: 28,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ═══════ LEFT PANEL ═══════ */}
        <div
          style={{
            width: 380,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
          className="left-panel"
        >
          {/* Brand Panel */}
          <div className="animate-fade-up stagger-1" style={{ opacity: 0 }}>
            <BrandPanel />
          </div>

          {/* Format Selector */}
          <div className="animate-fade-up stagger-2" style={{ opacity: 0 }}>
            <FormatSelector value={format} onChange={setFormat} />
          </div>

          {/* Occasion Picker */}
          <div className="animate-fade-up stagger-3" style={{ opacity: 0 }}>
            <OccasionPicker
              occasionType={occasionType}
              occasionName={occasionName}
              onTypeChange={setOccasionType}
              onNameChange={setOccasionName}
            />
          </div>

          {/* Context */}
          <div className="animate-fade-up stagger-4" style={{ opacity: 0 }}>
            <ContextInput value={extraContext} onChange={setExtraContext} />
          </div>

          {/* Generate Button */}
          <div className="animate-fade-up stagger-5" style={{ opacity: 0 }}>
            <GenerateButton
              onClick={handleGenerate}
              isLoading={isGenerating}
            />
          </div>
        </div>

        {/* ═══════ RIGHT PANEL ═══════ */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tab bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginBottom: 20,
              padding: '4px',
              background: 'var(--bg-surface)',
              borderRadius: 12,
              border: '1px solid var(--border-faint)',
              width: 'fit-content',
            }}
          >
            {([
              { id: 'output', label: 'Output', icon: Sparkles },
              { id: 'calendar', label: 'Calendar', icon: CalendarDays },
              { id: 'history', label: 'History', icon: History },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setRightTab(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-body)',
                  background: rightTab === id ? 'var(--bg-elevated)' : 'transparent',
                  color: rightTab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <Icon size={15} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {rightTab === 'output' && (
            <div>
              {/* Error state */}
              {error && (
                <div
                  style={{
                    padding: '14px 18px',
                    borderRadius: 12,
                    background: 'rgba(255,61,107,0.08)',
                    border: '1px solid rgba(255,61,107,0.25)',
                    color: 'var(--ink-crimson)',
                    fontSize: 14,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{error}</span>
                  <button
                    onClick={handleGenerate}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: '1px solid rgba(255,61,107,0.3)',
                      background: 'transparent',
                      color: 'var(--ink-crimson)',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Generating: show skeleton or streaming */}
              {isGenerating && !isStreaming && (
                <SkeletonLoader format={format} />
              )}

              {/* Streaming text preview */}
              {isStreaming && !hasOutput && (
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 14,
                    padding: '20px',
                  }}
                >
                  <div
                    className="streaming"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      lineHeight: 1.75,
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {streamText}
                  </div>
                </div>
              )}

              {/* Generated output */}
              {hasOutput && !isGenerating && (
                <div>
                  {/* Header row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                      flexWrap: 'wrap',
                      gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {profile.name}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>·</span>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {occasionName}
                      </span>
                      <span className={`badge badge-${format}`}>{format}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={handleSave}
                        style={actionBtnStyle}
                      >
                        <Save size={14} /> Save
                      </button>
                      <button
                        onClick={handleGenerate}
                        style={actionBtnStyle}
                      >
                        <RefreshCw size={14} /> Regenerate
                      </button>
                      <button
                        onClick={handleCopyAll}
                        style={actionBtnStyle}
                      >
                        <Copy size={14} /> Copy all
                      </button>
                      {occasionType === 'festival' && (
                        <button
                          onClick={handleAddReminder}
                          style={{
                            ...actionBtnStyle,
                            color: 'var(--accent-saffron)',
                            borderColor: 'var(--accent-saffron)',
                            background: 'rgba(255, 107, 53, 0.05)',
                          }}
                        >
                          <CalendarPlus size={14} /> Add Reminder
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Output cards */}
                  {fields.map((field, i) => (
                    <OutputCard
                      key={`${field.label}-${i}`}
                      label={field.label}
                      value={field.value}
                      index={i}
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isGenerating && !hasOutput && !error && (
                <EmptyOutput />
              )}
            </div>
          )}

          {rightTab === 'calendar' && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 14,
                padding: 20,
              }}
            >
              <MiniCalendar onSelectEvent={handleCalendarEvent} />
            </div>
          )}

          {rightTab === 'history' && (
            <HistoryPanel compact />
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .left-panel {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
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
  transition: 'all 0.15s',
  fontFamily: 'var(--font-body)',
};
