"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addCollegeSessionInfo } from "@/app/(dashboard)/college/session/[collegeId]/lib/actions";
import type { AddCollegeSessionSchema } from "@/app/(dashboard)/college/session/[collegeId]/lib/zod-type/add-college-session";

export function useAddCollegeSession(collegeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddCollegeSessionSchema) => {
      const res = await addCollegeSessionInfo(collegeId, payload);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["college-session", collegeId],
      });
      queryClient.invalidateQueries({ queryKey: ["college-info"] });
      toast.success("New session added.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
