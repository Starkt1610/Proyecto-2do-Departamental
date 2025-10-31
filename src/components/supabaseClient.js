import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://psendqpybtmlpvruivhz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZW5kcXB5YnRtbHB2cnVpdmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDczNzYsImV4cCI6MjA3NjYyMzM3Nn0.1JvxyVnDAkvCeWLbNysvpJsh5Iif3EjPL1kp1_4vnz0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)