"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ConfirmedPage() {
  const router = useRouter();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      router.push("/dashboard");
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
        {/* Success icon */}
        <div className="mb-6 flex justify-center">
          <CheckCircle2
            className="text-green-500"
            style={{ width: 64, height: 64 }}
            strokeWidth={1.75}
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-zinc-950">Email confirmed!</h1>

        {/* Subtext */}
        <p className="mt-2 text-sm text-zinc-400">
          You&apos;re all set. Taking you to your dashboard...
        </p>

        {/* Countdown */}
        <p className="mt-6 text-sm font-medium text-zinc-500">
          {count > 0 ? (
            <>
              Redirecting in{" "}
              <span className="font-semibold text-indigo-600">{count}...</span>
            </>
          ) : (
            <span className="text-indigo-600">Redirecting now...</span>
          )}
        </p>

        {/* Manual link */}
        <div className="mt-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Go to dashboard now →
          </Link>
        </div>
      </div>
    </div>
  );
}
