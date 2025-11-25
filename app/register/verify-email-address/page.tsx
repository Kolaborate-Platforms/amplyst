"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignUp, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();
  const { user } = useUser();

  useEffect(() => {
    // If user is already signed in, redirect to onboarding
    if (user && user.unsafeMetadata?.role) {
      router.push(`/onboarding/${user.unsafeMetadata.role}`);
    }
  }, [user, router]);

  useEffect(() => {
    // Check if sign up is complete and redirect
    if (isLoaded && signUp?.status === "complete") {
      // Get the role from URL params or signUp metadata
      const urlParams = new URLSearchParams(window.location.search);
      const role = urlParams.get("role");
      
      if (role) {
        router.push(`/onboarding/${role}`);
      } else {
        // Fallback to dashboard if no role specified
        router.push("/dashboard");
      }
    }
  }, [isLoaded, signUp, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
          </div>
          <CardTitle className="text-xl font-poppins">Email Verified!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Your email has been verified successfully. Redirecting you to complete your profile...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    </div>
  );
}