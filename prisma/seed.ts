import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@placetrack.app' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@placetrack.app',
      role: 'USER',
    },
  })

  // Demo Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@placetrack.app' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@placetrack.app',
      role: 'ADMIN',
    },
  })

  // Demo Companies
  const companiesData = [
    { name: 'Google', website: 'https://google.com', industry: 'Technology' },
    { name: 'Microsoft', website: 'https://microsoft.com', industry: 'Technology' },
    { name: 'Meta', website: 'https://meta.com', industry: 'Technology' },
    { name: 'Amazon', website: 'https://amazon.com', industry: 'Technology' },
    { name: 'Apple', website: 'https://apple.com', industry: 'Technology' },
    { name: 'Netflix', website: 'https://netflix.com', industry: 'Entertainment' },
    { name: 'Stripe', website: 'https://stripe.com', industry: 'Finance' },
  ]

  const createdCompanies = []
  for (const company of companiesData) {
    const created = await prisma.company.upsert({
      where: { name: company.name },
      update: {},
      create: company,
    })
    createdCompanies.push(created)
  }

  // Demo Roles / Applications
  const google = createdCompanies.find((c) => c.name === 'Google')
  const meta = createdCompanies.find((c) => c.name === 'Meta')

  if (google) {
    await prisma.application.create({
      data: {
        userId: demoUser.id,
        companyId: google.id,
        role: 'Frontend Engineer',
        status: 'INTERVIEW',
        location: 'Mountain View, CA',
        salary: '$150,000',
      },
    })
  }

  if (meta) {
    await prisma.application.create({
      data: {
        userId: demoUser.id,
        companyId: meta.id,
        role: 'Full Stack Developer',
        status: 'OFFERED',
        location: 'Menlo Park, CA',
        salary: '$160,000',
      },
    })
  }

  // Demo Experience
  if (google) {
    await prisma.experience.create({
      data: {
        title: 'Google L4 Frontend Interview',
        content: 'The interview process consisted of a phone screen and 4 virtual onsite rounds. Mostly focused on React and data structures. Highly recommend studying graphs.',
        rating: 4,
        difficulty: 5,
        offerStatus: 'Rejected',
        isAnonymous: true,
        userId: adminUser.id,
        companyId: google.id,
      },
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
