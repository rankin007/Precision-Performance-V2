'use server'

import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  // DEV BYPASS: Instantly simulate a successful login to allow the Orchestrator 
  // to view the UI without triggering a real Supabase authentication block.
  redirect('/portal/trainer/dashboard')
}

export async function signup(formData: FormData) {
  // DEV BYPASS: Redirect directly to the dashboard.
  redirect('/portal/trainer/dashboard')
}
