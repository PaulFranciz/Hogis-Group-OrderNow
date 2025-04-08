import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// Define routes that should be publicly accessible
const isPublicRoute = createRouteMatcher([
  '/api/webhook',  // Webhook endpoint
  '/api/trpc(.*)', // tRPC API routes
  '/sign-in(.*)',  // Sign-in page and its subpaths
  '/sign-up(.*)',  // Sign-up page and its subpaths
  '/start-ordering', // Onboarding page
]);

// Define routes that should be ignored by the middleware (if any)
// const isIgnoredRoute = createRouteMatcher([
//   '/ignored-route(.*)'
// ]);

export default clerkMiddleware(async (auth, req) => {
  // Redirect root path to start-ordering
  if (req.nextUrl.pathname === '/') {
    const onboardingUrl = new URL('/start-ordering', req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // Allow access to public routes defined above
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // For all other routes, check authentication
  const { userId } = await auth();
  if (!userId) {
    const onboardingUrl = new URL('/start-ordering', req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all routes except static files and _next internal paths
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)" , "/", "/(api|trpc)(.*)"],
};