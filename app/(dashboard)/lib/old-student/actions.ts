"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@/lib/generated/prisma/enums";
import {
  computeGrade,
  computeIsPrintable,
  generateAttendance,
  getTopicForCourse,
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

    // ── Check for duplicate registration_no in DB ─────────────
    const regNos = rows.map((r) => r.registration_no);
    const existingRegs = await prisma.old_Student_Record.findMany({
      where: { registrationNo: { in: regNos } },
      select: { registrationNo: true },
    });

    if (existingRegs.length > 0) {
      const dupes = existingRegs.map((e) => e.registrationNo).join(", ");
      return {
        success: false,
        message: `Duplicate registration numbers already exist in database: ${dupes}`,
      };
    }

    // ── Also check for duplicate registration_no within CSV ───
    const regNoSet = new Set<string>();
    const csvRegDupes: string[] = [];
    for (const r of rows) {
      if (regNoSet.has(r.registration_no)) {
        csvRegDupes.push(r.registration_no);
      }
      regNoSet.add(r.registration_no);
    }
    if (csvRegDupes.length > 0) {
      return {
        success: false,
        message: `Duplicate registration numbers found within CSV: ${csvRegDupes.join(", ")}`,
      };
    }

    // ── Get max serial per college short name ─────────────────
    // Collect unique college short names from the CSV
    const uniqueColleges = [
      ...new Set(rows.map((r) => r.short_clg_name_for_certificate)),
    ];

    // For each college, find the current max serial from existing DB records
    const collegeSerialMap = new Map<string, number>();

    for (const collegeName of uniqueColleges) {
      // Find the highest serial for this college in the DB
      // Certificate format: VSPL/<shortCollegeName>/<serial>/<year>
      const existingRecords = await prisma.old_Student_Record.findMany({
        where: { shortCollegeName: collegeName },
        select: { certificateNo: true },
      });

      let maxSerial = 0;
      for (const rec of existingRecords) {
        const parts = rec.certificateNo.split("/");
        const serialPart = parts[2];
        if (serialPart) {
          const parsed = Number.parseInt(serialPart, 10);
          if (!Number.isNaN(parsed) && parsed > maxSerial) {
            maxSerial = parsed;
          }
        }
      }

      collegeSerialMap.set(collegeName, maxSerial);
    }

    const uploadYear = new Date().getFullYear();
    const shortYear = String(uploadYear).slice(-2); // 2-digit year
    const issueDate = new Date(uploadYear, 6, 13); // July 13

    // ── Build records ──────────────────────────────────────────
    const records = rows.map((row) => {
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

      // Increment the per-college serial
      const collegeName = row.short_clg_name_for_certificate;
      const currentSerial = (collegeSerialMap.get(collegeName) ?? 0) + 1;
      collegeSerialMap.set(collegeName, currentSerial);

      // Zero-pad serial to 3 digits (001, 002, …)
      const paddedSerial = String(currentSerial).padStart(3, "0");
      const certificateNo = `VSPL/${collegeName}/${paddedSerial}/${shortYear}`;

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
        topic: getTopicForCourse(row.course_name),
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
      topic: r.topic ?? getTopicForCourse(r.courseName),
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
