import { v4 as uuidv4 } from 'uuid';
import type { Reading, TarotCard, ReadingInterpretation } from './types';

export class ReadingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReadingError';
  }
}

const STORAGE_KEY = 'tarot_readings';

function getReadingsFromStorage(): Reading[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

function saveReadingsToStorage(readings: Reading[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw new ReadingError('Failed to save reading to local storage');
  }
}

export async function saveReading(
  userId: string,
  type: 'daily' | 'reading',
  spreadType: string,
  cards: TarotCard[],
  interpretation: ReadingInterpretation,
  notes?: string
): Promise<Reading> {
  try {
    if (!userId) throw new ReadingError('User ID is required');
    if (!cards.length) throw new ReadingError('Cards are required');
    if (!interpretation.general) throw new ReadingError('Interpretation is required');

    const reading: Reading = {
      id: uuidv4(),
      user_id: userId,
      type,
      spread_type: spreadType,
      cards,
      interpretation,
      notes,
      is_favorite: false,
      created_at: new Date().toISOString()
    };

    const readings = getReadingsFromStorage();
    readings.push(reading);
    saveReadingsToStorage(readings);

    return reading;
  } catch (error) {
    console.error('Error in saveReading:', error);
    throw error instanceof ReadingError ? error : new ReadingError('Failed to save reading');
  }
}

export async function getReadings(userId: string): Promise<Reading[]> {
  try {
    const readings = getReadingsFromStorage();
    return readings.filter(reading => reading.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error('Error in getReadings:', error);
    throw error instanceof ReadingError ? error : new ReadingError('Failed to fetch readings');
  }
}

export async function updateReading(
  readingId: string,
  userId: string,
  updates: Partial<Reading>
): Promise<Reading> {
  try {
    const readings = getReadingsFromStorage();
    const index = readings.findIndex(r => r.id === readingId && r.user_id === userId);
    
    if (index === -1) {
      throw new ReadingError('Reading not found');
    }

    const updatedReading = { ...readings[index], ...updates };
    readings[index] = updatedReading;
    saveReadingsToStorage(readings);

    return updatedReading;
  } catch (error) {
    console.error('Error in updateReading:', error);
    throw error instanceof ReadingError ? error : new ReadingError('Failed to update reading');
  }
}

export async function deleteReading(readingId: string, userId: string): Promise<void> {
  try {
    const readings = getReadingsFromStorage();
    const filteredReadings = readings.filter(r => !(r.id === readingId && r.user_id === userId));
    saveReadingsToStorage(filteredReadings);
  } catch (error) {
    console.error('Error in deleteReading:', error);
    throw error instanceof ReadingError ? error : new ReadingError('Failed to delete reading');
  }
}

export async function toggleFavorite(
  readingId: string,
  userId: string,
  isFavorite: boolean
): Promise<Reading> {
  return updateReading(readingId, userId, { is_favorite: isFavorite });
}