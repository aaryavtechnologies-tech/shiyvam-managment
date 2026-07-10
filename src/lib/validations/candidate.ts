import * as z from "zod";

// --- CANDIDATE PROFILE WIZARD SCHEMAS ---

// Step 1: Basic Info
export const candidateBasicSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters").max(100),
  bio: z.string().max(500).optional(),
  phone: z.string().min(10, "Phone number is too short").max(20).optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["Male", "Female", "Non-binary", "Prefer not to say"]).optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  country: z.string().min(2, "Country is required"),
});

// Step 2: Professional Info
export const candidateProfessionalSchema = z.object({
  experience_level: z.enum(["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"]),
  current_company: z.string().optional(),
  current_position: z.string().optional(),
  current_salary: z.string().optional(),
  expected_salary: z.string().optional(),
  notice_period: z.string().optional(),
});

// Step 3: Education & Skills
export const candidateEducationSkillsSchema = z.object({
  education: z.array(
    z.object({
      degree: z.string().min(2, "Degree is required"),
      institution: z.string().min(2, "Institution is required"),
      year_of_passing: z.string().optional(),
    })
  ).optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required").max(15, "Maximum 15 skills allowed"),
  languages: z.array(z.string()).optional(),
  portfolio_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  github_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

// Combined Profile Schema
export const candidateProfileSchema = z.object({
  ...candidateBasicSchema.shape,
  ...candidateProfessionalSchema.shape,
  ...candidateEducationSkillsSchema.shape,
  profile_image: z.string().optional(),
  resume_url: z.string().optional(),
});

export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;
export type CandidateBasicInput = z.infer<typeof candidateBasicSchema>;
export type CandidateProfessionalInput = z.infer<typeof candidateProfessionalSchema>;
export type CandidateEducationSkillsInput = z.infer<typeof candidateEducationSkillsSchema>;

// --- APPLICATION SCHEMA ---
export const applicationSchema = z.object({
  job_id: z.string().uuid(),
  cover_letter: z.string().max(1000).optional(),
  resume_url: z.string().url("Valid resume URL required"),
  expected_salary: z.string().optional(),
  notice_period: z.string().optional(),
  portfolio_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// --- JOB SEARCH FILTER SCHEMA ---
export const jobFilterSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  experience: z.string().optional(),
  employment_type: z.string().optional(),
  is_remote: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
});

export type JobFilterInput = z.infer<typeof jobFilterSchema>;
