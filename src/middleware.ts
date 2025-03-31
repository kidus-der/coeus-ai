import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname is a public route that should not be protected
  const isPublicRoute = [
    '/about',
    '/contact',
    '/auth',
    '/_next',
    '/api',
    '/favicon.ico',
  ].some(route => pathname.startsWith(route));

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If it's an auth route and there's a token, redirect to home
  if ((pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If it's a protected route (not public) and there's no token, redirect to login
  if (!isPublicRoute && !token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.svg).*)',
  ],
};