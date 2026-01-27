import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection based on authentication and user roles
 * 
 * Protected routes:
 * - /dashboard -> USER only
 * - /admin/* -> ADMIN only
 * 
 * Redirects unauthorized users to /login
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth token from cookie
    const authToken = request.cookies.get('auth_token')?.value;

    // If no token, redirect to login
    if (!authToken) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Verify token and get user role
    try {
        const response = await fetch('http://localhost:4000/api/auth/verify', {
            headers: {
                Cookie: `auth_token=${authToken}`,
            },
        });

        if (!response.ok) {
            // Invalid token, redirect to login
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        const data = await response.json();
        const userRole = data.user.role;

        // Check role-based access
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
            // User trying to access admin area
            const homeUrl = new URL('/dashboard', request.url);
            return NextResponse.redirect(homeUrl);
        }

        if (pathname.startsWith('/dashboard') && userRole !== 'USER') {
            // Admin trying to access user dashboard
            const adminUrl = new URL('/admin', request.url);
            return NextResponse.redirect(adminUrl);
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware auth error:', error);
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
}

// Configure which routes to protect
export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};
