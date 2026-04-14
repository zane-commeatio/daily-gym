"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildHistory } from "@/lib/history";
import { recommend } from "@/lib/recommend";
import {
  getTodayIso,
  loadStartingPreference,
  saveStartingPreference,
} from "@/lib/storage";
import { useSessions } from "@/hooks/use-sessions";

export default function TodayPage() {
  const { sessions } = useSessions();
  const [fatigue, setFatigue] = useState<
    "low" | "medium" | "high" | "unset"
  >("unset");
  const [starting, setStarting] = useState<"S" | "A" | null>(() =>
    loadStartingPreference(),
  );

  const today = getTodayIso();
  const history = useMemo(
    () => buildHistory(sessions, today),
    [sessions, today],
  );

  const emptyNoPreference = history.length === 0 && !starting;

  const rec = useMemo(() => {
    const fatigueToday =
      fatigue === "unset"
        ? undefined
        : fatigue === "low" || fatigue === "medium" || fatigue === "high"
          ? fatigue
          : undefined;
    return recommend(history, today, fatigueToday, {
      isEmptyHistory: history.length === 0,
      startingPreference: starting ?? undefined,
    });
  }, [history, today, fatigue, starting]);

  return (
    <main className="flex flex-1 flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Based on your last seven days and how you feel.
        </p>
      </header>

      {emptyNoPreference ? (
        <section
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          aria-labelledby="empty-heading"
        >
          <h2 id="empty-heading" className="text-lg font-medium">
            Where do you want to start?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Pick a bias for your first recommendation. You can change this
            anytime by clearing history.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setStarting("S");
                saveStartingPreference("S");
              }}
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Strength first
            </button>
            <button
              type="button"
              onClick={() => {
                setStarting("A");
                saveStartingPreference("A");
              }}
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium dark:border-zinc-600"
            >
              Easy cardio first
            </button>
          </div>
        </section>
      ) : (
        <>
          <section
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            aria-labelledby="rec-heading"
          >
            <h2 id="rec-heading" className="sr-only">
              Recommendation
            </h2>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Today you should do
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              {rec.primaryLabel}
            </p>
            {rec.alternativeLabels.length > 0 && (
              <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Also ok
                </p>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                  {rec.alternativeLabels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section aria-labelledby="fatigue-heading">
            <h2
              id="fatigue-heading"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              How tired are you today?
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Optional — high fatigue limits today&apos;s options only.
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="group"
              aria-label="Fatigue level"
            >
              {(
                [
                  { key: "unset", label: "Not set" },
                  { key: "low", label: "Low" },
                  { key: "medium", label: "Medium" },
                  { key: "high", label: "High" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setFatigue(opt.key);
                  }}
                  className={`rounded-full px-4 py-2 text-sm ${
                    fatigue === opt.key
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      <Link
        href="/log"
        className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-center text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Log session
      </Link>
    </main>
  );
}
