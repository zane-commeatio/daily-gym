"use client";

import { useMemo, useState } from "react";
import { buildHistory } from "@/lib/history";
import { recommend } from "@/lib/recommend";
import {
  getTodayIso,
  loadStartingPreference,
  saveStartingPreference,
  pruneSessionsForFreeTier,
} from "@/lib/storage";
import { useSessions } from "@/hooks/use-sessions";
import { labelForType } from "@/lib/labels";
import { classify } from "@/lib/classify";
import { hasSessionOnDate } from "@/lib/sessions";
import type { SessionType } from "@/lib/types";
import { SESSION_TYPES } from "@/lib/types";

type View = "today" | "log" | "history";

export default function Home() {
  const { sessions, saveSession, isSaving } = useSessions();
  const [view, setView] = useState<View>("today");
  const [fatigue, setFatigue] = useState<"low" | "medium" | "high" | "unset">(
    "unset",
  );
  const [starting, setStarting] = useState<"S" | "A" | null>(() =>
    loadStartingPreference(),
  );
  const [logDate, setLogDate] = useState(() => getTodayIso());
  const [logType, setLogType] = useState<SessionType>("A");
  const [logIntensity, setLogIntensity] = useState<"easy" | "hard" | "">("easy");

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

  const historyRows = useMemo(() => {
    const pruned = pruneSessionsForFreeTier(sessions, today);
    return [...pruned].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [sessions, today]);

  const needsIntensity = logType === "S" || logType === "T";

  const handleLogSubmit = async () => {
    if (needsIntensity && !logIntensity) {
      window.alert("Choose easy or hard for this session type.");
      return;
    }
    const session = {
      date: logDate,
      type: logType,
      intensity: needsIntensity && logIntensity ? logIntensity : undefined,
    };
    if (hasSessionOnDate(sessions, logDate)) {
      const ok = window.confirm(
        "You already logged this day. Replace that entry?",
      );
      if (!ok) return;
    }
    await saveSession(session);
    setLogDate(getTodayIso());
    setLogType("A");
    setLogIntensity("easy");
    setView("history");
  };

  return (
    <main className="flex flex-1 flex-col gap-8">
      <div className="flex gap-1 border-b border-zinc-200 pb-px dark:border-zinc-800">
        {(
          [
            { key: "today", label: "Today" },
            { key: "log", label: "Log" },
            { key: "history", label: "History" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setView(tab.key)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              view === tab.key
                ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "today" && (
        <>
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
        </>
      )}

      {view === "log" && (
        <>
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">Log session</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              One entry per calendar day. Logging again asks before replacing.
            </p>
          </header>

          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Date
              <input
                type="date"
                value={logDate}
                onChange={(e) => {
                  setLogDate(e.target.value);
                }}
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium">
              Type
              <select
                value={logType}
                onChange={(e) => {
                  setLogType(e.target.value as SessionType);
                }}
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              >
                {SESSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === "S"
                      ? "Strength"
                      : t === "A"
                        ? "Aerobic (easy)"
                        : t === "H"
                          ? "High intensity"
                          : t === "T"
                            ? "Tennis"
                            : "Rest"}
                  </option>
                ))}
              </select>
            </label>

            {needsIntensity && (
              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium">Intensity</legend>
                <div className="flex gap-2">
                  {(["easy", "hard"] as const).map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setLogIntensity(i);
                      }}
                      className={`rounded-full px-4 py-2 text-sm ${
                        logIntensity === i
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                          : "bg-zinc-100 dark:bg-zinc-800"
                      }`}
                    >
                      {i === "easy" ? "Easy" : "Hard"}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                void handleLogSubmit();
              }}
              className="mt-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </>
      )}

      {view === "history" && (
        <>
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">History</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Last 14 days on this device, newest first.
            </p>
          </header>

          {historyRows.length === 0 ? (
            <p className="text-sm text-zinc-500">No sessions yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {historyRows.map((s) => {
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
        </>
      )}
    </main>
  );
}
