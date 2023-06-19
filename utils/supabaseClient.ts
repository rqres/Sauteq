import { createClient } from '@supabase/supabase-js'

import { Database } from '@/types/supabase'

export default async function supabaseClient(supabaseToken?: string) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // { global: { headers: { Authorization: `Bearer ${supabaseToken}` } } }
  )

  return supabase
}
