"use client";

import { IconCircleCheckFilled } from "@tabler/icons-react";
import Image from "next/image";
import type { ReactNode } from "react";

// Payment receipt data structure - defines all fields needed for a complete receipt
export type PaymentReceiptData = {
  status: string;
  receiptNo: string | null;
  orderId: string;
  paymentId: string | null;
  paidAt: string;
  amount: number;
  currency: string;
  studentName: string;
  fatherName: string;
  email: string;
  phone: string;
  universityRoll: string;
  collegeRoll: string;
  collegeName: string;
  session: string;
  course: string | null;
  duration: string;
  domain: string;
};

type ReceiptSectionProps = {
  receipt: PaymentReceiptData;
};

// Generic label-value pair for receipt details
type ReceiptDetail = {
  label: string;
  value: string;
};

const COMPANY_NAME = "VAASTMAN SOLUTIONS PVT. LTD.";

// Important notes to display at the bottom of the receipt
const NOTES = [
  "This receipt is official proof of payment for the registration/program.",
  "Keep this receipt safe for verification and support-related queries.",
  "This is a computer-generated receipt and does not require signature or seal.",
];

/**
 * Formats amount from paise to currency string (IN format)
 * @param amountInPaise - Amount in paise (1/100 of currency unit)
 * @param currency - Currency code (e.g., INR)
 * @returns Formatted currency string
 */
function formatAmount(amountInPaise: number, currency: string) {
  const amount = amountInPaise / 100;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats date to en-IN format (DD-MMM-YYYY)
 * @param value - ISO date string
 * @returns Formatted date string
 */
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Formats time to en-IN 12-hour format
 * @param value - ISO date string
 * @returns Formatted time string
 */
function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

/**
 * Safely formats nullable/undefined strings
 * @param value - String or null/undefined
 * @returns Original string or "Not available"
 */
function formatNullable(value: string | null | undefined) {
  return value?.trim() || "Not available";
}

/**
 * Section title component with left border accent
 * Design: 4px left black border, padding, bold small text
 */
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 border-l-4 border-black px-3 py-2 text-sm font-bold">
      {children}
    </h2>
  );
}

/**
 * Generic details section component for label-value pairs
 * Design: Responsive grid (1 col on mobile, 2 cols on md+),
 *         each item has dashed bottom border,
 *         label column width increases for print to prevent wrapping
 */
function DetailsSection({
  title,
  details,
}: {
  title: string;
  details: ReceiptDetail[];
}) {
  return (
    <section className="mt-5">
      <SectionTitle>{title}</SectionTitle>
      <dl className="grid gap-x-8 gap-y-2.5 md:grid-cols-2">
        {details.map((detail) => (
          <div
            className="grid gap-1 border-b border-dashed border-black/25 pb-1.5 sm:grid-cols-[140px_1fr] print:grid-cols-[160px_1fr]"
            key={detail.label}
          >
            <dt className="font-bold text-black/80">{detail.label}</dt>
            <dd className="font-medium">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * Receipt header with company logo, name, and payment status
 * Design: Responsive grid (1 col on mobile, 3 cols on md+),
 *         dashed border logo placeholder, centered company name,
 *         right-aligned status badge with check icon
 */
export function ReceiptHeader({ receipt }: ReceiptSectionProps) {
  return (
    <header className="grid gap-4 border-b-2 border-black/10 pb-4 md:grid-cols-[72px_1fr_auto] md:items-center print:grid-cols-[72px_1fr_auto] print:items-center">
      <div className="flex size-[72px] items-center justify-center border-2 border-dashed border-black text-center text-xs font-semibold">
        <Image
          className="object-cover"
          src="/logo.jpeg"
          alt={COMPANY_NAME}
          width={72}
          height={72}
        />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold">{COMPANY_NAME}</h2>
        {/* <p>hi there</p> */}
      </div>

      <div className="flex justify-start md:justify-end print:justify-end">
        <span className="inline-flex items-center gap-1.5 border border-black px-3 py-1.5 text-xs font-bold">
          <IconCircleCheckFilled className="size-5" />
          {receipt.status}
        </span>
      </div>
    </header>
  );
}

/**
 * Payment information section - receipt no, order ID, payment details
 */
export function PaymentInformation({ receipt }: ReceiptSectionProps) {
  return (
    <DetailsSection
      details={[
        { label: "Receipt No.", value: formatNullable(receipt.receiptNo) },
        { label: "Order ID", value: receipt.orderId },
        { label: "Payment ID", value: formatNullable(receipt.paymentId) },
        { label: "Payment Mode", value: "Online" },
        {
          label: "Payment Date & Time",
          value: `${formatDate(receipt.paidAt)} : ${formatTime(receipt.paidAt)}`,
        },
      ]}
      title="Payment Information"
    />
  );
}

/**
 * Student details section - personal and academic information
 */
export function StudentDetails({ receipt }: ReceiptSectionProps) {
  return (
    <DetailsSection
      details={[
        { label: "Student Name", value: receipt.studentName },
        // { label: "Father's Name", value: receipt.fatherName },
        // { label: "Email", value: receipt.email },
        // { label: "Phone", value: receipt.phone },
        { label: "University Roll No.", value: receipt.universityRoll },
        { label: "College Roll No.", value: receipt.collegeRoll },
        { label: "College Name", value: receipt.collegeName },
        { label: "Session", value: receipt.session },
        // { label: "Course", value: formatNullable(receipt.course) },
        // { label: "Duration", value: receipt.duration },
        { label: "Domain", value: receipt.domain },
      ]}
      title="Student Details"
    />
  );
}

/**
 * Payment summary section - line items with total
 * Design: Bordered container, each row with bottom border,
 *         last row has thicker top border and bold text
 */
export function PaymentSummary({ receipt }: ReceiptSectionProps) {
  const totalPaidAmount = formatAmount(receipt.amount, receipt.currency);
  const rows = [
    { label: "Program Fees", value: totalPaidAmount },
    { label: "GST", value: formatAmount(0, receipt.currency) },
    { label: "Total Paid Amount", value: totalPaidAmount },
  ];

  return (
    <section className="mt-5">
      <SectionTitle>Payment Summary</SectionTitle>
      <div className="border border-black/20">
        {rows.map((row) => (
          <div
            className="flex items-center justify-between gap-4 border-b border-black/10 px-4 py-2.5 last:border-b-0 last:border-t-2 last:border-black last:text-sm last:font-bold"
            key={row.label}
          >
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Important notes section with left border accent
 * Design: 4px left border, padded container, bullet points
 */
export function ImportantNotes() {
  return (
    <section className="mt-5 border-l-4 border-black p-3">
      <h2 className="text-sm font-bold">Important Note</h2>
      <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-xs leading-5 text-black/75">
        {NOTES.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  );
}
