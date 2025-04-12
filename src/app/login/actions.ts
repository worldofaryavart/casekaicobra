// src/app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: user, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login Error:', error.message)
    return redirect('/error') // Redirect to a custom error page
  }

  if (user) {
    revalidatePath('/')
    redirect('/')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: user, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup Error:', error.message)
    return redirect('/error') // Redirect to a custom error page
  }

  if (user) {
    revalidatePath('/')
    redirect('/')
  }
}
