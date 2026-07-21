"use client";

import { EB_Garamond, Noto_Serif } from "next/font/google";
import Image from "next/image";
import { ONLINE_ACTIVITIES } from "../lib/attendance-data";

/* ── Fonts ──────────────────────────────────────────────────────── */

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* ── Types ──────────────────────────────────────────────────────── */

export type AttendanceSheetData = {
  name: string;
  registrationNo: string;
  honoursSubject: string;
  courseName: string;
  universityRollNo: string;
  gender: string;
  collegeName?: string;
};

/* ── Helpers ────────────────────────────────────────────────────── */

/** Get pronouns and title based on gender */
function getPronouns(gender: string) {
  const g = gender.toLowerCase();
  if (g === "male" || g === "m") {
    return { title: "Mr.", subject: "he", possessive: "his", object: "him" };
  }
  if (g === "female" || g === "f") {
    return { title: "Ms.", subject: "she", possessive: "her", object: "her" };
  }
  return {
    title: "Mr./Ms.",
    subject: "he/she",
    possessive: "his/her",
    object: "him/her",
  };
}

/** Truncate a URL to a max character length, adding "..." */
function truncateUrl(url: string, maxLen: number): string {
  if (url.length <= maxLen) return url;
  return `${url.slice(0, maxLen - 3)}...`;
}

/* ── Single-page A4 portrait: 794 x 1123 ────────────────────── */

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

/* ── Component ──────────────────────────────────────────────────── */

export function AttendanceSheet({ data }: { data: AttendanceSheetData }) {
  // Split items into two columns
  const mid = Math.ceil(ONLINE_ACTIVITIES.length / 2);
  const col1 = ONLINE_ACTIVITIES.slice(0, mid);
  const col2 = ONLINE_ACTIVITIES.slice(mid);

  const { title, subject, possessive, object } = getPronouns(data.gender);

  return (
    <div
      id="attendance-sheet"
      style={{
        width: `${PAGE_WIDTH}px`,
        height: `${PAGE_HEIGHT}px`,
        background: "#fff",
        position: "relative",
        overflow: "hidden",
        fontFamily: notoSerif.style.fontFamily,
        boxSizing: "border-box",
        padding: "36px 40px 50px",
      }}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "3px solid #c0392b",
          paddingBottom: "10px",
          marginBottom: "16px",
        }}
      >
        <Image
          src="/certificate/logo.png"
          alt="Vaastman Logo"
          width={50}
          height={50}
          style={{ objectFit: "contain", height: "auto", marginRight: "12px" }}
          unoptimized
        />
        <h1
          className={ebGaramond.className}
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#c0392b",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "1px",
          }}
        >
          Vaastman Solutions Pvt. Ltd.
        </h1>
      </div>

      {/* ── Student info paragraph ────────────────────────── */}
      <div
        style={{
          fontSize: "13px",
          lineHeight: 1.7,
          color: "#111",
          marginBottom: "14px",
          textAlign: "justify",
        }}
      >
        This is to certify that {title} <strong>{data.name}</strong>, a student
        of <strong>{data.collegeName ?? "the institution"}</strong>, bearing
        University Registration No. <strong>{data.registrationNo}</strong>, has
        successfully completed {possessive} internship at Vaastman Solutions
        Pvt. Ltd. with an overall attendance of 94%. Throughout the internship,{" "}
        {subject} demonstrated dedication, punctuality, and professionalism. We
        wish {object} continued success in all future academic and professional
        endeavors.
      </div>
      <br />
      <br />
      <br />

      {/* ── Section title ─────────────────────────────────── */}
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#222",
          marginBottom: "8px",
          paddingLeft: "6px",
        }}
      >
        Online activities links:
      </div>

      {/* ── Two-column activity links ─────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          paddingLeft: "6px",
        }}
      >
        {/* Column 1 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {col1.map((item) => {
            const isHighlight =
              item.label.startsWith("Test") || item.label.startsWith("Exam");
            return (
              <div
                key={`${item.label}-1`}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "4px",
                  padding: "2.5px 0",
                  fontSize: "11px",
                  lineHeight: 1.45,
                }}
              >
                <span
                  style={{
                    color: isHighlight ? "#c0392b" : "#222",
                    flexShrink: 0,
                    fontSize: "9px",
                  }}
                >
                  ➤
                </span>
                <span
                  style={{
                    fontWeight: isHighlight ? 700 : 600,
                    color: isHighlight ? "#c0392b" : "#222",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}:
                </span>
                <span
                  style={{
                    color: "#1a0dab",
                    textDecoration: "underline",
                    fontSize: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {truncateUrl(item.url, 42)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Column 2 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {col2.map((item) => {
            const isHighlight =
              item.label.startsWith("Test") || item.label.startsWith("Exam");
            return (
              <div
                key={`${item.label}-2`}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "4px",
                  padding: "2.5px 0",
                  fontSize: "11px",
                  lineHeight: 1.45,
                }}
              >
                <span
                  style={{
                    color: isHighlight ? "#c0392b" : "#222",
                    flexShrink: 0,
                    fontSize: "9px",
                  }}
                >
                  ➤
                </span>
                <span
                  style={{
                    fontWeight: isHighlight ? 700 : 600,
                    color: isHighlight ? "#c0392b" : "#222",
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}:
                </span>
                <span
                  style={{
                    color: "#1a0dab",
                    textDecoration: "underline",
                    fontSize: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {truncateUrl(item.url, 42)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "15px",
          right: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Image
          src="/certificate/stamp.png"
          alt="Company Stamp"
          width={300}
          height={300}
          style={{ objectFit: "contain", height: "auto" }}
          unoptimized
        />
        <span
          style={{
            fontSize: "17px",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#111",
            fontFamily: notoSerif.style.fontFamily,
            whiteSpace: "nowrap",
            marginTop: "-40px",
          }}
        >
          Vaastman Solutions Pvt. Ltd.
        </span>
      </div>
    </div>
  );
}
