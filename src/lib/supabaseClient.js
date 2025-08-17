import { createClient } from "@supabase/supabase-js";

const url =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL; // fallback if you only set NEXT_PUBLIC

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error("SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) is required");
}
if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
}

export const supabaseServer = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

