"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconRosetteDiscountCheckFilled,
  IconCertificate,
  IconSearch,
  IconShieldCheckFilled,
} from "@tabler/icons-react";

export default function VerifyInternshipSearchPage() {
  const [certNo, setCertNo] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNo.trim()) return;
    router.push(`/verify/internship/${encodeURIComponent(certNo.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6">
      {/* Brand Header */}
      <header className="max-w-3xl mx-auto mb-10 flex items-center justify-between border-b border-border pb-4">
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

      <main className="max-w-xl mx-auto space-y-8 pt-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
            <IconShieldCheckFilled className="size-8" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Verify Certificate
          </h1>

          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Enter the Certificate Number printed on the internship certificate
            or scan the QR code to verify its authenticity.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="certNoInput"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
            >
              <IconCertificate className="size-4" /> Certificate Number
            </label>
            <div className="relative">
              <input
                id="certNoInput"
                type="text"
                value={certNo}
                onChange={(e) => setCertNo(e.target.value)}
                placeholder="e.g. VSPL/RKD/1/2026"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono tracking-wide"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <IconSearch className="size-4" />
            Verify Authenticity
          </button>
        </form>

        {/* Security / Authenticity callout */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
          <IconRosetteDiscountCheckFilled className="size-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">
              Official Verification Record
            </p>
            <p>
              All certificates issued by Vaastman Solutions Pvt. Ltd. contain a
              unique cryptographic tracking serial number linked to our official
              student database.
            </p>
          </div>
        </div>
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
