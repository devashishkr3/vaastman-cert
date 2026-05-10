"use client";

import {
  IconAlertCircleFilled,
  IconCircleCheckFilled,
  IconClockFilled,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

type PaymentStatusBadgeProps = {
  status: string;
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  VERIFIED: "Verified",
  CREATED: "Created",
  FAILED: "Failed",
  N_A: "N/A",
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  if (status === "VERIFIED") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700">
        <IconCircleCheckFilled className="size-5" data-icon="inline-start" />
        {PAYMENT_STATUS_LABELS[status]}
      </Badge>
    );
  }

  if (status === "FAILED") {
    return (
      <Badge variant="destructive">
        <IconAlertCircleFilled className="size-5" data-icon="inline-start" />
        {PAYMENT_STATUS_LABELS[status]}
      </Badge>
    );
  }

  if (status === "CREATED") {
    return (
      <Badge variant="secondary">
        <IconClockFilled className="size-5" data-icon="inline-start" />
        {PAYMENT_STATUS_LABELS[status]}
      </Badge>
    );
  }

  return <Badge variant="outline">{PAYMENT_STATUS_LABELS.N_A}</Badge>;
}
