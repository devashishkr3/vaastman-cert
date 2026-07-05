"use client";

import { toast } from "sonner";

export default function Page() {
  return (
    <button onClick={() => toast.success("hi there")}>this is button</button>
  );
}
