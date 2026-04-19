'use client';

interface ContextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ContextInput({ value, onChange }: ContextInputProps) {
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
          marginBottom: 8,
        }}
      >
        Additional context
      </label>
      <div style={{ position: 'relative' }}>
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= 300) {
              onChange(e.target.value);
            }
          }}
          placeholder="e.g., Focus on gifting angle. Our audience is 25–35 women. Diwali sale ends Sunday."
          style={{
            minHeight: 88,
            resize: 'vertical',
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: 8,
            right: 12,
            fontSize: 11,
            color: value.length > 270 ? 'var(--ink-crimson)' : 'var(--text-muted)',
            fontFeatureSettings: '"tnum"',
          }}
        >
          {value.length}/300
        </span>
      </div>
    </div>
  );
}
