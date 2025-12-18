'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react'

interface SignUpFormProps {
  onSuccess?: () => void
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { signUp } = useAuth()

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const { error } = await signUp(formData.email, formData.password)

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.')
        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        })
        onSuccess?.()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (error) setError('')
  }

  return (
    <div className="max-w-sm w-full bg-card-bg rounded-xl p-6 border border-accent-yellow/20 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-accent-yellow/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-6 h-6 text-accent-yellow" />
        </div>
        <h1 className="text-2xl font-bold text-accent-yellow mb-1">Create Account</h1>
        <p className="text-foreground/60 text-sm">Join us to access the image management dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-medium text-foreground/70 mb-1">
            Full Name (Optional)
          </label>
          <div className="relative">
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-background border border-foreground/20 focus:border-accent-yellow rounded-lg pl-10 pr-3 py-2 text-sm text-foreground placeholder-foreground/50 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-foreground/70 mb-1">
            <span className="text-red-500">*</span> Email Address 
          </label>
          <div className="relative">
            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
            <span className="text-red-500">*</span> Password 
          </label>
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a strong password"
              className="w-full bg-background border border-foreground/20 focus:border-accent-yellow rounded-lg pl-10 pr-10 py-2 text-sm text-foreground placeholder-foreground/50 focus:outline-none transition-all"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-foreground/50 mt-0.5">Minimum 6 characters</p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-foreground/70 mb-1">
            <span className="text-red-500">*</span> Confirm Password 
          </label>
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              className="w-full bg-background border border-foreground/20 focus:border-accent-yellow rounded-lg pl-10 pr-10 py-2 text-sm text-foreground placeholder-foreground/50 focus:outline-none transition-all"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-2 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-2 text-green-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.email || !formData.password || !formData.confirmPassword}
          className="w-full bg-accent-yellow text-background font-black uppercase tracking-wider py-2.5 text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-foreground/60 text-xs">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="text-accent-yellow hover:text-accent-yellow/80 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}