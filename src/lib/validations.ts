import { z } from "zod"
import xss from "xss"
import { ApplicationStatus } from "@prisma/client"

// Base sanitizer function
export const sanitize = (input: string | null | undefined): string => {
  if (!input) return ""
  return xss(input, {
    whiteList: {
      b: [], i: [], u: [], strong: [], em: [], 
      p: [], br: [], ul: [], ol: [], li: [],
      h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
      blockquote: [], code: [], pre: [], span: [], a: ['href', 'title']
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'xml', 'iframe', 'object', 'embed']
  })
}

// Reusable custom Zod type that auto-sanitizes strings
export const zSanitizedString = z.string().transform((val) => sanitize(val))

// Experience Validation Schema
export const ExperienceSchema = z.object({
  companyName: zSanitizedString.pipe(z.string().min(1, "Company name is required").max(100, "Company name is too long")),
  role: zSanitizedString.pipe(z.string().min(1, "Role is required").max(100, "Role is too long")),
  title: zSanitizedString.pipe(z.string().min(1, "Title is required").max(200, "Title is too long")),
  content: zSanitizedString.pipe(z.string().min(10, "Content must be at least 10 characters").max(10000, "Content is too long")),
  oaQuestions: zSanitizedString.pipe(z.string().max(5000)).optional(),
  interviewQuestions: zSanitizedString.pipe(z.string().max(5000)).optional(),
  tips: zSanitizedString.pipe(z.string().max(2000)).optional(),
  difficulty: z.coerce.number().min(1).max(5),
  year: z.coerce.number().min(2000).max(new Date().getFullYear() + 1),
  tags: zSanitizedString.optional(),
  isPublic: z.boolean().default(true),
  isAnonymous: z.boolean().default(false)
})

// Application Validation Schema
export const ApplicationSchema = z.object({
  company: zSanitizedString.pipe(z.string().min(1, "Company name is required").max(100)),
  role: zSanitizedString.pipe(z.string().min(1, "Role is required").max(100)),
  status: z.nativeEnum(ApplicationStatus),
  location: zSanitizedString.pipe(z.string().max(100)).optional(),
  salary: zSanitizedString.pipe(z.string().max(100)).optional(),
  notes: zSanitizedString.pipe(z.string().max(2000)).optional(),
  appliedAt: z.coerce.date(),
  assessmentDate: z.coerce.date().nullable().optional(),
  interviewDate: z.coerce.date().nullable().optional(),
  offerDeadline: z.coerce.date().nullable().optional()
})

// Search Validation Schema
export const SearchSchema = z.object({
  page: z.coerce.number().min(1).max(1000).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.enum(["recent", "trending", "helpful"]).default("recent"),
  company: zSanitizedString.optional(),
  role: zSanitizedString.optional(),
  year: zSanitizedString.optional()
})

// Admin Company Schema
export const CompanyAdminSchema = z.object({
  name: zSanitizedString.pipe(z.string().min(1).max(100)),
  website: zSanitizedString.pipe(z.string().max(200)).optional(),
  industry: zSanitizedString.pipe(z.string().max(100)).optional()
})

// Mock Question Schema
export const MockQuestionSchema = z.object({
  companyId: z.string().cuid(),
  role: zSanitizedString.pipe(z.string().min(1, "Role is required").max(100)),
  category: zSanitizedString.pipe(z.string().min(1, "Category is required").max(50)),
  question: zSanitizedString.pipe(z.string().min(10, "Question must be at least 10 characters").max(5000)),
  answer: zSanitizedString.pipe(z.string().min(10, "Answer must be at least 10 characters").max(10000)),
  difficulty: z.coerce.number().min(1).max(5),
  tags: z.array(zSanitizedString.pipe(z.string().max(30))).max(5),
  isPublic: z.boolean().default(true),
  isAnonymous: z.boolean().default(false)
})

// Practice Session Schema
export const PracticeSessionSchema = z.object({
  companyId: z.string().cuid().optional(),
  score: z.coerce.number().min(0)
})
