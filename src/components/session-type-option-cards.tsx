import { Card, CardContent } from "@/components/ui/card";
import type { SessionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SessionTypeOptionCardProps = {
  type: SessionType;
  title: string;
  info: string;
  icon: ReactNode;
  selected: boolean;
  onSelect: (type: SessionType) => void;
};

function OptionButton({
  type,
  selected,
  onSelect,
  className,
  children,
}: {
  type: SessionType;
  selected: boolean;
  onSelect: (type: SessionType) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => {
        onSelect(type);
      }}
      className={cn("text-left cursor-pointer", className)}
    >
      {children}
    </button>
  );
}

export function SessionTypeOptionCardCompact({
  type,
  title,
  info,
  icon,
  selected,
  onSelect,
}: SessionTypeOptionCardProps) {
  return (
    <OptionButton type={type} selected={selected} onSelect={onSelect} className="w-full">
      <Card
        className={cn(
          "h-full transition-colors",
          selected
            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
            : "hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-950",
        )}
      >
        <CardContent className="flex items-center gap-3 p-4">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
              selected
                ? "border-white/20 bg-white/10 text-white dark:border-zinc-900/10 dark:bg-zinc-900/10 dark:text-zinc-900"
                : "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
            )}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`${selected ? "font-bold" : ""}`}>{title}</span>
            </div>
            <p
              className={cn(
                "mt-1 text-sm",
                selected ? "text-white/80 dark:text-zinc-700" : "text-zinc-500 dark:text-zinc-400",
              )}
            >
              {info}
            </p>
          </div>
        </CardContent>
      </Card>
    </OptionButton>
  );
}
