import { auth } from '@clerk/nextjs/server'

export async function checkRole(role: 'ADMIN' | 'USER') {
  const { sessionClaims } = await auth()

  return sessionClaims?.role === role
}
