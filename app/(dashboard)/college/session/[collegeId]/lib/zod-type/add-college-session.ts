import { z } from "zod";

export const addCollegeSessionSchema = z.object({
  startSession: z.string().min(1, "Start session is required"),
  endSession: z.string().min(1, "End session is required"),
  duration: z.string().min(1, "Duration is required"),
  fees: z.string().min(1, "Fee is required"),
  domains: z.array(z.string()).optional(),
});

export type AddCollegeSessionSchema = z.infer<typeof addCollegeSessionSchema>;
