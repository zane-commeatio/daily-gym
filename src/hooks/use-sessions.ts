"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upsertSession } from "@/lib/sessions";
import {
  loadSessions,
  saveSessions,
  getTodayIso,
  pruneSessionsForFreeTier,
} from "@/lib/storage";
import type { Session } from "@/lib/types";

export const SESSIONS_QUERY_KEY = ["sessions"] as const;

export function useSessions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: () => {
      const today = getTodayIso();
      const raw = loadSessions();
      const pruned = pruneSessionsForFreeTier(raw, today);
      if (pruned.length !== raw.length) {
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
