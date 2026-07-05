import { z } from "zod";

// user will select university and college by choosing it's id internally
export const addCandidateEducationSchema = z.object({
  id: z.string(),
  universityRoll: z
    .string()
    .trim()
    .min(1, { error: "University roll is required" }),
  collegeRoll: z.string().trim().min(1, { error: "College roll is required" }),

  universityId: z
    .string()
    .trim()
    .min(1, { error: "University id is required" }),
  collegeId: z.string().trim().min(1, { error: "College name is required" }),
  collegeSessionId: z.string().trim().min(1, { error: "Session is required" }),
  collegeFee: z.string({ error: "College fee is required" }),
  duration: z.string().trim().min(1, { error: "Duration is required" }),
  domainOrMainSubject: z
    .string()
    .trim()
    .min(1, { error: "Domain/Main subject is required" }),
  mjcSubject: z.string().trim().min(1, { error: "MJC subject is required" }),
});

export type AddCandidateEducationSchema = z.infer<
  typeof addCandidateEducationSchema
>;

export const candidateEducationCollegeOptionSchema = z.object({
  name: z.string(),
  fees: z.string(),
});

export const candidateEducationCollegeOptionsSchema = z.array(
  candidateEducationCollegeOptionSchema,
);

export type CandidateEducationCollegeOption = z.infer<
  typeof candidateEducationCollegeOptionSchema
>;
