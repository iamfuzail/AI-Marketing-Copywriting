'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Building2 } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { INDUSTRIES, TONES, LANGUAGES } from '@/constants/categories';

export function BrandPanel() {
  const profile = useBrandStore((s) => s.profile);
  const updateProfile = useBrandStore((s) => s.updateProfile);
  const [isExpanded, setIsExpanded] = useState(!profile.name);
  const [showSaved, setShowSaved] = useState(false);

  const handleChange = (field: string, value: string) => {
    updateProfile({ [field]: value });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  if (!profile.name && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 12,
          border: '1px solid var(--border-accent)',
          background: 'rgba(255,107,53,0.04)',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'var(--font-body)',
          transition: 'all 0.15s',
        }}
      >
        <Building2 size={20} color="var(--accent-saffron)" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-saffron)' }}>
            Set up your brand
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            For personalised copy →
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      {/* Summary header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-elevated)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Building2 size={18} color="var(--text-secondary)" strokeWidth={1.5} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              {profile.name || 'Brand Profile'}
            </div>
            {profile.industry && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{profile.industry}</div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showSaved && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: 'var(--ink-teal)',
                fontWeight: 500,
              }}
            >
              <Check size={12} /> Saved
            </span>
          )}
          {isExpanded ? (
            <ChevronUp size={16} color="var(--text-muted)" />
          ) : (
            <ChevronDown size={16} color="var(--text-muted)" />
          )}
        </div>
      </button>

      {/* Form */}
      {isExpanded && (
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Brand Name */}
          <div>
            <label style={labelStyle}>Brand name *</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., BoAt, Nykaa, Zara"
            />
          </div>

          {/* Industry */}
          <div>
            <label style={labelStyle}>Industry</label>
            {!(INDUSTRIES as readonly string[]).includes(profile.industry) && profile.industry !== '' ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={profile.industry === 'Other' ? '' : profile.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  placeholder="Type your industry"
                  style={{ flex: 1 }}
                  autoFocus
                />
                <button
                  onClick={() => handleChange('industry', '')}
                  style={{
                    padding: '0 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <select
                value={profile.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            )}
          </div>

          {/* Origin */}
          <div>
            <label style={labelStyle}>Region / Origin</label>
            <input
              type="text"
              value={profile.origin}
              onChange={(e) => handleChange('origin', e.target.value)}
              placeholder="e.g., Mumbai, Pan-India, Kerala"
            />
          </div>

          {/* Audience */}
          <div>
            <label style={labelStyle}>Target audience</label>
            <input
              type="text"
              value={profile.audience}
              onChange={(e) => handleChange('audience', e.target.value)}
              placeholder="e.g., 18-35 urban women, new parents"
            />
          </div>

          {/* Tone */}
          <div>
            <label style={labelStyle}>Brand tone</label>
            <select
              value={profile.tone}
              onChange={(e) => handleChange('tone', e.target.value)}
            >
              <option value="">Select tone</option>
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label style={labelStyle}>Language</label>
            <select
              value={profile.language}
              onChange={(e) => handleChange('language', e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* USP */}
          <div>
            <label style={labelStyle}>USP / Key message</label>
            <input
              type="text"
              value={profile.usp}
              onChange={(e) => handleChange('usp', e.target.value)}
              placeholder="e.g., 100% organic, Made in India"
            />
          </div>

          {/* Offer */}
          <div>
            <label style={labelStyle}>Current offer</label>
            <input
              type="text"
              value={profile.offer}
              onChange={(e) => handleChange('offer', e.target.value)}
              placeholder="e.g., 40% off sitewide, Free shipping"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: 6,
};
