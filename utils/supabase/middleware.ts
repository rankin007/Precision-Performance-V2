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
  const isPendingRoute = pathname.startsWith('/pending-approval')
  const isPublicRoute = pathname === '/' || isAuthRoute || isOnboardingRoute || isPendingRoute

  // 1. Unauthenticated: protect all non-public routes
  if (!user && !isPublicRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const role = (user.user_metadata?.role || 'client').toLowerCase()
    const isSuperUser = role === 'super admin' || role === 'admin'

    // 2. Mandatory Onboarding Check (BE Kit form not yet submitted)
    if (!user.user_metadata?.onboarding_completed && !isOnboardingRoute && !isSuperUser) {
      url.pathname = '/onboarding/be-kit'
      return NextResponse.redirect(url)
    }

    // 3. Manual Approval Gate (form submitted, but not yet approved by Principal Orchestrator)
    //    Super Admins bypass this check entirely.
    if (!isSuperUser && !isOnboardingRoute && !isPendingRoute && !isAuthRoute && pathname !== '/') {
      // Only gate portal routes — public marketing pages are fine
      if (pathname.startsWith('/portal')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('portal_access_granted')
          .eq('id', user.id)
          .single()

        if (!profile?.portal_access_granted) {
          url.pathname = '/pending-approval'
          return NextResponse.redirect(url)
        }
      }
    }

    // 4. Role-Based Redirection for /portal
    if (pathname.startsWith('/portal')) {
      // Super Admin Bypass
      if (isSuperUser) {
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

    // 5. Root Redirection for logged-in users
    if (pathname === '/') {
      if (!user.user_metadata?.onboarding_completed && !isSuperUser) {
        url.pathname = '/onboarding/be-kit'
        return NextResponse.redirect(url)
      }
      if (isSuperUser) {
        url.pathname = '/portal/trainer/dashboard'
        return NextResponse.redirect(url)
      }
      // For non-super users at root: check access
      const { data: profile } = await supabase
        .from('profiles')
        .select('portal_access_granted')
        .eq('id', user.id)
        .single()

      if (!profile?.portal_access_granted) {
        url.pathname = '/pending-approval'
      } else {
        url.pathname = role === 'trainer' ? '/portal/trainer/dashboard' : '/portal/owner'
      }
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
