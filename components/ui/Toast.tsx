'use client';

import { useEffect, useState, useCallback } from 'react';
import { Check, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

let toastCallback: ((toast: ToastData) => void) | null = null;

export function showToast(message: string, type: ToastType = 'info') {
  if (toastCallback) {
    toastCallback({ id: crypto.randomUUID(), message, type });
  }
}

const COLORS: Record<ToastType, { border: string; icon: React.ElementType }> = {
  success: { border: 'var(--ink-teal)', icon: Check },
  error: { border: 'var(--ink-crimson)', icon: X },
  info: { border: 'var(--ink-sky)', icon: Info },
};

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: ToastData) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3000);
  }, []);

  useEffect(() => {
    toastCallback = addToast;
    return () => { toastCallback = null; };
  }, [addToast]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {toasts.map((toast) => {
        const { border, icon: Icon } = COLORS[toast.type];
        return (
          <div
            key={toast.id}
            className="animate-slide-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 18px',
              borderRadius: 12,
              background: 'var(--bg-elevated)',
              borderLeft: `3px solid ${border}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              minWidth: 260,
              maxWidth: 400,
            }}
          >
            <Icon size={16} style={{ color: border, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
              {toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
