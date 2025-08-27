'use client'
import { Settings, Home, Users, Target, BarChart3, MessageSquare, Briefcase } from "lucide-react";
import { useQuery } from 'convex/react';
import { UserRoleEnum } from '@/lib/enums/roles.enum';
import { NavItem } from '@/lib/interfaces/navigation.interface';
import { api } from '@/convex/_generated/api';
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const roleRoutes: Record<UserRoleEnum, NavItem[]> = {
    [UserRoleEnum.BRAND]: [
        {
            label: "Dashboard",
            href: "/dashboard/brand",
            icon: Home,
            tabValue: "overview",
            description: "Overview and stats"
        },
        {
            label: "Discover Influencers",
            href: "/dashboard/brand/discover",
            icon: Users,
            tabValue: "discover",
            description: "Find content creators"
        },
        {
            label: "Campaigns",
            href: "/dashboard/brand/campaigns",
            icon: Target,
            tabValue: "campaigns",
            description: "Manage your campaigns"
        },
        {
            label: "Applications",
            href: "/dashboard/brand/applications",
            icon: Briefcase,
            tabValue: "applications",
            description: "Review applications"
        },
        {
            label: "Analytics",
            href: "/dashboard/brand/analytics",
            icon: BarChart3,
            description: "Performance insights",
            comingSoon: true
        },
        {
            label: "Messages",
            href: "/dashboard/brand/messages",
            icon: MessageSquare,
            description: "Chat and communications"
        },
        {
            label: "Settings",
            href: "/dashboard/brand/settings",
            icon: Settings,
            description: "Account preferences",
            comingSoon: true
        }
    ],
    [UserRoleEnum.INFLUENCER]: [
            {
                label: "Dashboard",
                href: "/dashboard/influencer?tab=overview",
                icon: Home,
                tabValue: "overview",
                description: "Overview and stats"
            },
            {
                label: "Discover Campaigns",
                href: "/dashboard/influencer?tab=discover",
                icon: Target,
                tabValue: "discover",
                description: "Find new opportunities"
            },
            {
                label: "Discover Brands",
                href: "/dashboard/influencer?tab=brands",
                icon: Users,
                tabValue: "brands",
                description: "Explore brand partnerships"
            },
            {
                label: "My Applications",
                href: "/dashboard/influencer?tab=applications",
                icon: Briefcase,
                tabValue: "applications",
                description: "Track your applications"
            },
            {
                label: "Messages",
                href: "/influencer/messages",
                icon: MessageSquare,
                description: "Chat and communications"
            },
            {
                label: "Settings",
                href: "/influencer/settings",
                icon: Settings,
                description: "Account preferences",
                comingSoon: true
            }
    ],
    [UserRoleEnum.AGENCY]: [
        {
            label: "Dashboard",
            href: "/agency/dashboard",
            icon: Home,
            tabValue: "overview",
            description: "Overview and stats"
        },
        {
            label: "Manage Brands",
            href: "/agency/brands",
            icon: Target,
            description: "Brand management"
        },
        {
            label: "Manage Influencers",
            href: "/agency/influencers",
            icon: Users,
            description: "Influencer network"
        },
        {
            label: "Campaigns",
            href: "/agency/campaigns",
            icon: Briefcase,
            description: "Campaign oversight"
        },
        {
            label: "Analytics",
            href: "/agency/analytics",
            icon: BarChart3,
            description: "Performance metrics",
            comingSoon: true
        },
        {
            label: "Messages",
            href: "/agency/messages",
            icon: MessageSquare,
            description: "Chat and communications"
        },
        {
            label: "Settings",
            href: "/agency/settings",
            icon: Settings,
            description: "Account preferences",
            comingSoon: true
        }
    ]
};

// Role display configuration for user profile section
const roleConfig = {
    [UserRoleEnum.BRAND]: {
        displayName: "Brand",
        badgeClass: "bg-green-100 text-green-800",
        avatarClass: "from-green-500 to-emerald-600"
    },
    [UserRoleEnum.INFLUENCER]: {
        displayName: "Creator",
        badgeClass: "bg-blue-100 text-blue-800",
        avatarClass: "from-blue-500 to-indigo-600"
    },
    [UserRoleEnum.AGENCY]: {
        displayName: "Agency",
        badgeClass: "bg-purple-100 text-purple-800",
        avatarClass: "from-purple-500 to-pink-600"
    }
};

export default function SideNav() {
    // Fetch the user's role dynamically
    const userRole = useQuery(api.users.getMyRole);
    const userProfile = useQuery(api.users.getMyProfile); // Assuming you have this query
    const currentPath = usePathname();

    // Show loading state while fetching user role
    if (userRole === undefined) {
        return (
            <div className="flex flex-col h-full bg-white">
                <div className='flex justify-center items-center border-b border-primary h-32'>
                    <Image 
                        src='/assets/logo.png' 
                        alt="Amplyst Logo" 
                        height={150}
                        width={150}
                    />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    // Handle case where user role is null (no role assigned)
    if (userRole === null) {
        return (
            <div className="flex flex-col h-full bg-white">
                <div className='flex justify-center items-center border-b border-primary h-32'>
                    <Image 
                        src='/assets/logo.png' 
                        alt="Amplyst Logo" 
                        height={150}
                        width={150}
                    />
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center text-gray-500">
                        <p>No role assigned. Please contact support.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Get navigation items based on user role
    const navs = userRole ? roleRoutes[userRole] : [];
    const roleInfo = userRole ? roleConfig[userRole] : null;
    const userName = userProfile?.name || "User";

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Logo Section */}
            <div className='flex justify-center items-center border-b border-primary h-32'>
                <Image 
                    src='/assets/logo.png' 
                    alt="Amplyst Logo" 
                    height={150}
                    width={150}
                />
            </div>

            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${roleInfo?.avatarClass} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-semibold">
                            {userName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleInfo?.badgeClass}`}>
                                {roleInfo?.displayName}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <div className='flex-1 px-4 py-4'>
                <div className='space-y-2'>
                    {navs.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                                    ${isActive 
                                        ? "bg-primary text-white shadow-sm" 
                                        : "hover:bg-gray-50 hover:text-gray-900 text-gray-600"
                                    }
                                    ${item.comingSoon ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                `}
                                onClick={(e) => item.comingSoon && e.preventDefault()}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
                                <span className="text-sm font-medium">{item.label}</span>
                                {item.comingSoon && (
                                    <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                        Soon
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Footer Section - Role-specific info */}
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                    Signed in as {roleInfo?.displayName}
                </div>
            </div>
        </div>
    );
}