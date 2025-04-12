// src/app/login/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
    } else {
      router.push('/')
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })

    if (error) {
      setErrorMessage(error.message)
    } else {
      router.push('/')
    }
  }

  console.log("error is ", errorMessage);

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Login</h2>
        {/* Google Login Button on Top */}
        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-indigo-700 text-white px-4 py-2 rounded mb-6 hover:bg-indigo-800 transition-colors"
        >
          Sign in with Google
        </button>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-indigo-700 font-semibold mb-2">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-700"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-indigo-700 font-semibold mb-2">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-700"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
