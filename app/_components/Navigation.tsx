"use client";

import { SignInButton } from "@clerk/nextjs";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-[#3A7CA5]">
            Amplyst
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">How It Works</a>
          <a href="#success-stories" className="text-gray-600 hover:text-[#3A7CA5] transition-colors">Success Stories</a>
        </div>
        <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90 text-white px-6 py-2 rounded-full font-medium transition-all duration-300">
              Get Started
            </button>
          <SignInButton mode="modal">
            <button className="bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] hover:from-[#3A7CA5]/90 hover:to-[#88B04B]/90 text-white px-6 py-2 rounded-full font-medium transition-all duration-300">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    </nav>
  );
}
