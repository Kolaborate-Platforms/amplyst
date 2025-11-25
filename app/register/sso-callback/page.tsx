// // app/register/sso-callback/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function SSOCallback() {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const handleCallback = async () => {
//       if (!isLoaded) return;

//       try {
//         // Get role from URL params (preserved from initial registration)
//         const role = searchParams?.get("role") || 
//                     new URLSearchParams(window.location.search).get("role");
        
//         const redirectUrl = searchParams?.get("sign_up_force_redirect_url");

//         if (user && role) {
//           // Update user metadata with selected role
//           await user.update({
//             unsafeMetadata: { ...user.unsafeMetadata, role }
//           });

//           // Redirect to onboarding for the selected role
//           router.push(`/onboarding/${role}`);
//           return;
//         }

//         if (user && redirectUrl) {
//           // Decode and redirect to the intended URL
//           const decodedUrl = decodeURIComponent(redirectUrl);
//           const url = new URL(decodedUrl);
//           router.push(url.pathname + url.search);
//           return;
//         }

//         if (user) {
//           // User is signed in but no role info, redirect to register
//           router.push("/register");
//           return;
//         }

//         // If no user yet, wait for Clerk to finish processing
//         setTimeout(() => {
//           if (!user) {
//             setError("Authentication failed. Please try again.");
//           }
//         }, 3000);

//       } catch (error) {
//         console.error("Error in OAuth callback:", error);
//         setError("Something went wrong. Please try again.");
//       }
//     };

//     handleCallback();
//   }, [isLoaded, user, searchParams, router]);

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="text-red-500 text-lg mb-4">⚠️</div>
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => router.push("/register")}
//             className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//         <p className="mt-4 text-gray-600">Completing your sign up...</p>
//         <p className="mt-2 text-sm text-gray-500">This should only take a moment</p>
//       </div>
//     </div>
//   );
// }











"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function SSOCallback() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      // Wait for Clerk to be fully loaded
      if (!isLoaded) return;

      try {
        // Give Clerk a moment to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 1000));

        let role: string | null = null;

        // Try multiple ways to get the role
        // 1. From URL search params
        role = searchParams?.get("role");
        
        // 2. From sessionStorage (stored before OAuth redirect)
        if (!role && typeof window !== 'undefined') {
          role = sessionStorage.getItem('pendingRole');
        }

        // 3. From the complex URL structure in redirect_url param
        if (!role) {
          const redirectUrl = searchParams?.get("redirect_url") || 
                             searchParams?.get("sign_up_force_redirect_url");
          if (redirectUrl) {
            try {
              const decodedUrl = decodeURIComponent(redirectUrl);
              const urlMatch = decodedUrl.match(/role=([^&]+)/);
              if (urlMatch) {
                role = urlMatch[1];
              }
            } catch (e) {
              console.log("Could not parse redirect URL for role");
            }
          }
        }

        // 4. From current URL hash or other params
        if (!role && typeof window !== 'undefined') {
          const currentUrl = new URL(window.location.href);
          role = currentUrl.searchParams.get("role");
          
          // Check if role is in the hash
          if (!role && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            role = hashParams.get("role");
          }
        }

        console.log("Found role:", role);
        console.log("User signed in:", isSignedIn);
        console.log("User object:", user);

        if (isSignedIn && user && role) {
          console.log("Updating user metadata with role:", role);
          
          // Update user metadata with the role
          await user.update({
            unsafeMetadata: { 
              ...user.unsafeMetadata, 
              role: role 
            }
          });

          // Clear stored role
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('pendingRole');
          }

          console.log("Redirecting to onboarding:", `/onboarding/${role}`);
          router.push(`/onboarding/${role}`);
          return;
        }

        if (isSignedIn && user && !role) {
          console.log("User signed in but no role found, redirecting to register");
          // User signed in but no role information
          router.push("/register");
          return;
        }

        if (!isSignedIn) {
          console.log("User not signed in, waiting...");
          // Give it more time for the OAuth flow to complete
          setTimeout(() => {
            if (!isSignedIn) {
              console.log("OAuth flow seems to have failed");
              setError("Sign up failed. Please try again.");
              setIsProcessing(false);
            }
          }, 5000);
          return;
        }

      } catch (error) {
        console.error("Error in OAuth callback:", error);
        setError("Something went wrong during sign up. Please try again.");
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [isLoaded, isSignedIn, user, searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('pendingRole');
              }
              router.push("/register");
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Completing your sign up...</p>
          <p className="mt-2 text-sm text-gray-500">This should only take a moment</p>
        </div>
      </div>
    );
  }

  return null;
}