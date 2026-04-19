'use client';

import React from 'react';
import { Mail, Share2, MessageCircle, Megaphone, Bell } from 'lucide-react';
import type { CreativeFormat } from '@/types';
import { FORMATS } from '@/constants/formats';

const iconMap: Record<string, React.ElementType> = {
  Mail, Share2, MessageCircle, Megaphone, Bell,
};

interface FormatSelectorProps {
  value: CreativeFormat;
  onChange: (format: CreativeFormat) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 12,
        }}
      >
        Creative format
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {FORMATS.map((fmt) => {
          const Icon = iconMap[fmt.icon];
          const isActive = value === fmt.id;
          return (
            <button
              key={fmt.id}
              onClick={() => onChange(fmt.id as CreativeFormat)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 10,
                border: `1px solid ${isActive ? 'var(--accent-saffron)' : 'var(--border-default)'}`,
                background: isActive ? 'rgba(255,107,53,0.08)' : 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                transform: 'scale(1)',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.background = 'var(--bg-surface)';
                }
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                style={{
                  color: isActive ? 'var(--accent-saffron)' : 'var(--text-secondary)',
                  marginTop: 2,
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: isActive ? 'var(--accent-saffron)' : 'var(--text-primary)',
                    marginBottom: 2,
                  }}
                >
                  {fmt.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    lineHeight: 1.3,
                  }}
                >
                  {fmt.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
