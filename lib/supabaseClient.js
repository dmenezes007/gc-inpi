import { createClient } from '@supabase/supabase-js';
import { isValidSupabaseUrl, normalizeSupabaseUrl } from '@/lib/supabaseEnv';

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasValidSupabaseEnv = () =>
	Boolean(
		isValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	);

export const supabaseConfigured = Boolean(isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey);

export const supabase = supabaseConfigured
	? createClient(supabaseUrl, supabaseAnonKey)
	: null;