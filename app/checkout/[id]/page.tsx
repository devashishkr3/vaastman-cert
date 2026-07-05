import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getQueryClient } from "@/lib/get-query-client";
import { CheckoutForm } from "./_components/checkout-form";
import { getOrder } from "./query/get-order";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: candidateId } = await params;

  const payment = await prisma.candidate_Payment.findFirst({
    where: {
      candidateId,
      status: "VERIFIED",
    },
  });

  if (payment?.status === "VERIFIED") {
    redirect(`/payment-overview/${candidateId}`);
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getOrder(candidateId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="container mx-auto max-w-2xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>
              Review the terms and conditions and privacy policy below before
              proceeding with payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CheckoutForm candidateId={candidateId} />
          </CardContent>
        </Card>
      </main>
    </HydrationBoundary>
  );
}
