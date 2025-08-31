'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ChevronDown, User, LogOut, Crown, Building2, Users } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user role from Convex
  const userRole = useQuery(api.users.getMyRole);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isSignedIn || !user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'influencer':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'brand':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'agency':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'influencer':
        return 'Creator/Influencer';
      case 'brand':
        return 'Brand/SME';
      case 'agency':
        return 'Marketing Agency';
      default:
        return 'User';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3A7CA5] focus:ring-offset-2"
      >
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] flex items-center justify-center text-white font-semibold text-sm">
          {user.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt={user.fullName || 'User'} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span>{user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}</span>
          )}
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user.firstName || user.username || 'User'}
          </div>
          {userRole && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              {getRoleIcon(userRole)}
              <span>{getRoleLabel(userRole)}</span>
            </div>
          )}
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] flex items-center justify-center text-white font-semibold">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || 'User'} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span>{user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {user.fullName || user.username || 'User'}
                </div>
                <div className="text-sm text-gray-500">{user.emailAddresses[0]?.emailAddress}</div>
                {userRole && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                    {getRoleIcon(userRole)}
                    <span>{getRoleLabel(userRole)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
