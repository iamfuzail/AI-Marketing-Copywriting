'use client';

import { useState, useEffect } from 'react';
import { X, Key, Info, Check } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { showToast } from '@/components/ui/Toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { apiKey, setApiKey } = useSettingsStore();
  const [tempKey, setTempKey] = useState(apiKey);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTempKey(apiKey);
  }, [apiKey, isOpen]);

  if (!isOpen || !isMounted) return null;

  const handleSave = () => {
    setApiKey(tempKey);
    showToast('Settings saved successfully', 'success');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 20,
          padding: 28,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(255,107,53,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-saffron)',
            }}
          >
            <Key size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, m: 0 }}>API Settings</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', m: 0 }}>Manual integration</p>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            Gemini API Key
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Paste your API key here..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid var(--border-default)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, display: 'flex', gap: 6 }}>
            <Info size={14} style={{ flexShrink: 0 }} />
            This key is stored locally in your browser and used when the server-side key is missing.
          </p>
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(255,184,48,0.05)',
            border: '1px solid rgba(255,184,48,0.15)',
            marginBottom: 28,
          }}
        >
          <p style={{ fontSize: 12, color: 'var(--accent-gold)', margin: 0, lineHeight: 1.5 }}>
            <strong>Note:</strong> You can get a free Gemini API key from the{' '}
            <a
              href="https://aistudio.google.com/app/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}
            >
              Google AI Studio
            </a>.
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 12,
            background: 'var(--accent-saffron)',
            color: '#fff',
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s',
          }}
        >
          <Check size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
}
