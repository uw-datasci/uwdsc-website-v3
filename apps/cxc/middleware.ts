import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthMiddleware } from '@uwdsc/server/core/middleware/authMiddleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const authMiddleware = new AuthMiddleware();
    const baseUrl = request.nextUrl.origin;
    
    const result = await authMiddleware.checkAuth(baseUrl, pathname);
    
    if (result.shouldRedirect && result.redirectUrl) {
      return NextResponse.redirect(new URL(result.redirectUrl, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};