'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Users, TrendingUp } from 'lucide-react';

interface RoleCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  bgColor: string;
  iconBgColor: string;
}

const roleCards: RoleCard[] = [
  {
    icon: Users,
    title: "Creator/Influencer",
    description: "Nano & micro-influencers (1K-100K followers) looking to monetize content and build brand partnerships",
    features: [
      "Find relevant brand collaborations",
      "Professional portfolio builder",
      "Secure payment processing",
      "Campaign performance tracking"
    ],
    bgColor: "bg-white",
    iconBgColor: "bg-gradient-to-r from-[#3A7CA5] to-[#88B04B]"
  },
  {
    icon: TrendingUp,
    title: "Brand/SME",
    description: "Small to medium businesses and startups seeking authentic influencer partnerships",
    features: [
      "Discover nano & micro-influencers",
      "Cost-effective campaign management",
      "Real-time ROI tracking",
      "Streamlined collaboration tools"
    ],
    bgColor: "bg-white",
    iconBgColor: "bg-gradient-to-r from-[#88B04B] to-[#3A7CA5]"
  },

];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A7CA5]/5 to-[#88B04B]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#3A7CA5] to-[#88B04B] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#3A7CA5]">Amplyst</h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Amplyst
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The smart platform connecting nano & micro-influencers with brands
          </p>
        </div>

        {/* Role Selection Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Choose Your Role
          </h3>
          <p className="text-gray-600">
            Select how you'll be using Amplyst to get the most relevant experience
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {roleCards.map((role, index) => (
            <div
              key={index}
              className={`${role.bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100`}
            >
              <div className={`w-16 h-16 ${role.iconBgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <role.icon className="w-8 h-8 text-white" />
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {role.title}
              </h4>
              
              <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">
                {role.description}
              </p>
              
              <ul className="space-y-2">
                {role.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-flex items-center text-[#3A7CA5] hover:text-[#88B04B] transition-colors duration-200 font-medium"
          >
            <span className="mr-2">←</span>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
