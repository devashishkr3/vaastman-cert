"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getCollegeByIdHook } from "@/app/(dashboard)/college/edit/[id]/query/get-college-by-id";
import { ErrorDisplay } from "@/components/error-display";
import { LoaderScreen } from "@/components/loader-screen";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  type IUpdateCollegeSchema,
  updateCollegeSchema,
} from "../lib/zod-type/type";
import { useUpdateCollegeInfo } from "../query/mut-update-college";
import { InputForm } from "./input-form";
import { BackRedirect } from "@/components/back-redirect";

export function MainForm({ collegeId }: { collegeId: string }) {
  const router = useRouter();
  const {
    data: college,
    isLoading,
    error,
  } = useQuery(getCollegeByIdHook(collegeId));
  const activeSession = college?.sessions[0];
  const [startSession = "", endSession = ""] =
    activeSession?.name.split("-") ?? [];
  const duration = activeSession?.duration.replace(/h$/i, "") ?? "";

  const form = useForm<IUpdateCollegeSchema>({
    resolver: zodResolver(updateCollegeSchema),
    defaultValues: {
      code: college?.code ?? "",
      collegeName: college?.name ?? "",
      startSession,
      endSession,
      duration,
      fees: activeSession?.fees ?? "",
      domains:
        college?.domains.map((domain) => domain.name).filter(Boolean) ?? [],
    },
  });
  const { mutateAsync: updateCollegeInfo, isPending } =
    useUpdateCollegeInfo(collegeId);

  useEffect(() => {
    if (!college) {
      return;
    }

    form.reset({
      code: college.code ?? "",
      collegeName: college.name,
      startSession,
      endSession,
      duration,
      fees: activeSession?.fees ?? "",
      domains: college.domains.map((domain) => domain.name).filter(Boolean),
    });
  }, [activeSession?.fees, college, duration, endSession, form, startSession]);

  if (isLoading) {
    return <LoaderScreen message="Loading.." />;
  }

  if (error) {
    return <ErrorDisplay message={error.message} redirectPath="/home" />;
  }

  if (!college) {
    return <ErrorDisplay message="College not found" redirectPath="/home" />;
  }

  const onSubmit = async (data: IUpdateCollegeSchema) => {
    await updateCollegeInfo(data);
    router.push("/college");
  };

  return (
    <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
      <BackRedirect className="mb-4" href="/college" label="Back to College" method="href" />
      <InputForm
        domainOptions={college.domains
          .map((domain) => domain.name)
          .filter(Boolean)}
        form={form}
        universityName={college.university.name}
      />
      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isPending}>
          <LoadingSwap isLoading={isPending}>Update College</LoadingSwap>
        </Button>
      </div>
    </form>
  );
}
