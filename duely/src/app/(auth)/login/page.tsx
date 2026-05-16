"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
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
            className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
          <input
            name="password"
            type="password"
            defaultValue={isDemo ? "Duely@2025" : ""}
            placeholder="••••••••"
            className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500"
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
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-[400px] w-full max-w-sm animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />}>
      <LoginForm />
    </Suspense>
  );
}
