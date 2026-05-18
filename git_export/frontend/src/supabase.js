import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qtuzpswxzengqoqqwtpt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cwSD5GVp927MuLu0N1uROA_z7OsOjIB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
