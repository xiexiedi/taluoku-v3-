import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing environment variables. Please click the "Connect to Supabase" button in the top right to set up your database connection.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Utility function to check online status
export const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

// Wrapper for Supabase operations that checks online status
export const withOnlineCheck = async <T>(operation: () => Promise<T>): Promise<T> => {
  if (!isOnline()) {
    throw new Error('您当前处于离线状态，请检查网络连接后重试。');
  }
  return operation();
};

// Function to clear all reading records
export const clearAllReadings = async () => {
  try {
    return await withOnlineCheck(async () => {
      const { error: fortunesError } = await supabase
        .from('readings')
        .delete()
        .eq('type', 'daily');

      const { error: readingsError } = await supabase
        .from('readings')
        .delete()
        .eq('type', 'reading');

      if (fortunesError || readingsError) {
        throw new Error('清除记录时出错');
      }

      return true;
    });
  } catch (error) {
    console.error('Error clearing readings:', error);
    return false;
  }
};