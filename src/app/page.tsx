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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
      <Tabs value={view} onValueChange={(v) => setView(v as View)}>
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Based on your last seven days and how you feel.
            </p>
          </header>

          {emptyNoPreference ? (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium">Where do you want to start?</h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Pick a bias for your first recommendation. You can change this
                  anytime by clearing history.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={() => {
                      setStarting("S");
                      saveStartingPreference("S");
                    }}
                  >
                    Strength first
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStarting("A");
                      saveStartingPreference("A");
                    }}
                  >
                    Easy cardio first
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Today you should do
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {rec.primaryLabel}
                  </p>
                  {rec.alternativeLabels.length > 0 && (
                    <div className="mt-6">
                      <Separator />
                      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Also ok
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                        {rec.alternativeLabels.map((label) => (
                          <li key={label}>{label}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div>
                <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  How tired are you today?
                </h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Optional — high fatigue limits today&apos;s options only.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(
                    [
                      { key: "unset", label: "Not set" },
                      { key: "low", label: "Low" },
                      { key: "medium", label: "Medium" },
                      { key: "high", label: "High" },
                    ] as const
                  ).map((opt) => (
                    <Button
                      key={opt.key}
                      variant={fatigue === opt.key ? "default" : "secondary"}
                      size="sm"
                      onClick={() => {
                        setFatigue(opt.key);
                      }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="log">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">Log session</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              One entry per calendar day. Logging again asks before replacing.
            </p>
          </header>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={logDate}
                onChange={(e) => {
                  setLogDate(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={logType}
                onValueChange={(v) => {
                  setLogType(v as SessionType);
                }}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "S"
                        ? "Strength"
                        : t === "A"
                          ? "Aerobic (easy)"
                          : t === "H"
                            ? "High intensity"
                            : t === "T"
                              ? "Tennis"
                              : "Rest"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {needsIntensity && (
              <div className="flex flex-col gap-2">
                <Label>Intensity</Label>
                <div className="flex gap-2">
                  {(["easy", "hard"] as const).map((i) => (
                    <Button
                      key={i}
                      variant={logIntensity === i ? "default" : "secondary"}
                      size="sm"
                      onClick={() => {
                        setLogIntensity(i);
                      }}
                    >
                      {i === "easy" ? "Easy" : "Hard"}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="mt-2"
              disabled={isSaving}
              onClick={() => {
                void handleLogSubmit();
              }}
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history">
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
        </TabsContent>
      </Tabs>
    </main>
  );
}
