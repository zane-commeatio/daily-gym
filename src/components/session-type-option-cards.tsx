import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SessionType } from "@/lib/types";
import { cn } from "@/lib/utils";

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
      className={cn("text-left", className)}
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
              "flex size-10 shrink-0 items-center justify-center rounded-xl border",
              selected
                ? "border-white/20 bg-white/10 dark:border-zinc-900/10 dark:bg-zinc-900/10"
                : "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
            )}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{title}</span>
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em]",
                  selected
                    ? "bg-white/10 text-white/80 dark:bg-zinc-900/10 dark:text-zinc-700"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
                )}
              >
                {type}
              </span>
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

export function SessionTypeOptionCardTile({
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
          "h-full transition-all",
          selected
            ? "border-emerald-500 bg-emerald-50 shadow-md dark:border-emerald-400 dark:bg-emerald-950/30"
            : "hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700",
        )}
      >
        <CardContent className="flex h-full flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl",
                selected
                  ? "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-zinc-950"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
              )}
            >
              {icon}
            </div>
            <div
              className={cn(
                "rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
                selected
                  ? "border-emerald-500/40 text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-300"
                  : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400",
              )}
            >
              {type}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-zinc-950 dark:text-zinc-50">{title}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{info}</p>
          </div>
        </CardContent>
      </Card>
    </OptionButton>
  );
}

export function SessionTypeOptionCardEditorial({
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
            ? "border-zinc-950 dark:border-zinc-50"
            : "hover:border-zinc-300 dark:hover:border-zinc-700",
        )}
      >
        <CardContent className="flex h-full items-start gap-4 p-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-zinc-950 dark:text-zinc-50">{title}</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                    {type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{info}</p>
              </div>
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border",
                  selected
                    ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                    : "border-zinc-200 text-transparent dark:border-zinc-800",
                )}
              >
                <Check className="size-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </OptionButton>
  );
}
