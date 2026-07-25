import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

// Note: This client uses the service role key and bypasses Row Level Security (RLS).
// NEVER use this client on the frontend or pass it to the client side.
// Only use it in server-side functions where administrative privileges are required.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
      }
    }
  );
}
