"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signInWithGoogle, error, user, convexUser, userProfile } = useAuth()
  // const updateUser = useMutation(api.users.updateUser)
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Redirect when user data is loaded
  useEffect(() => {
    if (user && convexUser && isAuthenticating) {
      setIsAuthenticating(false)
      setLoading(false)

      // Check if user has completed their profile
      const hasProfile = userProfile !== null && userProfile !== undefined
      const userRole = convexUser.role?.toLowerCase()

      // If no profile or role is "pending", redirect to onboarding
      if (!hasProfile || userRole === 'pending') {
        // Determine which onboarding to redirect to based on role
        switch (userRole) {
          case 'influencer':
            router.push("/onboarding/influencer")
            break
          case 'brand':
            router.push("/onboarding/brand")
            break
          case 'agency':
            router.push("/onboarding/agency")
            break
          case 'pending':
            // If role is pending, redirect to role selection
            router.push("/signup/signup-role-selection")
            break
          default:
            router.push("/signup/signup-role-selection")
            break
        }
      } else {
        // User has completed profile, redirect to dashboard
        switch (userRole) {
          case 'influencer':
            router.push("/dashboard/influencer")
            break
          case 'brand':
            router.push("/dashboard/brand")
            break
          case 'agency':
            router.push("/dashboard/agency")
            break
          default:
            router.push("/")
            break
        }
      }
    }
  }, [user, convexUser, userProfile, isAuthenticating, router])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError(null)
    setIsAuthenticating(true)

    try {
      await signIn(formData.email, formData.password)
      // The useEffect will handle the redirect when user and convexUser are available

    } catch (err: unknown) {
      const error = err as Error
      setAuthError(error.message || "Failed to sign in. Please check your credentials.")
      setLoading(false)
      setIsAuthenticating(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setAuthError(null)
    setIsAuthenticating(true)

    try {
      await signInWithGoogle()
      // The useEffect will handle the redirect when user and convexUser are available

    } catch (err: unknown) {
      const error = err as Error
      setAuthError(error.message || "Failed to sign in with Google.")
      setLoading(false)
      setIsAuthenticating(false)
    }
  }

  const displayError = authError || error

  return (
    <div className="min-h-screen">
      <main className="flex items-center justify-center py-12 px-4 pt-32">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account to continue learning</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field mt-1"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field pr-10"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="checkbox-container">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                    disabled={loading}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-brand_green hover:underline">
                  Forgot password?
                </Link>
              </div>

              {displayError && <p className="text-red-500 text-sm text-center">{displayError}</p>}

              <Button
                type="submit"
                className="w-full bg-brand_green hover:bg-brand_green/90"
                size="lg"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>


              <Button
                variant="outline"
                className="w-full bg-transparent mt-6"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>

            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-brand_green font-semibold hover:underline">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}