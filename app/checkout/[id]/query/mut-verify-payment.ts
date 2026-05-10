import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyPayment } from "../lib/actions";

type VerifyPaymentPayload = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export function useVerifyPayment(candidateId: string) {
  return useMutation({
    mutationFn: async (data: VerifyPaymentPayload) => {
      const res = await verifyPayment({
        candidateId,
        ...data,
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      return res.data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
