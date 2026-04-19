import type { FestivalEvent } from '@/types';

// ═══════════════════════════════════════════
// Accurate 2026 Indian Festival Calendar
// Dates verified from official sources
// Month is 0-indexed (0 = January)
// ═══════════════════════════════════════════

export const INDIA_FESTIVALS: FestivalEvent[] = [
  // ── January 2026 ──
  { month: 0, day: 1,  name: "New Year's Day", type: 'Topical', priority: 'high' },
  { month: 0, day: 14, name: 'Makar Sankranti / Pongal', type: 'Festival', priority: 'high' },
  { month: 0, day: 26, name: 'Republic Day', type: 'National day', priority: 'high' },

  // ── February 2026 ──
  { month: 1, day: 14, name: "Valentine's Day", type: 'Topical', priority: 'high' },
  { month: 1, day: 15, name: 'Maha Shivratri', type: 'Festival', priority: 'high' },

  // ── March 2026 ──
  { month: 2, day: 4,  name: 'Holi', type: 'Festival', priority: 'high' },
  { month: 2, day: 8,  name: "Women's Day", type: 'Topical', priority: 'high' },
  { month: 2, day: 19, name: 'Ugadi / Gudi Padwa', type: 'Festival', priority: 'high' },
  { month: 2, day: 21, name: 'Eid al-Fitr', type: 'Festival', priority: 'high' },

  // ── April 2026 ──
  { month: 3, day: 14, name: 'Baisakhi', type: 'Festival', priority: 'high' },

  // ── May 2026 ──
  { month: 4, day: 10, name: "Mother's Day", type: 'Topical', priority: 'high' },
  { month: 4, day: 27, name: 'Eid ul-Adha', type: 'Festival', priority: 'high' },

  // ── June 2026 ──
  { month: 5, day: 1,  name: 'Mid-year sale', type: 'Seasonal', priority: 'high' },
  { month: 5, day: 21, name: 'International Yoga Day', type: 'Topical', priority: 'medium' },

  // ── July 2026 ──
  { month: 6, day: 29, name: 'Guru Purnima', type: 'Festival', priority: 'medium' },

  // ── August 2026 ──
  { month: 7, day: 2,  name: 'Friendship Day', type: 'Topical', priority: 'medium' },
  { month: 7, day: 15, name: 'Independence Day', type: 'National day', priority: 'high' },
  { month: 7, day: 25, name: 'Onam', type: 'Festival', priority: 'high', regions: ['Kerala', 'South India'] },
  { month: 7, day: 28, name: 'Raksha Bandhan', type: 'Festival', priority: 'high' },

  // ── September 2026 ──
  { month: 8, day: 4,  name: 'Janmashtami', type: 'Festival', priority: 'high' },
  { month: 8, day: 5,  name: "Teachers' Day", type: 'Topical', priority: 'medium' },
  { month: 8, day: 14, name: 'Ganesh Chaturthi', type: 'Festival', priority: 'high' },

  // ── October 2026 ──
  { month: 9, day: 2,  name: 'Gandhi Jayanti', type: 'National day', priority: 'medium' },
  { month: 9, day: 11, name: 'Navratri begins', type: 'Festival', priority: 'high' },
  { month: 9, day: 19, name: 'Durga Puja', type: 'Festival', priority: 'high', regions: ['East India'] },
  { month: 9, day: 20, name: 'Dussehra', type: 'Festival', priority: 'high' },
  { month: 9, day: 29, name: 'Karwa Chauth', type: 'Festival', priority: 'high' },

  // ── November 2026 ──
  { month: 10, day: 8,  name: 'Diwali', type: 'Festival', priority: 'high' },
  { month: 10, day: 11, name: 'Bhai Dooj', type: 'Festival', priority: 'high' },
  { month: 10, day: 14, name: "Children's Day", type: 'Topical', priority: 'medium' },
  { month: 10, day: 15, name: 'Chhath Puja', type: 'Festival', priority: 'high', regions: ['Bihar', 'UP', 'East India'] },
  { month: 10, day: 27, name: 'Black Friday', type: 'Seasonal', priority: 'high' },

  // ── December 2026 ──
  { month: 11, day: 5,  name: 'Year-end sale', type: 'Seasonal', priority: 'high' },
  { month: 11, day: 25, name: 'Christmas', type: 'Festival', priority: 'high' },
  { month: 11, day: 31, name: "New Year's Eve", type: 'Topical', priority: 'high' },
];

export function getEventsForMonth(month: number): FestivalEvent[] {
  return INDIA_FESTIVALS.filter((e) => e.month === month);
}

export function getEventsForDate(day: number, month: number): FestivalEvent[] {
  return INDIA_FESTIVALS.filter((e) => e.month === month && e.day === day);
}
