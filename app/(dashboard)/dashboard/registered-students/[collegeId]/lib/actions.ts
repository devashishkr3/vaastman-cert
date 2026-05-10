"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type RegisteredStudentRow = {
  candidateId: string;
  name: string;
  profilePhoto: string;
  email: string;
  phone: string;
  fatherName: string;
  gender: string;
  dateOfBirth: string;
  universityRoll: string;
  domainOrMainSubject: string;
  mjcSubject: string;
  duration: string;
  collegeFee: string;
  paymentStatus: string;
};

export async function getRegisteredStudentsByCollege(collegeId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  if (!collegeId || !collegeId.trim()) {
    return { success: false, message: "Invalid college id" };
  }

  try {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: {
        id: true,
        name: true,
        code: true,
        sessions: {
          select: {
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!college) {
      return { success: false, message: "College not found" };
    }

    const candidates = await prisma.candidate_Education.findMany({
      where: {
        collegeId: college.id,
      },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
            email: true,
            phone: true,
            fatherName: true,
            gender: true,
            dateOfBirth: true,
            candidatePayments: {
              orderBy: {
                createdAt: "desc",
              },
              select: {
                status: true,
              },
              take: 1,
            },
          },
        },
        collegeSession: {
          select: {
            name: true,
          },
        },
      },
    });

    const candidatesBySession = new Map<string, RegisteredStudentRow[]>();

    for (const candidate of candidates) {
      const sessionName = candidate.collegeSession.name;
      const groupedCandidates = candidatesBySession.get(sessionName) ?? [];

      groupedCandidates.push({
        candidateId: candidate.candidate.id,
        name: candidate.candidate.name,
        profilePhoto: candidate.candidate.profilePhoto,
        email: candidate.candidate.email,
        phone: candidate.candidate.phone,
        fatherName: candidate.candidate.fatherName,
        gender: candidate.candidate.gender,
        dateOfBirth: candidate.candidate.dateOfBirth,
        universityRoll: candidate.universityRoll,
        domainOrMainSubject: candidate.domainOrMainSubject,
        mjcSubject: candidate.mjcSubject,
        duration: candidate.duration,
        collegeFee: candidate.collegeFee,
        paymentStatus:
          candidate.candidate.candidatePayments.at(0)?.status ?? "N/A",
      });

      candidatesBySession.set(sessionName, groupedCandidates);
    }

    for (const [sessionName, sessionCandidates] of candidatesBySession) {
      sessionCandidates.sort((a, b) => a.name.localeCompare(b.name));
      candidatesBySession.set(sessionName, sessionCandidates);
    }

    const configuredSessionNames = college.sessions.map((collegeSession) => {
      return collegeSession.name;
    });
    const additionalSessionNames = Array.from(candidatesBySession.keys())
      .filter((sessionName) => !configuredSessionNames.includes(sessionName))
      .sort((a, b) => a.localeCompare(b));
    const sessionNames = [...configuredSessionNames, ...additionalSessionNames];

    return {
      success: true,
      data: {
        college: {
          id: college.id,
          name: college.name,
          code: college.code,
        },
        sessions: sessionNames.map((sessionName) => ({
          name: sessionName,
          candidates: candidatesBySession.get(sessionName) ?? [],
        })),
      },
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch registered students" };
  }
}
