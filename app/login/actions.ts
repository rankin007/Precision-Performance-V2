'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/portal/trainer/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: { role }
    }
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data?.user) {
    // Note: If email confirmation is ON, user needs to check email.
    // If OFF, they are logged in.
    redirect('/portal/trainer/dashboard')
  }

  redirect('/login?message=Check your email to confirm your account.')
}
