"use client";

import Link from "next/link";
import { IconAlertTriangleFilled, IconSearch } from "@tabler/icons-react";

type VerificationNotFoundProps = {
  certificateNo?: string;
  message?: string;
};

export function VerificationNotFound({
  certificateNo,
  message,
}: VerificationNotFoundProps) {
  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="bg-card border border-destructive/30 rounded-2xl p-8 text-center space-y-6 shadow-lg relative overflow-hidden">
        {/* Background ambient accent */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-destructive/10 rounded-full blur-2xl pointer-events-none" />

        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/20 ring-4 ring-destructive/5 text-destructive">
          <IconAlertTriangleFilled className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Certificate Not Verified
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {message ||
              "The certificate number you provided does not match any authenticated record in our database."}
          </p>
          {certificateNo && (
            <p className="text-xs font-mono text-destructive bg-destructive/5 px-3 py-1.5 rounded-md inline-block mt-2 border border-destructive/20">
              Queried: {certificateNo}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Link
            href="/verify/internship"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-xs"
          >
            <IconSearch className="size-4" />
            Try Another Certificate Number
          </Link>
        </div>
      </div>
    </div>
  );
}
