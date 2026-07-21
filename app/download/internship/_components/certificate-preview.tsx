"use client";

import { IconArrowLeft, IconDownload, IconLoader2 } from "@tabler/icons-react";
import { jsPDF } from "jspdf";
import { domToJpeg } from "modern-screenshot";
import { useRef, useState } from "react";
import type { CertificateData } from "@/app/(dashboard)/certificate/internship/_components/internship-certificate";
import { InternshipCertificate } from "@/app/(dashboard)/certificate/internship/_components/internship-certificate";
import { useDownloadStatus } from "@/lib/hooks/use-download-status";
import {
  AttendanceSheet,
  type AttendanceSheetData,
} from "./attendance-sheet";

type CertificatePreviewProps = {
  data: CertificateData;
  onBack: () => void;
};

/** A4 dimensions in mm */
const A4_LANDSCAPE = { w: 297, h: 210 };
const A4_PORTRAIT = { w: 210, h: 297 };

/** Pixel sizes for rendering */
const CERT_PX = { w: 1123, h: 794 };
const ATTENDANCE_PX = { w: 794, h: 1123 };

/**
 * Captures a DOM element as a JPEG data URL.
 */
async function captureElement(
  el: HTMLElement,
  width: number,
  height: number,
): Promise<string> {
  return domToJpeg(el, {
    scale: 1.5,
    quality: 0.85,
    width,
    height,
    timeout: 2000,
    fetch: {
      requestInit: {
        cache: "force-cache",
      },
    },
  });
}

export function CertificatePreview({ data, onBack }: CertificatePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadStatus = useDownloadStatus(isDownloading);

  const certRef = useRef<HTMLDivElement>(null);
  const attendanceRef = useRef<HTMLDivElement>(null);

  const attendanceData: AttendanceSheetData = {
    name: data.name,
    registrationNo: data.registrationNo,
    honoursSubject: data.honoursSubject,
    courseName: data.courseName,
    universityRollNo: data.universityRollNo,
    gender: data.gender,
    collegeName: data.collegeName,
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      if (typeof window !== "undefined" && "fonts" in document) {
        await document.fonts.ready;
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // ── Page 1: Certificate (landscape) ──────────────────
      const certEl =
        (certRef.current?.firstElementChild as HTMLElement) ??
        certRef.current;
      if (certEl) {
        const certImg = await captureElement(certEl, CERT_PX.w, CERT_PX.h);
        pdf.addImage(
          certImg,
          "JPEG",
          0,
          0,
          A4_LANDSCAPE.w,
          A4_LANDSCAPE.h,
          undefined,
          "FAST",
        );
      }

      // ── Page 2: Attendance Sheet (portrait) ──────────────
      if (attendanceRef.current) {
        pdf.addPage("a4", "portrait");
        const attImg = await captureElement(
          attendanceRef.current,
          ATTENDANCE_PX.w,
          ATTENDANCE_PX.h,
        );
        pdf.addImage(
          attImg,
          "JPEG",
          0,
          0,
          A4_PORTRAIT.w,
          A4_PORTRAIT.h,
          undefined,
          "FAST",
        );
      }

      const fileName = `Certificate_${data.name.replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("Failed to download certificate PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-lg border border-border bg-card shadow-2xs cursor-pointer"
        >
          <IconArrowLeft className="size-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <IconLoader2 className="size-4 animate-spin" />
              {downloadStatus}
            </>
          ) : (
            <>
              <IconDownload className="size-4" />
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* Visible Preview — Certificate */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm overflow-hidden">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          Page 1 — Internship Certificate
        </h3>
        <div
          style={{
            width: `${Math.ceil(CERT_PX.w * 0.78)}px`,
            height: `${Math.ceil(CERT_PX.h * 0.78)}px`,
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              transform: "scale(0.78)",
              transformOrigin: "top left",
              width: `${CERT_PX.w}px`,
              height: `${CERT_PX.h}px`,
            }}
          >
            <InternshipCertificate data={data} />
          </div>
        </div>
      </div>

      {/* Visible Preview — Attendance Sheet */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm overflow-hidden">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          Page 2 — Attendance Sheet
        </h3>
        <div
          style={{
            width: `${Math.ceil(ATTENDANCE_PX.w * 0.65)}px`,
            height: `${Math.ceil(ATTENDANCE_PX.h * 0.65)}px`,
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              transform: "scale(0.65)",
              transformOrigin: "top left",
              width: `${ATTENDANCE_PX.w}px`,
              height: `${ATTENDANCE_PX.h}px`,
            }}
          >
            <AttendanceSheet data={attendanceData} />
          </div>
        </div>
      </div>

      {/* ── Off-screen containers for PDF capture ────────────── */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -9999,
        }}
      >
        {/* Certificate */}
        <div
          style={{
            width: `${CERT_PX.w}px`,
            height: `${CERT_PX.h}px`,
            overflow: "hidden",
          }}
        >
          <div ref={certRef}>
            <InternshipCertificate data={data} />
          </div>
        </div>

        {/* Attendance Sheet */}
        <div
          ref={attendanceRef}
          style={{
            width: `${ATTENDANCE_PX.w}px`,
            height: `${ATTENDANCE_PX.h}px`,
            overflow: "hidden",
          }}
        >
          <AttendanceSheet data={attendanceData} />
        </div>
      </div>
    </div>
  );
}
