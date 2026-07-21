"use client";

import {
  IconAlertTriangleFilled,
  IconDownload,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CertificatePreview } from "./_components/certificate-preview";
import { DownloadForm } from "./_components/download-form";
import type { DownloadCertificateData } from "./lib/actions";
import { lookupCertificateForDownload } from "./lib/actions";

export default function DownloadInternshipPage() {
  const [certificateData, setCertificateData] =
    useState<DownloadCertificateData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResult = (result: {
    success: boolean;
    message?: string;
    data?: unknown;
  }) => {
    if (result.success && result.data) {
      setCertificateData(result.data as DownloadCertificateData);
      setErrorMessage(null);
    } else {
      setCertificateData(null);
      setErrorMessage(result.message ?? "Something went wrong.");
    }
  };

  const handleBack = () => {
    setCertificateData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6">
      {/* Brand Header */}
      <header className="max-w-5xl mx-auto mb-10 flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/certificate/logo.png"
            alt="Vaastman Logo"
            width={44}
            height={44}
            className="object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <span className="font-bold text-lg text-foreground block leading-tight">
              Vaastman Solutions
            </span>
            <span className="text-xs text-muted-foreground">
              Certificate Download Portal
            </span>
          </div>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto">
        {certificateData ? (
          /* Certificate Preview + Download */
          <CertificatePreview data={certificateData} onBack={handleBack} />
        ) : (
          /* Identity Verification Form */
          <div className="max-w-xl mx-auto space-y-8 pt-4">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
                <IconDownload className="size-8" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Download Your Certificate
              </h1>

              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Enter your details below to verify your identity and download
                your internship certificate.
              </p>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex items-start gap-3">
                <IconAlertTriangleFilled className="size-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}

            <DownloadForm
              onResult={handleResult}
              lookupAction={lookupCertificateForDownload}
            />

            {/* Info callout */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
              <IconRosetteDiscountCheckFilled className="size-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">
                  Secure Identity Verification
                </p>
                <p>
                  Your personal details are used solely to verify your identity
                  and are not stored or shared. Only candidates with matching
                  records can download their certificates.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto mt-16 text-center text-xs text-muted-foreground border-t border-border pt-6 space-y-1">
        <p>
          © {new Date().getFullYear()} Vaastman Solutions Pvt. Ltd. All rights
          reserved.
        </p>
        <p>Official Certificate Download System</p>
      </footer>
    </div>
  );
}
