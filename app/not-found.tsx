import Link from "next/link";
import { IconFaceIdError, IconHomeFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-8">
        <IconFaceIdError className="size-10" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-muted-foreground max-w-md mx-auto">
        Oops! The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Button asChild className="mt-8 gap-2">
        <Link href="/">
          <IconHomeFilled className="size-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
