import { createClient } from '@supabase/auth-helpers-sveltekit'
import { env } from '$env/dynamic/public'

env.PUBLIC_SUPABASE_URL="https://sryawqipfxjmnutudvuz.supabase.co"
env.PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyeWF3cWlwZnhqbW51dHVkdnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMyNDEyOTcsImV4cCI6MTk4ODgxNzI5N30.neKb86VB4i87DrNFRcCXtORP0q-RFjg1AOCIop10Jo8"

export const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);