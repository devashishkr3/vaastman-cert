"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { useGetCollegeInfo } from "@/app/(dashboard)/college/query/use-get-collegeInfo";
import { CredentialDialog } from "./credential-dialog";
import { SessionDialog } from "./session-dialog";

export type CollegeInfoRow = NonNullable<
  ReturnType<typeof useGetCollegeInfo>["data"]
>[number];

export const columns: ColumnDef<CollegeInfoRow>[] = [
  {
    accessorKey: "name",
    header: "College Name",
    cell: ({ row }) => {
      return (
        <div>
          {`${row.original.name} ${row.original.code ? `[${row.original.code}]` : ""}`}
        </div>
      );
    },
  },
  {
    id: "fees",
    accessorFn: (row) => {
      // Use session count for a compact table view; session fee details are in expanded row.
      return row.sessions.length;
    },
    header: "Fee",
    cell: ({ row }) => {
      const sessionCount = row.original.sessions.length;

      if (!sessionCount) {
        return <div>-</div>;
      }

      return <div>{sessionCount} session(s)</div>;
    },
  },

  // {
  //   accessorKey: "domains",
  //   header: "Domains",
  //   cell: ({ row }) => {
  //     return <div>{row.original.domains.join(", ")}</div>;
  //   },
  // },

  {
    id: "expander",
    header: "Details",
    cell: ({ row }) => (
      <button type="button" onClick={row.getToggleExpandedHandler()}>
        {row.getIsExpanded() ? "▼" : "▶"}
      </button>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Link
          href={`/college/edit/${row.original.id}`}
          className="hover:underline"
        >
          Edit
        </Link>
        <SessionDialog
          collegeId={row.original.id}
          sessions={row.original.sessions.map((session) => ({
            id: session.id,
            name: session.name,
            fees: session.fees,
            status: session.status,
          }))}
        />
        <CredentialDialog
          collegeId={row.original.id}
          collegeName={row.original.name}
        />
      </div>
    ),
  },
];
