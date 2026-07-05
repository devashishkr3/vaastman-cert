"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { recordTermsAcceptance } from "../lib/actions";

type TermsAndConditionsProps = {
  candidateId: string;
  defaultAccepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
  onSavingChange: (saving: boolean) => void;
};

export function TermsAndConditions({
  candidateId,
  defaultAccepted,
  onAcceptChange,
  onSavingChange,
}: TermsAndConditionsProps) {
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
      const res = await recordTermsAcceptance(candidateId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setAccepted(true);
      onAcceptChange(true);
    } catch {
      toast.error("Failed to record terms acceptance");
    } finally {
      setIsRecording(false);
      onSavingChange(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <h3 className="font-semibold text-sm">Terms and Conditions</h3>
        <p className="text-muted-foreground text-xs">
          Please read the following terms and conditions carefully before
          proceeding.
        </p>
      </div>

      <ScrollArea className="h-64 rounded-md border p-4">
        <div className="space-y-4 pr-4 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h4 className="mb-1 font-semibold text-foreground">
              1. Nature of the Internship Opportunity
            </h4>
            <p>
              The internship opportunity extended by the Organization is granted
              independently of, and is not contingent upon, any administrative,
              infrastructural, or onboarding charges levied hereunder. For the
              avoidance of doubt, no fee, charge, or consideration whatsoever is
              collected, demanded, or received by the Organization in exchange
              for, or as a precondition to, the grant of the internship
              opportunity itself.
            </p>
          </section>

          <section>
            <h4 className="mb-1 font-semibold text-foreground">
              2. Administrative, Infrastructural, and Onboarding Charges
            </h4>
            <p>
              Notwithstanding Clause 1, the Organization reserves the right to
              levy certain administrative, infrastructural, and operational
              charges as may be applicable, strictly in connection with
              facilitating the onboarding, training, and technical enablement of
              the applicant. Such charges are levied solely towards defraying
              the cost of services rendered and infrastructure utilized, and
              shall not, under any circumstance, be construed as consideration
              for the internship opportunity itself. Without prejudice to the
              generality of the foregoing, such charges may include, but shall
              not be limited to, the following:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Identity verification and background authentication</li>
              <li>
                Documentation processing, record-keeping, and compliance
                formalities
              </li>
              <li>Candidate onboarding and administrative processing</li>
              <li>
                Learning management system (LMS) access and platform licensing
              </li>
              <li>
                Training resources, curriculum materials, and instructional
                content
              </li>
              <li>Mentorship and guidance session facilitation</li>
              <li>
                Technical infrastructure provisioning, including servers, cloud
                resources, and software licensing
              </li>
              <li>Account creation, provisioning, and technical support</li>
              <li>Certificate issuance, processing, and verification</li>
              <li>Assessment, evaluation, and examination processing</li>
              <li>Communication and collaboration tool access</li>
              <li>Data storage, hosting, and maintenance costs</li>
              <li>
                Administrative overheads associated with programme coordination
              </li>
              <li>
                Any other incidental or ancillary service required for
                successful onboarding and participation
              </li>
            </ul>
          </section>

          <section>
            <h4 className="mb-1 font-semibold text-foreground">
              3. Payment and Disclosure
            </h4>
            <p>
              All applicable charges, if any, shall be transparently displayed
              to the applicant prior to the completion of the checkout process.
              The act of proceeding with payment shall constitute unequivocal
              acknowledgment and acceptance of the nature, purpose, and quantum
              of such charges, as well as of these Terms and Conditions in their
              entirety.
            </p>
          </section>

          <section>
            <h4 className="mb-1 font-semibold text-foreground">
              4. Acceptance of Terms
            </h4>
            <p>
              By proceeding with the checkout process, the applicant expressly
              affirms that they have read, comprehended, and voluntarily agreed
              to be bound by these Terms and Conditions, and further
              acknowledges that no representation, warranty, or assurance beyond
              what is expressly stated herein has been relied upon.
            </p>
          </section>

          <section>
            <h4 className="mb-1 font-semibold text-foreground">
              5. Refund Policy
            </h4>
            <p>
              Eligibility for any refund, whether in whole or in part, shall be
              determined strictly in accordance with the Organization&apos;s
              published Refund Policy, as may be amended from time to time, and
              shall be subject to the terms and conditions stipulated therein.
            </p>
          </section>

          <section>
            <h4 className="mb-1 font-semibold text-foreground">
              6. Amendments
            </h4>
            <p>
              The Organization reserves the unilateral right to amend, modify,
              revise, or supplement these Terms and Conditions at its sole
              discretion and without prior notice. Any such amendment shall
              become effective immediately upon publication, and continued use
              of the Organization&apos;s services shall constitute acceptance of
              the amended terms.
            </p>
          </section>
        </div>
      </ScrollArea>

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms-acceptance"
          checked={accepted}
          disabled={isRecording || accepted}
          onCheckedChange={handleCheckedChange}
        />
        <Label
          htmlFor="terms-acceptance"
          className="cursor-pointer text-sm leading-snug"
        >
          I have read and agree to the Terms and Conditions stated above.
        </Label>
      </div>
    </div>
  );
}
