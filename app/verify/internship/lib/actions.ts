"use server";

import { prisma } from "@/lib/db";

export type VerificationResultData = {
  certificateNo: string;
  courseName: string;
  honoursSubject: string;
  grade: string | null;
  semester: number;
  programHrs: number;
  issueDate: string;
};

export async function getCertificateVerification(rawCertificateNo: string) {
  if (!rawCertificateNo || rawCertificateNo.trim() === "") {
    return {
      success: false as const,
      message: "Certificate number is required.",
    };
  }

  const cleanNo = decodeURIComponent(rawCertificateNo).trim();

  try {
    // Try exact match first
    let record = await prisma.old_Student_Record.findUnique({
      where: { certificateNo: cleanNo },
    });

    // Fallback: try case-insensitive findFirst if exact match fails
    if (!record) {
      record = await prisma.old_Student_Record.findFirst({
        where: {
          certificateNo: {
            equals: cleanNo,
            mode: "insensitive",
          },
        },
      });
    }

    if (!record) {
      return {
        success: false as const,
        message:
          "No certificate record found with the provided certificate number.",
      };
    }

    // Only return non-personal data for public verification
    const data: VerificationResultData = {
      certificateNo: record.certificateNo,
      courseName: record.courseName,
      honoursSubject: record.honoursSubject,
      grade: record.grade,
      semester: record.semester,
      programHrs: record.programHrs,
      issueDate: record.issueDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error("getCertificateVerification error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to verify certificate.";
    return {
      success: false as const,
      message,
    };
  }
}
