import { NextRequest, NextResponse } from 'next/server';

// Paths that require authentication (Now handled elsewhere)
// const PROTECTED_PATHS = [
//   '/admin',
//   '/api/admin',
// ];

// Function to check if the path should be protected (Now unused)
// const isProtectedPath = (path: string) => {
//   return PROTECTED_PATHS.some(protectedPath => 
//     path.startsWith(protectedPath)
//   );
// };

// Removed LoginAttempts logic (brute force protection might be added elsewhere if needed)
// type LoginAttempts = { ... };
// const loginAttempts: LoginAttempts = {};
// function cleanupLoginAttempts() { ... }
// setInterval(cleanupLoginAttempts, 60 * 60 * 1000);

// Removed Admin credentials constants
// const ADMIN_USERNAME = ...;
// const ADMIN_PASSWORD = ...;

// Function to get IP (can still be useful for logging)
function getIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.ip || '127.0.0.1';
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getIP(req);
  const requestId = crypto.randomUUID();
  
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-request-id', requestId);

  // Logging (can remain)
  console.info(JSON.stringify({
    timestamp: new Date().toISOString(),
    request_id: requestId,
    method: req.method,
    url: req.nextUrl.toString(),
    ip,
    user_agent: req.headers.get('user-agent'),
  }));

  // --- Authentication Logic Removed --- 
  // The middleware now only logs and sets up Sentry, but doesn't block access.
  // Protection for /admin must be implemented within the page/component itself.

  return NextResponse.next({ request: { headers: requestHeaders } });
}

// Updated matcher: Middleware now runs on ALL paths for logging,
// but doesn't perform authentication checks here.
// Remove admin paths if you ONLY want this middleware for specific paths.
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
 