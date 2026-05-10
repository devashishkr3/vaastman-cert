import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { auth } from "@/lib/auth";
import { ManageCollegeSession } from "./_components/manage-college-session";

type CollegeSessionPageProps = {
  params: Promise<{ collegeId: string }>;
};

export default async function CollegeSessionPage({
  params,
}: CollegeSessionPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  const { collegeId } = await params;

  return (
    <ContentLayout title="College Sessions">
      <ManageCollegeSession collegeId={collegeId} />
    </ContentLayout>
  );
}
