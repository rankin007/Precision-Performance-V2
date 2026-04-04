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
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profile?.role === 'Owner') {
      redirect('/portal/owner')
    } else {
      redirect('/portal/trainer/dashboard')
    }
  }

  redirect('/portal/trainer/dashboard')
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
      data: { role, full_name: fullName }
    }
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data?.user) {
    // 1. Determine default membership level (V3 Schema IDs)
    // Bronze for Owners, Gold for Trainers (Standard V3 Reset Defaults)
    const levelName = role === 'Owner' ? 'Bronze' : 'Gold'
    const { data: level } = await supabase
      .from('membership_levels')
      .select('id')
      .eq('name', levelName)
      .single()

    // 2. Instantiate the V3 Profile
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role: role,
      membership_level_id: level?.id
    })

    // 3. Redirect to appropriate portal
    if (role === 'Owner') {
      redirect('/portal/owner')
    } else {
      redirect('/portal/trainer/dashboard')
    }
  }

  redirect('/login?message=Check your email to confirm your account.')
}
