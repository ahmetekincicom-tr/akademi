import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymvlcptjgsumurfmjuxp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltdmxjcHRqZ3N1bXVyZm1qdXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODg1MTQsImV4cCI6MjA4OTM2NDUxNH0.gchCWOqMjoWOR8sChpouO8z6etlNCH_cFhnxy6_nl7U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
