import { prisma } from "@/lib/prisma"

/**
 * ResourceDiscoveryService
 * 
 * Future-ready architecture for aggregating public interview resources.
 * This service handles fetching, normalizing, and storing metadata without scraping copyrighted content.
 */
export class ResourceDiscoveryService {
  
  // Scaffolding for future API integrations
  static async discoverYouTubePlaylists(query: string) {
    console.log(`[Discovery] Fetching YouTube playlists for: ${query}`)
    // TODO: Implement actual YouTube Data API v3 call here
    // Normalize and map to ExternalResource format
    return []
  }

  static async discoverArticles(query: string) {
    console.log(`[Discovery] Fetching articles for: ${query}`)
    // TODO: Implement RSS/Custom Search Engine API call here
    return []
  }

  /**
   * MOCK SEEDING FUNCTION
   * Since we don't have active API keys in this phase, we inject 15 realistic placeholder
   * resources to demonstrate the categorization, filtering, and UI of the Discovery Engine.
   */
  static async seedMockResources() {
    const existing = await prisma.externalResource.count()
    if (existing > 0) return { message: "Already seeded", count: existing }

    const mocks = [
      // Recommended
      {
        title: "Amazon SDE 1 Preparation Guide & OA Questions",
        summary: "A comprehensive repository of past Online Assessment questions and patterns for Amazon SDE 1.",
        url: "https://github.com/hxu296/leetcode-company-wise-problems-2022#amazon",
        source: "GitHub",
        company: "Amazon",
        role: "SDE 1",
        tags: ["OA", "Graphs", "DP", "Amazon"],
      },
      {
        title: "Google SWE Interview Preparation Hub",
        summary: "Official and community-curated prep material for Google Software Engineering interviews.",
        url: "https://careers.google.com/interview-tips/",
        source: "Google Careers",
        company: "Google",
        role: "SWE",
        tags: ["System Design", "Algorithms", "Google"],
      },
      {
        title: "Deloitte Analyst Aptitude Test Patterns",
        summary: "Breakdown of the logical reasoning, verbal, and quantitative sections for Deloitte.",
        url: "https://www.geeksforgeeks.org/deloitte-recruitment-process/",
        source: "GeeksforGeeks",
        company: "Deloitte",
        role: "Analyst",
        tags: ["Aptitude", "Logical", "Deloitte"],
      },
      // Videos
      {
        title: "Striver's A2Z DSA Course/Playlist",
        summary: "The ultimate DSA playlist covering everything from basic arrays to advanced DP.",
        url: "https://www.youtube.com/watch?v=EAR7De6GOMA&list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
        source: "YouTube",
        company: null,
        role: "SDE",
        tags: ["DSA", "Video", "Trees"],
      },
      {
        title: "System Design Interview – Step By Step Guide",
        summary: "A deep dive into how to structure your 45-minute system design interview.",
        url: "https://www.youtube.com/watch?v=bBmLzOcgGgU",
        source: "YouTube",
        company: null,
        role: "Senior SDE",
        tags: ["System Design", "Video", "Architecture"],
      },
      {
        title: "Operating Systems Crash Course for Interviews",
        summary: "Quick review of deadlocks, paging, scheduling, and concurrency.",
        url: "https://www.youtube.com/watch?v=mXw9ruZaxzQ",
        source: "YouTube",
        company: null,
        role: "SDE",
        tags: ["OS", "Video", "Concurrency"],
      },
      // Articles
      {
        title: "Understanding Database Indexing & B-Trees",
        summary: "How databases store data internally and why indexing speeds up queries.",
        url: "https://use-the-index-luke.com/",
        source: "Use The Index",
        company: null,
        role: "Backend Engineer",
        tags: ["DBMS", "SQL", "Article"],
      },
      {
        title: "Top 50 Object Oriented Programming Interview Questions",
        summary: "A rapid-fire review of inheritance, polymorphism, encapsulation, and abstraction.",
        url: "https://www.geeksforgeeks.org/commonly-asked-oop-interview-questions/",
        source: "GeeksforGeeks",
        company: null,
        role: "SDE",
        tags: ["OOP", "Java", "C++", "Article"],
      },
      {
        title: "Mastering the Sliding Window Technique",
        summary: "Learn how to identify and solve sliding window problems in O(N) time.",
        url: "https://leetcode.com/discuss/interview-question/3722472/mastering-sliding-window-technique-a-comprehensive-guide",
        source: "LeetCode Discuss",
        company: null,
        role: "SDE",
        tags: ["DSA", "Arrays", "Article"],
      },
      {
        title: "Microsoft SWE Interview Experience & Prep Strategy",
        summary: "How I cleared Microsoft campus placements.",
        url: "https://www.geeksforgeeks.org/microsoft-interview-experience-for-sde-1/",
        source: "GeeksforGeeks",
        company: "Microsoft",
        role: "SWE",
        tags: ["Interview Experience", "Microsoft", "Article"],
      },
    ]

    await prisma.externalResource.createMany({
      data: mocks.map(m => ({
        ...m,
        fetchedAt: new Date()
      }))
    })

    return { message: "Seeded mock resources successfully", count: mocks.length }
  }
}
