"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useUpdateCollegeSession } from "@/app/(dashboard)/college/query/mut-update-college-session";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CollegeSession = {
  id: string;
  name: string;
  fees: string;
  status: "ACTIVE" | "INACTIVE";
};

type SessionDialogProps = {
  collegeId: string;
  sessions: CollegeSession[];
};

export function SessionDialog({ collegeId, sessions }: SessionDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateCollegeSession(collegeId);

  const { activeSessions, archiveSessions, defaultTab } = useMemo(() => {
    const active = sessions.filter((session) => session.status === "ACTIVE");
    const archive = sessions.filter((session) => session.status === "INACTIVE");

    return {
      activeSessions: active,
      archiveSessions: archive,
      defaultTab: active.length ? "active" : "archive",
    };
  }, [sessions]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <a href="#" className="hover:underline">Session</a>
      </DialogTrigger>
      <DialogContent className="w-[96vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Session Management</DialogTitle>
          <DialogDescription>
            Enable or disable sessions. Disabled sessions move to archive.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Session</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-3">
            {activeSessions.length ? (
              <div className="flex flex-col gap-2">
                {activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <p className="text-sm">
                      {session.name} • {session.fees}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isPending}
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
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No active sessions.
              </p>
            )}
          </TabsContent>

          <TabsContent value="archive" className="mt-3">
            {archiveSessions.length ? (
              <div className="flex flex-col gap-2">
                {archiveSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <p className="text-sm">
                      {session.name} • {session.fees}
                    </p>
                    <Button
                      type="button"
                      disabled={isPending}
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
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No archived sessions.
              </p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button asChild>
            <Link href={`/college/session/${collegeId}`}>Add new session</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
