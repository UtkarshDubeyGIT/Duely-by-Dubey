"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const signupSuccess = searchParams.get("signup") === "success";
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Confirmation banner */}
      {signupSuccess && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/40 px-4 py-3.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60">
            <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </span>
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Confirmation email sent!
            </p>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
              Please check your inbox and verify your email before logging in.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-indigo-600">Welcome back</p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-zinc-50">Log in</h1>
        </div>
        <form action={formAction} className="mt-6 space-y-4">
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
            <input
              name="email"
              type="email"
              defaultValue={isDemo ? "demo@duely.tech" : ""}
              placeholder="john@example.com"
              className="h-9 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
            <input
              name="password"
              type="password"
              defaultValue={isDemo ? "Duely@2025" : ""}
              placeholder="••••••••"
              className="h-9 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500"
            />
          </label>
          {state?.error ? (
            <p className="text-sm text-red-600">{state.error}</p>
          ) : null}
          <Button
            type="submit"
            variant="accent"
            className="w-full"
            disabled={pending}
          >
            {pending ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
          New here?{" "}
          <Link className="font-medium text-indigo-600" href="/signup">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-[400px] w-full max-w-sm animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />}>
      <LoginForm />
    </Suspense>
  );
}
