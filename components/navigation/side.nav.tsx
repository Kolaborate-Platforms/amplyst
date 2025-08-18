'use client'
import { Settings, Home, Users, Target, BarChart3, MessageSquare, Briefcase } from "lucide-react";
import { useQuery } from 'convex/react';
import { UserRoleEnum } from '@/lib/enums/roles.enum';
import { NavItem } from '@/lib/interfaces/navigation.interface';
import { api } from '@/convex/_generated/api';

const roleRoutes: Record<UserRoleEnum, NavItem[]> = {
    [UserRoleEnum.BRAND]: [
        {
            label: "Dashboard",
            href: "/brand",
            icon: Home,
            tabValue: "overview",
            description: "Overview and stats"
        },
        {
            label: "Discover Influencers",
            href: "/brand/discover",
            icon: Users,
            tabValue: "discover",
            description: "Find content creators"
        },
        {
            label: "Campaigns",
            href: "/brand/campaigns",
            icon: Target,
            tabValue: "brands",
            description: "Manage your campaigns"
        },
        {
            label: "Applications",
            href: "/brand/applications",
            icon: Briefcase,
            tabValue: "applications",
            description: "Review applications"
        },
        {
            label: "Analytics",
            href: "/brand/analytics",
            icon: BarChart3,
            description: "Performance insights",
            comingSoon: true
        },
        {
            label: "Messages",
            href: "/brand/messages",
            icon: MessageSquare,
            description: "Chat and communications"
        },
        {
            label: "Settings",
            href: "/brand/settings",
            icon: Settings,
            description: "Account preferences",
            comingSoon: true
        }
    ],
    [UserRoleEnum.INFLUENCER]: [
        {
            label: "Dashboard",
            href: "/influencer/dashboard",
            icon: Home,
            tabValue: "overview",
            description: "Overview and stats"
        },
        {
            label: "Discover Campaigns",
            href: "/influencer/discover-campaigns",
            icon: Target,
            tabValue: "discover",
            description: "Find new opportunities"
        },
        {
            label: "Discover Brands",
            href: "/influencer/discover-brands",
            icon: Users,
            tabValue: "brands",
            description: "Explore brand partnerships"
        },
        {
            label: "My Applications",
            href: "/influencer/applications",
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

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SideNav() {
    // const userRole = useQuery(api.users.getMyRole);
    const userRole = UserRoleEnum.BRAND;
    const navs = userRole ? roleRoutes[userRole] : [];
    const currentPath = usePathname();

    return (
        <>
            <div className='flex justify-center items-center border-b border-primary h-32'>
                <Image 
                    src='/assets/logo.png' 
                    alt="Amplyst Logo" 
                    // className='scale-75' 
                    height={150}
                    width={150}
                />
            </div>
            <div className='space-y-6 mt-4'>
                {navs.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.href;
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer
                                ${isActive ? "bg-primary text-white" : "hover:bg-primary hover:text-white"}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="capitalize">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}