"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, isLoading, logout } = useAuth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:items-start sm:text-left">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Nest Auth Starter
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Sign up and log in with a NestJS API backed by PostgreSQL and JWT
            authentication.
          </p>
        </div>

        {!isLoading && user ? (
          <div className="w-full rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
            <p className="text-zinc-700 dark:text-zinc-300">
              Signed in as <span className="font-medium">{user.name}</span>
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Go to dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Log in
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
