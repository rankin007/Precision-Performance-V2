import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()
  
  // Protect /portal routes
  if (request.nextUrl.pathname.startsWith('/portal')) {
    if (!user) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // Role-based routing logic based on user_metadata.role
    const role = user.user_metadata?.role || 'client' // Default to client if unspecified
    
    // If Trainer tries to access Client
    if (request.nextUrl.pathname.startsWith('/portal/client') && role === 'trainer') {
       url.pathname = '/portal/trainer/dashboard'
       return NextResponse.redirect(url)
    }
    
    // If Client tries to access Trainer
    if (request.nextUrl.pathname.startsWith('/portal/trainer') && role !== 'trainer') {
       url.pathname = '/portal/client/dashboard'
       return NextResponse.redirect(url)
    }
  }

  // Redirect root to logical place
  if (request.nextUrl.pathname === '/') {
    if (user) {
      const role = user.user_metadata?.role || 'client'
      url.pathname = role === 'trainer' ? '/portal/trainer/dashboard' : '/portal/client/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
