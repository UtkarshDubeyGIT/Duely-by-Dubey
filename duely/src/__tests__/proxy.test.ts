/**
 * @file proxy.test.ts
 * @description Unit tests for the authentication proxy / middleware in src/proxy.ts
 *
 * The proxy function:
 *  1. Allows public routes without authentication
 *  2. Redirects unauthenticated users hitting protected routes to /login
 *  3. Redirects authenticated users away from /login and /signup to /dashboard
 *  4. Passes through API routes regardless of auth state
 *  5. Passes through when Supabase is not configured
 *
 * Strategy:
 *  - Mock @supabase/ssr and the env helpers so tests are fully in-process.
 *  - Construct minimal NextRequest objects manually (no need for full HTTP server).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ---- Mocks must be declared before importing the module under test --------

vi.mock("@/lib/env", () => ({
  getSupabaseUrl: vi.fn(() => "https://test.supabase.co"),
  getSupabaseAnonKey: vi.fn(() => "test-anon-key"),
}));

// We will control getUserResult per test
let getUserResult: { data: { user: object | null }; error: null } = {
  data: { user: null },
  error: null,
};

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve(getUserResult)),
    },
  })),
}));

// --------------------------------------------------------------------------

import { proxy } from "@/proxy";
import * as envModule from "@/lib/env";

function makeRequest(pathname: string): NextRequest {
  return new NextRequest(`http://localhost:3000${pathname}`);
}

describe("proxy() — public routes (no auth required)", () => {
  beforeEach(() => {
    getUserResult = { data: { user: null }, error: null };
  });

  const publicPaths = ["/", "/login", "/signup", "/features", "/how-to-use", "/future-upgrades"];

  for (const path of publicPaths) {
    it(`allows unauthenticated access to ${path}`, async () => {
      const req = makeRequest(path);
      const res = await proxy(req);
      // Should NOT redirect (status 307/302)
      expect(res.status).not.toBe(307);
      expect(res.status).not.toBe(302);
    });
  }

  it("allows unauthenticated access to sub-paths of /features", async () => {
    const req = makeRequest("/features/something");
    const res = await proxy(req);
    expect(res.status).not.toBe(307);
  });
});

describe("proxy() — protected routes (redirect to /login when unauthenticated)", () => {
  beforeEach(() => {
    getUserResult = { data: { user: null }, error: null };
  });

  const protectedPaths = ["/dashboard", "/invoices", "/clients", "/settings"];

  for (const path of protectedPaths) {
    it(`redirects unauthenticated user from ${path} to /login`, async () => {
      const req = makeRequest(path);
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/login");
    });
  }
});

describe("proxy() — API routes bypass authentication check", () => {
  beforeEach(() => {
    getUserResult = { data: { user: null }, error: null };
  });

  it("passes through /api/invoices without redirect", async () => {
    const req = makeRequest("/api/invoices");
    const res = await proxy(req);
    expect(res.status).not.toBe(307);
    expect(res.status).not.toBe(302);
  });

  it("passes through /api/clients without redirect", async () => {
    const req = makeRequest("/api/clients");
    const res = await proxy(req);
    expect(res.status).not.toBe(307);
  });
});

describe("proxy() — authenticated user redirects", () => {
  beforeEach(() => {
    getUserResult = { data: { user: { id: "user-123", email: "test@example.com" } }, error: null };
  });

  it("redirects authenticated user from /login to /dashboard", async () => {
    const req = makeRequest("/login");
    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/dashboard");
  });

  it("redirects authenticated user from /signup to /dashboard", async () => {
    const req = makeRequest("/signup");
    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/dashboard");
  });

  it("passes authenticated user through to /dashboard", async () => {
    const req = makeRequest("/dashboard");
    const res = await proxy(req);
    expect(res.status).not.toBe(307);
  });
});

describe("proxy() — unconfigured Supabase (fallback mode)", () => {
  it("passes all requests through when Supabase is not configured", async () => {
    // Temporarily make env helpers return empty strings
    vi.mocked(envModule.getSupabaseUrl).mockReturnValueOnce("");
    vi.mocked(envModule.getSupabaseAnonKey).mockReturnValueOnce("");

    const req = makeRequest("/dashboard");
    const res = await proxy(req);
    // Should not redirect — graceful degradation
    expect(res.status).not.toBe(307);
    expect(res.status).not.toBe(302);
  });
});
