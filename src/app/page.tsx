"use client";

import { HistorySheet } from "@/components/history-sheet";
import { SessionTypeOptionCardCompact } from "@/components/session-type-option-cards";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { WorkoutInfoSheet } from "@/components/workout-info-sheet";
import { useSessions } from "@/hooks/use-sessions";
import { buildHistory } from "@/lib/history";
import { labelForType } from "@/lib/labels";
import { recommend } from "@/lib/recommend";
import { hasSessionOnDate } from "@/lib/sessions";
import {
    getTodayIso,
    loadStartingPreference,
    pruneSessionsForFreeTier,
    saveStartingPreference,
    subscribeStartingPreference,
} from "@/lib/storage";
import type { SessionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Bike, Check, CircleHelp, Dumbbell, Flame, History, Menu, MoonStar } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { DayButton, type DayButtonProps } from "react-day-picker";
import { toast } from "sonner";

function LoggedDayButton({ className, children, modifiers, ...props }: DayButtonProps) {
  const isLogged = Boolean(modifiers.logged);
  const isSelected = Boolean(modifiers.selected);

  return (
    <DayButton
      className={cn(
        className,
        !isSelected &&
          !isLogged &&
          "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        isSelected &&
          "bg-zinc-900 text-white hover:bg-zinc-900 hover:text-white focus:bg-zinc-900 focus:text-white active:bg-zinc-900 active:text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 dark:focus:bg-zinc-100 dark:focus:text-zinc-900 dark:active:bg-zinc-100 dark:active:text-zinc-900",
        isLogged &&
          !isSelected &&
          "border border-emerald-200 bg-emerald-50 text-emerald-950 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-950/60",
      )}
      modifiers={modifiers}
      {...props}
    >
      {children}
      {isLogged ? (
        <Check
          className={cn(
            "pointer-events-none absolute right-1 top-1 size-3",
            isSelected ? "text-white dark:text-zinc-900" : "text-emerald-600 dark:text-emerald-300",
          )}
        />
      ) : null}
    </DayButton>
  );
}

const SESSION_TYPE_OPTIONS = [
  {
    type: "S" as const,
    title: labelForType("S"),
    info: "Lift or do a focused strength block.",
    icon: <Dumbbell className="size-5" />,
  },
  {
    type: "A" as const,
    title: labelForType("A"),
    info: "Steady, low-stress cardio work.",
    icon: <Bike className="size-5" />,
  },
  {
    type: "H" as const,
    title: labelForType("H"),
    info: "Short, hard intervals or conditioning.",
    icon: <Flame className="size-5" />,
  },
  {
    type: "R" as const,
    title: labelForType("R"),
    info: "Recovery day with no training load.",
    icon: <MoonStar className="size-5" />,
  },
];

export default function Home() {
  const { sessions, saveSession, isSaving } = useSessions();
  const [fatigue, setFatigue] = useState<"low" | "medium" | "high" | "unset">(
    "unset",
  );
  const starting = useSyncExternalStore(
    subscribeStartingPreference,
    loadStartingPreference,
    () => null,
  );
  const [logDate, setLogDate] = useState(() => getTodayIso());
  const [logType, setLogType] = useState<SessionType>("A");
  const [logIntensity, setLogIntensity] = useState<"easy" | "hard" | "">("easy");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const today = getTodayIso();
  const todayLabel = format(new Date(), "EEEE, MMM d");
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
  const loggedDates = useMemo(() => new Set(sessions.map((session) => session.date)), [sessions]);

  const needsIntensity = logType === "S";
  const selectedLogDate = useMemo(
    () => parse(logDate, "yyyy-MM-dd", new Date()),
    [logDate],
  );
  const [visibleMonth, setVisibleMonth] = useState(selectedLogDate);

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
    const nextLogDate = parse(getTodayIso(), "yyyy-MM-dd", new Date());
    setLogDate(format(nextLogDate, "yyyy-MM-dd"));
    setVisibleMonth(nextLogDate);
    setLogType("A");
    setLogIntensity("easy");
    toast.success("Session saved");
  };

  return (
    <>
      <WorkoutInfoSheet open={isHelpOpen} onOpenChange={setIsHelpOpen} />
      <HistorySheet
        historyRows={historyRows}
        todayIso={today}
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
      <main className="relative left-1/2 flex w-[min(calc(100vw-2rem),42rem)] flex-1 -translate-x-1/2 flex-col gap-8">
        <section className="flex flex-col gap-6">
          <header>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{todayLabel}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  <Menu className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    setIsHelpOpen(true);
                  }}
                >
                  <CircleHelp className="size-4" />
                  Help
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setIsHistoryOpen(true);
                  }}
                >
                  <History className="size-4" />
                  History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                      saveStartingPreference("S");
                    }}
                  >
                    Strength first
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
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
                  Recommended
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
        </section>

        <Separator />

        <section className="flex flex-col gap-5">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Log session</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            One entry per calendar day. Logging again asks before replacing.
          </p>
        </header>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                month={visibleMonth}
                onMonthChange={setVisibleMonth}
                selected={selectedLogDate}
                onSelect={(date) => {
                  if (!date) return;
                  setLogDate(format(date, "yyyy-MM-dd"));
                  setVisibleMonth(date);
                }}
                modifiers={{
                  logged: (date) => loggedDates.has(format(date, "yyyy-MM-dd")),
                }}
                components={{
                  DayButton: LoggedDayButton,
                }}
                className="w-fit"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
              {SESSION_TYPE_OPTIONS.map((option) => (
                <SessionTypeOptionCardCompact
                  key={option.type}
                  {...option}
                  selected={logType === option.type}
                  onSelect={setLogType}
                />
              ))}
            </div>
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
              {isSaving ? "Saving..." : "Save"}
            </Button>
        </div>
        </section>
      </main>
    </>
  );
}
