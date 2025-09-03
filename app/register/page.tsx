// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import RoleSelection from "../_components/RoleSelection";
// import { Users, TrendingUp, BarChart3 } from "lucide-react";
// import { SignUp, useSignUp, useUser } from "@clerk/nextjs";

// const Register = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { signUp, isLoaded } = useSignUp();
//   const { user } = useUser();

//   const roleParam = searchParams.get("role");
//   const [selectedRole, setSelectedRole] = useState(roleParam || "");
//   const [step, setStep] = useState(roleParam ? "clerk-signup" : "role");

//   const roleIcons = {
//     influencer: Users,
//     brand: TrendingUp,
//     agency: BarChart3,
//   };

//   const roleLabels = {
//     influencer: "Creator/Influencer",
//     brand: "Brand/SME",
//     // agency: "Marketing Agency",
//   };

//   // Handle successful sign up completion
//   useEffect(() => {
//     if (user && selectedRole) {
//       // Update user metadata with selected role
//       user.update({
//         unsafeMetadata: { 
//           ...user.unsafeMetadata,
//           role: selectedRole 
//         }
//       }).then(() => {
//         // Redirect to appropriate onboarding page
//         router.push(`/onboarding/${selectedRole}`);
//       }).catch((error) => {
//         console.error("Error updating user metadata:", error);
//       });
//     }
//   }, [user, selectedRole, router]);

//   const handleRoleSelect = (role: string) => {
//     setSelectedRole(role);
//     setStep("clerk-signup");
    
//     // Update URL to reflect selected role
//     const newUrl = new URL(window.location.href);
//     newUrl.searchParams.set('role', role);
//     window.history.replaceState({}, '', newUrl);
//   };

//   const handleBackToRoleSelection = () => {
//     setStep("role");
//     setSelectedRole("");
    
//     // Remove role from URL
//     const newUrl = new URL(window.location.href);
//     newUrl.searchParams.delete('role');
//     window.history.replaceState({}, '', newUrl);
//   };

//   // Role selection step
//   if (step === "role") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//         <Card className="w-full max-w-5xl animate-fade-in">
//           <CardHeader className="text-center">
//             <div className="flex items-center justify-center space-x-2 mb-4">
//               <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">A</span>
//               </div>
//               <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
//             </div>
//             <CardTitle className="text-2xl font-poppins">Welcome to Amplyst</CardTitle>
//             <CardDescription>
//               The smart platform connecting nano & micro-influencers with brands
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <RoleSelection onRoleSelect={handleRoleSelect} />
//             <div className="text-center mt-8">
//               <Link href="/" className="text-sm text-gray-600 hover:text-primary transition-colors duration-200">
//                 ← Back to home
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Clerk SignUp step with role context
//   if (step === "clerk-signup" && selectedRole) {
//     const RoleIcon = roleIcons[selectedRole as keyof typeof roleIcons];

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//         <div className="w-full max-w-md space-y-6">
//           {/* Role Badge */}
//           <div className="text-center">
//             <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-100">
//               <RoleIcon className="h-4 w-4 mr-1" />
//               {roleLabels[selectedRole as keyof typeof roleLabels]}
//             </Badge>
//           </div>

//           {/* Clerk SignUp Component */}
//           <Card>
//             <CardContent className="p-0">
//               <SignUp
//                 appearance={{
//                   elements: {
//                     rootBox: "w-full",
//                     card: "shadow-none border-0",
//                     headerTitle: "text-2xl font-poppins",
//                     headerSubtitle: getRoleDescription(selectedRole),
//                     formButtonPrimary: "bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-poppins",
//                     footerActionLink: "text-primary hover:text-primary/80",
//                   },
//                 }}
//                 redirectUrl={`/onboarding/${selectedRole}`}
//                 afterSignUpUrl={`/onboarding/${selectedRole}`}
//               />
//             </CardContent>
//           </Card>

//           {/* Back button */}
//           <div className="text-center">
//             <Button
//               variant="ghost"
//               onClick={handleBackToRoleSelection}
//               className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
//             >
//               ← Change role
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// // Helper function to get role description
// function getRoleDescription(role: string): string {
//   switch (role) {
//     case "influencer":
//       return "Start monetizing your content and building brand partnerships";
//     case "brand":
//       return "Discover authentic nano & micro-influencers for your campaigns";
//     case "agency":
//       return "Manage influencer campaigns at scale for your clients";
//     default:
//       return "Join our platform today";
//   }
// }

// export default Register;



// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import RoleSelection from "../_components/RoleSelection";
// import { Users, TrendingUp, BarChart3 } from "lucide-react";
// import { SignUp, useSignUp, useUser } from "@clerk/nextjs";

// const roleIcons = {
//   influencer: Users,
//   brand: TrendingUp,
//   agency: BarChart3,
// };

// const roleLabels = {
//   influencer: "Creator/Influencer",
//   brand: "Brand/SME",
//   agency: "Marketing Agency",
// };

// export default function RegisterPage() {
//   const router = useRouter();
//   const { signUp, isLoaded } = useSignUp();
//   const { user } = useUser();

//   const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
//   const [selectedRole, setSelectedRole] = useState<string>("");
//   const [step, setStep] = useState<"role" | "clerk-signup">("role");

//   // Read URL search params only on the client
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     setSearchParams(params);

//     const role = params.get("role");
//     if (role) {
//       setSelectedRole(role);
//       setStep("clerk-signup");
//     }
//   }, []);

//   // Update user metadata when signed in
//   useEffect(() => {
//     if (user && selectedRole) {
//       user
//         .update({ unsafeMetadata: { ...user.unsafeMetadata, role: selectedRole } })
//         .then(() => router.push(`/onboarding/${selectedRole}`))
//         .catch((error) => console.error("Error updating user metadata:", error));
//     }
//   }, [user, selectedRole, router]);

//   const handleRoleSelect = (role: string) => {
//     setSelectedRole(role);
//     setStep("clerk-signup");

//     const newUrl = new URL(window.location.href);
//     newUrl.searchParams.set("role", role);
//     window.history.replaceState({}, "", newUrl);
//   };

//   const handleBackToRoleSelection = () => {
//     setStep("role");
//     setSelectedRole("");

//     const newUrl = new URL(window.location.href);
//     newUrl.searchParams.delete("role");
//     window.history.replaceState({}, "", newUrl);
//   };

//   // Role selection step
//   if (step === "role") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//         <Card className="w-full max-w-5xl animate-fade-in">
//           <CardHeader className="text-center">
//             <div className="flex items-center justify-center space-x-2 mb-4">
//               <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">A</span>
//               </div>
//               <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
//             </div>
//             <CardTitle className="text-2xl font-poppins">Welcome to Amplyst</CardTitle>
//             <CardDescription>
//               The smart platform connecting nano & micro-influencers with brands
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <RoleSelection onRoleSelect={handleRoleSelect} />
//             <div className="text-center mt-8">
//               <Link href="/" className="text-sm text-gray-600 hover:text-primary transition-colors duration-200">
//                 ← Back to home
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Clerk SignUp step
//   if (step === "clerk-signup" && selectedRole) {
//     const RoleIcon = roleIcons[selectedRole as keyof typeof roleIcons];

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//         <div className="w-full max-w-md space-y-6">
//           <div className="text-center">
//             <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-100">
//               <RoleIcon className="h-4 w-4 mr-1" />
//               {roleLabels[selectedRole as keyof typeof roleLabels]}
//             </Badge>
//           </div>

//           <Card>
//             <CardContent className="p-0">
//               <SignUp
//                 appearance={{
//                   elements: {
//                     rootBox: "w-full",
//                     card: "shadow-none border-0",
//                     headerTitle: "text-2xl font-poppins",
//                     headerSubtitle: getRoleDescription(selectedRole),
//                     formButtonPrimary: "bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-poppins",
//                     footerActionLink: "text-primary hover:text-primary/80",
//                   },
//                 }}
//                 // redirectUrl={`/onboarding/${selectedRole}`}
//                 // afterSignUpUrl={`/onboarding/${selectedRole}`}
//                 forceRedirectUrl={`/onboarding/${selectedRole}`}
//                 fallbackRedirectUrl={`/onboarding/${selectedRole}`}
//               />
//             </CardContent>
//           </Card>

//           <div className="text-center">
//             <Button
//               variant="ghost"
//               onClick={handleBackToRoleSelection}
//               className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
//             >
//               ← Change role
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// }

// // Helper function to get role description
// function getRoleDescription(role: string): string {
//   switch (role) {
//     case "influencer":
//       return "Start monetizing your content and building brand partnerships";
//     case "brand":
//       return "Discover authentic nano & micro-influencers for your campaigns";
//     case "agency":
//       return "Manage influencer campaigns at scale for your clients";
//     default:
//       return "Join our platform today";
//   }
// }





"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RoleSelection from "../_components/RoleSelection";
import { Users, TrendingUp, BarChart3 } from "lucide-react";
import { SignUp, useSignUp, useUser } from "@clerk/nextjs";

const roleIcons = {
  influencer: Users,
  brand: TrendingUp,
  agency: BarChart3,
};

const roleLabels = {
  influencer: "Creator/Influencer",
  brand: "Brand/SME",
  agency: "Marketing Agency",
};

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();
  const { user } = useUser();

  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [step, setStep] = useState<"role" | "clerk-signup">("role");

  // Read URL search params only on the client
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);

    const role = params.get("role");
    if (role) {
      setSelectedRole(role);
      setStep("clerk-signup");
      // Store role in localStorage as backup
      localStorage.setItem("selectedRole", role);
    }
  }, []);

  // Update user metadata when signed in
  useEffect(() => {
    if (user && selectedRole) {
      user
        .update({ unsafeMetadata: { ...user.unsafeMetadata, role: selectedRole } })
        .then(() => {
          // Clear the stored role
          localStorage.removeItem("selectedRole");
          router.push(`/onboarding/${selectedRole}`);
        })
        .catch((error) => console.error("Error updating user metadata:", error));
    }
  }, [user, selectedRole, router]);

  // Handle sign-up completion
  useEffect(() => {
    if (isLoaded && signUp?.status === "complete") {
      const role = selectedRole || localStorage.getItem("selectedRole");
      if (role) {
        router.push(`/onboarding/${role}`);
      }
    }
  }, [isLoaded, signUp, selectedRole, router]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep("clerk-signup");

    // Store role in localStorage
    localStorage.setItem("selectedRole", role);

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("role", role);
    window.history.replaceState({}, "", newUrl);
  };

  const handleBackToRoleSelection = () => {
    setStep("role");
    setSelectedRole("");
    localStorage.removeItem("selectedRole");

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("role");
    window.history.replaceState({}, "", newUrl);
  };

  // Role selection step
  if (step === "role") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-5xl animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
            </div>
            <CardTitle className="text-2xl font-poppins">Welcome to Amplyst</CardTitle>
            <CardDescription>
              The smart platform connecting nano & micro-influencers with brands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleSelection onRoleSelect={handleRoleSelect} />
            <div className="text-center mt-8">
              <Link href="/" className="text-sm text-gray-600 hover:text-primary transition-colors duration-200">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Clerk SignUp step
  if (step === "clerk-signup" && selectedRole) {
    const RoleIcon = roleIcons[selectedRole as keyof typeof roleIcons];

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-100">
              <RoleIcon className="h-4 w-4 mr-1" />
              {roleLabels[selectedRole as keyof typeof roleLabels]}
            </Badge>
          </div>

          <Card>
            <CardContent className="p-0">
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0",
                    headerTitle: "text-2xl font-poppins",
                    headerSubtitle: getRoleDescription(selectedRole),
                    formButtonPrimary: "bg-gradient-to-r from-primary to-secondary hover:opacity-90 font-poppins",
                    footerActionLink: "text-primary hover:text-primary/80",
                  },
                }}
                afterSignUpUrl={`/onboarding/${selectedRole}?role=${selectedRole}`}
                redirectUrl={`/register/verify-email-address?role=${selectedRole}`}
              />
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleBackToRoleSelection}
              className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
            >
              ← Change role
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Helper function to get role description
function getRoleDescription(role: string): string {
  switch (role) {
    case "influencer":
      return "Start monetizing your content and building brand partnerships";
    case "brand":
      return "Discover authentic nano & micro-influencers for your campaigns";
    case "agency":
      return "Manage influencer campaigns at scale for your clients";
    default:
      return "Join our platform today";
  }
}