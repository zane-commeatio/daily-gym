"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upsertSession } from "@/lib/sessions";
import {
  loadSessions,
  normalizeSessions,
  saveSessions,
  getTodayIso,
  pruneSessionsForFreeTier,
  STORAGE_KEY_SESSIONS,
} from "@/lib/storage";
import type { Session } from "@/lib/types";

export const SESSIONS_QUERY_KEY = ["sessions"] as const;

/**
 * Read/write sessions from localStorage via TanStack Query.
 *
 * Reads are cached by query key; the mutation writes directly to localStorage
 * (loadSessions inside mutateFn) then updates the cache optimistically via
 * setQueryData. This avoids stale-closure issues with the query cache when
 * multiple tabs are open — the mutation always reads fresh from localStorage.
 * @returns The sessions state: sessions array, loading flag, save function, and saving flag.
 */
export function useSessions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: () => {
      const today = getTodayIso();
      const rawStored = typeof window === "undefined"
        ? []
        : (() => {
            try {
              return JSON.parse(
                window.localStorage.getItem(STORAGE_KEY_SESSIONS) ?? "[]",
              ) as unknown[];
            } catch {
              return [];
            }
          })();
      const raw = Array.isArray(rawStored)
        ? normalizeSessions(rawStored)
        : loadSessions();
      const pruned = pruneSessionsForFreeTier(raw, today);
      if (
        pruned.length !== raw.length ||
        JSON.stringify(rawStored) !== JSON.stringify(pruned)
      ) {
        saveSessions(pruned);
      }
      return pruned;
    },
  });

  const save = useMutation({
    mutationFn: async (next: Session) => {
      const today = getTodayIso();
      const merged = upsertSession(loadSessions(), next, today);
      saveSessions(merged);
      return merged;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(SESSIONS_QUERY_KEY, data);
    },
  });

  return {
    sessions: query.data ?? [],
    isLoading: query.isLoading,
    saveSession: save.mutateAsync,
    isSaving: save.isPending,
  };
}
