import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@hooks/useAuth'

export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signInWithEmail, signUpWithEmail } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = isSignUp
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password)

      if (result.error) {
        setError(result.error.message)
      } else {
        navigate('/admin/dashboard')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>{isSignUp ? 'Create Admin Account' : 'Admin Login'}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? 'Already have an account? Sign in'
            : 'Need an account? Sign up'}
        </button>
      </form>
    </div>
  )
}
