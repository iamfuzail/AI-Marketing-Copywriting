'use client';

import { Sparkles } from 'lucide-react';

export function EmptyOutput() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 500,
        padding: 40,
        textAlign: 'center',
      }}
    >
      {/* Pulsing icon */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: 'rgba(255, 107, 53, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
          animation: 'radialPulse 3s ease-in-out infinite',
        }}
      >
        <Sparkles size={40} color="var(--accent-saffron)" strokeWidth={1.5} />
      </div>

      {/* Heading */}
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 10,
        }}
      >
        Ready to write?
      </h2>

      {/* Subtext */}
      <p
        style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          marginBottom: 32,
          maxWidth: 340,
          lineHeight: 1.6,
        }}
      >
        Set your brand, pick a format, and hit generate.
      </p>

      {/* Feature pills */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['India festivals built-in', '5 creative formats', 'Streams in real time'].map((text) => (
          <span
            key={text}
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: '6px 14px',
              borderRadius: 99,
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-faint)',
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
