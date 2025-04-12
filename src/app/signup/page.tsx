// src/app/signup/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const SignUpPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
    } else {
      // Redirect to login page after successful sign-up
      router.push('/login')
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSignUp}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUpPage
