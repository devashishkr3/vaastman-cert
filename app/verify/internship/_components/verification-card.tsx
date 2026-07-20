"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IconRosetteDiscountCheckFilled,
  IconCertificate,
  IconCalendar,
  IconClock,
  IconAward,
  IconCheck,
  IconBuilding,
  IconSearch,
} from "@tabler/icons-react";
import type { VerificationResultData } from "../lib/actions";

type VerificationCardProps = {
  data: VerificationResultData;
};

export function VerificationCard({ data }: VerificationCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* ── Official Verified Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/90 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/30">
        {/* Background decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Verified Badge Icon */}
          <div className="shrink-0 p-3 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-400/30 ring-4 ring-emerald-500/10">
            <IconRosetteDiscountCheckFilled className="size-12 text-emerald-400" />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              AUTHENTICATED & VERIFIED
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Official Internship Certificate
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed pt-1">
              This certificate has been verified as authentic and issued by{" "}
              <strong className="text-emerald-200 font-semibold">
                Vaastman Solutions Pvt. Ltd.
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── Issuer Header & Summary ── */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-lg bg-background p-1.5 border border-border shrink-0 flex items-center justify-center">
            <Image
              src="/certificate/logo.png"
              alt="Vaastman Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">
              Vaastman Solutions Pvt. Ltd.
            </h2>
            <p className="text-xs text-muted-foreground">
              Issued Authority & Corporate Partner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 font-medium">
          <IconCheck className="size-4 shrink-0" />
          Verified Database Record
        </div>
      </div>

      {/* ── Certificate Details Grid (no personal data) ── */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <IconCertificate className="size-5 text-primary" />
            Certificate Details
          </h3>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
            {data.certificateNo}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Course & Subject */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1 sm:col-span-2">
            <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider flex items-center gap-1.5">
              <IconBuilding className="size-4 text-muted-foreground" /> Course &
              Subject
            </span>
            <p className="text-base font-semibold text-foreground">
              {data.courseName} ({data.honoursSubject})
            </p>
          </div>

          {/* Semester */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider flex items-center gap-1.5">
              <IconCertificate className="size-4 text-muted-foreground" />{" "}
              Academic Semester
            </span>
            <p className="text-base font-semibold text-foreground">
              Semester {data.semester}
            </p>
          </div>

          {/* Program Hours */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider flex items-center gap-1.5">
              <IconClock className="size-4 text-muted-foreground" /> Internship
              Duration
            </span>
            <p className="text-base font-semibold text-foreground">
              {data.programHrs} Hours
            </p>
          </div>

          {/* Grade Obtained */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider flex items-center gap-1.5">
              <IconAward className="size-4 text-muted-foreground" /> Grade
              Awarded
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-sm font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {data.grade || "Completed"}
              </span>
            </div>
          </div>

          {/* Issue Date */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider flex items-center gap-1.5">
              <IconCalendar className="size-4 text-muted-foreground" />{" "}
              Certificate Issue Date
            </span>
            <p className="text-base font-semibold text-foreground">
              {data.issueDate}
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer Search Link ── */}
      <div className="text-center pt-2">
        <Link
          href="/verify/internship"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-lg border border-border bg-card shadow-2xs"
        >
          <IconSearch className="size-4" />
          Verify Another Certificate
        </Link>
      </div>
    </div>
  );
}
