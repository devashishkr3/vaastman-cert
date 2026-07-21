"use client";

import {
  IconId,
  IconLoader2,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";

type DownloadFormProps = {
  onResult: (result: {
    success: boolean;
    message?: string;
    data?: unknown;
  }) => void;
  lookupAction: (
    identifier: string,
    fatherName: string,
  ) => Promise<{ success: boolean; message?: string; data?: unknown }>;
};

export function DownloadForm({ onResult, lookupAction }: DownloadFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !fatherName.trim()) return;

    setIsLoading(true);
    try {
      const result = await lookupAction(
        identifier.trim(),
        fatherName.trim(),
      );
      onResult(result);
    } catch {
      onResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5"
    >
      {/* University Roll No / Registration No */}
      <div className="space-y-2">
        <label
          htmlFor="download-identifier"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
        >
          <IconId className="size-4" /> University Roll No. / Registration No.
        </label>
        <input
          id="download-identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter your University Roll No. or Registration No."
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono tracking-wide"
          required
        />
      </div>


      {/* Father's Name */}
      <div className="space-y-2">
        <label
          htmlFor="download-father"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
        >
          <IconUser className="size-4" /> Father&apos;s Name
        </label>
        <input
          id="download-father"
          type="text"
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
          placeholder="Enter your father's full name"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <IconLoader2 className="size-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <IconSearch className="size-4" />
            Find My Certificate
          </>
        )}
      </button>
    </form>
  );
}
