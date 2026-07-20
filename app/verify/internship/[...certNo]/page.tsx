import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCertificateVerification } from "../lib/actions";
import { VerificationCard } from "../_components/verification-card";
import { VerificationNotFound } from "../_components/verification-not-found";

type VerifyParams = {
  params: Promise<{
    certNo: string[];
  }>;
};

export async function generateMetadata({
  params,
}: VerifyParams): Promise<Metadata> {
  const resolvedParams = await params;
  const rawCertNo = Array.isArray(resolvedParams.certNo)
    ? resolvedParams.certNo.map((p) => decodeURIComponent(p)).join("/")
    : decodeURIComponent(resolvedParams.certNo || "");

  return {
    title: rawCertNo
      ? `Verify Certificate: ${rawCertNo} | Vaastman Solutions`
      : "Certificate Verification | Vaastman Solutions",
    description:
      "Official certificate verification system for Vaastman Solutions Pvt. Ltd. internship certificates.",
  };
}

export default async function VerifyCertificatePage({ params }: VerifyParams) {
  const resolvedParams = await params;

  const rawCertNo = Array.isArray(resolvedParams.certNo)
    ? resolvedParams.certNo.map((p) => decodeURIComponent(p)).join("/")
    : decodeURIComponent(resolvedParams.certNo || "");

  const result = await getCertificateVerification(rawCertNo);

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6">
      {/* ── Public Brand Header ── */}
      <header className="max-w-3xl mx-auto mb-8 flex items-center justify-between border-b border-border pb-4">
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
              Official Verification Portal
            </span>
          </div>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto">
        {result.success && result.data ? (
          <VerificationCard data={result.data} />
        ) : (
          <VerificationNotFound
            certificateNo={rawCertNo}
            message={result.message}
          />
        )}
      </main>

      <footer className="max-w-3xl mx-auto mt-16 text-center text-xs text-muted-foreground border-t border-border pt-6 space-y-1">
        <p>
          © {new Date().getFullYear()} Vaastman Solutions Pvt. Ltd. All rights
          reserved.
        </p>
        <p>Official Authentication & Validation System</p>
      </footer>
    </div>
  );
}
