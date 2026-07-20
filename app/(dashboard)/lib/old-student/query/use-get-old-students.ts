"use client";

import { useQuery } from "@tanstack/react-query";
import { getOldStudents } from "../actions";

export function useGetOldStudents() {
  return useQuery({
    queryKey: ["old-students"],
    queryFn: async () => {
      const res = await getOldStudents();
      if (!res.success) {
        throw new Error(res.message);
      }
      return res.data;
    },
    retry: false,
  });
}
