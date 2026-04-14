"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SESSION_TYPES } from "@/lib/types";
import { getTodayIso, loadSessions } from "@/lib/storage";
import { hasSessionOnDate } from "@/lib/sessions";
import { useSessions } from "@/hooks/use-sessions";
import type { Session, SessionType } from "@/lib/types";

export default function LogPage() {
  const router = useRouter();
  const { saveSession, isSaving } = useSessions();
  const [date, setDate] = useState(() => getTodayIso());
  const [type, setType] = useState<SessionType>("A");
  const [intensity, setIntensity] = useState<"easy" | "hard" | "">("easy");

  const needsIntensity = type === "S" || type === "T";

  const handleSubmit = async () => {
    const session: Session = {
      date,
      type,
      intensity: needsIntensity && intensity ? intensity : undefined,
    };
    if (needsIntensity && !intensity) {
      window.alert("Choose easy or hard for this session type.");
      return;
    }
    const existing = loadSessions();
    if (hasSessionOnDate(existing, date)) {
      const ok = window.confirm(
        "You already logged this day. Replace that entry?",
      );
      if (!ok) return;
    }
    await saveSession(session);
    router.push("/today");
  };

  return (
    <main className="flex flex-1 flex-col gap-8">
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
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Type
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as SessionType);
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
                    setIntensity(i);
                  }}
                  className={`rounded-full px-4 py-2 text-sm ${
                    intensity === i
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
            void handleSubmit();
          }}
          className="mt-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </main>
  );
}
