import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

// Gracefully handle missing env vars locally so the app doesn't completely crash if someone clones it
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "https://dummy.upstash.io"
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "dummy-token"

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
})

// Mock fallback for when UPSTASH isn't configured so local dev works without it
const createFallbackLimit = () => ({
  limit: async (identifier: string) => ({
    success: true,
    limit: 100,
    remaining: 99,
    reset: Date.now() + 10000,
  })
})

const isConfigured = !!process.env.UPSTASH_REDIS_REST_URL

// 1. IP-based limit for Auth Routes (Middleware)
// Very strict to prevent brute-forcing login/register
export const authRateLimit = isConfigured ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute per IP
  analytics: true,
}) : createFallbackLimit()

// 2. User-based limit for submitting experiences
// Strict to prevent database spam
export const experienceSubmissionLimit = isConfigured ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 submissions per hour per user
  analytics: true,
}) : createFallbackLimit()

// 3. User-based limit for Voting
// Moderate
export const voteLimit = isConfigured ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 votes per minute per user
  analytics: true,
}) : createFallbackLimit()

// 4. IP/User-based limit for Search
// Generous but still protected
export const searchLimit = isConfigured ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 searches per minute
  analytics: true,
}) : createFallbackLimit()
