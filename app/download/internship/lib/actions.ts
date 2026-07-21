"use server";

import { getTopicForCourse } from "@/app/(dashboard)/lib/old-student/csv-helpers";
import { prisma } from "@/lib/db";

export type DownloadCertificateData = {
  name: string;
  fatherName: string;
  courseName: string;
  universityRollNo: string;
  collegeName: string;
  honoursSubject: string;
  topic?: string | null;
  grade: string | null;
  semester: number;
  programHrs: number;
  certificateNo: string;
  registrationNo: string;
  issueDate: string;
  gender: string;
};

export async function lookupCertificateForDownload(
  identifier: string,
  fatherName: string,
) {
  if (!identifier || identifier.trim() === "") {
    return {
      success: false as const,
      message: "University Roll No. or Registration No. is required.",
    };
  }
  if (!fatherName || fatherName.trim() === "") {
    return {
      success: false as const,
      message: "Father's Name is required.",
    };
  }

  const cleanId = identifier.trim();
  const cleanFather = fatherName.trim().toLowerCase();

  try {
    // Search by universityRollNo OR registrationNo
    const record = await prisma.old_Student_Record.findFirst({
      where: {
        OR: [{ universityRollNo: cleanId }, { registrationNo: cleanId }],
      },
    });

    if (!record) {
      return {
        success: false as const,
        message:
          "No record found with the provided University Roll No. or Registration No.",
      };
    }

    // Validate father name match (case-insensitive)
    if (record.fatherName.trim().toLowerCase() !== cleanFather) {
      return {
        success: false as const,
        message: "Father's Name does not match our records.",
      };
    }

    // Check if certificate is printable
    if (!record.isPrintable) {
      return {
        success: false as const,
        message:
          "Your certificate is not yet available for download. Please contact Vaastman Solutions for assistance.",
      };
    }

    const data: DownloadCertificateData = {
      name: record.name,
      fatherName: record.fatherName,
      courseName: record.courseName,
      universityRollNo: record.universityRollNo,
      collegeName: record.collegeName,
      honoursSubject: record.honoursSubject,
      topic: record.topic ?? getTopicForCourse(record.courseName),
      grade: record.grade,

      semester: record.semester,
      programHrs: record.programHrs,
      certificateNo: record.certificateNo,
      registrationNo: record.registrationNo,
      issueDate: record.issueDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      gender: record.gender,
    };

    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error("lookupCertificateForDownload error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to look up certificate.";
    return {
      success: false as const,
      message,
    };
  }
}
