import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL");
}

if (!supabaseKey) {
  throw new Error("Missing VITE_SUPABASE_PUBLISHABLE_KEY");
}

console.log("Supabase project:", new URL(supabaseUrl).hostname);
console.log("Supabase key prefix:", supabaseKey.slice(0, 15));
console.log("Supabase key length:", supabaseKey.length);

export const supabase = createClient(supabaseUrl, supabaseKey);