import { createClient } from '@supabase/supabase-js'
import { Database } from './types.ts'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env file');
}

// Client pour les opérations côté client respectant les politiques RLS
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
