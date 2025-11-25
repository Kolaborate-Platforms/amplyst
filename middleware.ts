import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

interface CustomSessionClaims {
  unsafeMetadata?: {
    role?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
  '/profile(.*)',
  '/settings(.*)',
  '/campaigns(.*)',
])

// Define public routes that should be accessible without auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/register(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/signup(.*)',
  '/about(.*)',
  '/contact(.*)',
  '/api/webhook(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const url = req.nextUrl.clone()

  // Handle protected routes
  if (isProtectedRoute(req)) {
    // If user is not authenticated, redirect to login
    if (!userId) {
      const signInUrl = new URL('/signup/login', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // For dashboard and other protected routes, allow access if user is authenticated
    // The auth-context will handle redirecting to onboarding if profile is incomplete
    // This prevents the middleware from blocking users who have completed onboarding
    // but whose role is stored in Convex rather than Clerk metadata
  }

  // Handle OAuth callback - preserve role information
  if (url.pathname === '/register/sso-callback') {
    const role = url.searchParams.get('role')
    const redirectUrl = url.searchParams.get('sign_up_force_redirect_url') ||
      url.searchParams.get('redirect_url')

    // If we have role info, proceed normally
    if (role) {
      return NextResponse.next()
    }

    // Try to extract role from redirect URL
    if (redirectUrl) {
      try {
        const decodedUrl = decodeURIComponent(redirectUrl)
        const roleMatch = decodedUrl.match(/role=([^&]+)/)
        if (roleMatch) {
          const extractedRole = roleMatch[1]
          // Add the role to the current URL
          url.searchParams.set('role', extractedRole)
          return NextResponse.redirect(url)
        }
      } catch (error) {
        console.error('Error processing OAuth callback:', error)
      }
    }

    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}