"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SSOCallbackPageSimplified() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Extract role from URL parameters
  const extractRoleFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const afterSignUpUrl = urlParams.get("after_sign_up_url");
    const redirectUrl = urlParams.get("redirect_url");
    
    let role = urlParams.get("role");
    
    // Try to extract role from afterSignUpUrl
    if (!role && afterSignUpUrl) {
      try {
        const decodedUrl = decodeURIComponent(afterSignUpUrl);
        console.log("Decoded afterSignUpUrl:", decodedUrl);
        const url = new URL(decodedUrl);
        
        // First try query params
        role = url.searchParams.get("role");
        
        // Then try pathname
        if (!role) {
          const pathParts = url.pathname.split('/').filter(Boolean);
          if (pathParts.length >= 2 && pathParts[0] === 'onboarding') {
            role = pathParts[1];
          }
        }
      } catch (e) {
        console.warn("Could not parse afterSignUpUrl", e);
      }
    }
    
    // Try to extract role from redirectUrl
    if (!role && redirectUrl) {
      try {
        const decodedUrl = decodeURIComponent(redirectUrl);
        console.log("Decoded redirectUrl:", decodedUrl);
        const url = new URL(decodedUrl);
        role = url.searchParams.get("role");
      } catch (e) {
        console.warn("Could not parse redirectUrl", e);
      }
    }

    // Fallback to localStorage
    if (!role) {
      role = localStorage.getItem("selectedRole");
    }

    console.log("Extracted role:", role);
    return role;
  };

  useEffect(() => {
    console.log("SSO Callback State:", { isLoaded, isSignedIn, user: !!user, retryCount });
    
    if (!isLoaded) return;

    const handleRedirect = async () => {
      try {
        const role = extractRoleFromUrl();
        
        if (isSignedIn && user) {
          console.log("User is signed in, processing...");
          
          // Update user metadata if needed
          if (role && !user.unsafeMetadata?.role) {
            console.log("Updating user metadata with role:", role);
            try {
              await user.update({
                unsafeMetadata: { ...user.unsafeMetadata, role: role }
              });
              console.log("User metadata updated successfully");
            } catch (updateError) {
              console.error("Failed to update user metadata:", updateError);
              // Continue anyway, don't block the flow
            }
          }

          const finalRole = user.unsafeMetadata?.role || role;
          console.log("Final role for redirect:", finalRole);
          
          // Clean up localStorage
          localStorage.removeItem("selectedRole");

          if (finalRole) {
            console.log("Redirecting to onboarding:", finalRole);
            router.push(`/onboarding/${finalRole}`);
          } else {
            console.log("No role found, redirecting to dashboard");
            router.push("/dashboard");
          }
        } else {
          console.log("User not signed in yet, waiting...");
          
          // If we've been waiting too long, increase retry count
          if (retryCount >= 15) { // 15 seconds instead of 10
            throw new Error("Authentication is taking too long");
          }
          
          // Wait and retry
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000);
        }
      } catch (error) {
        console.error("SSO callback error:", error);
        // setError(error.message || "Authentication failed. Please try again.");
      }
    };

    // Smaller delay for faster response
    const timer = setTimeout(handleRedirect, 500);
    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, user, router, retryCount]);

  const handleRetry = async () => {
    const role = extractRoleFromUrl();
    console.log("Retry with role:", role);
    
    if (role && user) {
      try {
        // Save role to Clerk before redirecting
        if (!user.unsafeMetadata?.role) {
          console.log("Saving role to Clerk during retry:", role);
          await user.update({
            unsafeMetadata: { ...user.unsafeMetadata, role: role }
          });
          console.log("Role saved successfully during retry");
        }
        
        // Clean up localStorage
        localStorage.removeItem("selectedRole");
        
        // Redirect to onboarding
        router.push(`/onboarding/${role}`);
      } catch (updateError) {
        console.error("Failed to save role during retry:", updateError);
        // Still redirect, but role won't be saved
        router.push(`/onboarding/${role}`);
      }
    } else if (role) {
      // User not available but we have role, just redirect
      router.push(`/onboarding/${role}`);
    } else {
      // If no role, go to register to start over
      router.push("/register");
    }
  };

  const handleStartOver = () => {
    // Clear any stored state and start fresh
    localStorage.removeItem("selectedRole");
    router.push("/register");
  };

  if (error) {
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
            <CardTitle className="text-xl font-poppins text-red-600">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <div className="space-y-2">
              <Button onClick={handleRetry} className="w-full">
                Continue to Onboarding
              </Button>
              <Button onClick={handleStartOver} variant="outline" className="w-full">
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CardTitle className="text-xl font-poppins">Almost there...</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Completing your authentication. Please wait...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-xs text-gray-500 mt-4">
            This should only take a few seconds ({retryCount}/15)
          </p>
          {retryCount > 10 && (
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              Skip to Onboarding
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}








// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export default function SSOCallbackPageSimplified() {
//   const router = useRouter();
//   const { user, isLoaded, isSignedIn } = useUser();
//   const [error, setError] = useState<string | null>(null);
//   const [retryCount, setRetryCount] = useState(0);

//   // Extract role from URL parameters
//   const extractRoleFromUrl = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const afterSignUpUrl = urlParams.get("after_sign_up_url");
//     const redirectUrl = urlParams.get("redirect_url");
    
//     let role = urlParams.get("role");
    
//     // Try to extract role from afterSignUpUrl
//     if (!role && afterSignUpUrl) {
//       try {
//         const decodedUrl = decodeURIComponent(afterSignUpUrl);
//         console.log("Decoded afterSignUpUrl:", decodedUrl);
//         const url = new URL(decodedUrl);
        
//         // First try query params
//         role = url.searchParams.get("role");
        
//         // Then try pathname
//         if (!role) {
//           const pathParts = url.pathname.split('/').filter(Boolean);
//           if (pathParts.length >= 2 && pathParts[0] === 'onboarding') {
//             role = pathParts[1];
//           }
//         }
//       } catch (e) {
//         console.warn("Could not parse afterSignUpUrl", e);
//       }
//     }
    
//     // Try to extract role from redirectUrl
//     if (!role && redirectUrl) {
//       try {
//         const decodedUrl = decodeURIComponent(redirectUrl);
//         console.log("Decoded redirectUrl:", decodedUrl);
//         const url = new URL(decodedUrl);
//         role = url.searchParams.get("role");
//       } catch (e) {
//         console.warn("Could not parse redirectUrl", e);
//       }
//     }

//     // Fallback to localStorage
//     if (!role) {
//       role = localStorage.getItem("selectedRole");
//     }

//     console.log("Extracted role:", role);
//     return role;
//   };

//   useEffect(() => {
//     console.log("SSO Callback State:", { isLoaded, isSignedIn, user: !!user, retryCount });
    
//     if (!isLoaded) return;

//     const handleRedirect = async () => {
//       try {
//         const role = extractRoleFromUrl();
        
//         if (isSignedIn && user) {
//           console.log("User is signed in, processing...");
          
//           // Update user metadata if needed
//           if (role && !user.unsafeMetadata?.role) {
//             console.log("Updating user metadata with role:", role);
//             try {
//               await user.update({
//                 unsafeMetadata: { ...user.unsafeMetadata, role: role }
//               });
//               console.log("User metadata updated successfully");
//             } catch (updateError) {
//               console.error("Failed to update user metadata:", updateError);
//               // Continue anyway, don't block the flow
//             }
//           }

//           const finalRole = user.unsafeMetadata?.role || role;
//           console.log("Final role for redirect:", finalRole);
          
//           // Clean up localStorage
//           localStorage.removeItem("selectedRole");

//           if (finalRole) {
//             console.log("Redirecting to onboarding:", finalRole);
//             router.push(`/onboarding/${finalRole}`);
//           } else {
//             console.log("No role found, redirecting to dashboard");
//             router.push("/dashboard");
//           }
//         } else {
//           console.log("User not signed in yet, waiting...");
          
//           // If we've been waiting too long, increase retry count
//           if (retryCount >= 15) { // 15 seconds instead of 10
//             throw new Error("Authentication is taking too long");
//           }
          
//           // Wait and retry
//           setTimeout(() => {
//             setRetryCount(prev => prev + 1);
//           }, 1000);
//         }
//       } catch (error) {
//         console.error("SSO callback error:", error);
//         // setError(error.message || "Authentication failed. Please try again.");
//       }
//     };

//     // Smaller delay for faster response
//     const timer = setTimeout(handleRedirect, 500);
//     return () => clearTimeout(timer);
//   }, [isLoaded, isSignedIn, user, router, retryCount]);

//   const handleRetry = () => {
//     const role = extractRoleFromUrl();
//     console.log("Retry with role:", role);
    
//     if (role) {
//       // Try to go directly to onboarding
//       router.push(`/onboarding/${role}`);
//     } else {
//       // If no role, go to register to start over
//       router.push("/register");
//     }
//   };

//   const handleStartOver = () => {
//     // Clear any stored state and start fresh
//     localStorage.removeItem("selectedRole");
//     router.push("/register");
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//         <Card className="w-full max-w-md">
//           <CardHeader className="text-center">
//             <div className="flex items-center justify-center space-x-2 mb-4">
//               <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">A</span>
//               </div>
//               <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
//             </div>
//             <CardTitle className="text-xl font-poppins text-red-600">Authentication Error</CardTitle>
//           </CardHeader>
//           <CardContent className="text-center space-y-4">
//             <p className="text-gray-600">{error}</p>
//             <div className="space-y-2">
//               <Button onClick={handleRetry} className="w-full">
//                 Continue to Onboarding
//               </Button>
//               <Button onClick={handleStartOver} variant="outline" className="w-full">
//                 Start Over
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">A</span>
//             </div>
//             <span className="text-xl font-bold text-gray-900 font-poppins">Amplyst</span>
//           </div>
//           <CardTitle className="text-xl font-poppins">Almost there...</CardTitle>
//         </CardHeader>
//         <CardContent className="text-center">
//           <p className="text-gray-600 mb-4">
//             Completing your authentication. Please wait...
//           </p>
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//           <p className="text-xs text-gray-500 mt-4">
//             This should only take a few seconds ({retryCount}/15)
//           </p>
//           {retryCount > 10 && (
//             <Button 
//               onClick={handleRetry} 
//               variant="outline" 
//               size="sm" 
//               className="mt-4"
//             >
//               Skip to Onboarding
//             </Button>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }