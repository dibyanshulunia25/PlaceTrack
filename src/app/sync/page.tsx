import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function SyncPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const email = user.emailAddresses?.[0]?.emailAddress
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
  const role = (user.publicMetadata?.role === 'ADMIN' ? 'ADMIN' : 'USER') as 'ADMIN' | 'USER'

  try {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email,
        name,
        image: user.imageUrl,
        role,
      },
      create: {
        id: user.id,
        email,
        name,
        image: user.imageUrl,
        role,
      },
    })
  } catch (error) {
    console.error('Failed to sync user to database:', error)
    // Could render an error state here, but for now we'll just log it.
  }

  // Redirect to the dashboard after successful sync
  redirect('/dashboard')
}
