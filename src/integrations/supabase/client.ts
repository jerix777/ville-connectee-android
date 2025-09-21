import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = 'https://mmslqomfaeklpgmdpxcq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tc2xxb21mYWVrbHBnbWRweGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNDAzMDAsImV4cCI6MjA2MDgxNjMwMH0.FnB9O8qqE_V1n-SEJTk17VcwwmvRJeh5Dr-vdirI8zE'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tc2xxb21mYWVrbHBnbWRweGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTI0MDMwMCwiZXhwIjoyMDYwODE2MzAwfQ.GJqKUOq749BepcHGdZUirp6SWflK0EJFs1p3Ulsa5Eg'

// Client pour les opérations nécessitant des droits élevés (côté serveur ou sécurisé)
export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

// Client pour les opérations côté client respectant les politiques RLS
export const supabaseAnon = createClient<Database>(supabaseUrl, supabaseAnonKey)
