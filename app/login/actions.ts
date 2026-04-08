'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // V3 Role-Based Redirection
  if (authData?.user) {
    const roleFromMetadata = authData.user.user_metadata?.role

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', authData.user.id)
      .single()

    // Role-Based Redirection with Normalization
    const effectiveRole = (profile?.role || roleFromMetadata || 'client').toLowerCase()

    // Mandatory Onboarding Check
    if (profile && !profile.onboarding_completed) {
      redirect('/onboarding/be-kit')
    }

    if (effectiveRole === 'owner') {
      redirect('/portal/owner')
    } else if (effectiveRole === 'super admin' || effectiveRole === 'admin' || effectiveRole === 'trainer') {
      redirect('/portal/trainer/dashboard')
    } else {
      // Default fallback for any other role or client
      redirect('/portal/owner')
    }
  }

  // Fallback for missing profile
  redirect('/login?error=Could not find user profile.')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string // 'Trainer' or 'Owner'
  const fullName = formData.get('fullName') as string || 'New User'

  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: { role, full_name: fullName, onboarding_completed: false }
    }
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data?.user) {
    // 1. Determine default membership level (V3 Schema IDs)
    // Bronze for Owners, Gold for Trainers, Super Admin for Super Admin
    const levelNameMap: Record<string, string> = {
      'Owner': 'Bronze',
      'Trainer': 'Gold',
      'Super Admin': 'Super Admin',
      'Admin': 'Admin'
    }
    const levelName = levelNameMap[role] || 'Bronze'

    const { data: level, error: levelError } = await supabase
      .from('membership_levels')
      .select('id')
      .eq('name', levelName)
      .single()

    if (levelError) {
      console.warn(`Signup: Could not find membership level "${levelName}". Defaulting to NULL.`)
    }

    // 2. Instantiate the V3 Profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role: role,
      membership_level_id: level?.id,
      onboarding_completed: false
    })

    if (profileError) {
      redirect(`/login?error=Profile Creation Failed: ${encodeURIComponent(profileError.message)}`)
    }

    // 3. Mandatory Onboarding Redirect
    redirect('/onboarding/be-kit')
  }

  redirect('/login?message=Check your email to confirm your account.')
}
