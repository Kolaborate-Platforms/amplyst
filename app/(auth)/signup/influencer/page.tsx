// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// // import { Header } from "@/components/header"
// // import { Footer } from "@/components/footer"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Eye, EyeOff } from "lucide-react"
// import { useAuth } from "../../../../contexts/auth-context"
// import { toast } from "@/components/ui/use-toast"
// import { useSignup } from "../../../../contexts/signup-context"

// export default function Page() {
//   const router = useRouter()
//   const { signUp, signInWithGoogle } = useAuth()
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     agreeToTerms: false,
//     subscribeNewsletter: false,
//   })
//   const [loading, setLoading] = useState(false)
//   const [authError, setAuthError] = useState<string | null>(null)
//     // Get role from URL parameters
//    const { selectedRole, clearRole } = useSignup()

//   // Clear role when component unmounts or signup completes
//     useEffect(() => {
//       return () => clearRole()
//     }, [clearRole])


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setAuthError(null)

//     if (formData.password !== formData.confirmPassword) {
//       setAuthError("Passwords do not match.")
//       setLoading(false)
//       return
//     }
//     if (!formData.agreeToTerms) {
//       setAuthError("You must agree to the Terms of Service and Privacy Policy.")
//       setLoading(false)
//       return
//     }

//     try {
//       // Pass the selected role to signUp function
//       await signUp(
//         formData.email, 
//         formData.password, 
//         formData.firstName, 
//         formData.lastName,
//         selectedRole || "influencer" // Default to influencer if no role selected
//       )
      

//        toast({
//         title: "Success",
//         description: "Account created successfully! Redirecting to your onboarding.",
//       })

//       router.push("/teach")

//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       console.log("Signup error:", errorMessage);
//       // Check if it's a waitlist error
//         router.push("/");
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleGoogleSignUp = async () => {
//     setLoading(true)
//     setAuthError(null)
//     try {
//       await signInWithGoogle(selectedRole)
//       router.push("/onboarding/influencer")

//     } catch (err: unknown) {
//       // Check if it's a waitlist error
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error';
//       if (errorMessage?.includes("waitlist")) {
//         toast({
//           title: "Auth required",
//           description: "You need to first to create an account.",
//           variant: "destructive",
//         });
//         router.push("/signup/influencer");
//       } else {
//         setAuthError(errorMessage || "Failed to sign up with Google.");
//       }
//     } finally {
//       setLoading(false)
//     }
//   }


//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* <Header /> */}
//       <main className="flex flex-1 items-center justify-center py-12 px-4">
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-lg shadow-lg p-8">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up as an Influencer</h1>
//               <p className="text-gray-600"></p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="firstName">First Name</Label>
//                   <Input
//                     id="firstName"
//                     type="text"
//                     value={formData.firstName}
//                     onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                     className="input-field mt-1"
//                     placeholder="John"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="lastName">Last Name</Label>
//                   <Input
//                     id="lastName"
//                     type="text"
//                     value={formData.lastName}
//                     onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                     className="input-field mt-1"
//                     placeholder="Doe"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="input-field mt-1"
//                   placeholder="john@example.com"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative mt-1">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     className="input-field pr-10"
//                     placeholder="Create a strong password"
//                     required
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={loading}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-gray-400" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <div className="relative mt-1">
//                   <Input
//                     id="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={formData.confirmPassword}
//                     onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                     className="input-field pr-10"
//                     placeholder="Confirm your password"
//                     required
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     disabled={loading}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="h-4 w-4 text-gray-400" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div className="checkbox-container">
//                   <Checkbox
//                     id="terms"
//                     checked={formData.agreeToTerms}
//                     onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
//                     required
//                     disabled={loading}
//                   />
//                   <Label htmlFor="terms" className="text-sm">
//                     I agree to the{" "}
//                     <Link href="/terms" className="text-brand_green hover:underline">
//                       Terms of Service
//                     </Link>{" "}
//                     and{" "}
//                     <Link href="/privacy" className="text-brand_green hover:underline">
//                       Privacy Policy
//                     </Link>
//                   </Label>
//                 </div>

//                 <div className="checkbox-container">
//                   <Checkbox
//                     id="newsletter"
//                     checked={formData.subscribeNewsletter}
//                     onCheckedChange={(checked) => setFormData({ ...formData, subscribeNewsletter: checked as boolean })}
//                     disabled={loading}
//                   />
//                   <Label htmlFor="newsletter" className="text-sm">
//                     Subscribe to our newsletter for course updates and special offers
//                   </Label>
//                 </div>
//               </div>

//               {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}

//               <Button
//                 type="submit"
//                 className="w-full bg-brand_green hover:bg-brand_green/90"
//                 size="lg"
//                 disabled={loading}
//               >
//                 {loading ? "Creating Account..." : "Create Account"}
//               </Button>
//             </form>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or sign up with</span>
//                 </div>
//               </div>

//                 <Button
//                   variant="outline"
//                   className="w-full bg-transparent"
//                   onClick={handleGoogleSignUp}
//                   disabled={loading}
//                 >
//                   <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                     <path
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                       fill="#4285F4"
//                     />
//                     <path
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                       fill="#34A853"
//                     />
//                     <path
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                       fill="#FBBC05"
//                     />
//                     <path
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                       fill="#EA4335"
//                     />
//                   </svg>
//                   Google
//                 </Button>

//             </div>

//             <div className="mt-8 text-center">
//               <p className="text-gray-600">
//                 Already have an account?{" "}
//                 <Link href="/login" className="text-brand_green font-semibold hover:underline">
//                   Sign in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//       {/* <Footer /> */}
//     </div>
//   )
// }









// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Eye, EyeOff } from "lucide-react"
// import { useSignUp, useUser } from "@clerk/nextjs"
// import { useMutation } from "convex/react"
// import { api } from "@/convex/_generated/api"
// import { toast } from "@/components/ui/use-toast"

// type UserRole = "influencer" | "brand" | "agency"

// export default function Page() {
//   const router = useRouter()
//   const { signUp, isLoaded, setActive } = useSignUp()
//   const { user } = useUser()
//   const createUser = useMutation(api.users.createOrGetUser)
//   const createProfile = useMutation(api.users.createProfile)
  
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     agreeToTerms: false,
//     subscribeNewsletter: false,
//   })
//   const [loading, setLoading] = useState(false)
//   const [authError, setAuthError] = useState<string | null>(null)
//   const [verificationCode, setVerificationCode] = useState("")
//   const [pendingVerification, setPendingVerification] = useState(false)
  
//   // Role is hardcoded as "influencer" since this is the influencer signup page
//   const role: UserRole = "influencer"

//   // Handle creating user in Convex after successful Clerk signup
//   const handleSignUpComplete = async (clerkUserId: string) => {
//     try {
//       // Create user in Convex
//       const convexUserId = await createUser()

//       // Create user profile with role
//       await createProfile({
//         userId: convexUserId,
//         role,
//         name: `${formData.firstName} ${formData.lastName}`.trim(),
//       })

//       // Update Clerk user metadata
//       if (user) {
//         await user.update({
//           unsafeMetadata: { 
//             role,
//             convexUserId
//           }
//         })
//       }

//       toast({
//         title: "Success",
//         description: "Account created successfully! Redirecting to your onboarding.",
//       })

//       // Redirect based on role
//       router.push(`/onboarding/${role}`)
//     } catch (error) {
//       console.error("Error setting up user profile:", error)
//       setAuthError("Failed to complete account setup. Please try again.")
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!isLoaded) return

//     setLoading(true)
//     setAuthError(null)

//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       setAuthError("Passwords do not match.")
//       setLoading(false)
//       return
//     }
//     if (!formData.agreeToTerms) {
//       setAuthError("You must agree to the Terms of Service and Privacy Policy.")
//       setLoading(false)
//       return
//     }

//     try {
//       // Create signup with Clerk
//       const result = await signUp.create({
//         emailAddress: formData.email,
//         password: formData.password,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//       })

//       // Check if email verification is required
//       if (result.status === "missing_requirements") {
//         // Send verification email
//         await signUp.prepareEmailAddressVerification({
//           strategy: "email_code",
//         })
//         setPendingVerification(true)
//         toast({
//           title: "Verification Required",
//           description: "We've sent a verification code to your email address.",
//         })
//       } else if (result.status === "complete") {
//         // No verification needed, set session active and complete setup
//         await setActive({ session: result.createdSessionId })
//         await handleSignUpComplete(result.createdUserId!)
//       }

//     } catch (err: any) {
//       console.error("Signup error:", err)
//       setAuthError(err.errors?.[0]?.message || "Failed to create account")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleVerification = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!isLoaded) return

//     setLoading(true)
//     setAuthError(null)

//     try {
//       // Verify the email code
//       const result = await signUp.attemptEmailAddressVerification({
//         code: verificationCode,
//       })

//       if (result.status === "complete") {
//         // Set the session active and complete user setup
//         await setActive({ session: result.createdSessionId })
//         await handleSignUpComplete(result.createdUserId!)
//       } else {
//         setAuthError("Verification incomplete. Please try again.")
//       }
//     } catch (err: any) {
//       console.error("Verification error:", err)
//       setAuthError(err.errors?.[0]?.message || "Invalid verification code")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleGoogleSignUp = async () => {
//     if (!isLoaded) return
    
//     setLoading(true)
//     setAuthError(null)

//     try {
//       await signUp.authenticateWithRedirect({
//         strategy: "oauth_google",
//         redirectUrl: "/register/sso-callback",
//         redirectUrlComplete: `/onboarding/${role}`,
//       })
//     } catch (err: any) {
//       console.error("Google OAuth error:", err)
//       setAuthError(err.errors?.[0]?.message || "Failed to sign up with Google")
//       setLoading(false)
//     }
//   }

//   // If pending email verification, show verification form
//   if (pendingVerification) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <main className="flex flex-1 items-center justify-center py-12 px-4">
//           <div className="w-full max-w-md">
//             <div className="bg-white rounded-lg shadow-lg p-8">
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
//                 <p className="text-gray-600">Enter the verification code sent to {formData.email}</p>
//               </div>

//               <form onSubmit={handleVerification} className="space-y-6">
//                 <div>
//                   <Label htmlFor="code">Verification Code</Label>
//                   <Input
//                     id="code"
//                     type="text"
//                     value={verificationCode}
//                     onChange={(e) => setVerificationCode(e.target.value)}
//                     className="input-field mt-1"
//                     placeholder="Enter 6-digit code"
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}

//                 <Button
//                   type="submit"
//                   className="w-full bg-brand_green hover:bg-brand_green/90"
//                   size="lg"
//                   disabled={loading}
//                 >
//                   {loading ? "Verifying..." : "Verify Email"}
//                 </Button>

//                 <div className="text-center">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setPendingVerification(false)
//                       setVerificationCode("")
//                       setAuthError(null)
//                     }}
//                     className="text-brand_green hover:underline text-sm"
//                     disabled={loading}
//                   >
//                     Back to signup
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </main>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex flex-1 items-center justify-center py-12 px-4">
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-lg shadow-lg p-8">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up as an Influencer</h1>
//               <p className="text-gray-600">Create your influencer account to get started</p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="firstName">First Name</Label>
//                   <Input
//                     id="firstName"
//                     type="text"
//                     value={formData.firstName}
//                     onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                     className="input-field mt-1"
//                     placeholder="John"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="lastName">Last Name</Label>
//                   <Input
//                     id="lastName"
//                     type="text"
//                     value={formData.lastName}
//                     onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                     className="input-field mt-1"
//                     placeholder="Doe"
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="input-field mt-1"
//                   placeholder="john@example.com"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative mt-1">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     className="input-field pr-10"
//                     placeholder="Create a strong password"
//                     required
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={loading}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-gray-400" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <div className="relative mt-1">
//                   <Input
//                     id="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={formData.confirmPassword}
//                     onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                     className="input-field pr-10"
//                     placeholder="Confirm your password"
//                     required
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     disabled={loading}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="h-4 w-4 text-gray-400" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div className="checkbox-container">
//                   <Checkbox
//                     id="terms"
//                     checked={formData.agreeToTerms}
//                     onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
//                     required
//                     disabled={loading}
//                   />
//                   <Label htmlFor="terms" className="text-sm">
//                     I agree to the{" "}
//                     <Link href="/terms" className="text-brand_green hover:underline">
//                       Terms of Service
//                     </Link>{" "}
//                     and{" "}
//                     <Link href="/privacy" className="text-brand_green hover:underline">
//                       Privacy Policy
//                     </Link>
//                   </Label>
//                 </div>
//               </div>

//               {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}

//               <Button
//                 type="submit"
//                 // className="w-full bg-brand_green hover:bg-brand_green/90"
//                 size="lg"
//                 // disabled={loading}
//               >
//                 create Account
//                 {/* {loading ? "Creating Account..." : "Create Account"} */}
//               </Button>
//             </form>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or sign up with</span>
//                 </div>
//               </div>

//               <Button
//                 variant="outline"
//                 className="w-full bg-transparent mt-4"
//                 onClick={handleGoogleSignUp}
//                 disabled={loading}
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     fill="#4285F4"
//                   />
//                   <path
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     fill="#34A853"
//                   />
//                   <path
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     fill="#FBBC05"
//                   />
//                   <path
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     fill="#EA4335"
//                   />
//                 </svg>
//                 Google
//               </Button>
//             </div>

//             <div className="mt-8 text-center">
//               <p className="text-gray-600">
//                 Already have an account?{" "}
//                 <Link href="/login" className="text-brand_green font-semibold hover:underline">
//                   Sign in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }




"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../../../contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function Page() {
  const router = useRouter()
  const { signUp, signInWithGoogle, error, clearError, loading: authLoading } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })
  const [localLoading, setLocalLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  
  // Role is hardcoded as "influencer" since this is the influencer signup page
  const role = "influencer" as const

  // Use auth loading state or local loading state
  const loading = authLoading || localLoading

  // Clear errors when form data changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) clearError()
    if (localError) setLocalError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear any existing errors
    setLocalError(null)
    if (error) clearError()

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.")
      return
    }
    if (!formData.agreeToTerms) {
      setLocalError("You must agree to the Terms of Service and Privacy Policy.")
      return
    }
    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters long.")
      return
    }

    setLocalLoading(true)

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        role
      )

      toast({
        title: "Success",
        description: "Account created successfully! Please check your email for verification if required.",
      })

      // The auth context will handle redirecting based on the signup flow
      // If email verification is needed, user will be redirected appropriately
      // If signup is complete, they'll be redirected to onboarding

    } catch (err: any) {
      console.error("Signup error:", err)
      // Error is handled by the auth context, but we can show additional feedback
      toast({
        title: "Signup Failed",
        description: err.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLocalLoading(true)
    setLocalError(null)
    if (error) clearError()

    try {
      await signInWithGoogle(role)
      
      toast({
        title: "Success",
        description: "Signing up with Google...",
      })

    } catch (err: any) {
      console.error("Google signup error:", err)
      toast({
        title: "Google Signup Failed",
        description: err.message || "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLocalLoading(false)
    }
  }

  // Display either local error or auth context error
  const displayError = localError || error

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-1 items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign Up as an Influencer</h1>
              <p className="text-gray-600">Create your influencer account to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="input-field mt-1"
                  placeholder="john@example.com"
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
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="input-field pr-10"
                    placeholder="Create a strong password (min 8 characters)"
                    required
                    disabled={loading}
                    minLength={8}
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
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    required
                    disabled={loading}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm leading-5">
                    I agree to the{" "}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                    disabled={loading}
                    className="mt-1"
                  />
                  <Label htmlFor="newsletter" className="text-sm leading-5">
                    Subscribe to our newsletter for updates and special offers
                  </Label>
                </div>
              </div>

              {displayError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{displayError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
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

              <Button
                variant="outline"
                className="w-full mt-4 bg-transparent border-gray-300 hover:bg-gray-50"
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
                {loading ? "Signing up..." : "Continue with Google"}
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

