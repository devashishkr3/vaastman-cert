"use client";

import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { domToJpeg } from "modern-screenshot";
import { IconDownload, IconLoader2, IconArrowLeft } from "@tabler/icons-react";
import { InternshipCertificate } from "@/app/(dashboard)/certificate/internship/_components/internship-certificate";
import type { CertificateData } from "@/app/(dashboard)/certificate/internship/_components/internship-certificate";

type CertificatePreviewProps = {
  data: CertificateData;
  onBack: () => void;
};

export function CertificatePreview({ data, onBack }: CertificatePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const target = exportRef.current;
    if (!target) return;
    try {
      setIsDownloading(true);

      const certElement = (target.firstElementChild as HTMLElement) || target;

      const dataUrl = await domToJpeg(certElement, {
        scale: 1.5,
        quality: 0.85,
        width: 1123,
        height: 794,
        font: false,
      });

      // A4 Landscape orientation: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(dataUrl, "JPEG", 0, 0, 297, 210, undefined, "FAST");

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
              Downloading...
            </>
          ) : (
            <>
              <IconDownload className="size-4" />
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* Visible Preview (scaled down) */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm overflow-hidden">
        <div
          style={{
            width: `${Math.ceil(1123 * 0.78)}px`,
            height: `${Math.ceil(794 * 0.78)}px`,
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              transform: "scale(0.78)",
              transformOrigin: "top left",
              width: "1123px",
              height: "794px",
            }}
          >
            <InternshipCertificate data={data} />
          </div>
        </div>
      </div>

      {/* Off-screen container for high-resolution PDF download (unscaled) */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: "-9999px",
          width: "1123px",
          height: "794px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -9999,
        }}
      >
        <div ref={exportRef}>
          <InternshipCertificate data={data} />
        </div>
      </div>
    </div>
  );
}
