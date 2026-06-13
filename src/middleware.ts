import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/', 
  '/about', 
  '/privacy', 
  '/terms',
  '/sign-in(.*)', 
  '/sign-up(.*)'
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

import { NextResponse } from 'next/server'
import { authRateLimit } from '@/lib/ratelimit'

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request) && (await auth()).sessionClaims?.role !== 'ADMIN') {
    const url = new URL('/dashboard', request.url)
    return Response.redirect(url)
  }

  // Rate limit check for Auth routes
  if (request.nextUrl.pathname.startsWith('/sign-in') || request.nextUrl.pathname.startsWith('/sign-up')) {
    // Get client IP, fallback to 127.0.0.1 if not available
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'
    
    // We append the pathname to the IP so sign-in and sign-up have their own separate limits
    const { success } = await authRateLimit.limit(`auth_${ip}`)
    
    if (!success) {
      // Redirect to the friendly rate limit page
      return NextResponse.redirect(new URL('/rate-limit', request.url))
    }
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
