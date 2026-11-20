import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const GUEST_COOKIE_NAME = 'learn_guest_session';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(GUEST_COOKIE_NAME)?.value;

  if (!token) {
    const newToken = 'gst_' + crypto.randomUUID().replace(/-/g, '');
    
    // Clone request headers and add new cookie so route handlers can read it immediately
    const requestHeaders = new Headers(request.headers);
    const existingCookie = request.headers.get('cookie') || '';
    requestHeaders.set(
      'cookie',
      existingCookie ? `${existingCookie}; ${GUEST_COOKIE_NAME}=${newToken}` : `${GUEST_COOKIE_NAME}=${newToken}`
    );

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.cookies.set(GUEST_COOKIE_NAME, newToken, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
