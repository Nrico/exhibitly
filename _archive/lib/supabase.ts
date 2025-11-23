import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.https://zdfxzjjvjddsdmkrihgl.supabase.co
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZnh6amp2amRkc2Rta3JpaGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjY1NzMsImV4cCI6MjA3OTQwMjU3M30.n4xgIGQ3TwBxdOqySpIehjdPI66WuvGwFzdLcqy6i8o

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables for Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
