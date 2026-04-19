import { create } from 'zustand';
import type { CreativeFormat, OccasionType, OutputField } from '@/types';

interface GenerateStore {
  format: CreativeFormat;
  occasionType: OccasionType;
  occasionName: string;
  extraContext: string;
  isGenerating: boolean;
  streamText: string;
  fields: OutputField[];
  error: string | null;
  setFormat: (f: CreativeFormat) => void;
  setOccasionType: (t: OccasionType) => void;
  setOccasionName: (n: string) => void;
  setExtraContext: (c: string) => void;
  setIsGenerating: (v: boolean) => void;
  setStreamText: (t: string) => void;
  setFields: (f: OutputField[]) => void;
  setError: (e: string | null) => void;
  resetOutput: () => void;
}

export const useGenerateStore = create<GenerateStore>()((set) => ({
  format: 'emailer',
  occasionType: 'festival',
  occasionName: '',
  extraContext: '',
  isGenerating: false,
  streamText: '',
  fields: [],
  error: null,

  setFormat: (format) => set({ format }),
  setOccasionType: (occasionType) => set({ occasionType, occasionName: '' }),
  setOccasionName: (occasionName) => set({ occasionName }),
  setExtraContext: (extraContext) => set({ extraContext }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setStreamText: (streamText) => set({ streamText }),
  setFields: (fields) => set({ fields }),
  setError: (error) => set({ error }),
  resetOutput: () => set({ streamText: '', fields: [], error: null }),
}));
