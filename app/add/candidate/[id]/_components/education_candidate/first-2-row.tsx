import { Controller, type UseFormReturn } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AddCandidateEducationSchema } from "../../lib/zod-type/candidate-education";

export function FirstTwoRow({
  form,
}: {
  form: UseFormReturn<AddCandidateEducationSchema>;
}) {
  return (
    <>
      <Controller
        control={form.control}
        name="universityRoll"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel requiredLable>University Roll</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Enter university roll"
              />
              <FieldError errors={[fieldState.error]} />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="collegeRoll"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel requiredLable>College Roll</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Enter college roll"
              />
              <FieldError errors={[fieldState.error]} />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="mjcSubject"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel requiredLable>MJC Subject</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Enter MJC subject"
              />
              <FieldError errors={[fieldState.error]} />
            </FieldContent>
          </Field>
        )}
      />
    </>
  );
}
