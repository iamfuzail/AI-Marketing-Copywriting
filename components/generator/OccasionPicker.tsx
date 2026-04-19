'use client';

import { OCCASION_OPTIONS, OCCASION_TYPES } from '@/constants/occasions';
import type { OccasionType } from '@/types';

interface OccasionPickerProps {
  occasionType: OccasionType;
  occasionName: string;
  onTypeChange: (type: OccasionType) => void;
  onNameChange: (name: string) => void;
}

export function OccasionPicker({
  occasionType,
  occasionName,
  onTypeChange,
  onNameChange,
}: OccasionPickerProps) {
  const options = occasionType !== 'custom' ? OCCASION_OPTIONS[occasionType] || [] : [];

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
          marginBottom: 12,
        }}
      >
        Occasion
      </label>
      <div style={{ display: 'flex', gap: 10 }}>
        <select
          value={occasionType}
          onChange={(e) => onTypeChange(e.target.value as OccasionType)}
          style={{ flex: 1 }}
        >
          {OCCASION_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        {occasionType === 'custom' ? (
          <input
            type="text"
            value={occasionName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter custom occasion..."
            style={{ flex: 1 }}
          />
        ) : (
          <select
            value={occasionName}
            onChange={(e) => onNameChange(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">Select occasion</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
