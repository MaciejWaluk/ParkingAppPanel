interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_API_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
  readonly VITE_MAPBOX_ACCESS_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_RESEND_API_KEY: string
  readonly VITE_EXPRESSJS_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
