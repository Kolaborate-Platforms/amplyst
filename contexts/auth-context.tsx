"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth, useSignUp, useSignIn } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

type UserRole = "influencer" | "brand" | "agency";

interface AuthContextType {
  // User state
  user: any;
  isLoaded: boolean;
  isSignedIn: boolean;
  role: UserRole | null;
  convexUser: any;
  userProfile: any;

  // Auth functions
  signUp: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;

  // Error state
  error: string | null;
  clearError: () => void;

  // Loading state
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  const { signUp: clerkSignUp, isLoaded: signUpLoaded, setActive } = useSignUp();
  const { signIn: clerkSignIn, isLoaded: signInLoaded, setActive: setSignInActive } = useSignIn();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  // Convex mutations and queries
  const createUser = useMutation(api.users.createOrGetUser);
  const createProfile = useMutation(api.users.createProfile);

  // Get user by token identifier (Clerk ID)
  const convexUser = useQuery(
    api.users.getUserByToken,
    user ? { tokenIdentifier: user.id } : "skip"
  );

  // Get user profile
  const userProfile = useQuery(api.users.getMyProfile);

  // Update role when user data changes
  useEffect(() => {
    if (user && convexUser) {
      const userRole = convexUser.role || userProfile?.role;
      if (userRole) {
        setRole(userRole as UserRole);
      }
    } else if (user?.unsafeMetadata?.role) {
      setRole(user.unsafeMetadata.role as UserRole);
    } else {
      setRole(null);
    }
  }, [user, convexUser, userProfile]);

  // Clear error helper
  const clearError = () => setError(null);

  // Sign up function
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole
  ) => {
    if (!clerkSignUp || !signUpLoaded) {
      throw new Error("Sign up not ready");
    }

    try {
      setError(null);
      setLoading(true);

      // Store role for later use
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingRole', role);
        sessionStorage.setItem('pendingFirstName', firstName);
        sessionStorage.setItem('pendingLastName', lastName);
      }

      // Start sign up process with Clerk
      const result = await clerkSignUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        unsafeMetadata: { role }
      });

      // If email verification is required
      if (result.status === "missing_requirements") {
        await clerkSignUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        // User will need to verify email - handled by Clerk UI
        return;
      }

      // If sign up is complete
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await handleSignUpComplete(firstName, lastName, role);
      }

    } catch (err: any) {
      console.error("Sign up error:", err);
      const errorMessage = err.errors?.[0]?.message || err.message || "Failed to sign up";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle successful sign up completion
  const handleSignUpComplete = async (
    firstName: string,
    lastName: string,
    role: UserRole
  ) => {
    try {
      // Create user in Convex
      const userId = await createUser();

      // Create user profile
      await createProfile({
        userId,
        role,
        name: `${firstName} ${lastName}`.trim(),
      });

      // Clear stored data
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pendingRole');
        sessionStorage.removeItem('pendingFirstName');
        sessionStorage.removeItem('pendingLastName');
      }

      // Redirect to onboarding
      router.push(`/onboarding/${role}`);

    } catch (convexError) {
      console.error("Error creating user in Convex:", convexError);
      throw new Error("Failed to complete account setup");
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    if (!clerkSignIn || !signInLoaded) {
      throw new Error("Sign in not ready");
    }

    try {
      setError(null);
      setLoading(true);

      const result = await clerkSignIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        // User will be redirected by the login page based on their role/profile completion
        return;
      } else {
        throw new Error("Sign in incomplete");
      }

    } catch (err: any) {
      console.error("Sign in error:", err);
      const errorMessage = err.errors?.[0]?.message || err.message || "Failed to sign in";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth sign in
  const signInWithGoogle = async (role?: UserRole) => {
    if (!clerkSignUp || !signUpLoaded) {
      throw new Error("OAuth not ready");
    }

    try {
      setError(null);
      setLoading(true);

      // Store role if provided
      if (role && typeof window !== 'undefined') {
        sessionStorage.setItem('pendingRole', role);
      }

      await clerkSignUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/",
        redirectUrlComplete: role ? `/onboarding/${role}` : "/dashboard",
      });

    } catch (err: any) {
      console.error("Google OAuth error:", err);
      const errorMessage = err.errors?.[0]?.message || err.message || "Failed to sign in with Google";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);

      await clerkSignOut();
      setRole(null);

      // Clear stored data
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pendingRole');
        sessionStorage.removeItem('pendingFirstName');
        sessionStorage.removeItem('pendingLastName');
      }

      router.push('/');
    } catch (err: any) {
      console.error("Sign out error:", err);
      setError(err.message || "Failed to sign out");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth callback completion and user sync
  useEffect(() => {
    const syncUserAfterAuth = async () => {
      if (user && isSignedIn && !convexUser && typeof window !== 'undefined') {
        const pendingRole = sessionStorage.getItem('pendingRole') as UserRole;
        const pendingFirstName = sessionStorage.getItem('pendingFirstName') || user.firstName || '';
        const pendingLastName = sessionStorage.getItem('pendingLastName') || user.lastName || '';

        if (pendingRole) {
          try {
            await handleSignUpComplete(
              pendingFirstName,
              pendingLastName,
              pendingRole
            );
          } catch (err) {
            console.error("Failed to sync user after auth:", err);
            setError("Failed to complete account setup");
          }
        }
      }
    };

    if (isLoaded && isSignedIn && user) {
      // Only sync user if they don't exist in Convex yet (new sign-up via OAuth)
      if (!convexUser) {
        setTimeout(syncUserAfterAuth, 1000);
      }
      // Don't automatically redirect - let the login page or individual pages handle redirects
      // This prevents unwanted redirects when users navigate directly to dashboard pages
    }
  }, [user, isSignedIn, isLoaded, convexUser]);

  const value: AuthContextType = {
    // User state
    user,
    isLoaded,
    isSignedIn: isSignedIn || false,
    role,
    convexUser,
    userProfile,

    // Auth functions
    signUp,
    signIn,
    signInWithGoogle,
    signOut,

    // Error state
    error,
    clearError,

    // Loading state
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook for role-based routing
export function useRoleRedirect() {
  const { role, isLoaded, isSignedIn, userProfile } = useAuth();

  const getRedirectPath = () => {
    if (!isLoaded || !isSignedIn) return '/signup/login';

    // If user has completed profile, go to role-specific dashboard
    if (userProfile) {
      switch (role) {
        case 'influencer':
          return '/dashboard/influencer';
        case 'brand':
          return '/dashboard/brand';
        case 'agency':
          return '/dashboard/agency';
        default:
          return '/';
      }
    }

    // Otherwise, go to onboarding
    switch (role) {
      case 'influencer':
        return '/onboarding/influencer';
      case 'brand':
        return '/onboarding/brand';
      case 'agency':
        return '/onboarding/agency';
      default:
        return '/signup/signup-role-selection';
    }
  };

  return { redirectPath: getRedirectPath(), role, isLoaded, isSignedIn };
}