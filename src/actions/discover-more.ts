"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function fetchMoreResources(category: string) {
  // Simulate scraping new content
  const timestamp = Date.now()
  let newResources: any[] = []

  switch (category) {
    case 'recommended':
      newResources = [
        {
          title: `Ultimate Tech Interview Prep Guide (${timestamp})`,
          summary: "Comprehensive guide on how to prepare for top-tier tech companies.",
          url: `https://example.com/guide-${timestamp}`,
          source: "Medium",
          company: null,
          role: "SDE",
          tags: ["Interview Experience", "Guide"],
        },
        {
          title: `Meta Frontend Engineer Preparation (${timestamp})`,
          summary: "Official guidance for frontend engineering candidates.",
          url: `https://example.com/meta-${timestamp}`,
          source: "Meta Careers",
          company: "Meta",
          role: "Frontend Engineer",
          tags: ["Guide", "Frontend", "Meta"],
        }
      ]
      break;
    case 'videos':
      newResources = [
        {
          title: `Dynamic Programming Masterclass (${timestamp})`,
          summary: "Learn DP concepts from scratch with examples.",
          url: `https://youtube.com/watch?v=dp-${timestamp}`,
          source: "YouTube",
          company: null,
          role: "SDE",
          tags: ["DSA", "Video", "DP"],
        },
        {
          title: `Mock Interview: Google Software Engineer (${timestamp})`,
          summary: "Watch a realistic mock interview for a Google SWE role.",
          url: `https://youtube.com/watch?v=mock-${timestamp}`,
          source: "YouTube",
          company: "Google",
          role: "SWE",
          tags: ["Video", "Interview", "Google"],
        }
      ]
      break;
    case 'articles':
      newResources = [
        {
          title: `10 Tips for Your Next System Design Interview (${timestamp})`,
          summary: "Essential advice for passing system design rounds.",
          url: `https://geeksforgeeks.org/sys-design-${timestamp}`,
          source: "GeeksforGeeks",
          company: null,
          role: "Senior SDE",
          tags: ["Article", "System Design"],
        },
        {
          title: `How I cracked Amazon SDE2 (${timestamp})`,
          summary: "Detailed interview experience for Amazon SDE2.",
          url: `https://medium.com/amazon-sde2-${timestamp}`,
          source: "Medium",
          company: "Amazon",
          role: "SDE 2",
          tags: ["Article", "Amazon", "Interview Experience"],
        }
      ]
      break;
    case 'technical':
      newResources = [
        {
          title: `Advanced Graph Algorithms Explained (${timestamp})`,
          summary: "Deep dive into Dijkstra, Bellman-Ford, and A*.",
          url: `https://example.com/graphs-${timestamp}`,
          source: "Tech Blog",
          company: null,
          role: "SDE",
          tags: ["DSA", "Graphs"],
        },
        {
          title: `Database Scaling Techniques (${timestamp})`,
          summary: "Sharding, partitioning, and replication strategies.",
          url: `https://example.com/db-scaling-${timestamp}`,
          source: "Engineering Blog",
          company: null,
          role: "Backend Engineer",
          tags: ["DBMS", "System Design"],
        }
      ]
      break;
  }

  // Insert into database
  if (newResources.length > 0) {
    await prisma.externalResource.createMany({
      data: newResources.map(r => ({ ...r, fetchedAt: new Date() }))
    })
  }

  // Revalidate the page
  revalidatePath('/dashboard/resources')
}
