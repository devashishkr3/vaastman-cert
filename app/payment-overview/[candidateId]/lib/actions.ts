"use server";

import { prisma } from "@/lib/db";

function toReadableStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export async function getPaymentReceipt(candidateId: string) {
  const normalizedCandidateId = candidateId.trim();

  if (!normalizedCandidateId) {
    return { success: false, message: "Invalid candidate id" };
  }

  try {
    const candidate = await prisma.candidate_Personal.findUnique({
      where: {
        id: normalizedCandidateId,
      },
      select: {
        name: true,
        email: true,
        phone: true,
        fatherName: true,
        candidateEducations: {
          select: {
            universityRoll: true,
            collegeRoll: true,
            duration: true,
            domainOrMainSubject: true,
            mjcSubject: true,
            college: {
              select: {
                name: true,
              },
            },
            collegeSession: {
              select: {
                name: true,
              },
            },
          },
          take: 1,
        },
        candidatePayments: {
          where: {
            status: "VERIFIED",
          },
          orderBy: {
            verifiedAt: "desc",
          },
          select: {
            receipt: true,
            amount: true,
            currency: true,
            status: true,
            razorpayOrderId: true,
            razorpayPaymentId: true,
            verifiedAt: true,
            createdAt: true,
          },
          take: 1,
        },
      },
    });

    const education = candidate?.candidateEducations.at(0);
    const payment = candidate?.candidatePayments.at(0);

    if (!candidate || !education || !payment) {
      return {
        success: false,
        message: "Receipt data not found for this candidate",
      };
    }

    const paidAt = payment.verifiedAt ?? payment.createdAt;

    return {
      success: true,
      data: {
        status: toReadableStatus(payment.status),
        receiptNo: payment.receipt,
        orderId: payment.razorpayOrderId,
        paymentId: payment.razorpayPaymentId,
        paidAt: paidAt.toISOString(),
        amount: payment.amount,
        currency: payment.currency,
        studentName: candidate.name,
        fatherName: candidate.fatherName,
        email: candidate.email,
        phone: candidate.phone,
        universityRoll: education.universityRoll,
        collegeRoll: education.collegeRoll,
        collegeName: education.college.name,
        session: education.collegeSession.name,
        course: education.mjcSubject,
        duration: education.duration,
        domain: education.domainOrMainSubject,
      },
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch payment receipt" };
  }
}
