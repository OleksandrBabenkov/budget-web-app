// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Get the env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check that they are not null
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

// Create and export the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);