


export interface Profile {
  _id?: string;
  name: string;
  bio: string;
  niche: string;
  location: string;
  totalEarnings?: number;
  portfolio: PortfolioItem[];
  socialAccounts: SocialAccounts;
}

export interface PortfolioItem {
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
}

export interface SocialAccounts {
  instagram: string;
  tiktok: string;
  youtube: string;
  twitter: string;
}

export interface Campaign {
  _id: string;
  title: string;
  description?: string;
  budget?: number;
  status: string;
  endDate: string;
  targetAudience?: string;
  contentTypes?: string[];
  creatorUserId: string;
}

export interface Application {
  _id: string;
  campaignTitle: string;
  influencerName: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  proposedContent?: string;
  _creationTime: number;
}

export interface Brand {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
}