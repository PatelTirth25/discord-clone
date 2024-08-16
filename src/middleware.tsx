import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === '/signup') {
        return NextResponse.redirect(new URL("/api/auth/login", request.url))
    }
    if (request.nextUrl.pathname === '/dashboard') {
        return NextResponse.redirect(new URL("/", request.url))
    }
}
