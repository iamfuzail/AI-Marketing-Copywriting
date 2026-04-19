import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BrandProfile } from '@/types';

interface BrandStore {
  profiles: BrandProfile[];
  activeId: string | null;
  profile: BrandProfile;
  setActiveProfile: (id: string) => void;
  updateProfile: (updates: Partial<BrandProfile>) => void;
  addProfile: (profile: BrandProfile) => void;
  deleteProfile: (id: string) => void;
  reset: () => void;
}

const DEFAULT_PROFILE: BrandProfile = {
  id: 'default',
  name: '',
  industry: '',
  origin: '',
  audience: '',
  tone: '',
  language: 'English',
  usp: '',
  offer: '',
  updatedAt: '',
};

export const useBrandStore = create<BrandStore>()(
  persist(
    (set, get) => ({
      profiles: [DEFAULT_PROFILE],
      activeId: 'default',
      profile: DEFAULT_PROFILE,

      setActiveProfile: (id) => {
        const found = get().profiles.find((p) => p.id === id);
        if (found) {
          set({ activeId: id, profile: found });
        }
      },

      updateProfile: (updates) =>
        set((s) => {
          const updated = { ...s.profile, ...updates, updatedAt: new Date().toISOString() };
          const profiles = s.profiles.map((p) =>
            p.id === s.activeId ? updated : p
          );
          return { profile: updated, profiles };
        }),

      addProfile: (profile) =>
        set((s) => {
          if (s.profiles.length >= 5) return s;
          return {
            profiles: [...s.profiles, profile],
            activeId: profile.id,
            profile,
          };
        }),

      deleteProfile: (id) =>
        set((s) => {
          if (s.profiles.length <= 1) return s;
          const filtered = s.profiles.filter((p) => p.id !== id);
          const newActive = filtered[0];
          return {
            profiles: filtered,
            activeId: newActive.id,
            profile: newActive,
          };
        }),

      reset: () => set({ profiles: [DEFAULT_PROFILE], activeId: 'default', profile: DEFAULT_PROFILE }),
    }),
    { name: 'copycraft_brand' }
  )
);
