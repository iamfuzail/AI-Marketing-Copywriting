'use client';

import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function GenerateButton({ onClick, isLoading, disabled }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '14px 28px',
        borderRadius: 12,
        border: isLoading ? '1px solid var(--border-accent)' : 'none',
        background: isLoading
          ? 'rgba(255,107,53,0.08)'
          : 'var(--accent-saffron)',
        color: isLoading ? 'var(--accent-saffron)' : '#fff',
        fontSize: 15,
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.02em',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.currentTarget.style.background = 'var(--accent-ember)';
          e.currentTarget.style.boxShadow = '0 8px 32px var(--accent-glow)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading) {
          e.currentTarget.style.background = 'var(--accent-saffron)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      onMouseDown={(e) => {
        if (!isLoading) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} style={{ animation: 'spin-slow 1s linear infinite' }} />
          <span>Writing your copy</span>
          <span className="streaming" style={{ fontSize: 18 }} />
        </>
      ) : (
        <>
          <Sparkles size={18} strokeWidth={1.5} />
          <span>Generate copy</span>
        </>
      )}

      {/* Shimmer sweep */}
      {!isLoading && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '60%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
            transition: 'left 0.4s ease',
            pointerEvents: 'none',
          }}
        />
      )}
    </button>
  );
}
