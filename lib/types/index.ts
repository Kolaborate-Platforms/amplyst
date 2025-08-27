
'use client';

import { Id } from "../../convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  tokenIdentifier?: string;
  email: string;
  username?: string;
  role: "influencer" | "brand" | "agency";
}
    
export interface Profile {
  _id: Id<"profiles">;
  userId: Id<"users">;
  role: "influencer" | "brand" | "agency";
  name: string;
  handle?: string;
  verified?: boolean;
  profilePictureUrl?: string;
  bio?: string;
  niche?: string;
  location?: string;
  followerCount?: number;
  engagementRate?: number;
  socialAccounts?: {
    instagram: string;
    tiktok: string;
    youtube: string;
    twitter: string;
  };
  portfolio?: any[];
  primaryPlatform?: string[];
  recentPost?: string;
  price?: string;
  rating?: number;
  // Brand/agency fields
  companyName?: string;
  website?: string;
  industry?: string;
  description?: string;
  contactPerson?: string;
  businessEmail?: string;
  campaignGoal?: string;
  targetAudience?: string;
  influencerType?: string[];
  influencerNiche?: string[];
  budgetRange?: string;
  contentType?: string[];
  campaignDescription?: string;
  campaignCount?: number;
  activeCampaigns?: Id<"campaigns">[];
  totalBudget?: number;
  totalEarnings?: number;
}

export interface Campaign {
  _id: Id<"campaigns">;
  creatorUserId: Id<"users">;
  role: "influencer" | "brand" | "agency";
  title: string;
  description: string;
  budget?: number;
  status: "draft" | "active" | "completed" | "archived" | "expired";
  targetAudience?: string;
  contentTypes?: string[];
  duration?: string;
  platform?: string;
  startDate?: string;
  endDate?: string;
  requirements?: string;
  niche?: string;
  expiredAt?: string;
  _creationTime?: number;
}

export interface CampaignWithCreator extends Campaign {
  creatorName?: string;
  creatorHandle?: string;
  creatorVerified?: boolean;
  creatorProfilePicture?: string;
}

export interface Application {
  _id: Id<"applications">;
  campaignId: Id<"campaigns">;
  influencerId: Id<"users">;
  brandId?: Id<"brands">;
  status: "pending" | "approved" | "rejected";
  message?: string;
  proposedContent?: string;
  influencerName?: string;
  influencerEmail?: string;
  influencerNiche?: string;
  campaignTitle?: string;
  createdAt: number;
  updatedAt: number;
}