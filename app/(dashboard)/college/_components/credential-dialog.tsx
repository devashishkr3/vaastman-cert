"use client";

import {
  IconCopyCheckFilled,
  IconCopyFilled,
  IconKeyFilled,
  IconShieldCheckFilled,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { getCollegeCredentialStatus } from "@/app/(dashboard)/college/lib/actions-credential";
import { useCreateCollegeCredential } from "@/app/(dashboard)/college/query/mut-create-credential";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSwap } from "@/components/ui/loading-swap";

type CredentialDialogProps = {
  collegeId: string;
  collegeName: string;
};

export function CredentialDialog({
  collegeId,
  collegeName,
}: CredentialDialogProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [credentialStatus, setCredentialStatus] = useState<{
    hasCredential: boolean;
    username?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState("");

  // Created credentials (shown once after creation)
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const { mutate, isPending } = useCreateCollegeCredential();

  const checkStatus = useCallback(async () => {
    setLoading(true);
    const res = await getCollegeCredentialStatus(collegeId);
    if (res.success && res.data) {
      setCredentialStatus(res.data);
    }
    setLoading(false);
  }, [collegeId]);

  useEffect(() => {
    if (open) {
      checkStatus();
      // Reset state when opening
      setCreatedCredentials(null);
      setPassword("");

      // Generate the username preview exactly as it will be created
      const nameSlug = collegeName
        .replace(/\s+/g, "")
        .toLowerCase()
        .slice(0, 8);
      const randomDigits = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 10),
      ).join("");
      setGeneratedUsername(`clg${nameSlug}${randomDigits}`);
    }
  }, [open, checkStatus, collegeName]);

  const generatePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const handleCreate = () => {
    mutate(
      { collegeId, username: generatedUsername, password },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            setCreatedCredentials(res.data);
            setCredentialStatus({
              hasCredential: true,
              username: res.data.username,
            });
          }
        },
      },
    );
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <button type="button" className="hover:underline">
          Credential
        </button>
      </DialogTrigger>
      <DialogContent className="w-[96vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconKeyFilled className="size-5" />
            College Credential
          </DialogTitle>
          <DialogDescription>
            Manage login credentials for{" "}
            <span className="font-medium text-foreground">{collegeName}</span>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSwap isLoading={true}>Loading...</LoadingSwap>
          </div>
        ) : createdCredentials ? (
          // Show created credentials (one-time view)
          <div className="space-y-4">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <IconShieldCheckFilled className="size-5" />
                <p className="text-sm font-medium">Credential created</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Copy these credentials now. The password will not be shown
                again.
              </p>
              <CopyField label="Username" value={createdCredentials.username} />
              <CopyField label="Password" value={createdCredentials.password} />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        ) : credentialStatus?.hasCredential ? (
          // Credential already exists
          <div className="space-y-3">
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium">Credential exists</p>
              <CopyField
                label="Username"
                value={credentialStatus.username ?? "—"}
              />
              <p className="text-xs text-muted-foreground">
                Password was shown at creation time only.
              </p>
            </div>
          </div>
        ) : (
          // Create new credential
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Username (auto-generated)</Label>
              <Input value={generatedUsername} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credential-password">Password</Label>
              <div className="flex gap-2">
                <Input
                  id="credential-password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter or generate a password"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters. You can type your own or generate one.
              </p>
            </div>
            <Button
              className="w-full"
              disabled={password.length < 8 || isPending}
              onClick={handleCreate}
            >
              <LoadingSwap isLoading={isPending}>Create Credential</LoadingSwap>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded bg-background px-3 py-2 text-sm font-mono border">
          {value}
        </code>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <IconCopyCheckFilled className="size-5 text-green-500" />
          ) : (
            <IconCopyFilled className="size-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
