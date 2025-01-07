import { createClient } from '@supabase/supabase-js'
import { Database } from '../../database.types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_API_KEY, {
  auth: {
    storage: sessionStorage,
  },
})

export default supabase
