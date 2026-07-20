"use client";

import { Cinzel, Alice, Noto_Serif, EB_Garamond } from "next/font/google";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

/* ── Certificate fonts ─────────────────────────────────────────── */

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const alice = Alice({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

/* ── Types ─────────────────────────────────────────────────────── */

export type CertificateData = {
  name: string;
  fatherName: string;
  courseName: string;
  universityRollNo: string;
  collegeName: string;
  honoursSubject: string;
  grade: string | null;
  semester: number;
  programHrs: number;
  certificateNo: string;
  registrationNo: string;
  issueDate: string; // pre-formatted string
  gender: string;
};

type InternshipCertificateProps = {
  data: CertificateData;
};

/* ── Helpers ───────────────────────────────────────────────────── */

function getSemesterLabel(sem: number | string): string {
  const num = typeof sem === "number" ? sem : Number.parseInt(String(sem), 10);
  const roman: Record<number, string> = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
  };
  if (!Number.isNaN(num) && roman[num]) {
    return roman[num];
  }
  return String(sem);
}

function getPronoun(gender: string): { subject: string; possessive: string } {
  const g = gender.toLowerCase();
  if (g === "male" || g === "m") {
    return { subject: "He", possessive: "his" };
  }
  if (g === "female" || g === "f") {
    return { subject: "She", possessive: "her" };
  }
  return { subject: "He/She", possessive: "his/her" };
}

/** Build a verification URL the QR code points to */
function buildVerificationUrl(certificateNo: string): string {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://vaastman.com";
  return `${baseUrl}/verify/internship/${encodeURIComponent(certificateNo)}`;
}

/* ── Component ─────────────────────────────────────────────────── */

export function InternshipCertificate({ data }: InternshipCertificateProps) {
  const { subject, possessive } = getPronoun(data.gender);

  return (
    <div
      className="certificate-wrapper"
      style={{
        position: "relative",
        width: "1123px",
        height: "794px",
        overflow: "hidden",
        fontFamily: notoSerif.style.fontFamily,
      }}
    >
      {/* Background */}
      <Image
        src="/certificate/bg.png"
        alt=""
        fill
        style={{ objectFit: "cover" }}
        unoptimized
      />

      {/* Overlay content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "55px 70px",
        }}
      >
        {/* ── Header ───────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {/* Company — logo + title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src="/certificate/logo.png"
              alt="Vaastman Logo"
              width={120}
              height={120}
              style={{ objectFit: "contain" }}
              unoptimized
            />
            <h1
              className={ebGaramond.className}
              style={{
                fontSize: "60px",
                fontWeight: 800,
                color: "#8B6914",
                lineHeight: 1.1,
                // letterSpacing: "-1px",
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              Vaastman Solutions Pvt. Ltd.
            </h1>
          </div>
        </div>

        {/* ── Title ────────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            marginTop: "6px",
            textAlign: "center",
          }}
        >
          <h2
            className={cinzel.className}
            style={{
              fontSize: "44px",
              fontWeight: 700,
              color: "#252b8e",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.25)",
              letterSpacing: "0px",
              margin: 0,
            }}
          >
            CERTIFICATE OF INTERNSHIP
          </h2>
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        <div
          style={{
            width: "88%",
            margin: "40px auto 0",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: notoSerif.style.fontFamily,
              fontSize: "19.2px",
              lineHeight: 1.9,
              color: "#111",
            }}
          >
            This is to certify that <strong>{data.name}</strong> S/o or D/o{" "}
            <strong>{data.fatherName}</strong> is a regular student of{" "}
            <strong>{data.courseName}</strong> (MJC Subject -{" "}
            <strong>{data.honoursSubject}</strong>) four-year degree course of{" "}
            <strong>{getSemesterLabel(data.semester)} Semester</strong> having
            University Roll No. <strong>{data.universityRollNo}</strong> of{" "}
            <strong>{data.collegeName}</strong>. {subject} has successfully
            completed {possessive} <strong>{data.programHrs} hours</strong>{" "}
            internship program on topic of{" "}
            <strong>{data.honoursSubject}</strong> &amp; obtained grade{" "}
            <strong>{data.grade ?? "N/A"}</strong>.
          </p>

          {/* Message */}
          <div style={{ marginTop: "25px", textAlign: "center" }}>
            <p
              style={{
                fontFamily: notoSerif.style.fontFamily,
                fontSize: "20px",
                fontWeight: 500,
                color: "#111",
              }}
            >
              We wish all success in {possessive} future endeavor.
            </p>
          </div>

          {/* Certificate info */}
          <hr
            style={{
              border: "none",
              borderTop: "1.5px solid #888",
              width: "70%",
              margin: "12px auto",
            }}
          />
          <div
            style={{
              textAlign: "center",
              fontFamily: notoSerif.style.fontFamily,
              fontSize: "17px",
              color: "#111",
            }}
          >
            <span>
              Certificate No. : <strong>{data.certificateNo}</strong>
            </span>
            <span style={{ margin: "0 20px" }}>|</span>
            <span>
              Reg. No. : <strong>{data.registrationNo}</strong>
            </span>
            <span style={{ margin: "0 20px" }}>|</span>
            <span>
              Issue Date : <strong>{data.issueDate}</strong>
            </span>
          </div>
        </div>

        {/* ── Signatures ───────────────────────────────────── */}

        {/* Supervisor / Trainer signature — positioned above the
            "Supervisor" label in the background (~left 29%) */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "220px",
            width: "320px",
            textAlign: "center",
          }}
        >
          <Image
            src="/certificate/trainer4.png"
            alt="Supervisor Signature"
            width={300}
            height={180}
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>

        {/* Director signature — positioned above the
            "Director" label in the background (~right 65%) */}
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            right: "180px",
            width: "330px",
            textAlign: "center",
          }}
        >
          <Image
            src="/certificate/director.png"
            alt="Director Signature"
            width={310}
            height={190}
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>

        {/* Stamp — centred between the two signature blocks */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50px",
          }}
        >
          <Image
            src="/certificate/stamp.png"
            alt="Company Stamp"
            width={280}
            height={280}
            style={{ objectFit: "contain" }}
            unoptimized
          />
        </div>

        {/* QR Code — bottom-right, working verification link */}
        <div
          style={{
            position: "absolute",
            right: "90px",
            bottom: "70px",
            textAlign: "center",
          }}
        >
          <QRCodeSVG
            value={buildVerificationUrl(data.certificateNo)}
            size={100}
            level="M"
            bgColor="transparent"
          />
          <p
            style={{
              fontFamily: notoSerif.style.fontFamily,
              fontSize: "12px",
              color: "#111",
              fontWeight: 600,
              marginTop: "4px",
              letterSpacing: "0.5px",
              lineHeight: 1.4,
            }}
          >
            Scan to Verify
            <br />
            Authenticity
          </p>
        </div>

        {/* Footer design line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "40px",
          }}
        />
      </div>

      {/* Print-only page setup */}
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: scoped print styles
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 landscape;
                margin: 0;
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .certificate-wrapper {
                page-break-after: always;
              }
            }
          `,
        }}
      />
    </div>
  );
}
