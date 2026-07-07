"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteProfile, updateProfile } from "@/lib/auth-api";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isLoading, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setIsEditing(false);
    setMessage(null);
  }

  async function handleSave() {
    if (!token) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const updatedUser = await updateProfile(token, { name, email });
      setMessage("Profile updated successfully.");
      setIsEditing(false);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      if (updatedUser) {
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!token) return;
    const confirmed = window.confirm("Delete this account and its row permanently?");
    if (!confirmed) return;

    setIsDeleting(true);
    setMessage(null);

    try {
      await deleteProfile(token);
      logout();
      router.replace("/login");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete profile.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You are signed in as <span className="font-medium">{user.name}</span>.
        </p>

        <div className="mt-6 space-y-4 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
          {isEditing ? (
            <>
              <label className="block">
                <span className="mb-1 block text-zinc-500">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-zinc-500">Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>
            </>
          ) : (
            <>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Name</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Email</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-100">{user.email}</dd>
              </div>
            </>
          )}
        </div>

        {message ? (
          <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</p>
        ) : null}

        <dl className="mt-6 space-y-3 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">User ID</dt>
            <dd className="font-mono text-xs text-zinc-900 dark:text-zinc-100">{user.id}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Edit
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg border border-rose-300 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-950"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Log out
          </button>

          <Link
            href="/"
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
