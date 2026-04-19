'use client';

import type { CreativeFormat } from '@/types';

interface SkeletonLoaderProps {
  format: CreativeFormat;
}

const SKELETON_COUNTS: Record<CreativeFormat, number> = {
  emailer: 7,
  social: 4,
  whatsapp: 2,
  ads: 9,
  push: 5,
};

const WIDTHS = ['40%', '80%', '60%', '45%', '70%'];

export function SkeletonLoader({ format }: SkeletonLoaderProps) {
  const count = SKELETON_COUNTS[format];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-card-reveal"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 14,
            overflow: 'hidden',
            animationDelay: `${i * 80}ms`,
            animationFillMode: 'backwards',
          }}
        >
          {/* Header skeleton */}
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
            <div className="skeleton" style={{ width: 80, height: 10 }} />
            <div className="skeleton" style={{ width: 50, height: 22, borderRadius: 6 }} />
          </div>

          {/* Body skeleton */}
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {WIDTHS.slice(0, 2 + (i % 3)).map((w, j) => (
              <div key={j} className="skeleton" style={{ width: w, height: 12 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
