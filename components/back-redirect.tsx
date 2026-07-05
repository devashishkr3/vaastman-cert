"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface BackRedirectProps {
  /** Where to navigate back to */
  href: string;
  /** Label shown in the pill, e.g. "Back to products" */
  label: string;
  /** Extra className on the pill */
  className?: string;
  /** Navigation method to use */
  method?: "push" | "replace" | "href";
}

export function BackRedirect({
  href,
  label,
  className,
  method = "replace",
}: BackRedirectProps) {
  const router = useRouter();

  const handleNavigation = () => {
    if (method === "href") {
      router.push(href);
    } else if (method === "push") {
      router.push(href);
    } else {
      router.replace(href);
    }
  };

  return (
    <Button
      onClick={handleNavigation}
      variant={"outline"}
      className={cn(className)}
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
