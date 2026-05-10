"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCollegeSessionStatus } from "@/app/(dashboard)/college/lib/actions";
import type { useGetCollegeInfo } from "@/app/(dashboard)/college/query/use-get-collegeInfo";

type CollegeInfoData = ReturnType<typeof useGetCollegeInfo>["data"];
type SessionStatus = "ACTIVE" | "INACTIVE";

type CollegeSessionData = {
  sessions: Array<{
    id: string;
    status: SessionStatus;
  }>;
};

export function useUpdateCollegeSession(collegeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      sessionId: string;
      status: SessionStatus;
    }) => {
      const res = await updateCollegeSessionStatus({
        collegeId,
        sessionId: payload.sessionId,
        status: payload.status,
      });
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
    onMutate: async ({ sessionId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["college-info"] });
      await queryClient.cancelQueries({
        queryKey: ["college-session", collegeId],
      });

      const previousCollegeInfo = queryClient.getQueryData<CollegeInfoData>([
        "college-info",
      ]);
      const previousCollegeSession =
        queryClient.getQueryData<CollegeSessionData>([
          "college-session",
          collegeId,
        ]);

      queryClient.setQueryData<CollegeInfoData>(["college-info"], (old) => {
        if (!old) {
          return old;
        }

        return old.map((college) => {
          if (college.id !== collegeId) {
            return college;
          }

          return {
            ...college,
            sessions: college.sessions.map((session) =>
              session.id === sessionId ? { ...session, status } : session,
            ),
          };
        });
      });

      queryClient.setQueryData<CollegeSessionData>(
        ["college-session", collegeId],
        (old) => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            sessions: old.sessions.map((session) =>
              session.id === sessionId ? { ...session, status } : session,
            ),
          };
        },
      );

      return { previousCollegeInfo, previousCollegeSession };
    },
    onError: (error, _variables, context) => {
      if (context?.previousCollegeInfo) {
        queryClient.setQueryData(["college-info"], context.previousCollegeInfo);
      }
      if (context?.previousCollegeSession) {
        queryClient.setQueryData(
          ["college-session", collegeId],
          context.previousCollegeSession,
        );
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["college-info"] });
      queryClient.invalidateQueries({
        queryKey: ["college-session", collegeId],
      });
      toast.success("Session status updated.");
    },
  });
}
