// src/utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Define allowed domains
const allowedDomains = [
  'localhost:3000',
  'www.chichore.com',
  'chichore.com'
];

export async function updateSession(request: NextRequest) {
  // Check if the request is from an allowed domain
  const host = request.headers.get('host') || '';
  const isAllowedDomain = allowedDomains.some(domain => host.includes(domain));
  
  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // If the cookie is being set, update the response
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          // If the cookie is being deleted, update the response
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Refresh the session
  await supabase.auth.getSession();

  // Get the user from the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/shop",
    "/login",
    "/auth",
    "/auth-callback",
  ];

  // Check if the path starts with any of the public paths
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(`${path}/`)
  );

  // If user is not authenticated and the path is not public, redirect to login
  if (!user && !isPublicPath) {
    // Get the origin based on the current host
    let origin = isAllowedDomain 
      ? `${request.nextUrl.protocol}//${host}`
      : 'https://www.chichore.com'; // Default to production if host is unknown
    
    const redirectUrl = new URL("/login", origin);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
