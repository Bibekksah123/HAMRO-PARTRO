import {
  createBrowserClient,
  createServerClient,
  type CookieMethodsServer,
  type CookieOptions,
} from "@supabase/ssr";

export type SupabaseCookieStore = {
  getAll: NonNullable<CookieMethodsServer["getAll"]>;
  set(name: string, value: string, options?: CookieOptions): void;
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to the environment to enable authentication.",
    );
  }
  return { url, key };
}

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

export function createBrowserAuthClient(url?: string, key?: string) {
  if (!url || !key) {
    throw new Error(
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to the environment to enable authentication.",
    );
  }
  return createBrowserClient(url, key);
}

export function createServerAuthClient(cookieStore: SupabaseCookieStore) {
  const { url, key } = supabaseConfig();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies; the Next.js proxy refreshes them.
        }
      },
    },
  });
}
