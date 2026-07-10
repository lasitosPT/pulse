import { NextResponse, type NextRequest } from 'next/server'

// Auth.js session cookie names (dev + production/secure variants).
const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token']

/**
 * Optimistic auth routing: redirect signed-out users away from the app and
 * signed-in users away from the auth pages. Authoritative checks still run
 * server-side in the route layouts.
 */
export function proxy(request: NextRequest) {
  const isLoggedIn = SESSION_COOKIES.some((name) => request.cookies.has(name))
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if ((pathname === '/login' || pathname === '/signup') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
