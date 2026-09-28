import { z } from "zod";

const safeText = (label: string, min = 2, max = 2000) =>
  z.string().trim().min(min, `${label} is required.`).max(max, `${label} is too long.`);

export const educationLevels = [
  "O Levels", "A Levels", "Matric", "FSc", "ICS", "IB",
  "Undergraduate transfer", "Gap year", "Other",
] as const;

export const guidanceRequestSchema = z.object({
  studentName: safeText("Full name", 2, 120),
  studentEmail: z.string().trim().email("Enter a valid email address.").max(254),
  phoneOptional: z.string().trim().max(40).optional().or(z.literal("")),
  schoolCollege: safeText("Current school or college", 2, 180),
  educationLevel: z.enum(educationLevels),
  offeringId: safeText("Program offering", 3, 180),
  preferredMentorId: z.string().uuid().optional().or(z.literal("")),
  reason: safeText("Why you are considering this program", 20, 2000),
  questions: safeText("What you would like to ask", 10, 3000),
  availability: safeText("Preferred availability", 3, 1000),
  under18: z.boolean(),
  guardianAcknowledgement: z.boolean(),
  website: z.string().max(0, "Spam check failed.").optional().default(""),
}).superRefine((value, context) => {
  if (value.under18 && !value.guardianAcknowledgement) {
    context.addIssue({ code: "custom", path: ["guardianAcknowledgement"], message: "Please confirm that your parent or guardian is aware." });
  }
});

export const mentorApplicationSchema = z.object({
  fullName: safeText("Full name", 2, 120),
  nustEmail: z.string().trim().email("Enter a valid email address.").max(254).refine((value) => value.toLowerCase().endsWith(".nust.edu.pk") || value.toLowerCase().endsWith("@nust.edu.pk"), "Use your NUST email address."),
  offeringId: safeText("Program offering", 3, 180),
  semester: z.coerce.number().int().min(1).max(12),
  graduationYear: z.coerce.number().int().min(new Date().getFullYear()).max(new Date().getFullYear() + 8),
  bio: safeText("Short bio", 30, 1200),
  reason: safeText("Why you want to mentor", 30, 1600),
  topics: z.array(z.string().trim().min(2).max(80)).min(1).max(8),
  languages: z.array(z.string().trim().min(2).max(40)).min(1).max(6),
  availability: safeText("General availability", 3, 800),
  linkedinUrl: z.string().trim().url("Enter a valid LinkedIn URL.").optional().or(z.literal("")),
  verificationConsent: z.literal(true, { error: "Verification consent is required." }),
  codeOfConduct: z.literal(true, { error: "You must agree to the code of conduct." }),
  website: z.string().max(0, "Spam check failed.").optional().default(""),
});

export const feedbackSchema = z.object({
  token: z.string().min(24).max(200),
  respondentType: z.enum(["student", "mentor"]),
  overallRating: z.coerce.number().int().min(1).max(5),
  clarityRating: z.coerce.number().int().min(1).max(5),
  mentorRating: z.coerce.number().int().min(1).max(5).optional(),
  recommend: z.boolean(),
  comments: z.string().trim().max(3000).optional().default(""),
  testimonial: z.string().trim().max(1500).optional().default(""),
  testimonialPermission: z.boolean().default(false),
  studentAttended: z.boolean().optional(),
  additionalGuidanceNeeded: z.boolean().optional(),
  safetyConcern: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(0).optional().default(""),
});

export type GuidanceRequestInput = z.infer<typeof guidanceRequestSchema>;
export type MentorApplicationInput = z.infer<typeof mentorApplicationSchema>;
