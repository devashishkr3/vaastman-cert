"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  createPaymentSuccessSearchParams,
  getPayButtonLabel,
  loadRazorpayScript,
  type RazorpayErrorResponse,
} from "@/app/checkout/[id]/lib/payment-checkout";
import { ErrorDisplay } from "@/components/error-display";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getOrder } from "../query/get-order";
import { useRecordPaymentFailure } from "../query/mut-record-payment-failure";
import { useVerifyPayment } from "../query/mut-verify-payment";

type PaymentButtonProps = {
  candidateId: string;
  allAccepted: boolean;
  isSavingAgreements: boolean;
};

export function PaymentButton({
  candidateId,
  allAccepted,
  isSavingAgreements,
}: PaymentButtonProps) {
  const router = useRouter();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery(getOrder(candidateId));
  const verifyPaymentMutation = useVerifyPayment(candidateId);
  const recordPaymentFailureMutation = useRecordPaymentFailure();

  const isPending =
    isLoading ||
    verifyPaymentMutation.isPending ||
    verifyPaymentMutation.isSuccess;
  const payableAmount = Number(data?.order.amount ?? 0);

  const handlePay = async () => {
    setPaymentError(null);
    if (!data) {
      return;
    }

    const orderAmount = Number(data.order.amount);

    if (Number.isNaN(orderAmount) || orderAmount <= 0) {
      toast.error("Invalid order amount");
      return;
    }

    const canLoadScript = await loadRazorpayScript();
    if (!canLoadScript || !window.Razorpay) {
      toast.error("Unable to load payment gateway");
      return;
    }

    const checkout = new window.Razorpay({
      key: data.keyId,
      amount: orderAmount,
      currency: data.order.currency,
      name: "Vaastman Solution",
      description: "Course fee payment",
      order_id: data.order.id,
      notes: {
        candidateId,
      },
      prefill: {
        name: data.customer.name,
        email: data.customer.email,
        contact: data.customer.contact,
      },
      handler: async (response) => {
        try {
          const verification = await verifyPaymentMutation.mutateAsync({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (!verification) {
            return;
          }

          const paymentSuccessParams = createPaymentSuccessSearchParams({
            candidateId: verification.candidateId,
            orderId: verification.orderId,
            paymentId: verification.paymentId,
          });

          router.push(
            `/payment-overview/${candidateId}?${paymentSuccessParams}`,
          );
        } catch (error) {
          console.error("Server-side payment verification failed:", error);
          // Note: Error toast is handled by useMutation's onError callback.
        }
      },
      theme: {
        color: "#0f172a",
      },
    });

    checkout.on("payment.failed", (response: RazorpayErrorResponse) => {
      setPaymentError(
        response.error.description || "Payment failed. Please try again.",
      );
      recordPaymentFailureMutation.mutate({
        razorpayOrderId: response.error.metadata.order_id || data.order.id,
        razorpayPaymentId: response.error.metadata.payment_id,
        reason: response.error.description || response.error.reason,
        paymentPayload: response.error as unknown as Record<string, string>,
      });
    });

    checkout.open();
  };

  if (error) {
    return <ErrorDisplay message={error.message} showButton={false} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {paymentError && (
        <Alert variant="destructive">
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handlePay}
        disabled={isPending || !data || !allAccepted || isSavingAgreements}
      >
        {getPayButtonLabel(payableAmount, isPending)}
      </Button>
    </div>
  );
}
