"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { createId } from "@paralleldrive/cuid2";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

type StoredOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt?: string | null;
};

/**
 * Parses a string containing rupees (e.g., "₹ 1,500.00") into a clean number.
 * Removes all non-numeric characters and verifies validity.
 * @param value - The raw string value to parse
 * @returns The numeric value or null if invalid
 */
function parseRupees(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(normalized);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

/**
 * Utility to stringify and re-parse an object to fit Prisma's InputJsonValue expectation.
 * @param value - Any arbitrary data to store as JSON
 * @returns Serialized JSON compatible with Prisma
 */
function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function isStoredOrder(value: Prisma.JsonValue | null): value is StoredOrder {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const order = value as Record<string, unknown>;

  return (
    typeof order.id === "string" &&
    typeof order.amount === "number" &&
    typeof order.currency === "string" &&
    (typeof order.receipt === "string" ||
      typeof order.receipt === "undefined" ||
      order.receipt === null)
  );
}

/**
 * Updates a specific payment's status to "FAILED" in the database.
 * Used when signature verification or amount validation fails.
 * @param razorpayOrderId - The order ID from Razorpay
 * @param failureReason - Description of why the payment failed
 * @param paymentPayload - Optional diagnostic payload of the failure
 */
async function markPaymentFailed(
  razorpayOrderId: string,
  failureReason: string,
  paymentPayload?: Record<string, string>,
) {
  await prisma.candidate_Payment.updateMany({
    where: {
      razorpayOrderId,
      status: {
        not: "VERIFIED",
      },
    },
    data: {
      status: "FAILED",
      failureReason,
      paymentPayload: paymentPayload ? toInputJson(paymentPayload) : undefined,
    },
  });
}

/**
 * Prepares the checkout details for a candidate and creates a Razorpay order.
 * Verifies fee consistency and immediately stores the order in DB with status "CREATED".
 * @param candidateId - The ID of the candidate initiating checkout
 * @returns The Razorpay order details required to start the checkout script on the client
 */
export async function getPaymentOrder(candidateId: string) {
  // 1) Basic candidate id and env validation.
  const normalizedCandidateId = candidateId.trim();

  if (!normalizedCandidateId) {
    return { success: false, message: "Invalid candidate id" };
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { success: false, message: "Payment gateway is not configured" };
  }

  const verifiedPayment = await prisma.candidate_Payment.findFirst({
    where: {
      candidateId: normalizedCandidateId,
      status: "VERIFIED",
    },
    select: {
      id: true,
    },
  });

  if (verifiedPayment) {
    return {
      success: false,
      message: "Payment has already been completed for this candidate",
    };
  }

  const education = await prisma.candidate_Education.findFirst({
    where: { candidateId: normalizedCandidateId },
    select: {
      collegeFee: true,
      candidate: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      collegeSession: {
        select: {
          fees: true,
        },
      },
    },
  });

  if (!education) {
    return { success: false, message: "Candidate education details not found" };
  }

  const candidateFee = parseRupees(education.collegeFee);
  const sessionFee = parseRupees(education.collegeSession.fees);

  // 2) Ensure candidate fee matches configured session fee.
  if (!candidateFee || !sessionFee) {
    return { success: false, message: "Invalid fee details for payment" };
  }

  if (candidateFee !== sessionFee) {
    return { success: false, message: "Fee mismatch found for this candidate" };
  }

  const amount = Math.round(candidateFee * 100);

  const existingPayment = await prisma.candidate_Payment.findFirst({
    where: {
      candidateId: normalizedCandidateId,
      status: "CREATED",
      amount,
      currency: "INR",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      razorpayOrderId: true,
      orderPayload: true,
    },
  });

  if (existingPayment && isStoredOrder(existingPayment.orderPayload)) {
    return {
      success: true,
      data: {
        keyId,
        order: existingPayment.orderPayload,
        customer: {
          name: education.candidate.name,
          email: education.candidate.email,
          contact: education.candidate.phone,
        },
      },
    };
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  try {
    // 3) Create Razorpay order and persist "CREATED" payment state.
    const attemptRef = createId();
    const receipt = createId();

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        candidateId: normalizedCandidateId,
      },
    });

    await prisma.candidate_Payment.create({
      data: {
        candidateId: normalizedCandidateId,
        attemptRef,
        receipt: order.receipt ?? receipt,
        amount,
        currency: order.currency,
        status: "CREATED",
        razorpayOrderId: order.id,
        orderPayload: toInputJson(order),
      },
    });

    return {
      success: true,
      data: {
        keyId,
        order,
        customer: {
          name: education.candidate.name,
          email: education.candidate.email,
          contact: education.candidate.phone,
        },
      },
    };
  } catch {
    return { success: false, message: "Failed to create payment order" };
  }
}

type VerifyPaymentInput = {
  candidateId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

/**
 * Securely verifies a Razorpay payment signature originating from the client.
 * Also double-checks the finalized amount strictly against our DB's expectations.
 * If all assertions pass, marks the candidate's payment as "VERIFIED".
 * @param data - The payload sent from the client's Razorpay successful checkout
 * @returns Success status and verification results
 */
export async function verifyPayment(data: VerifyPaymentInput) {
  // 1) Validate incoming verification payload.
  const candidateId = data.candidateId.trim();
  const razorpayOrderId = data.razorpayOrderId.trim();
  const razorpayPaymentId = data.razorpayPaymentId.trim();
  const razorpaySignature = data.razorpaySignature.trim();

  if (
    !candidateId ||
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    return { success: false, message: "Missing payment verification details" };
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { success: false, message: "Payment gateway is not configured" };
  }

  const paymentRecord = await prisma.candidate_Payment.findUnique({
    where: {
      razorpayOrderId,
    },
    select: {
      candidateId: true,
      amount: true,
      currency: true,
      status: true,
      razorpayPaymentId: true,
    },
  });

  if (!paymentRecord) {
    return { success: false, message: "Payment order record not found" };
  }

  // 2) Guard against candidate/order mismatches and repeated verify calls.
  if (paymentRecord.candidateId !== candidateId) {
    return {
      success: false,
      message: "Payment order does not match candidate",
    };
  }

  if (
    paymentRecord.status === "VERIFIED" &&
    paymentRecord.razorpayPaymentId === razorpayPaymentId
  ) {
    return {
      success: true,
      data: {
        verified: true,
        candidateId,
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      },
    };
  }

  const education = await prisma.candidate_Education.findFirst({
    where: { candidateId },
    select: {
      collegeFee: true,
      collegeSession: {
        select: {
          fees: true,
        },
      },
    },
  });

  if (!education) {
    return { success: false, message: "Candidate education details not found" };
  }

  const candidateFee = parseRupees(education.collegeFee);
  const sessionFee = parseRupees(education.collegeSession.fees);

  if (!candidateFee || !sessionFee) {
    return { success: false, message: "Invalid fee details for payment" };
  }

  if (candidateFee !== sessionFee) {
    return { success: false, message: "Fee mismatch found for this candidate" };
  }

  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const signatureBuffer = Buffer.from(razorpaySignature, "utf8");

  let isSignatureValid = false;
  if (expectedBuffer.length === signatureBuffer.length) {
    isSignatureValid = timingSafeEqual(expectedBuffer, signatureBuffer);
  }

  // 3) Signature mismatch means tampered/invalid callback.
  if (!isSignatureValid) {
    await markPaymentFailed(razorpayOrderId, "Payment verification failed", {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    return { success: false, message: "Payment verification failed" };
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  try {
    // 4) Fetch order from gateway, verify final amount, then mark VERIFIED.
    const order = await razorpay.orders.fetch(razorpayOrderId);
    const expectedAmount = Math.round(candidateFee * 100);
    const orderAmount = Number(order.amount);

    if (
      order.currency !== "INR" ||
      orderAmount !== expectedAmount ||
      paymentRecord.amount !== expectedAmount ||
      paymentRecord.currency !== "INR"
    ) {
      await markPaymentFailed(
        razorpayOrderId,
        "Payment order amount mismatch",
        {
          razorpayOrderId,
          razorpayPaymentId,
        },
      );
      return { success: false, message: "Payment order amount mismatch" };
    }

    if (order.notes?.candidateId !== candidateId) {
      await markPaymentFailed(
        razorpayOrderId,
        "Payment order does not match candidate",
        {
          razorpayOrderId,
          razorpayPaymentId,
        },
      );
      return {
        success: false,
        message: "Payment order does not match candidate",
      };
    }

    await prisma.candidate_Payment.update({
      where: {
        razorpayOrderId,
      },
      data: {
        status: "VERIFIED",
        razorpayPaymentId,
        razorpaySignature,
        verifiedAt: new Date(),
        failureReason: null,
        orderPayload: toInputJson(order),
        paymentPayload: toInputJson({
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        }),
      },
    });

    return {
      success: true,
      data: {
        verified: true,
        candidateId,
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      },
    };
  } catch {
    await markPaymentFailed(
      razorpayOrderId,
      "Failed to verify payment order details",
      {
        razorpayOrderId,
        razorpayPaymentId,
      },
    );
    return {
      success: false,
      message: "Failed to verify payment order details",
    };
  }
}
