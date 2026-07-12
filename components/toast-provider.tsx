"use client";

import { Toaster } from "sonner";

export function CustomeToast() {
  return (
    <Toaster
      closeButton
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "!font-mono !font-bold !border !shadow-lg !rounded-xl",
          success: "!bg-emerald-600 !text-white !border-emerald-700",
          title: "!font-bold",
          error: "!bg-rose-600 !text-white !border-rose-700",
          info: "!bg-sky-600 !text-white !border-sky-700",
          warning: "!bg-amber-500 !text-white !border-amber-600",
        },
      }}
    />
  );
}
