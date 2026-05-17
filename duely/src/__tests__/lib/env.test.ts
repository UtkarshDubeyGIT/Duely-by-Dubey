/**
 * @file lib/env.test.ts
 * @description Unit tests for environment variable helper functions in src/lib/env.ts
 *
 * Tests cover:
 *  - getSupabaseUrl()      — reads NEXT_PUBLIC_SUPABASE_URL
 *  - getSupabaseAnonKey()  — reads anon key (primary + fallback env var)
 *  - isSupabaseConfigured()— boolean gate for configured state
 *  - isResendConfigured()  — boolean gate for Resend API key
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured, isResendConfigured } from "@/lib/env";

// We need to re-import the module after manipulating env vars.
// Vitest's resetModules() approach is cleanest here.
const setEnv = (key: string, value: string | undefined) => {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
};

describe("getSupabaseUrl()", () => {
  afterEach(() => {
    setEnv("NEXT_PUBLIC_SUPABASE_URL", undefined);
  });

  it("returns the URL when env var is set", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abc.supabase.co");
    expect(getSupabaseUrl()).toBe("https://abc.supabase.co");
  });

  it('returns empty string when env var is missing', () => {
    setEnv("NEXT_PUBLIC_SUPABASE_URL", undefined);
    expect(getSupabaseUrl()).toBe("");
  });

  it("trims whitespace from the URL", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_URL", "  https://abc.supabase.co  ");
    expect(getSupabaseUrl()).toBe("https://abc.supabase.co");
  });
});

describe("getSupabaseAnonKey()", () => {
  afterEach(() => {
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", undefined);
    setEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", undefined);
  });

  it("reads the primary ANON_KEY env var", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-123");
    expect(getSupabaseAnonKey()).toBe("anon-key-123");
  });

  it("falls back to PUBLISHABLE_KEY when ANON_KEY is not set", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", undefined);
    setEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "pub-key-456");
    expect(getSupabaseAnonKey()).toBe("pub-key-456");
  });

  it("returns empty string when neither key is set", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", undefined);
    setEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", undefined);
    expect(getSupabaseAnonKey()).toBe("");
  });

  it("trims whitespace from keys", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "  key-with-spaces  ");
    expect(getSupabaseAnonKey()).toBe("key-with-spaces");
  });
});

describe("isSupabaseConfigured()", () => {
  afterEach(() => {
    setEnv("NEXT_PUBLIC_SUPABASE_URL", undefined);
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", undefined);
  });

  it("returns true when both URL and key are present", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abc.supabase.co");
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "key-123");
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("returns false when URL is missing", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_URL", undefined);
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "key-123");
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("returns false when key is missing", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abc.supabase.co");
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", undefined);
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("returns false when both are missing", () => {
    setEnv("NEXT_PUBLIC_SUPABASE_URL", undefined);
    setEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", undefined);
    expect(isSupabaseConfigured()).toBe(false);
  });
});

describe("isResendConfigured()", () => {
  afterEach(() => {
    setEnv("RESEND_API_KEY", undefined);
  });

  it("returns true when RESEND_API_KEY is set", () => {
    setEnv("RESEND_API_KEY", "re_abc123");
    expect(isResendConfigured()).toBe(true);
  });

  it("returns false when RESEND_API_KEY is missing", () => {
    setEnv("RESEND_API_KEY", undefined);
    expect(isResendConfigured()).toBe(false);
  });

  it("returns false when RESEND_API_KEY is empty string after trim", () => {
    setEnv("RESEND_API_KEY", "   ");
    expect(isResendConfigured()).toBe(false);
  });
});
