"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, null);

  return (
    <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-indigo-600">Start collecting faster</p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-zinc-50">Create your account</h1>
      </div>
      <form action={formAction} className="mt-6 space-y-4">
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Business name
          <input name="business_name" defaultValue="Dubey Studio" className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Full name
          <input name="full_name" defaultValue="Siddhant Dubey" className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
          <input name="email" type="email" defaultValue="demo@duely.tech" className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
          <input name="password" type="password" defaultValue="Duely@2025" className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500" />
        </label>
        {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <Button type="submit" variant="accent" className="w-full" disabled={pending}>
          {pending ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account? <Link className="font-medium text-indigo-600" href="/login">Log in</Link>
      </p>
    </div>
  );
}
