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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()
  const pathname = request.nextUrl.pathname

  // Define route categories
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/auth')
  const isOnboardingRoute = pathname.startsWith('/onboarding')
  const isPublicRoute = pathname === '/' || isAuthRoute || isOnboardingRoute

  // 1. Mandatory Onboarding Check (Elite Strategy: All users must complete BE Kit)
  if (user && !user.user_metadata?.onboarding_completed && !isOnboardingRoute) {
    url.pathname = '/onboarding/be-kit'
    return NextResponse.redirect(url)
  }

  // 2. Auth Protection (Catch-all for non-public routes)
  if (!user && !isPublicRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. Role-Based Redirection for /portal (Preserving existing logic)
  if (pathname.startsWith('/portal')) {
    const role = (user?.user_metadata?.role || 'client').toLowerCase()
    
    // Super Admin Bypass
    if (role === 'super admin' || role === 'admin') {
       return supabaseResponse
    }

    // If Trainer tries to access Owner Dashboard
    if (pathname.startsWith('/portal/owner') && role === 'trainer') {
       url.pathname = '/portal/trainer/dashboard'
       return NextResponse.redirect(url)
    }
    
    // If Owner/Client tries to access Trainer Dashboard
    if (pathname.startsWith('/portal/trainer') && role !== 'trainer') {
       url.pathname = '/portal/owner'
       return NextResponse.redirect(url)
    }
  }

  // 4. Root Redirection
  if (pathname === '/') {
    if (user) {
      const role = (user.user_metadata?.role || 'client').toLowerCase()
      if (!user.user_metadata?.onboarding_completed) {
        url.pathname = '/onboarding/be-kit'
      } else if (role === 'super admin' || role === 'admin') {
        url.pathname = '/portal/trainer/dashboard'
      } else {
        url.pathname = role === 'trainer' ? '/portal/trainer/dashboard' : '/portal/owner'
      }
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
