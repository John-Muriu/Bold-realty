import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const VITE_SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Unsafe env detected: VITE_SUPABASE_SERVICE_ROLE_KEY must never be used. Use SUPABASE_SERVICE_ROLE_KEY only."
  );
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error("Missing SUPABASE_URL (or VITE_SUPABASE_URL)");
  console.error("Env present:", {
    hasSUPABASE_URL: !!process.env.SUPABASE_URL,
    hasVITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasAnon: !!process.env.SUPABASE_ANON_KEY,
    hasVitePublishable: !!process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  });
  process.exit(1);
}

const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY || SUPABASE_PUBLISHABLE_KEY || VITE_SUPABASE_PUBLISHABLE_KEY;
if (!key) {
  console.error("Missing a Supabase key.");
  console.error(
    "Set one of: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PUBLISHABLE_KEY"
  );
  console.error("Env present:", {
    hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY,
    hasAnon: !!SUPABASE_ANON_KEY,
    hasPublishable: !!SUPABASE_PUBLISHABLE_KEY,
    hasVitePublishable: !!VITE_SUPABASE_PUBLISHABLE_KEY,
  });
  process.exit(1);
}

const candidates = [
  SUPABASE_SERVICE_ROLE_KEY
    ? { kind: "service_role", key: SUPABASE_SERVICE_ROLE_KEY }
    : null,
  SUPABASE_ANON_KEY ? { kind: "anon", key: SUPABASE_ANON_KEY } : null,
  SUPABASE_PUBLISHABLE_KEY
    ? { kind: "publishable", key: SUPABASE_PUBLISHABLE_KEY }
    : null,
  VITE_SUPABASE_PUBLISHABLE_KEY
    ? { kind: "vite_publishable", key: VITE_SUPABASE_PUBLISHABLE_KEY }
    : null,
].filter(Boolean);

async function pingWithKey(apiKey) {
  const supabase = createClient(SUPABASE_URL, apiKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Lightweight query; we avoid special options (`head`, `count`) so this is robust.
  const { error } = await supabase.from("properties").select("id").limit(1);

  if (error) {
    // Try an alternate table in case `properties` permissions/schema change.
    const { error: altError } = await supabase
      .from("testimonials")
      .select("id")
      .limit(1);

    if (altError) {
      const detail = error.message || JSON.stringify(error);
      const altDetail = altError.message || JSON.stringify(altError);
      return { ok: false, error: `properties: ${detail} | testimonials: ${altDetail}` };
    }
  }

  return { ok: true };
}

async function keepAlive() {
  let lastError = null;

  for (const candidate of candidates) {
    const result = await pingWithKey(candidate.key).catch((err) => ({
      ok: false,
      error: err?.message || String(err),
    }));

    if (result.ok) {
      console.log(`Supabase keep-alive ping successful (${candidate.kind})`);
      return;
    }

    const msg = String(result.error || "");
    lastError = result.error;

    // If the key is malformed/incorrect, try the next candidate (e.g. malformed service key).
    if (/Invalid API key/i.test(msg)) {
      console.error(`Supabase ping failed with ${candidate.kind}: Invalid API key (trying next key)`);
      continue;
    }

    // For other errors, fail fast (likely schema/RLS/network issues).
    throw new Error(`Supabase ping failed with ${candidate.kind}: ${msg}`);
  }

  throw new Error(`Supabase keep-alive failed for all keys. Last error: ${lastError}`);
}

keepAlive().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
