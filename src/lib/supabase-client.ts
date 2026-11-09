import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClientBrowser() {
  if (typeof window === "undefined") {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabaseUrlPublic = supabaseUrl;
export const supabaseAnonKeyPublic = supabaseAnonKey;
