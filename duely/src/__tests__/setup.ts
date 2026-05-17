import "@testing-library/jest-dom";

// Stub Next.js server-only globals that don't exist in jsdom
(globalThis as Record<string, unknown>).EdgeRuntime = "test";
