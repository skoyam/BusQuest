import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher(["/dashboard", "/api/user"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    if (!auth.userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Protect all routes except static assets
  ],
};
