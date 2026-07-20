"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadOldStudents } from "../actions";
import type { UploadPayloadSchema } from "../zod-type/csv-schema";

export function useUploadOldStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UploadPayloadSchema) => {
      const res = await uploadOldStudents(payload);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["old-students"] });
      toast.success(`Successfully uploaded ${data?.count ?? 0} records.`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
