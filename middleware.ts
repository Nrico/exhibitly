import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update session and get user
  const { supabase, response, user } = await updateSession(request)

  // Custom Domain Routing
  const host = request.headers.get('host') || request.nextUrl.hostname
  const hostname = host.split(':')[0] // strip port if running locally
  
  const platformDomains = ['localhost', 'exhibitly.app', 'exhibitly.vercel.app', 'exhibitly.co']
  const isPlatform = platformDomains.some(d => hostname === d || hostname.endsWith('.' + d))

  if (!isPlatform) {
    // 1. Redirect administrative / auth pages on custom domains to primary platform domain
    if (
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/auth') ||
      request.nextUrl.pathname.startsWith('/api')
    ) {
      const platformBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://exhibitly.vercel.app'
      return NextResponse.redirect(new URL(request.nextUrl.pathname + request.nextUrl.search, platformBaseUrl))
    }

    // 2. Resolve custom domain to user's profile and rewrite path
    try {
      const { data: setting } = await supabase
        .from('site_settings')
        .select('user_id')
        .eq('custom_domain', hostname)
        .single()

      if (setting?.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', setting.user_id)
          .single()

        if (profile?.username) {
          const url = request.nextUrl.clone()
          url.pathname = `/${profile.username}${url.pathname}`
          return NextResponse.rewrite(url)
        }
      }
    } catch (err) {
      console.error('Error resolving custom domain:', err)
    }
  }

  // Standard Routing (Platform Domains)
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // Auth routes (redirect to dashboard if logged in)
  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Root route (optional: redirect to dashboard if logged in, or stay on landing)
  if (request.nextUrl.pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}