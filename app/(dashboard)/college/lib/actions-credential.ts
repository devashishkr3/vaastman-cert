"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@/lib/generated/prisma/enums";
import {
  type CreateCredentialSchema,
  createCredentialSchema,
} from "./zod-type/credential";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Creates a credential (username + password) for a college.
 * Only ADMIN users can call this action.
 * The username is auto-generated from the college code (lowercase).
 * Returns the username and password in plaintext — this is the only time
 * the password is visible.
 */
export async function createCollegeCredential(data: CreateCredentialSchema) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (session.user.role !== Role.ADMIN) {
    return { success: false, message: "Unauthorized: Admin access required" };
  }

  const parsed = createCredentialSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    // Look up the college
    const college = await prisma.college.findUnique({
      where: { id: parsed.data.collegeId },
      select: {
        id: true,
        name: true,
        users: { select: { id: true }, where: { role: Role.COLLEGE } },
      },
    });

    if (!college) {
      return { success: false, message: "College not found" };
    }

    // Check if credential already exists for this college
    if (college.users.length > 0) {
      return {
        success: false,
        message: "Credential already exists for this college",
      };
    }

    const username = parsed.data.username;

    // Generate a placeholder email for the college user (required by better-auth)
    const email = `${username}@college.vaastman.local`;

    // Create the user via better-auth server API
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password: parsed.data.password,
        name: college.name,
        username,
        role: Role.COLLEGE,
        collegeId: college.id,
      },
    });

    if (!result?.user) {
      return { success: false, message: "Failed to create credential" };
    }

    // Send credential email to admin (fire-and-forget, don't block on failure)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const { error: emailError } = await resend.emails.send(
        {
          from: "Vaastman <noreply@id0.uk>",
          to: [adminEmail],
          subject: `[Vaastman] College Credential Created — ${college.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">College Credential Created</h2>
              <p style="color: #555;">A new login credential has been created for:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                  <td style="padding: 8px 12px; border: 1px solid #e5e5e5; font-weight: 600; background: #f9f9f9;">College</td>
                  <td style="padding: 8px 12px; border: 1px solid #e5e5e5;">${college.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border: 1px solid #e5e5e5; font-weight: 600; background: #f9f9f9;">Username</td>
                  <td style="padding: 8px 12px; border: 1px solid #e5e5e5; font-family: monospace;">${username}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border: 1px solid #e5e5e5; font-weight: 600; background: #f9f9f9;">Password</td>
                  <td style="padding: 8px 12px; border: 1px solid #e5e5e5; font-family: monospace;">${parsed.data.password}</td>
                </tr>
              </table>
              <p style="color: #888; font-size: 12px;">Login URL: ${process.env.BETTER_AUTH_URL}/college-login</p>
              <p style="color: #888; font-size: 12px;">This is an automated message from Vaastman Solutions.</p>
            </div>
          `,
        },
        { idempotencyKey: `college-credential/${college.id}/${Date.now()}` },
      );
      if (emailError) {
        console.error("Failed to send credential email:", emailError.message);
      }
    }

    return {
      success: true,
      data: {
        username,
        password: parsed.data.password,
      },
    };
  } catch (error) {
    console.error("createCollegeCredential error:", error);
    return { success: false, message: "Failed to create college credential" };
  }
}

/**
 * Checks whether a college already has credential (a user with COLLEGE role).
 */
export async function getCollegeCredentialStatus(collegeId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { collegeId, role: Role.COLLEGE },
      select: { id: true, username: true },
    });

    return {
      success: true,
      data: {
        hasCredential: !!user,
        username: user?.username ?? undefined,
      },
    };
  } catch (error) {
    console.error("getCollegeCredentialStatus error:", error);
    return { success: false, message: "Failed to check credential status" };
  }
}
