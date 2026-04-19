'use client';

import { useState } from 'react';
import { Plus, Check, Trash2, Star, Building2 } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { INDUSTRIES, TONES, LANGUAGES } from '@/constants/categories';
import { showToast } from '@/components/ui/Toast';
import type { BrandProfile } from '@/types';

export default function BrandPage() {
  const profiles = useBrandStore((s) => s.profiles);
  const activeId = useBrandStore((s) => s.activeId);
  const profile = useBrandStore((s) => s.profile);
  const setActiveProfile = useBrandStore((s) => s.setActiveProfile);
  const updateProfile = useBrandStore((s) => s.updateProfile);
  const addProfile = useBrandStore((s) => s.addProfile);
  const deleteProfile = useBrandStore((s) => s.deleteProfile);
  const [showSaved, setShowSaved] = useState(false);

  const handleChange = (field: string, value: string) => {
    updateProfile({ [field]: value });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleAddProfile = () => {
    if (profiles.length >= 5) {
      showToast('Maximum 5 brand profiles allowed', 'error');
      return;
    }
    const newProfile: BrandProfile = {
      id: crypto.randomUUID(),
      name: `New Brand ${profiles.length + 1}`,
      industry: '',
      origin: '',
      audience: '',
      tone: '',
      language: 'English',
      usp: '',
      offer: '',
      updatedAt: new Date().toISOString(),
    };
    addProfile(newProfile);
    showToast('New brand profile created', 'success');
  };

  const handleDelete = (id: string) => {
    if (profiles.length <= 1) {
      showToast('Cannot delete the only profile', 'error');
      return;
    }
    deleteProfile(id);
    showToast('Profile deleted', 'success');
  };

  return (
    <div className="hero-bg" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '28px 32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div className="animate-fade-up stagger-1" style={{ opacity: 0, marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 6,
            }}
          >
            Brand Profiles
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            Set up your brands for personalised AI copywriting. Switch between brands instantly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {/* Profile switcher */}
          <div
            className="animate-fade-up stagger-2"
            style={{
              opacity: 0,
              width: 280,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {profiles.map((p) => (
              <div
                key={p.id}
                onClick={() => setActiveProfile(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: `1px solid ${p.id === activeId ? 'var(--accent-saffron)' : 'var(--border-default)'}`,
                  background: p.id === activeId ? 'rgba(255,107,53,0.06)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: p.id === activeId
                      ? 'linear-gradient(135deg, var(--accent-saffron), var(--accent-gold))'
                      : 'var(--bg-elevated)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Building2 size={16} color={p.id === activeId ? '#fff' : 'var(--text-muted)'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: p.id === activeId ? 'var(--accent-saffron)' : 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.name || 'Unnamed brand'}
                  </div>
                  {p.industry && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.industry}</div>
                  )}
                </div>
                {p.id === activeId && <Star size={14} color="var(--accent-saffron)" fill="var(--accent-saffron)" />}
              </div>
            ))}

            {profiles.length < 5 && (
              <button
                onClick={handleAddProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px dashed var(--border-default)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-saffron)';
                  e.currentTarget.style.color = 'var(--accent-saffron)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <Plus size={16} /> Add brand
              </button>
            )}
          </div>

          {/* Editor */}
          <div
            className="animate-fade-up stagger-3"
            style={{
              opacity: 0,
              flex: 1,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 14,
              padding: 28,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 28,
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {profile.name || 'Edit brand'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {showSaved && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: 'var(--ink-teal)',
                      fontWeight: 500,
                    }}
                  >
                    <Check size={14} /> Profile saved
                  </span>
                )}
                {profiles.length > 1 && (
                  <button
                    onClick={() => handleDelete(activeId!)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 8,
                      border: '1px solid rgba(255,61,107,0.3)',
                      background: 'transparent',
                      color: 'var(--ink-crimson)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px 24px',
              }}
            >
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Brand name *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., BoAt, Nykaa, Zara"
                  style={{ fontSize: 16 }}
                />
              </div>

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
                    {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                    <option value="Other">Other</option>
                  </select>
                )}
              </div>

              <div>
                <label style={labelStyle}>Region / Origin</label>
                <input
                  type="text"
                  value={profile.origin}
                  onChange={(e) => handleChange('origin', e.target.value)}
                  placeholder="e.g., Mumbai, Pan-India"
                />
              </div>

              <div>
                <label style={labelStyle}>Target audience</label>
                <input
                  type="text"
                  value={profile.audience}
                  onChange={(e) => handleChange('audience', e.target.value)}
                  placeholder="e.g., 18-35 urban women"
                />
              </div>

              <div>
                <label style={labelStyle}>Brand tone</label>
                <select value={profile.tone} onChange={(e) => handleChange('tone', e.target.value)}>
                  <option value="">Select tone</option>
                  {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Language</label>
                <select value={profile.language} onChange={(e) => handleChange('language', e.target.value)}>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>USP / Key message</label>
                <input
                  type="text"
                  value={profile.usp}
                  onChange={(e) => handleChange('usp', e.target.value)}
                  placeholder="e.g., 100% organic"
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Current offer</label>
                <input
                  type="text"
                  value={profile.offer}
                  onChange={(e) => handleChange('offer', e.target.value)}
                  placeholder="e.g., 40% off sitewide, Free shipping above ₹999"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
