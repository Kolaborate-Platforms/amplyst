'use client'

import { BellDotIcon, User2Icon, Settings, LogOut, Crown, Users, Target, Menu, Home, BarChart3, Target as TargetIcon, Crown as CrownIcon, FileText, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useUser, SignOutButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
    const currentPath = usePathname()?.split('/')
    const path = currentPath[currentPath.length -1]
    
    // Get user data from Clerk
    const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
    
    // Get user data from Convex
    const userData = useQuery(api.users.getCurrentUserWithProfile)
    
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

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const getNavigationItems = () => {
        return [
            { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
            { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
            { href: '/campaigns', label: 'Campaigns', icon: <TargetIcon className="h-4 w-4" /> },
            { href: '/influencers', label: 'Influencers', icon: <Users className="h-4 w-4" /> },
            { href: '/brands', label: 'Brands', icon: <CrownIcon className="h-4 w-4" /> },
            { href: '/agencies', label: 'Agencies', icon: <FileText className="h-4 w-4" /> },
            { href: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
        ]
    }

    const getProfileImageUrl = () => {
        // Priority: Custom uploaded photo > Clerk photo > Fallback
        if (userData?.profile?.profilePictureUrl) {
            return userData.profile.profilePictureUrl
        }
        if (clerkUser?.imageUrl) {
            return clerkUser.imageUrl
        }
        return null
    }
        
    return (
        <>
            <div className='flex flex-row items-center h-full justify-between'>
                {/* Mobile Menu Button and Page Title */}
                <div className="flex items-center gap-3">
                    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" className="lg:hidden p-2">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0">
                            <SheetHeader className="p-6 border-b">
                                <SheetTitle className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">A</span>
                                    </div>
                                    <span className="text-xl font-bold">Amplyst</span>
                                </SheetTitle>
                            </SheetHeader>
                            
                            {/* User Info in Drawer */}
                            {isClerkLoaded && clerkUser && (
                                <div className="p-6 border-b">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage 
                                                src={clerkUser.imageUrl} 
                                                alt={clerkUser.fullName || 'User'} 
                                            />
                                            <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                                                {clerkUser.firstName?.charAt(0) || clerkUser.emailAddresses[0]?.emailAddress.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col">
                                            <p className="font-medium">
                                                {clerkUser.fullName || 'User'}
                                            </p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                {clerkUser.emailAddresses[0]?.emailAddress}
                                            </p>
                                            {userData?.user?.role && (
                                                <Badge 
                                                    variant="secondary" 
                                                    className={`${getRoleColor(userData.user.role)} text-xs mt-1`}
                                                >
                                                    {getRoleIcon(userData.user.role)}
                                                    <span className="ml-1 capitalize">
                                                        {userData.user.role}
                                                    </span>
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Navigation Items */}
                            <nav className="flex-1 p-6">
                                <ul className="space-y-2">
                                    {getNavigationItems().map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsDrawerOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                                    currentPath?.includes(item.href.split('/').pop() || '') 
                                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                                }`}
                                            >
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                
                                {/* Sign Out in Drawer */}
                                {isClerkLoaded && clerkUser && (
                                    <div className="mt-6 pt-6 border-t">
                                        <SignOutButton>
                                            <Button 
                                                variant="ghost" 
                                                className="w-full justify-start text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20"
                                                onClick={() => setIsDrawerOpen(false)}
                                            >
                                                <LogOut className="mr-3 h-5 w-5" />
                                                Sign out
                                            </Button>
                                        </SignOutButton>
                                    </div>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    
                    {/* Page Title */}
                    <span className='capitalize text-primary font-semibold text-lg lg:text-xl tracking-wider'>{path}</span>
                </div>
                
                <div className="flex flex-row items-center gap-2 lg:gap-4">
                    {/* Notifications */}
                    <Button className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                        <BellDotIcon className="h-5 w-5 lg:h-6 lg:w-6 text-neutral-600 dark:text-neutral-400" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-error-500" />
                    </Button>
                    
                    {/* User Menu */}
                    {isClerkLoaded && clerkUser && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 lg:h-10 lg:w-10 rounded-full p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                    <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
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
                </div>
            </div>
        </>
    )
}