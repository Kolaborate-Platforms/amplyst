"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RoleSelection from "../../_components/RoleSelection";
import Image from "next/image";

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const [selectedRole, setSelectedRole] = useState(roleParam || "");

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    // Redirect directly to the appropriate onboarding page
    router.push(`/onboarding/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-4xl mx-auto animate-fade-in shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-center gap-4 px-6 sm:px-8 pt-6 sm:pt-8 text-center">
          <div className="flex flex-row items-center justify-center gap-4 w-full">
            <Image src="/logo.png" alt="Amplyst" width={100} height={100} />
          </div>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
          <RoleSelection onRoleSelect={handleRoleSelect} />
          
          <div className="text-center mt-6 sm:mt-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-xs sm:text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200 hover:underline font-medium"
            >
              <span className="mr-2">←</span>
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
