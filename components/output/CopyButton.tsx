'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

export const CopyButton = React.memo(function CopyButton({ text, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        fontSize: size === 'sm' ? 11 : 13,
        fontWeight: 600,
        padding: size === 'sm' ? '4px 10px' : '6px 14px',
        borderRadius: 6,
        border: `1px solid ${copied ? 'var(--ink-teal)' : 'var(--border-default)'}`,
        background: copied ? 'rgba(0,201,167,0.08)' : 'transparent',
        color: copied ? 'var(--ink-teal)' : 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'var(--font-body)',
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
});
