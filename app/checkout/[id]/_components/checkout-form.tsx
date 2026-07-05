"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getAgreementStatus } from "../lib/actions";
import { PaymentButton } from "./payment-button";
import { PrivacyPolicyCheckbox } from "./privacy-policy-checkbox";
import { TermsAndConditions } from "./terms-and-conditions";

export function CheckoutForm({ candidateId }: { candidateId: string }) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const savingCount = useRef(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const res = await getAgreementStatus(candidateId);
        if (cancelled) return;
        if (res.success && res.data) {
          setTermsAccepted(res.data.termsAccepted);
          setPrivacyAccepted(res.data.privacyAccepted);
        }
      } catch {
        toast.error("Failed to load agreement status");
      } finally {
        if (!cancelled) setIsLoadingStatus(false);
      }
    }

    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [candidateId]);

  const handleSavingChange = useCallback((saving: boolean) => {
    savingCount.current += saving ? 1 : -1;
    setIsSaving(savingCount.current > 0);
  }, []);

  const allAccepted = termsAccepted && privacyAccepted;

  if (isLoadingStatus) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-80 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <TermsAndConditions
        candidateId={candidateId}
        defaultAccepted={termsAccepted}
        onAcceptChange={setTermsAccepted}
        onSavingChange={handleSavingChange}
      />
      <PrivacyPolicyCheckbox
        candidateId={candidateId}
        defaultAccepted={privacyAccepted}
        onAcceptChange={setPrivacyAccepted}
        onSavingChange={handleSavingChange}
      />
      <PaymentButton
        candidateId={candidateId}
        allAccepted={allAccepted}
        isSavingAgreements={isSaving}
      />
    </div>
  );
}
