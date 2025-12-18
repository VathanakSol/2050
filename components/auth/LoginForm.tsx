'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
      } else {
        onSuccess?.()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-sm w-full bg-card-bg rounded-xl p-6 border border-accent-yellow/20 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-accent-yellow/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <LogIn className="w-6 h-6 text-accent-yellow" />
        </div>
        <h1 className="text-2xl font-bold text-accent-yellow mb-1">Welcome Back</h1>
        <p className="text-foreground/60 text-sm">Sign in to access more features</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-foreground/70 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-background border border-foreground/20 focus:border-accent-yellow rounded-lg pl-10 pr-3 py-2 text-sm text-foreground placeholder-foreground/50 focus:outline-none transition-all"
              required
              autoFocus
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-foreground/70 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-background border border-foreground/20 focus:border-accent-yellow rounded-lg pl-10 pr-10 py-2 text-sm text-foreground placeholder-foreground/50 focus:outline-none transition-all"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-2 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full bg-accent-yellow text-background font-black uppercase tracking-wider py-2 text-sm rounded-lg  transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-foreground/60 text-xs">
            Don&apos;t have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="text-accent-yellow hover:text-accent-yellow/80 font-medium transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}