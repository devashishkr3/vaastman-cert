"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@/lib/generated/prisma/enums";
import {
  computeGrade,
  computeIsPrintable,
  generateAttendance,
} from "./csv-helpers";
import {
  type UploadPayloadSchema,
  uploadPayloadSchema,
} from "./zod-type/csv-schema";

export async function uploadOldStudents(payload: UploadPayloadSchema) {
  // ── Auth check ───────────────────────────────────────────────
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (session.user.role !== Role.ADMIN) {
    return { success: false, message: "Only admins can upload old students" };
  }

  // ── Validate payload ─────────────────────────────────────────
  const parsed = uploadPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      message: `Validation error: ${firstIssue?.message ?? "Invalid data"}`,
    };
  }

  const rows = parsed.data.rows;

  try {
    // ── Check for duplicate university_roll_no in DB ───────────
    const rollNos = rows.map((r) => r.university_roll_no);
    const existing = await prisma.old_Student_Record.findMany({
      where: { universityRollNo: { in: rollNos } },
      select: { universityRollNo: true },
    });

    if (existing.length > 0) {
      const dupes = existing.map((e) => e.universityRollNo).join(", ");
      return {
        success: false,
        message: `Duplicate university roll numbers already exist in database: ${dupes}`,
      };
    }

    // ── Also check for duplicates within the CSV itself ────────
    const rollNoSet = new Set<string>();
    const csvDupes: string[] = [];
    for (const r of rows) {
      if (rollNoSet.has(r.university_roll_no)) {
        csvDupes.push(r.university_roll_no);
      }
      rollNoSet.add(r.university_roll_no);
    }
    if (csvDupes.length > 0) {
      return {
        success: false,
        message: `Duplicate university roll numbers found within CSV: ${csvDupes.join(", ")}`,
      };
    }

    // ── Get current max serial for certificate_no ──────────────
    const maxRecord = await prisma.old_Student_Record.findFirst({
      orderBy: { createdAt: "desc" },
      select: { certificateNo: true },
    });

    let currentSerial = 0;
    if (maxRecord?.certificateNo) {
      // Format: VSPL/<shortCollegeName>/<serial>/<year>
      const parts = maxRecord.certificateNo.split("/");
      const serialPart = parts[2];
      if (serialPart) {
        const parsed = Number.parseInt(serialPart, 10);
        if (!Number.isNaN(parsed)) {
          currentSerial = parsed;
        }
      }
    }

    // Also count total records as fallback to ensure serial is always correct
    const totalCount = await prisma.old_Student_Record.count();
    if (totalCount > currentSerial) {
      currentSerial = totalCount;
    }

    const uploadYear = new Date().getFullYear();
    const issueDate = new Date(uploadYear, 6, 13); // July 13

    // ── Build records ──────────────────────────────────────────
    const records = rows.map((row, index) => {
      // Convert marks string to number | null
      const marksTrimmed = row.marks.trim();
      const marksValue =
        marksTrimmed === "" || marksTrimmed === "-"
          ? null
          : Number.isNaN(Number(marksTrimmed))
            ? null
            : Number(marksTrimmed);

      // Convert empty email to null
      const emailValue =
        row.email_id.trim() === "" ? null : row.email_id.trim();

      const serial = currentSerial + index + 1;
      const certificateNo = `VSPL/${row.short_clg_name_for_certificate}/${serial}/${uploadYear}`;

      return {
        name: row.name,
        fatherName: row.father_name,
        courseName: row.course_name,
        universityRollNo: row.university_roll_no,
        marks: marksValue,
        registrationNo: row.registration_no,
        collegeName: row.college_name,
        shortCollegeName: row.short_clg_name_for_certificate,
        mobileNo: row.mobile_no,
        emailId: emailValue,
        dob: row.dob,
        gender: row.gender,
        honoursSubject: row.honours_subject,
        grade: computeGrade(marksValue),
        isPrintable: computeIsPrintable(marksValue),
        attendance: generateAttendance(),
        issueDate,
        certificateNo,
      };
    });

    // ── Bulk insert inside a transaction ───────────────────────
    const result = await prisma.$transaction(async (tx) => {
      // createMany doesn't support returning created records in all adapters,
      // so we use it for performance and return the count
      const created = await tx.old_Student_Record.createMany({
        data: records,
      });
      return created;
    });

    return {
      success: true,
      data: { count: result.count },
    };
  } catch (error) {
    console.error("uploadOldStudents error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload old students";
    return { success: false, message };
  }
}

/* ── Fetch old student records ──────────────────────────────────── */

export async function getOldStudents() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false as const, message: "Unauthorized" };
  }

  if (session.user.role !== Role.ADMIN) {
    return {
      success: false as const,
      message: "Only admins can view old student records",
    };
  }

  try {
    const records = await prisma.old_Student_Record.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Format issueDate for the certificate component
    const data = records.map((r) => ({
      id: r.id,
      name: r.name,
      fatherName: r.fatherName,
      courseName: r.courseName,
      universityRollNo: r.universityRollNo,
      marks: r.marks,
      registrationNo: r.registrationNo,
      collegeName: r.collegeName,
      shortCollegeName: r.shortCollegeName,
      mobileNo: r.mobileNo,
      emailId: r.emailId,
      dob: r.dob,
      gender: r.gender,
      honoursSubject: r.honoursSubject,
      grade: r.grade,
      isPrintable: r.isPrintable,
      attendance: r.attendance,
      semester: r.semester,
      programHrs: r.programHrs,
      certificateNo: r.certificateNo,
      issueDate: r.issueDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    }));

    return { success: true as const, data };
  } catch (error) {
    console.error("getOldStudents error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch old student records";
    return { success: false as const, message };
  }
}
