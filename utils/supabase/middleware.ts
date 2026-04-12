import { createServerClient } from '@supabase/ssr'
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
          supabaseResponse = NextResponse.next({ request })
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

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/auth')
  const isOnboardingRoute = pathname.startsWith('/onboarding')
  const isPublicRoute = pathname === '/' || isAuthRoute || isOnboardingRoute

  // 1. Unauthenticated: block all non-public routes
  if (!user && !isPublicRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const role = (user.user_metadata?.role || 'client').toLowerCase()
    const isSuperUser = role === 'super admin' || role === 'admin'

    // 2. Onboarding gate: redirect to BE Kit if not yet submitted
    if (!isSuperUser && !user.user_metadata?.onboarding_completed && !isOnboardingRoute && !isAuthRoute) {
      url.pathname = '/onboarding/be-kit'
      return NextResponse.redirect(url)
    }

    // 3. Role-based portal protection
    if (pathname.startsWith('/portal')) {
      if (isSuperUser) return supabaseResponse

      if (pathname.startsWith('/portal/owner') && role === 'trainer') {
        url.pathname = '/portal/trainer/dashboard'
        return NextResponse.redirect(url)
      }
      if (pathname.startsWith('/portal/trainer') && role !== 'trainer') {
        url.pathname = '/portal/owner'
        return NextResponse.redirect(url)
      }
    }

    // 4. Root redirect for logged-in users
    if (pathname === '/') {
      if (!isSuperUser && !user.user_metadata?.onboarding_completed) {
        url.pathname = '/onboarding/be-kit'
      } else if (isSuperUser || role === 'trainer') {
        url.pathname = '/portal/trainer/dashboard'
      } else {
        url.pathname = '/portal/owner'
      }
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
