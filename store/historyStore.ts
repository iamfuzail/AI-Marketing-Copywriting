import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryEntry } from '@/types';

interface HistoryStore {
  entries: HistoryEntry[];
  add: (entry: Omit<HistoryEntry, 'id' | 'savedAt' | 'starred'>) => void;
  toggleStar: (id: string) => void;
  remove: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      entries: [],
      add: (entry) =>
        set((s) => ({
          entries: [
            {
              ...entry,
              id: crypto.randomUUID(),
              savedAt: new Date().toISOString(),
              starred: false,
            },
            ...s.entries,
          ].slice(0, 200),
        })),
      toggleStar: (id) =>
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, starred: !e.starred } : e
          ),
        })),
      remove: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      bulkDelete: (ids) =>
        set((s) => ({ entries: s.entries.filter((e) => !ids.includes(e.id)) })),
      clear: () => set({ entries: [] }),
    }),
    { name: 'copycraft_history' }
  )
);
