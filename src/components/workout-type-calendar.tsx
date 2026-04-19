"use client";

import { Calendar } from "@/components/ui/calendar";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { createContext, useContext, useMemo } from "react";
import { DayButton, type DayButtonProps } from "react-day-picker";

type WorkoutCalendarVariant = "band" | "badge" | "split" | "dot" | "tile";

type WorkoutTypeCalendarProps = {
  month: Date;
  onMonthChange: (month: Date) => void;
  selected: Date;
  onSelect: (date: Date | undefined) => void;
  sessionsByDate: Map<string, Session>;
  variant: WorkoutCalendarVariant;
  className?: string;
};

type WorkoutCalendarVariantOption = {
  value: WorkoutCalendarVariant;
  title: string;
  note: string;
};

type WorkoutContextValue = {
  sessionsByDate: Map<string, Session>;
};

const WorkoutCalendarContext = createContext<WorkoutContextValue | null>(null);

export const WORKOUT_CALENDAR_VARIANTS: WorkoutCalendarVariantOption[] = [
  { value: "band", title: "Band", note: "Bottom label strip" },
  { value: "badge", title: "Badge", note: "Floating type chip" },
  { value: "split", title: "Split", note: "Two-part tile" },
  { value: "dot", title: "Dot", note: "Small dot and label" },
  { value: "tile", title: "Tile", note: "Full colored tile" },
];

function useWorkoutSession(day: Date): Session | undefined {
  const context = useContext(WorkoutCalendarContext);

  if (!context) {
    throw new Error("WorkoutTypeCalendar day buttons must render inside WorkoutTypeCalendar.");
  }

  return context.sessionsByDate.get(format(day, "yyyy-MM-dd"));
}

function typeLabel(session: Session): string {
  if (session.type === "S") {
    return session.intensity === "hard" ? "STR+" : "STR";
  }

  if (session.type === "A") return "CARD";
  if (session.type === "H") return "HIIT";
  return "REST";
}

function typeTitle(session: Session): string {
  if (session.type === "S") {
    return session.intensity === "hard" ? "Strength hard" : "Strength easy";
  }

  if (session.type === "A") return "Easy cardio";
  if (session.type === "H") return "High intensity";
  return "Rest";
}

function typeClasses(session: Session): {
  tint: string;
  strong: string;
  text: string;
  dot: string;
  border: string;
} {
  if (session.type === "S") {
    return {
      tint: "bg-sky-50 text-sky-950 dark:bg-sky-950/35 dark:text-sky-100",
      strong: "bg-sky-600 text-white dark:bg-sky-300 dark:text-sky-950",
      text: "text-sky-700 dark:text-sky-200",
      dot: "bg-sky-500 dark:bg-sky-300",
      border: "border-sky-200 dark:border-sky-800/80",
    };
  }

  if (session.type === "A") {
    return {
      tint: "bg-emerald-50 text-emerald-950 dark:bg-emerald-950/35 dark:text-emerald-100",
      strong: "bg-emerald-600 text-white dark:bg-emerald-300 dark:text-emerald-950",
      text: "text-emerald-700 dark:text-emerald-200",
      dot: "bg-emerald-500 dark:bg-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800/80",
    };
  }

  if (session.type === "H") {
    return {
      tint: "bg-orange-50 text-orange-950 dark:bg-orange-950/35 dark:text-orange-100",
      strong: "bg-orange-500 text-white dark:bg-orange-300 dark:text-orange-950",
      text: "text-orange-700 dark:text-orange-200",
      dot: "bg-orange-500 dark:bg-orange-300",
      border: "border-orange-200 dark:border-orange-800/80",
    };
  }

  return {
    tint: "bg-violet-50 text-violet-950 dark:bg-violet-950/35 dark:text-violet-100",
    strong: "bg-violet-600 text-white dark:bg-violet-300 dark:text-violet-950",
    text: "text-violet-700 dark:text-violet-200",
    dot: "bg-violet-500 dark:bg-violet-300",
    border: "border-violet-200 dark:border-violet-800/80",
  };
}

type BaseDayButtonProps = DayButtonProps & {
  renderWorkout: (session: Session, label: string, classes: ReturnType<typeof typeClasses>) => React.ReactNode;
};

function BaseWorkoutDayButton({
  className,
  children,
  day,
  modifiers,
  renderWorkout,
  ...props
}: BaseDayButtonProps) {
  const session = useWorkoutSession(day.date);
  const isOutside = Boolean(modifiers.outside);
  const isSelected = Boolean(modifiers.selected);
  const isToday = Boolean(modifiers.today);
  const classes = session ? typeClasses(session) : null;
  const label = session ? typeLabel(session) : null;

  return (
    <DayButton
      className={cn(
        "group relative flex h-11 w-11 flex-col items-center justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white px-0.5 pt-1.5 pb-0.5 text-zinc-950 shadow-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus-visible:ring-zinc-300",
        !isOutside && !isSelected && !session && "hover:bg-zinc-100 dark:hover:bg-zinc-800",
        isSelected && "ring-2 ring-zinc-950 ring-offset-1 dark:ring-zinc-100",
        isSelected && !session && "bg-zinc-100 dark:bg-zinc-800",
        isToday && !isSelected && "border-zinc-400 dark:border-zinc-500",
        session && classes?.border,
        session && classes?.tint,
        isOutside && "opacity-45",
        className,
      )}
      aria-label={session ? `${props["aria-label"] ?? day.date.toDateString()}, ${typeTitle(session)}` : props["aria-label"]}
      day={day}
      modifiers={modifiers}
      {...props}
    >
      <span className={cn("text-xs font-semibold leading-none", isOutside && "text-zinc-400 dark:text-zinc-600")}>
        {children}
      </span>
      {session && label && classes ? renderWorkout(session, label, classes) : <span className="h-3.5" aria-hidden="true" />}
    </DayButton>
  );
}

function WorkoutDayButtonBand(props: DayButtonProps) {
  return (
    <BaseWorkoutDayButton
      {...props}
      renderWorkout={(_session, label, classes) => (
        <span className={cn("w-full rounded-md px-0.5 py-px text-center text-[8px] leading-none font-semibold tracking-[0.08em] uppercase", classes.strong)}>
          {label}
        </span>
      )}
    />
  );
}

function WorkoutDayButtonBadge(props: DayButtonProps) {
  return (
    <BaseWorkoutDayButton
      {...props}
      renderWorkout={(_session, label, classes) => (
        <span className={cn("rounded-full border border-white/70 px-1 py-px text-[8px] leading-none font-semibold uppercase shadow-sm dark:border-zinc-950/30", classes.strong)}>
          {label}
        </span>
      )}
    />
  );
}

function WorkoutDayButtonSplit(props: DayButtonProps) {
  return (
    <BaseWorkoutDayButton
      {...props}
      renderWorkout={(_session, label, classes) => (
        <span className={cn("flex w-full flex-1 items-end justify-end rounded-lg px-1 py-0.5 text-[8px] leading-none font-semibold uppercase", classes.strong)}>
          {label}
        </span>
      )}
    />
  );
}

function WorkoutDayButtonDot(props: DayButtonProps) {
  return (
    <BaseWorkoutDayButton
      {...props}
      renderWorkout={(_session, label, classes) => (
        <span className={cn("inline-flex items-center gap-1 rounded-full px-0.5 py-px text-[8px] leading-none font-medium uppercase", classes.text)}>
          <span className={cn("size-1.5 rounded-full", classes.dot)} />
          {label}
        </span>
      )}
    />
  );
}

function WorkoutDayButtonTile(props: DayButtonProps) {
  return (
    <BaseWorkoutDayButton
      {...props}
      renderWorkout={(_session, label, classes) => (
        <span className={cn("flex w-full flex-1 items-center justify-center rounded-lg text-[8px] leading-none font-semibold uppercase", classes.text)}>
          {label}
        </span>
      )}
    />
  );
}

function componentForVariant(variant: WorkoutCalendarVariant) {
  if (variant === "band") return WorkoutDayButtonBand;
  if (variant === "badge") return WorkoutDayButtonBadge;
  if (variant === "split") return WorkoutDayButtonSplit;
  if (variant === "dot") return WorkoutDayButtonDot;
  return WorkoutDayButtonTile;
}

export function WorkoutTypeCalendar({
  className,
  month,
  onMonthChange,
  onSelect,
  selected,
  sessionsByDate,
  variant,
}: WorkoutTypeCalendarProps) {
  const DayButtonComponent = useMemo(() => componentForVariant(variant), [variant]);

  return (
    <WorkoutCalendarContext.Provider value={{ sessionsByDate }}>
      <Calendar
        mode="single"
        month={month}
        onMonthChange={onMonthChange}
        selected={selected}
        onSelect={onSelect}
        className={cn("w-fit", className)}
        classNames={{
          weekday: "w-11 text-center text-[0.7rem] font-medium text-zinc-500 dark:text-zinc-400",
          week: "mt-2 flex w-full gap-1",
          day: "relative h-11 w-11 p-0 text-center",
          day_button: "h-11 w-11",
        }}
        components={{
          DayButton: DayButtonComponent,
        }}
      />
    </WorkoutCalendarContext.Provider>
  );
}
