"use client";

import type { ReactNode } from "react";
import { CircleHelp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const workoutTypes = [
  {
    code: "S",
    name: "Strength",
    description: "Lifting or a focused strength block. If yesterday was hard strength, the app only allows light strength today.",
  },
  {
    code: "A",
    name: "Aerobic",
    description: "Steady, low-stress cardio. This is the safest option when fatigue or recent hard work is high.",
  },
  {
    code: "H",
    name: "High intensity",
    description: "Intervals or conditioning. The app limits this quickly when you already have enough hard work in the week.",
  },
  {
    code: "T",
    name: "Tennis",
    description: "Racket time or a tennis-style session. After a hard day, the app treats tennis as an easier option when needed.",
  },
  {
    code: "R",
    name: "Rest",
    description: "A recovery day with no real training load.",
  },
];

const rules = [
  "High fatigue limits today to aerobic or rest.",
  "After a high-intensity day, the next day cannot be high intensity or strength.",
  "After hard strength, high intensity is blocked and strength stays light only.",
  "Two high-intensity sessions in the last seven days block another one.",
  "Two hard sessions across the last three days narrow today to aerobic or rest.",
  "If you have not lifted recently, strength gets bumped up in the ranking when it is still allowed.",
  "If you have not had a hard session recently, high intensity gets bumped up too, unless an earlier rule blocked it.",
];

type WorkoutInfoSheetProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
};

export function WorkoutInfoSheet({
  open,
  onOpenChange,
  trigger,
}: WorkoutInfoSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      ) : open === undefined && onOpenChange === undefined ? (
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open workout rules"
            className="rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <CircleHelp className="size-5" />
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Workout types and rules</DrawerTitle>
          <DrawerDescription>
            Daily Gym recommends the safest useful session for today based on the
            last seven days and your fatigue input.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-5 overflow-y-auto px-4 pb-2 sm:px-6">
          <section className="space-y-3">
            {workoutTypes.map((type) => (
              <div
                key={type.code}
                className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  {type.name}
                  <span className="ml-2 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    {type.code}
                  </span>
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {type.description}
                </p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
            <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              How recommendations work
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
