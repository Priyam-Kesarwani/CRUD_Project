"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { deleteProfile } from "@/lib/auth-api";

export default function Navigation() {
  const { user, logout, token } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return null;

  async function handleDelete() {
    if (!token) return;
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteProfile(token);
      logout();
      window.location.href = "/";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete account.");
    } finally {
      setIsDeleting(false);
      setIsProfileMenuOpen(false);
    }
  }

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Dashboard
            </Link>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-300 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span>{user.name}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-950"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
