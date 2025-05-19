// Types for tarot readings
export interface TarotCard {
  name: string;
  isReversed: boolean;
  position?: string;
  meaning?: string;
}

export interface ReadingInterpretation {
  general: string;
  cards?: Array<{
    position: string;
    meaning: string;
  }>;
}

export interface Reading {
  id: string;
  user_id: string;
  type: 'daily' | 'reading';
  spread_type: string;
  cards: TarotCard[];
  notes?: string;
  is_favorite: boolean;
  created_at: string;
  interpretation: ReadingInterpretation;
}