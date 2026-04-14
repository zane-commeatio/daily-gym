"use client";

import { useMemo } from "react";
import { useSessions } from "@/hooks/use-sessions";
import { getTodayIso, pruneSessionsForFreeTier } from "@/lib/storage";
import { labelForType } from "@/lib/labels";
import { classify } from "@/lib/classify";

export default function HistoryPage() {
  const { sessions } = useSessions();
  const today = getTodayIso();

  const rows = useMemo(() => {
    const pruned = pruneSessionsForFreeTier(sessions, today);
    return [...pruned].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [sessions, today]);

  return (
    <main className="flex flex-1 flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Last 14 days on this device, newest first.
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">No sessions yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {rows.map((s) => {
            const tennisEasy = s.type === "T" && classify(s) === "easy";
            const label = labelForType(s.type, { tennisEasy });
            const extra =
              s.type === "S" || s.type === "T"
                ? s.intensity
                  ? ` · ${s.intensity}`
                  : ""
                : "";
            return (
              <li
                key={s.date}
                className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-zinc-950 dark:text-zinc-50">
                  {s.date}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {label}
                  {extra}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
