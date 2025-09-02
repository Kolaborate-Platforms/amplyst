"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Target, 
  Search, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Home,
  BarChart3,
  Users,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "influencer" | "brand";
  userName?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole,
  userName = "User",
  activeTab = "overview",
  onTabChange
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const influencerNavItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/dashboard/influencer" },
    { id: "discover", label: "Discover", icon: Search, href: "/dashboard/influencer/discover" },
    { id: "brands", label: "Brands", icon: Users, href: "/dashboard/influencer/brands" },
    { id: "applications", label: "Applications", icon: FileText, href: "/dashboard/influencer/applications" },
  ];

  const brandNavItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/dashboard/brand" },
    { id: "campaigns", label: "Campaigns", icon: Target, href: "/dashboard/brand/campaigns" },
    { id: "influencers", label: "Influencers", icon: Users, href: "/dashboard/brand/influencers" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/dashboard/brand/analytics" },
  ];

  const navItems = userRole === "influencer" ? influencerNavItems : brandNavItems;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  const Sidebar = ({ isMobile = false }) => (
    <motion.div
      className={`
        ${isMobile ? "fixed inset-y-0 left-0 z-50 w-64" : "hidden lg:block lg:w-64"}
        bg-white border-r border-gray-200 shadow-sm
      `}
      initial={isMobile ? { x: -320 } : undefined}
      animate={isMobile ? { x: 0 } : undefined}
      exit={isMobile ? { x: -320 } : undefined}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="font-bold text-lg text-gray-900">InfluenceHub</span>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary"
                  className={`text-xs ${
                    userRole === "influencer" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {userRole === "influencer" ? "Creator" : "Brand"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-gray-500"}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <Sidebar isMobile />
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Desktop Title */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-900 capitalize">
                {userRole} Dashboard
              </h1>
            </div>

            {/* Mobile Title */}
            <div className="lg:hidden flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {navItems.find(item => item.id === activeTab)?.label || "Dashboard"}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              <div className="hidden sm:block">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;