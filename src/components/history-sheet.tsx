"use client";

import { format, parse } from "date-fns";
import type { ReactNode } from "react";
import { calendarDaysBetween } from "@/lib/dates";
import { labelForType } from "@/lib/labels";
import type { Session } from "@/lib/types";
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

type HistorySheetProps = {
  historyRows: Session[];
  todayIso: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
};

export function HistorySheet({
  historyRows,
  todayIso,
  open,
  onOpenChange,
  trigger,
}: HistorySheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>History</DrawerTitle>
          <DrawerDescription>
            Last 14 days on this device, newest first.
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-2 sm:px-6">
          {historyRows.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No sessions yet.</p>
          ) : (
              <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {historyRows.map((s) => {
                const label = labelForType(s.type);
                const daysAgo = calendarDaysBetween(s.date, todayIso);
                const formattedDate = format(
                  parse(s.date, "yyyy-MM-dd", new Date()),
                  "EEEE, MMM d",
                );
                const relativeLabel =
                  daysAgo === 0
                    ? "Today"
                    : daysAgo === 1
                      ? "1 day ago"
                      : `${daysAgo} days ago`;
                const extra =
                  s.type === "S"
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
                      {formattedDate}
                      <span className="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">
                        ({relativeLabel})
                      </span>
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
