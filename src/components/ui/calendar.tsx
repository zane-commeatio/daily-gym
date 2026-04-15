"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type MonthCaptionProps, useDayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarMonthCaption({ calendarMonth, className, ...props }: MonthCaptionProps) {
  const {
    labels: { labelPrevious, labelNext },
    nextMonth,
    previousMonth,
    goToMonth,
  } = useDayPicker();

  const previousLabel = labelPrevious(previousMonth);
  const nextLabel = labelNext(nextMonth);

  return (
    <div className={cn("flex items-center justify-between gap-2 pt-1", className)} {...props}>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "size-8 rounded-lg p-0")}
        disabled={!previousMonth}
        aria-label={previousLabel}
        onClick={() => {
          if (previousMonth) {
            goToMonth(previousMonth);
          }
        }}
      >
        <ChevronLeft className="size-4" />
      </button>
      <span aria-live="polite" className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
        {format(calendarMonth.date, "MMMM yyyy")}
      </span>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "size-8 rounded-lg p-0")}
        disabled={!nextMonth}
        aria-label={nextLabel}
        onClick={() => {
          if (nextMonth) {
            goToMonth(nextMonth);
          }
        }}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

function Calendar({ className, classNames, components, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      hideNavigation
      showOutsideDays={showOutsideDays}
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        month_caption: "",
        caption_label: "",
        nav: "",
        button_previous: "",
        button_next: "",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-10 text-[0.8rem] font-medium text-zinc-500 dark:text-zinc-400",
        week: "mt-2 flex w-full",
        day: "relative size-10 p-0 text-center",
        day_button:
          "relative inline-flex size-10 appearance-none cursor-pointer items-center justify-center rounded-xl border-0 bg-transparent p-0 text-sm font-normal text-zinc-950 shadow-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:text-zinc-50 dark:focus-visible:ring-zinc-300",
        today: "text-zinc-950 dark:text-zinc-50",
        selected: "",
        outside:
          "text-zinc-400 opacity-50 aria-selected:bg-zinc-100/50 aria-selected:text-zinc-400 dark:text-zinc-600 dark:aria-selected:bg-zinc-800/50",
        disabled: "text-zinc-400 opacity-50 dark:text-zinc-600",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        MonthCaption: CalendarMonthCaption,
        Chevron: ({ className: iconClassName, orientation, ...iconProps }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;

          return <Icon className={cn("size-4", iconClassName)} {...iconProps} />;
        },
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
