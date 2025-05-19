import { v4 as uuidv4 } from 'uuid';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  timestamp: string;
}

const STORAGE_KEY = 'journal_entries';

export function getJournalEntries(): JournalEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading journal entries:', error);
    return [];
  }
}

export function saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'timestamp'>): JournalEntry {
  try {
    const entries = getJournalEntries();
    const newEntry = {
      ...entry,
      id: uuidv4(),
      timestamp: new Date().toISOString()
    };
    
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    
    // 触发自定义事件通知统计数据更新
    window.dispatchEvent(new Event('journalUpdated'));
    
    return newEntry;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw new Error('Failed to save journal entry');
  }
}

export function deleteJournalEntry(id: string): void {
  try {
    const entries = getJournalEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // 触发自定义事件通知统计数据更新
    window.dispatchEvent(new Event('journalUpdated'));
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw new Error('Failed to delete journal entry');
  }
}