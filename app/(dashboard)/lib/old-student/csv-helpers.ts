/**
 * CSV parsing and data-generation helpers for old student record uploads.
 */

/**
 * The 13 exact CSV column headers we expect (after sanitization).
 */
export const EXPECTED_HEADERS = [
  "name",
  "father_name",
  "course_name",
  "university_roll_no",
  "marks",
  "registration_no",
  "college_name",
  "short_clg_name_for_certificate",
  "mobile_no",
  "email_id",
  "dob",
  "gender",
  "honours_subject",
] as const;

/**
 * Strip BOM, zero-width characters, and extra whitespace from a raw header
 * string. CSV files exported from Excel or Google Sheets often embed invisible
 * Unicode codepoints that break exact-match comparisons.
 */
export function sanitizeHeader(raw: string): string {
  return raw
    .replaceAll("\uFEFF", "")
    .replaceAll("\u200B", "")
    .replaceAll("\u200C", "")
    .replaceAll("\u200D", "")
    .replaceAll("\u00A0", "")
    .replace(/\r?\n/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Sanitize a cell value — strip zero-width chars and trim whitespace.
 */
export function sanitizeValue(raw: string): string {
  return raw
    .replaceAll("\uFEFF", "")
    .replaceAll("\u200B", "")
    .replaceAll("\u200C", "")
    .replaceAll("\u200D", "")
    .replace(/\r?\n/g, " ")
    .trim();
}

/**
 * Compute the grade string from a marks value.
 *
 * - marks >= 16 → "A+"
 * - 10 <= marks < 16 → "A"
 * - 7 <= marks < 10 → "B+"
 * - 0 < marks < 7 → "B"
 * - marks === 0 / null / undefined → null
 */
export function computeGrade(marks: number | null | undefined): string | null {
  if (marks === null || marks === undefined || marks === 0) return null;
  if (marks >= 16) return "A+";
  if (marks >= 10) return "A";
  if (marks >= 7) return "B+";
  return "B";
}

/**
 * Determine whether a record should be printable.
 * Only printable when marks is provided and > 0.
 */
export function computeIsPrintable(marks: number | null | undefined): boolean {
  if (marks === null || marks === undefined || marks === 0) return false;
  return true;
}

/**
 * Generate a random attendance percentage between 85.0 and 95.0 (1 decimal).
 */
export function generateAttendance(): number {
  const raw = 85 + Math.random() * 10; // 85.0 – 95.0
  return Math.round(raw * 10) / 10;
}

/**
 * Validate that the sanitized headers match EXPECTED_HEADERS exactly.
 * Returns an object with `valid` boolean and, on failure, details about
 * which headers are missing or unexpected.
 */
export function validateHeaders(sanitizedHeaders: string[]): {
  valid: boolean;
  missing: string[];
  unexpected: string[];
} {
  const expected = new Set<string>(EXPECTED_HEADERS);
  const actual = new Set(sanitizedHeaders);

  const missing = [...expected].filter((h) => !actual.has(h));
  const unexpected = [...actual].filter((h) => !expected.has(h));

  return {
    valid: missing.length === 0 && unexpected.length === 0,
    missing,
    unexpected,
  };
}
