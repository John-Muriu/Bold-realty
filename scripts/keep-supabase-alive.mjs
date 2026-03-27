import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Unsafe env detected: VITE_SUPABASE_SERVICE_ROLE_KEY must never be used. Use SUPABASE_SERVICE_ROLE_KEY only."
  );
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error("Missing SUPABASE_URL (or VITE_SUPABASE_URL)");
  process.exit(1);
}

const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
if (!key) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function keepAlive() {
  const { error } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .limit(1);

  if (error) {
    const detail = error.message || JSON.stringify(error);
    throw new Error(`Supabase ping failed: ${detail}`);
  }

  console.log("Supabase keep-alive ping successful");
}

keepAlive().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
