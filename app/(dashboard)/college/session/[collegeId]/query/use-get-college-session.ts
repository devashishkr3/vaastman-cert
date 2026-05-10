"use client";

import { useQuery } from "@tanstack/react-query";
import { getCollegeSessionInfo } from "@/app/(dashboard)/college/session/[collegeId]/lib/actions";

export function useGetCollegeSession(collegeId: string) {
  return useQuery({
    queryKey: ["college-session", collegeId],
    queryFn: async () => {
      const res = await getCollegeSessionInfo(collegeId);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
    enabled: Boolean(collegeId),
    retry: false,
  });
}
