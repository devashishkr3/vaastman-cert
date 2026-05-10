"use client";

import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ErrorDisplay } from "@/components/error-display";
import { LoaderScreen } from "@/components/loader-screen";
import { Button } from "@/components/ui/button";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { AddCollege } from "./_components/add-college";
import { type CollegeInfoRow, columns } from "./_components/column";
import { DataTable } from "./_components/data-table";
import { useGetCollegeInfo } from "./query/use-get-collegeInfo";
import { BackRedirect } from "@/components/back-redirect";

export default function CollegePage() {
  const { data, isPending, error } = useGetCollegeInfo();
  const tableData: CollegeInfoRow[] = data ?? [];
  // get all domains name for auto complete when adding new college
  const domainOptions = Array.from(
    new Set(
      tableData.flatMap((college) =>
        college.domains
          .map((domain) => domain.name.trim())
          .filter((domainName) => domainName.length > 0),
      ),
    ),
  ).sort((a, b) => a.localeCompare(b));

  if (isPending) {
    return <LoaderScreen message="Getting colleges list..." offsetHeight={NAVBAR_HEIGHT} />;
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error.message}
        redirectPath="/signin"
        buttonText="Back to Signin Page"
      />
    );
  }

  return (
    <ContentLayout title="Colleges">
      <div className="">
        <div className="flex mb-2 md:mb-4 items-center justify-between">
          <BackRedirect href="/dashboard" label="Back to dashboard" method="href" />
          <AddCollege domainOptions={domainOptions} />
        </div>
        <DataTable
          columns={columns}
          data={tableData}
          // Render fee-by-session and domains inside each row's expandable section.
          renderExpandedRow={(row) => (
            <div className="space-y-2 p-2">
              <p className="text-sm text-sidebar-primary font-medium">
                Session Fees
              </p>
              {row.sessions.length ? (
                <div className="space-y-1">
                  {row.sessions.map((session) => (
                    <p key={session.id} className="text-sm">
                      {session.name}: {session.fees}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No session fees.
                </p>
              )}
              <p className="text-sm text-sidebar-primary font-medium">
                Domains
              </p>
              {row.domains.length ? (
                <div className="flex flex-wrap gap-2">
                  {row.domains.map((domain) => (
                    <span
                      key={domain.id}
                      className="rounded-md bg-muted px-2 py-1 text-xs"
                    >
                      {domain.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No domains.</p>
              )}
            </div>
          )}
        />
      </div>
    </ContentLayout>
  );
}
