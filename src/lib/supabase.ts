import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY

const hasValidConfig =
  Boolean(supabaseUrl) &&
  Boolean(supabaseKey) &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('placeholder') &&
  supabaseKey !== 'your-publishable-or-anon-key' &&
  supabaseKey !== 'placeholder-key'

if (!hasValidConfig) {
  console.error(
    'Supabase env vars are missing or still placeholders. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your host (Vercel/Netlify), then redeploy.',
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
)

export function assertSupabaseConfigured() {
  if (!hasValidConfig) {
    throw new Error(
      'App is not connected to Supabase. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your deploy settings, then redeploy.',
    )
  }
}
