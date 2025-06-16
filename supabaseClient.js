import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vrppuzycycplutzgdkxh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycHB1enljeWNwbHV0emdka3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNTY4MTMsImV4cCI6MjA2NTYzMjgxM30.3AG2y7YIGYFV7oTqB_JI7qLTh1sJyFo68MAADkW3q-w"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)