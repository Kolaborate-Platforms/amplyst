'use client'

import { ReactNode, useEffect } from 'react'
import { ConvexReactClient, useMutation } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth, useUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

function UserInitializer() {
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      // In production, we need to ensure the JWT token is properly formatted
      const initializeUser = async () => {
        try {
          // CRITICAL: Use the correct template name for Convex
          const token = await getToken({ template: "convex" });
          console.log("🔍 Token available:", !!token);
          
          if (token) {
            console.log("🔍 Attempting to create/get user...");
            const userId = await createOrGetUser();
            console.log("✅ User initialized:", userId);
          } else {
            console.log("❌ No JWT token available - check Clerk JWT template configuration");
          }
        } catch (error) {
          console.error("❌ Failed to create or get user:", error);
          
          // Enhanced debugging
          console.log("🔍 Debug info:", {
            isSignedIn,
            userLoaded: !!user,
            userId: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
          });
        }
      };

      // Add a small delay to ensure user is fully loaded
      const timer = setTimeout(initializeUser, 100);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, user, createOrGetUser, getToken]);

  return null;
}

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <UserInitializer />
      {children}
    </ConvexProviderWithClerk>
  )
}