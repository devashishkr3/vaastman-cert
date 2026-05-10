"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentLayout } from "@/components/admin-panel/content-layout";

interface BackRedirectProps {
  /** Where to navigate back to */
  href: string;
  /** Label shown in the pill, e.g. "Back to products" */
  label: string;
  /** Extra className on the pill */
  className?: string;
}

export function BackRedirect({ href, label, className }: BackRedirectProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.replace(href)}
      className={cn(
        "inline-flex items-center gap-1.5",
        "px-3 py-1.5 rounded-full",
        "border border-border bg-background",
        "text-sm text-muted-foreground",
        "transition-colors duration-100",
        "hover:bg-muted hover:text-foreground hover:border-input",
        "active:scale-[0.97]",
        "cursor-pointer select-none",
        className
      )}
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

export default function Page() {
  return (
    <ContentLayout title="hi there">

    <BackRedirect href="/dashboard" label="Back to dashboard" />
    </ContentLayout>
  )
}