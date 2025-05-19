import { getJournalEntries } from './mockData';
import { useAuth } from './auth';

export interface UserStatistics {
  readingsCount: number;
  favoritesCount: number;
  journalCount: number;
}

export async function getUserStatistics(userId: string): Promise<UserStatistics> {
  try {
    // 获取所有读数
    const readings = JSON.parse(localStorage.getItem('tarot_readings') || '[]');
    
    // 计算统计数据
    const readingsCount = readings.filter((r: any) => r.user_id === userId).length;
    const favoritesCount = readings.filter((r: any) => r.user_id === userId && r.is_favorite).length;
    
    // 获取日志数量 - 直接从本地存储获取
    const journalEntries = getJournalEntries();
    const journalCount = journalEntries.length;

    return {
      readingsCount,
      favoritesCount,
      journalCount
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    return {
      readingsCount: 0,
      favoritesCount: 0,
      journalCount: 0
    };
  }
}

export function useStatistics() {
  const { user } = useAuth();
  
  const getStatistics = async () => {
    if (!user) return null;
    return await getUserStatistics(user.id);
  };

  return { getStatistics };
}