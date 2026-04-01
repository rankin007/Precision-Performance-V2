import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/proxy'

export default async function proxy(request: NextRequest) {
  // DEV BYPASS: Allow local visual traversal without live DB credentials
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
