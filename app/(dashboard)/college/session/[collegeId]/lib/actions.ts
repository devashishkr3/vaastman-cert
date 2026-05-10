"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CollegeSessionStatus, Role } from "@/lib/generated/prisma/enums";
import {
  type AddCollegeSessionSchema,
  addCollegeSessionSchema,
} from "./zod-type/add-college-session";

export async function getCollegeSessionInfo(collegeId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!collegeId.trim()) {
    return { success: false, message: "Invalid college id" };
  }

  try {
    const data = await prisma.college.findUnique({
      where: {
        id: collegeId,
      },
      include: {
        domains: true,
        sessions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!data) {
      return { success: false, message: "College not found" };
    }

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to fetch college session details",
    };
  }
}

export async function addCollegeSessionInfo(
  collegeId: string,
  payload: AddCollegeSessionSchema,
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (session.user.role !== Role.ADMIN) {
    return { success: false, message: "Unauthorized" };
  }

  if (!collegeId.trim()) {
    return { success: false, message: "Invalid college id" };
  }

  const parsedData = addCollegeSessionSchema.safeParse(payload);

  if (!parsedData.success) {
    return { success: false, message: "Invalid data" };
  }

  const normalizedDomains = Array.from(
    new Set(
      (parsedData.data.domains ?? [])
        .map((domain) => domain.trim().replace(/\s+/g, " "))
        .filter(Boolean),
    ),
  );

  const sessionName = `${parsedData.data.startSession}-${parsedData.data.endSession}`;
  const sessionDuration = `${parsedData.data.duration}h`;

  try {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true },
    });

    if (!college) {
      return { success: false, message: "College not found" };
    }

    const duplicateSession = await prisma.collegeSession.findFirst({
      where: {
        collegeId,
        name: sessionName,
      },
      select: { id: true },
    });

    if (duplicateSession) {
      return { success: false, message: "This session already exists" };
    }

    const data = await prisma.$transaction(async (tx) => {
      if (normalizedDomains.length) {
        const existingDomains = await tx.domain.findMany({
          where: {
            name: {
              in: normalizedDomains,
            },
          },
          select: { id: true, name: true },
        });

        const existingDomainNames = new Set(
          existingDomains.map((domain) => domain.name),
        );

        const createdDomains = await Promise.all(
          normalizedDomains
            .filter((domain) => !existingDomainNames.has(domain))
            .map((domain) =>
              tx.domain.create({
                data: { name: domain },
                select: { id: true },
              }),
            ),
        );

        const domainIds = [
          ...existingDomains.map((domain) => domain.id),
          ...createdDomains.map((domain) => domain.id),
        ];

        await tx.college.update({
          where: {
            id: collegeId,
          },
          data: {
            domains: {
              connect: domainIds.map((domainId) => ({ id: domainId })),
            },
          },
        });
      }

      return tx.collegeSession.create({
        data: {
          collegeId,
          name: sessionName,
          duration: sessionDuration,
          fees: parsedData.data.fees,
          status: CollegeSessionStatus.ACTIVE,
        },
      });
    });

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to add session" };
  }
}
