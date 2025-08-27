"use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle, Users, Target, TrendingUp, Star } from "lucide-react";
// import { useRouter } from "next/router";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Target, TrendingUp, Users, Star } from 'lucide-react';

interface OnboardingData {
  firstName: string;
  lastName: string;
  niche: string;
  role: string;
  followerCount: string;
  location: string;
  bio: string;
  socialAccounts: {
    instagram: string;
    tiktok: string;
    youtube: string;
    twitter: string;
  };
  portfolio: Array<{
    id?: number;
    type: string;
    title: string;
    description: string;
    url: string;
    metrics: {
      followers: string;
      likes: string;
      comments: string;
      shares: string;
    };
  }>;
}

interface CompletionStepProps {
  data: OnboardingData;
  onComplete?: () => void; 
}

const CompletionStep = ({ data, onComplete }: CompletionStepProps) => {
  const [isRouterReady, setIsRouterReady] = useState(false);
  const router = useRouter();
  

  const features = [
    {
      icon: Target,
      title: "Smart Campaign Matching",
      description: "Get matched with brands that align with your niche and values"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track your campaign performance and grow your influence"
    },
    {
      icon: Users,
      title: "Brand Collaborations",
      description: "Connect with authentic brands looking for creators like you"
    },
    {
      icon: Star,
      title: "Professional Growth",
      description: "Build your creator portfolio and increase your earning potential"
    }
  ];

  const handleComplete = async () => {
    try {

      if (onComplete) {
        onComplete();
        return;
      }

      // Only use router if it's ready
      if (isRouterReady) {
        await router.push("/dashboard/influencer");
      } else {
        console.warn("Router not ready yet, cannot navigate");
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-secondary to-secondary-600 rounded-full flex items-center justify-center mx-auto animate-scale-in">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">
            Welcome to Amplyst, {data.firstName}! 🎉
          </h3>
          <p className="text-gray-600">
            Your profile is complete and ready to attract amazing brand partnerships
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-none">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Your Profile Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">{data.firstName} {data.lastName}</span>
            </div>
            <div className="text-left">
              <span className="text-gray-600">Niche:</span>
              <span className="ml-2 font-medium">{data.niche}</span>
            </div>
            <div className="text-left">
              <span className="text-gray-600">Followers:</span>
              <span className="ml-2 font-medium">{data.followerCount}</span>
            </div>
            <div className="text-left">
              <span className="text-gray-600">Location:</span>
              <span className="ml-2 font-medium">{data.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">What's Next?</h4>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h5 className="font-medium text-sm mb-1">{feature.title}</h5>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={handleComplete}
          disabled={!isRouterReady && !onComplete}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isRouterReady && !onComplete ? 'Loading...' : 'Complete Setup & Go to Dashboard'}
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Why connect your accounts?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Automatically pull your follower count and engagement metrics</li>
          <li>• Show brands your authentic audience and reach</li>
          <li>• Track campaign performance in real-time</li>
          <li>• Build trust with verified social media presence</li>
        </ul>
      </div>
    </div>
  );
};

export default CompletionStep;