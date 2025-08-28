'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  ArrowLeft,
  Users,
  Clock,
  CheckCircle,
  X,
  MessageSquare,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useState, use } from 'react';
import { toast } from '@/components/ui/use-toast';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs'; // assuming you have these tabs components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar'; // assuming avatar components exist
import {
  Check,
  X as XIcon
} from 'lucide-react';

interface Application {
  _id: Id<'applications'>;
  _creationTime: number;
  campaignId: Id<'campaigns'>;
  influencerId: Id<'users'>;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  proposedRate?: number;
  deliverables?: string[];
  submittedAt: number;
  influencer: {
    name: string;
    email: string;
    profileImage?: string;
    followers?: number;
    engagement?: number;
    niche?: string[];
  };
}

interface CampaignManageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CampaignManage({ params }: CampaignManageProps) {
  const router = useRouter();
  
  // Use React's `use` hook to resolve the Promise
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id as Id<'campaigns'>;

  const campaign = useQuery(api.campaign.getCampaignById, { campaignId });
  const rawApplications = useQuery(api.applications.listInfluencerApplications) || [];

  const updateApplicationStatus = useMutation(api.campaign.updateApplicationStatus);

  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    application: Application | null;
    action: 'approve' | 'reject' | null;
  }>({
    open: false,
    application: null,
    action: null
  });

  // Map raw applications data to match Application interface
  const applications: Application[] = rawApplications.map(app => ({
    _id: app._id,
    _creationTime: app.createdAt,
    campaignId: app.campaignId,
    influencerId: app.influencerId,
    status: app.status,
    message: app.message,
    submittedAt: app.createdAt,
    influencer: {
      name: app.influencerName || 'Unknown',
      email: app.influencerEmail || '',
      profileImage: undefined,
      followers: undefined,
      engagement: undefined,
      niche: app.influencerNiche ? app.influencerNiche.split(',').map(n => n.trim()) : []
    }
  }));

  if (campaign === undefined || rawApplications === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
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
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  const handleApplicationAction = (application: Application, action: 'approve' | 'reject') => {
    setActionDialog({
      open: true,
      application,
      action
    });
  };

  const confirmApplicationAction = async () => {
    if (!actionDialog.application || !actionDialog.action) return;

    try {
      await updateApplicationStatus({
        applicationId: actionDialog.application._id,
        status: actionDialog.action === 'approve' ? 'approved' : 'rejected'
      });
      toast({
        title: `Application ${actionDialog.action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `${actionDialog.application.influencer.name}'s application has been ${actionDialog.action}d`
      });
      setActionDialog({ open: false, application: null, action: null });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive"
      });
    }
  };

    const handleTabChange = (value: string) => {
    // Narrow the string type to 'pending' | 'approved' | 'rejected' before setting
    if (value === 'pending' || value === 'approved' || value === 'rejected') {
        setSelectedTab(value);
    }
    };


  const renderApplication = (application: Application) => (
    <Card key={application._id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={application.influencer.profileImage} alt={application.influencer.name} />
              <AvatarFallback>
                {application.influencer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{application.influencer.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {application.influencer.followers?.toLocaleString() || 0} followers
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-2">{application.influencer.email}</p>

              {application.influencer.niche && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {application.influencer.niche.map(n => (
                    <Badge key={n} variant="secondary" className="text-xs">
                      {n}
                    </Badge>
                  ))}
                </div>
              )}

              {application.message && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{application.message}</p>
                </div>
              )}

              {application.proposedRate && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Proposed Rate: </span>
                  <span className="font-semibold">${application.proposedRate}</span>
                </div>
              )}

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span>Applied: {new Date(application.submittedAt).toLocaleDateString()}</span>
                {application.influencer.engagement && (
                  <span>Engagement: {application.influencer.engagement}%</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {application.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApplicationAction(application, 'approve')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApplicationAction(application, 'reject')}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <XIcon className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}

            <Button size="sm" variant="ghost">
              <MessageSquare className="w-4 h-4 mr-1" />
              Message
            </Button>

            <Button size="sm" variant="ghost">
              <ExternalLink className="w-4 h-4 mr-1" />
              Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.title}</h1>
            <p className="text-gray-600">Manage applications and campaign performance</p>
          </div>
        </div>

        <Button 
          variant="outline"
          onClick={() => router.push(`/dashboard/brand/campaigns/${campaignId}/details`)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold">{applications.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold">{pendingApplications.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold">{approvedApplications.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <XIcon className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold">{rejectedApplications.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Applications Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pendingApplications.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved ({approvedApplications.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XIcon className="h-4 w-4" />
                Rejected ({rejectedApplications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              <div className="space-y-4">
                {pendingApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No pending applications</p>
                  </div>
                ) : (
                  pendingApplications.map(renderApplication)
                )}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <div className="space-y-4">
                {approvedApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No approved applications yet</p>
                  </div>
                ) : (
                  approvedApplications.map(renderApplication)
                )}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <div className="space-y-4">
                {rejectedApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <XIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No rejected applications</p>
                  </div>
                ) : (
                  rejectedApplications.map(renderApplication)
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog 
        open={actionDialog.open} 
        onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'approve' ? 'Approve' : 'Reject'} Application
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionDialog.action} {actionDialog.application?.influencer.name}'s application?
              {actionDialog.action === 'approve' && ' This will notify the influencer and allow them to proceed with the campaign.'}
              {actionDialog.action === 'reject' && ' This action can be reversed later if needed.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmApplicationAction}
              className={actionDialog.action === 'approve' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
              }
            >
              {actionDialog.action === 'approve' ? 'Approve' : 'Reject'} Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}