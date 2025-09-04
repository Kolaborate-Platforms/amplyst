  "use client";

  import { SignedOut, SignInButton, SignIn } from "@clerk/nextjs";
  import Link from "next/link";
  import RoleBased from "./roleBased";
  import { Button } from "@/components/ui/button";
  import { Authenticated, Unauthenticated } from "convex/react";
  import { useRouter } from "next/navigation";
  import Image from "next/image";
  import { BellDotIcon, User2Icon, Settings, LogOut, Crown, Users, Target } from 'lucide-react';
  import { useUser, SignOutButton } from '@clerk/nextjs';
  import { useQuery } from 'convex/react';
  import { api } from '@/convex/_generated/api';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { Badge } from '@/components/ui/badge';

  export default function Navigation() {
    const router = useRouter();
    
    // Get user data from Clerk
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
    
    // Get user data from Convex
    const userData = useQuery(api.users.getCurrentUserWithProfile);
    
    // Get role icon based on user role
    const getRoleIcon = (role: string) => {
      switch (role) {
        case 'influencer':
          return <Crown className="h-3 w-3" />
        case 'brand':
          return <Target className="h-3 w-3" />
        case 'agency':
          return <Users className="h-3 w-3" />
        default:
          return <User2Icon className="h-3 w-3" />
      }
    }
    
    // Get role color based on user role
    const getRoleColor = (role: string) => {
      switch (role) {
        case 'influencer':
          return 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200'
        case 'brand':
          return 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
        case 'agency':
          return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
        default:
          return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200'
      }
    }
    
    return (
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Amplyst" width={100} height={100} />
          </div>
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            <Link href="#features" className="text-primary-700 hover:text-primary transition-colors duration-200 font-medium">Features</Link>
            <Link href="#how-it-works" className="text-primary-700 hover:text-primary transition-colors duration-200 font-medium">How It Works</Link>
            <Link href="#success-stories" className="text-primary-700 hover:text-primary transition-colors duration-200 font-medium">Success Stories</Link>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-5">
            <Authenticated>
              <RoleBased/>
              {/* User Menu */}
              {isClerkLoaded && clerkUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={clerkUser.imageUrl} 
                          alt={clerkUser.fullName || 'User'} 
                        />
                        <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                          {clerkUser.firstName?.charAt(0) || clerkUser.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={clerkUser.imageUrl} 
                              alt={clerkUser.fullName || 'User'} 
                            />
                            <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                              {clerkUser.firstName?.charAt(0) || clerkUser.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium leading-none">
                              {clerkUser.fullName || 'User'}
                            </p>
                            <p className="text-xs leading-none text-neutral-500 dark:text-neutral-400">
                              {clerkUser.emailAddresses[0]?.emailAddress}
                            </p>
                          </div>
                        </div>
                        
                        {/* Role Badge */}
                        {userData?.user?.role && (
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="secondary" 
                              className={`${getRoleColor(userData.user.role)} text-xs`}
                            >
                              {getRoleIcon(userData.user.role)}
                              <span className="ml-1 capitalize">
                                {userData.user.role}
                              </span>
                            </Badge>
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Profile Info from Convex */}
                    {userData?.profile && (
                      <>
                        <DropdownMenuItem className="cursor-pointer">
                          <User2Icon className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        {userData.profile.niche && (
                          <div className="px-2 py-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="font-medium">Niche:</span> {userData.profile.niche}
                          </div>
                        )}
                        {userData.profile.location && (
                          <div className="px-2 py-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="font-medium">Location:</span> {userData.profile.location}
                          </div>
                        )}
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    
                    {/* Sign Out Button */}
                    <SignOutButton>
                      <DropdownMenuItem className="cursor-pointer text-error-600 dark:text-error-400">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </SignOutButton>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Authenticated>

            <Unauthenticated>
              <SignInButton 
                mode="modal" 
                forceRedirectUrl="/role"
                signUpFallbackRedirectUrl="/role"
              >
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl font-poppins"
                >
                  Get Started
                </Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>
      </nav>
    );
  }
