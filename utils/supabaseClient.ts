import { createClient } from '@supabase/supabase-js'

import { Database } from '@/types/supabase'

export default function supabaseClient(supabaseToken?: string) {
  const options = supabaseToken
    ? {
        global: { headers: { Authorization: `Bearer ${supabaseToken}` } },
        auth: { persistSession: false },
      }
    : { auth: { persistSession: false } }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  )

  return supabase
}
