'use client';

import { useState } from 'react';
import { useHistoryStore } from '@/store/historyStore';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { Download, Trash2 } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

export default function HistoryPage() {
  const entries = useHistoryStore((s) => s.entries);
  const bulkDelete = useHistoryStore((s) => s.bulkDelete);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    bulkDelete(Array.from(selected));
    setSelected(new Set());
    showToast(`Deleted ${selected.size} entries`, 'success');
  };

  const handleExport = () => {
    const toExport = entries.filter((e) => selected.has(e.id));
    if (toExport.length === 0) {
      showToast('Select entries to export', 'info');
      return;
    }
    const text = toExport
      .map((entry) => {
        const header = `=== ${entry.brandName} | ${entry.format} | ${entry.occasion} ===\n`;
        const body = entry.fields.map((f) => `${f.label}:\n${f.value}`).join('\n\n');
        return header + body;
      })
      .join('\n\n---\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copycraft-export.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported successfully!', 'success');
  };

  return (
    <div className="hero-bg" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="app-container" style={{ display: 'block' }}>
        {/* Header */}
        <div
          className="animate-fade-up stagger-1"
          style={{
            opacity: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 28,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}
            >
              Copy History
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
              {entries.length} saved generation{entries.length !== 1 ? 's' : ''}
            </p>
          </div>

          {selected.size > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleExport}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <Download size={14} /> Export ({selected.size})
              </button>
              <button
                onClick={handleBulkDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,61,107,0.3)',
                  background: 'rgba(255,61,107,0.06)',
                  color: 'var(--ink-crimson)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <Trash2 size={14} /> Delete ({selected.size})
              </button>
            </div>
          )}
        </div>

        <div className="animate-fade-up stagger-2" style={{ opacity: 0 }}>
          <HistoryPanel selected={selected} onToggleSelect={toggleSelect} />
        </div>
      </div>
    </div>
  );
}
