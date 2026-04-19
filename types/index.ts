export type CreativeFormat =
  | 'emailer'
  | 'social'
  | 'whatsapp'
  | 'ads'
  | 'push';

export type OccasionType =
  | 'festival'
  | 'seasonal'
  | 'product'
  | 'brand'
  | 'custom';

export type Priority = 'high' | 'medium' | 'low';

export type FestivalType =
  | 'Festival'
  | 'National day'
  | 'Topical'
  | 'Seasonal'
  | 'Holiday';

export interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  origin: string;
  audience: string;
  tone: string;
  language: string;
  usp: string;
  offer: string;
  updatedAt: string;
}

export interface GenerationRequest {
  brand: BrandProfile;
  format: CreativeFormat;
  occasionType: OccasionType;
  occasionName: string;
  extraContext: string;
}

export interface OutputField {
  label: string;
  value: string;
}

export interface GenerationResult {
  id: string;
  request: GenerationRequest;
  fields: OutputField[];
  generatedAt: string;
}

export interface FestivalEvent {
  month: number;
  day: number;
  name: string;
  type: FestivalType;
  priority: Priority;
  regions?: string[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  events: FestivalEvent[];
}

export interface HistoryEntry {
  id: string;
  brandName: string;
  format: CreativeFormat;
  occasion: string;
  preview: string;
  fields: OutputField[];
  savedAt: string;
  starred: boolean;
}
