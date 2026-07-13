import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Read from Expo Constants (which reads from app.json extra)
// In production builds, the key is injected at build time from Vercel env vars
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'VIVAS_SUPABASE_ANON_KEY_PLACEHOLDER') {
  console.error('Supabase config missing — check VIVAS_SUPABASE_ANON_KEY env var');
}

export const supabase = createClient(
  supabaseUrl || 'https://qtuzpswxzengqoqqwtpt.supabase.co',
  supabaseAnonKey || '',
  {
    auth: {
      storage: AsyncStorage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
