"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
// import { Header } from "@/components/header"
// import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

type UserRole = "influencer" | "brand"

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, signInWithGoogle, error } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>("influencer")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError(null)

    if (formData.password !== formData.confirmPassword) {
      setAuthError("Passwords do not match.")
      setLoading(false)
      return
    }
    if (!formData.agreeToTerms) {
      setAuthError("You must agree to the Terms of Service and Privacy Policy.")
      setLoading(false)
      return
    }

    try {
      // Pass the selected role to signUp function
      await signUp(formData.email, formData.password, formData.firstName, formData.lastName, selectedRole)
      
      // The auth context will handle creating the user with the role
      // Redirect based on role
      if (selectedRole === "influencer") {
        router.push("/onboarding/influencer")
      } else {
        router.push("/onboarding/brand")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setAuthError(errorMessage || "Failed to sign up. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setAuthError(null)
    try {
      await signInWithGoogle(selectedRole)
      
      // Redirect based on role
      if (selectedRole === "influencer") {
        router.push("/onboarding/influencer")
      } else {
        router.push("/onboarding/brand")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setAuthError(errorMessage || "Failed to sign up with Google.")
    } finally {
      setLoading(false)
    }
  }

  const displayError = authError || error

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex flex-1 items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join thousands of learners and educators worldwide</p>
            </div>

            {/* Role Selection */}
            {/* <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">I want to join as:</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  onClick={() => handleRoleSelect("kolaborator")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedRole === "kolaborator"
                      ? "border-brand_green bg-brand_green/5 text-brand_green"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  disabled={loading}
                >
                  <GraduationCap className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm font-semibold">kolaborator</div>
                  <div className="text-xs text-gray-500">Learn new skills</div>
                </Button>
                <Button
                  type="button"
                  onClick={() => handleRoleSelect("instructor")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedRole === "instructor"
                      ? "border-brand_green bg-brand_green/5 text-brand_green"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  disabled={loading}
                >
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm font-semibold">Instructor</div>
                  <div className="text-xs text-gray-500">Teach & inspire</div>
                </Button>
              </div>
            </div> */}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field mt-1"
                    placeholder="John"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field mt-1"
                    placeholder="Doe"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field mt-1"
                  placeholder="johndoe@example.com"
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
                    placeholder="Create a strong password"
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

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-field pr-10"
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="checkbox-container">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                    required
                    disabled={loading}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-brand_green hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-brand_green hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                {selectedRole === "influencer" && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Influencer Benefits:</strong> Collaborate with brands, access exclusive campaigns, and grow your audience.
                    </p>
                  </div>
                )}
              </div>

              {displayError && <p className="text-red-500 text-sm text-center">{displayError}</p>}

              <Button
                type="submit"
                className="w-full bg-brand_green hover:bg-brand_green/90"
                size="lg"
                disabled={loading}
              >
                {loading 
                  ? "Creating Account..." 
                  : `Create ${selectedRole === "influencer" ? "Influencer" : "Brand"} Account`
                }
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleGoogleSignUp}
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
                <Button variant="outline" className="w-full bg-transparent" disabled={loading}>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                      fill="#1DA1F2"
                    />
                  </svg>
                  Twitter
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-brand_green font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}