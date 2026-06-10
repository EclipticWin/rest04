import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://lpdijndoqijhhkwicwoy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZGlqbmRvcWlqaGhrd2ljd295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNjYyOTksImV4cCI6MjA5NjY0MjI5OX0.qs_v8g-kUj5_2y_PBskXfFzov7YuMEa1U43-28P7vR0'
)
