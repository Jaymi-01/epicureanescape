import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/admin/:path*',
}

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get('auth-token')
  const url = req.nextUrl

  // If user is not authenticated and trying to access admin, redirect to login
  if (!authToken && url.pathname.startsWith('/admin')) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}