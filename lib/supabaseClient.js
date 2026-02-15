import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isValidUrl = (value) => {
	if (!value) {
		return false;
	}

	try {
		const url = new URL(value);
		return url.protocol === 'https:' || url.protocol === 'http:';
	} catch {
		return false;
	}
};

export const supabaseConfigured = Boolean(isValidUrl(supabaseUrl) && supabaseAnonKey);

export const supabase = supabaseConfigured
	? createClient(supabaseUrl, supabaseAnonKey)
	: null;