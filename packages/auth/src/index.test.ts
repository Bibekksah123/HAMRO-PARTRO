import { describe, expect, it } from "bun:test";
import { createBrowserAuthClient, hasSupabaseConfig } from "./index";

describe("Supabase auth configuration", () => {
  it("reports missing public auth configuration without requiring setup", () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const originalPublishable =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    expect(hasSupabaseConfig()).toBe(false);
    expect(() => createBrowserAuthClient()).toThrow(
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    if (originalUrl !== undefined)
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    if (originalAnon !== undefined)
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnon;
    if (originalPublishable !== undefined) {
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalPublishable;
    }
  });
});
