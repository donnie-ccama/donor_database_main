import { createBrowserClient } from '@supabase/ssr'

// Note: For production, generate types with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
// Until then, we use a flexible type approach

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
