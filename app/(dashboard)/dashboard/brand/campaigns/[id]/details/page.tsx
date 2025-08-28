'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Calendar, 
  Users, 
  CheckCircle, 
  Edit,
  Settings,
  DollarSign,
  Target,
  FileText,
  Clock
} from 'lucide-react';
import { use } from 'react';

interface CampaignDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CampaignDetails({ params }: CampaignDetailsProps) {
  const router = useRouter();
  
  // Use React's `use` hook to resolve the Promise
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id as Id<"campaigns">;
  
  // Fetch campaign details
  const campaign = useQuery(api.campaign.getCampaignById, { campaignId });
  
  // Loading state
  if (campaign === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mt-2"></div>
          </div>
        </div>
        <div className="grid gap-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not found state
  if (campaign === null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Campaign Not Found</h1>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">The requested campaign could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getBadgeClassName = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard/brand")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.title}</h1>
            <p className="text-gray-600">{campaign.description}</p>
          </div>
          <Badge className={getBadgeClassName(campaign.status)}>
            {campaign.status}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push(`/dashboard/brand/campaigns/${campaignId}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            onClick={() => router.push(`/dashboard/brand/campaigns/${campaignId}/manage`)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {/* <DollarSign className="h-8 w-8 text-green-500" /> */}
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="text-2xl font-bold">
                  {campaign.budget ? `$${campaign.budget.toLocaleString()}` : 'Not set'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="text-2xl font-bold">{campaign.applications || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold">{campaign.status.approved || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Approval Rate</p>
                <p className="text-2xl font-bold">
                  {campaign.applications && campaign.applications > 0 
                    ? `${Math.round(((campaign.approved || 0) / campaign.applications) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Campaign Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Campaign Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="text-lg">{campaign.title}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-700">{campaign.description}</p>
            </div>
            
            {campaign.niche && (
              <div>
                <label className="text-sm font-medium text-gray-500">Niche</label>
                <p className="text-gray-700">{campaign.niche}</p>
              </div>
            )}
            
            {campaign.targetAudience && (
              <div>
                <label className="text-sm font-medium text-gray-500">Target Audience</label>
                <p className="text-gray-700">{campaign.targetAudience}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline & Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline & Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge className={getBadgeClassName(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Budget</label>
              <p className="text-lg font-semibold">
                {campaign.budget ? `$${campaign.budget.toLocaleString()}` : 'Not specified'}
              </p>
            </div>
            
            {campaign.startDate && campaign.endDate ? (
              <div>
                <label className="text-sm font-medium text-gray-500">Campaign Period</label>
                <p className="text-gray-700">
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </p>
              </div>
            ) : campaign.duration ? (
              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <p className="text-gray-700">{campaign.duration}</p>
              </div>
            ) : null}
            
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-700">
                {new Date(campaign._creationTime).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Types */}
      {campaign.contentTypes && campaign.contentTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Content Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {campaign.contentTypes.map((type: string) => (
                <Badge key={type} variant="outline" className="text-sm">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => router.push(`/dashboard/brand/campaigns/${campaignId}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Campaign
            </Button>
            <Button 
              onClick={() => router.push(`/dashboard/brand/campaigns/${campaignId}/manage`)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Applications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}