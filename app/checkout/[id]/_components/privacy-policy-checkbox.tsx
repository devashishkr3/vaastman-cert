"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { recordPrivacyAcceptance } from "../lib/actions";

type PrivacyPolicyCheckboxProps = {
  candidateId: string;
  defaultAccepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
  onSavingChange: (saving: boolean) => void;
};

export function PrivacyPolicyCheckbox({
  candidateId,
  defaultAccepted,
  onAcceptChange,
  onSavingChange,
}: PrivacyPolicyCheckboxProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [accepted, setAccepted] = useState(defaultAccepted);

  const handleCheckedChange = async (checked: boolean | "indeterminate") => {
    const isAccepted = checked === true;
    if (!isAccepted) {
      setAccepted(false);
      onAcceptChange(false);
      return;
    }

    setIsRecording(true);
    onSavingChange(true);
    try {
      const res = await recordPrivacyAcceptance(candidateId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setAccepted(true);
      onAcceptChange(true);
    } catch {
      toast.error("Failed to record privacy policy acceptance");
    } finally {
      setIsRecording(false);
      onSavingChange(false);
    }
  };

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        id="privacy-acceptance"
        checked={accepted}
        disabled={isRecording || accepted}
        onCheckedChange={handleCheckedChange}
      />
      <Label
        htmlFor="privacy-acceptance"
        className="cursor-pointer text-sm leading-snug"
      >
        {isRecording ? (
          "Saving..."
        ) : (
          <>
            I have read and agree to the{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              className="underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </>
        )}
      </Label>
    </div>
  );
}
