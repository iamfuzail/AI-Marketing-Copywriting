'use client';

import React from 'react';
import { CopyButton } from './CopyButton';

interface OutputCardProps {
  label: string;
  value: string;
  isStreaming?: boolean;
  index?: number;
}

export const OutputCard = React.memo(function OutputCard({
  label,
  value,
  isStreaming = false,
  index = 0,
}: OutputCardProps) {
  return (
    <div
      className="animate-card-reveal"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 12,
        animationDelay: `${index * 80}ms`,
        animationFillMode: 'backwards',
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-faint)',
          background: 'var(--bg-elevated)',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {label}
        </span>
        <CopyButton text={value} />
      </div>

      {/* Card Body */}
      <div style={{ padding: '14px 16px' }}>
        <div
          className={isStreaming ? 'streaming' : ''}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            lineHeight: 1.75,
            color: 'var(--text-primary)',
            letterSpacing: '0.01em',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
});
