'use client';

import { useState } from 'react';
import { Star, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useHistoryStore } from '@/store/historyStore';
import { formatDate } from '@/lib/utils';
import type { CreativeFormat } from '@/types';
import { CopyButton } from '../output/CopyButton';

interface HistoryPanelProps {
  compact?: boolean;
  selected?: Set<string>;
  onToggleSelect?: (id: string) => void;
}

export function HistoryPanel({ compact = false, selected, onToggleSelect }: HistoryPanelProps) {
  const entries = useHistoryStore((s) => s.entries);
  const toggleStar = useHistoryStore((s) => s.toggleStar);
  const remove = useHistoryStore((s) => s.remove);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'starred' | CreativeFormat>('all');
  const [search, setSearch] = useState('');

  const filtered = entries.filter((e) => {
    if (filter === 'starred' && !e.starred) return false;
    if (filter !== 'all' && filter !== 'starred' && e.format !== filter) return false;
    if (search && !e.brandName.toLowerCase().includes(search.toLowerCase()) &&
        !e.occasion.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (entries.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          textAlign: 'center',
          minHeight: compact ? 200 : 400,
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>📝</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          No history yet
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Generate some copy and save it to see it here.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {!compact && (
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brand or occasion..."
              style={{ paddingLeft: 32, fontSize: 13 }}
            />
          </div>
        )}
        {(['all', 'starred', 'emailer', 'social', 'whatsapp', 'ads', 'push'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 12px',
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              border: `1px solid ${filter === f ? 'var(--accent-saffron)' : 'var(--border-default)'}`,
              background: filter === f ? 'rgba(255,107,53,0.08)' : 'transparent',
              color: filter === f ? 'var(--accent-saffron)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? 'All' : f === 'starred' ? '★ Starred' : f}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((entry) => {
          const isExpanded = expandedId === entry.id;
          return (
            <div
              key={entry.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'all 0.15s',
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              >
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {onToggleSelect && (
                    <input
                      type="checkbox"
                      checked={selected?.has(entry.id) || false}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleSelect(entry.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginTop: 4, cursor: 'pointer' }}
                    />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {entry.brandName}
                      </span>
                      <span className={`badge badge-${entry.format}`}>{entry.format}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {entry.occasion} · {formatDate(entry.savedAt)}
                    </div>
                  {!isExpanded && (
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--text-muted)',
                        marginTop: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.preview}
                    </div>
                  )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(entry.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: entry.starred ? 'var(--accent-gold)' : 'var(--text-muted)',
                      padding: 4,
                    }}
                  >
                    <Star size={16} fill={entry.starred ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(entry.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: 4,
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                  {isExpanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {entry.fields.map((field, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderBottom: '1px solid var(--border-faint)',
                        }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {field.label}
                        </span>
                        <CopyButton text={field.value} />
                      </div>
                      <div
                        style={{
                          padding: '10px 12px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          lineHeight: 1.7,
                          color: 'var(--text-primary)',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
