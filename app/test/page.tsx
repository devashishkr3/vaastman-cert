"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <Button onClick={() => toast.success("Success! Data Saved.")}>
      Click Me
    </Button>
  );
}
