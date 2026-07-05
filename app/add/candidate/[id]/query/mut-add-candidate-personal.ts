import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ErrorTypes } from "@/lib/error-type";
import { addCandidatePersonalAction } from "../lib/actions";
import type { AddCandidatePersonalSchema } from "../lib/zod-type/candidate-personal";

export function useAddCandidatePersonal({
  candidateId,
}: {
  candidateId: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddCandidatePersonalSchema) => {
      const res = await addCandidatePersonalAction(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["candidate-personal", candidateId],
      });
      toast.success("Personal details saved.");
      router.push(`/add/candidate/${candidateId}?tab=education`);
    },
    onError: (error) => {
      if (error.message === ErrorTypes.ALREADY_EXISTS) {
        toast.error("Personal details already exist.", {
          description: "redirecting in 4s..",
        });
        //delay of 4 second
        setTimeout(() => {
          router.push("/home");
        }, 4000);
        return;
      }
      toast.error(error.message);
    },
  });
}
