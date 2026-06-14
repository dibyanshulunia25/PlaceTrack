import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
  const experiences = await prisma.experience.findMany()
  let oaCount = 0;
  let intCount = 0;

  for (const exp of experiences) {
    if (exp.legacyOaQuestions) {
      const questions = exp.legacyOaQuestions.split('\n\n').filter(q => q.trim() !== '')
      for (let i = 0; i < questions.length; i++) {
        await prisma.assessmentQuestion.create({
          data: {
            experienceId: exp.id,
            questionText: questions[i].trim(),
            order: i
          }
        })
        oaCount++;
      }
      await prisma.experience.update({
        where: { id: exp.id },
        data: { legacyOaQuestions: null }
      })
    }

    if (exp.legacyInterviewQuestions) {
      const questions = exp.legacyInterviewQuestions.split('\n\n').filter(q => q.trim() !== '')
      for (let i = 0; i < questions.length; i++) {
        await prisma.interviewQuestion.create({
          data: {
            experienceId: exp.id,
            questionText: questions[i].trim(),
            order: i
          }
        })
        intCount++;
      }
      await prisma.experience.update({
        where: { id: exp.id },
        data: { legacyInterviewQuestions: null }
      })
    }
  }
  console.log(`Migration complete! Migrated ${oaCount} OA questions and ${intCount} Interview questions.`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
