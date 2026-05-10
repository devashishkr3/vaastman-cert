"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useUpdateCollegeSession } from "@/app/(dashboard)/college/query/mut-update-college-session";
import {
  type AddCollegeSessionSchema,
  addCollegeSessionSchema,
} from "@/app/(dashboard)/college/session/[collegeId]/lib/zod-type/add-college-session";
import { useAddCollegeSession } from "@/app/(dashboard)/college/session/[collegeId]/query/mut-add-college-session";
import { useGetCollegeSession } from "@/app/(dashboard)/college/session/[collegeId]/query/use-get-college-session";
import { ErrorDisplay } from "@/components/error-display";
import { LoaderScreen } from "@/components/loader-screen";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { BackRedirect } from "@/components/back-redirect";

type ManageCollegeSessionProps = {
  collegeId: string;
};

export function ManageCollegeSession({ collegeId }: ManageCollegeSessionProps) {
  const { data, isPending, error } = useGetCollegeSession(collegeId);
  const { mutate, isPending: isUpdatingSessionStatus } =
    useUpdateCollegeSession(collegeId);
  const { mutateAsync: addCollegeSession, isPending: isAddingSession } =
    useAddCollegeSession(collegeId);

  const currentYear = new Date().getFullYear();
  const startSessionYears = Array.from({ length: 7 }, (_, index) =>
    String(currentYear - 3 + index),
  );
  const endSessionYears = Array.from({ length: 10 }, (_, index) =>
    String(currentYear - 2 + index),
  );

  const form = useForm<AddCollegeSessionSchema>({
    resolver: zodResolver(addCollegeSessionSchema),
    defaultValues: {
      startSession: "",
      endSession: "",
      duration: "",
      fees: "",
      domains: [],
    },
  });

  if (isPending) {
    return <LoaderScreen message="Loading session details..." />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} redirectPath="/college" />;
  }

  if (!data) {
    return <ErrorDisplay message="College not found" redirectPath="/college" />;
  }

  const onSubmit = async (payload: AddCollegeSessionSchema) => {
    await addCollegeSession(payload);
    form.reset({
      startSession: "",
      endSession: "",
      duration: "",
      fees: "",
      domains: payload.domains ?? [],
    });
  };

  const activeSessions = data.sessions.filter(
    (session) => session.status === "ACTIVE",
  );
  const archiveSessions = data.sessions.filter(
    (session) => session.status === "INACTIVE",
  );
  const domainOptions = data.domains
    .map((domain) => domain.name)
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <BackRedirect href="/college" label="Back to College" method="href" />
        <div>
          <p className="text-lg font-semibold">
            {data.name} {data.code ? `[${data.code}]` : ""}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-4 text-base font-medium">Add New Session</p>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              control={form.control}
              name="startSession"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel requiredLable>Start Session</FieldLabel>
                  <FieldContent>
                    <NativeSelect
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                      value={field.value ?? ""}
                    >
                      <NativeSelectOption value="">
                        Select start year
                      </NativeSelectOption>
                      {startSessionYears.map((year) => (
                        <NativeSelectOption key={year} value={year}>
                          {year}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="endSession"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel requiredLable>End Session</FieldLabel>
                  <FieldContent>
                    <NativeSelect
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                      value={field.value ?? ""}
                    >
                      <NativeSelectOption value="">
                        Select end year
                      </NativeSelectOption>
                      {endSessionYears.map((year) => (
                        <NativeSelectOption key={year} value={year}>
                          {year}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="duration"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel requiredLable>Duration (in hours)</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="example: 60"
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="fees"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel requiredLable>Fee</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="domains"
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2">
                  <FieldLabel>Associated Domains</FieldLabel>
                  <FieldContent>
                    <MultiSelect
                      onValuesChange={(values) => {
                        field.onChange(values);
                        field.onBlur();
                      }}
                      values={field.value ?? []}
                    >
                      <MultiSelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="w-full justify-between"
                      >
                        <MultiSelectValue
                          className="max-w-[90%]"
                          placeholder="Select associated domains"
                          overflowBehavior="wrap"
                        />
                      </MultiSelectTrigger>
                      <MultiSelectContent
                        creatable={{
                          createLabel: (value) => `Add "${value}"`,
                        }}
                        search={{
                          placeholder:
                            "Search or add domains, by comma separated",
                          emptyMessage: "No domain found. Type to create one.",
                        }}
                        uppercaseSearch
                      >
                        {domainOptions.map((domain) => (
                          <MultiSelectItem key={domain} value={domain}>
                            {domain}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectContent>
                    </MultiSelect>
                    <FieldError errors={[fieldState.error]} />
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>

          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isAddingSession}>
              <LoadingSwap isLoading={isAddingSession}>Add Session</LoadingSwap>
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border p-4">
        <p className="mb-3 text-base font-medium">Current Sessions</p>
        <div className="flex flex-col gap-2">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <p className="text-sm">
                {session.name} • {session.fees}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={isUpdatingSessionStatus}
                onClick={() =>
                  mutate({
                    sessionId: session.id,
                    status: "INACTIVE",
                  })
                }
              >
                Disable
              </Button>
            </div>
          ))}
          {!activeSessions.length && (
            <p className="text-sm text-muted-foreground">No active sessions.</p>
          )}
        </div>

        <p className="mb-3 mt-6 text-base font-medium">Archived Sessions</p>
        <div className="flex flex-col gap-2">
          {archiveSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <p className="text-sm">
                {session.name} • {session.fees}
              </p>
              <Button
                type="button"
                disabled={isUpdatingSessionStatus}
                onClick={() =>
                  mutate({
                    sessionId: session.id,
                    status: "ACTIVE",
                  })
                }
              >
                Enable
              </Button>
            </div>
          ))}
          {!archiveSessions.length && (
            <p className="text-sm text-muted-foreground">
              No archived sessions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
