'use client';




import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from '../../../../hooks/use-toast';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Settings,
  CheckCircle,
  Calendar,
  Users,
  Trash2,
  AlertTriangle,
  Clock,
  RefreshCw,
} from 'lucide-react';

interface Campaign {
  _id: Id<"campaigns">;
  _creationTime: number;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'archived' | 'expired';
  budget?: number;
  startDate?: string;
  endDate?: string;
  contentTypes?: string[];
  niche?: string;
  targetAudience?: string;
  duration?: string;
  applications?: number;
  approved?: number;
  expiredAt?: string; // Add this field for tracking when campaign expired
}

export default function CampaignsComponent() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [isCheckingExpired, setIsCheckingExpired] = useState(false);
  
  // Fetch campaigns from database (now including expired for delete functionality)
  const campaigns = useQuery(api.campaign.listMyCampaigns, { includeExpired: true });

  // Fetch all application stats at once to avoid Rules of Hooks violation
  const allApplicationStats = useQuery(api.applications.getAllApplicationStatsByBrand);

  // Mutations
  const deleteCampaign = useMutation(api.campaign.deleteCampaign);
  const updateCampaignStatus = useMutation(api.campaign.updateCampaignStatus);
  const checkExpiredCampaigns = useMutation(api.campaign.checkExpiredCampaigns);
  const deleteExpiredCampaigns = useMutation(api.campaign.deleteExpiredCampaigns);

  // Check for expired campaigns on component mount
  useEffect(() => {
    const checkExpired = async () => {
      try {
        setIsCheckingExpired(true);
        const expiredCount = await checkExpiredCampaigns();
        if (expiredCount > 0) {
          toast({
            title: "Campaigns Updated",
            description: `${expiredCount} campaign${expiredCount > 1 ? 's' : ''} marked as expired`,
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error checking expired campaigns:', error);
      } finally {
        setIsCheckingExpired(false);
      }
    };

    if (campaigns) {
      checkExpired();
    }
  }, [campaigns, checkExpiredCampaigns]);

  // Auto-delete campaigns that have been expired for more than 7 days
  const handleAutoDeleteExpired = async () => {
    try {
      const deletedCount = await deleteExpiredCampaigns();
      if (deletedCount > 0) {
        toast({
          title: "Campaigns Cleaned Up",
          description: `${deletedCount} expired campaign${deletedCount > 1 ? 's' : ''} automatically deleted`,
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Error auto-deleting expired campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to clean up expired campaigns",
        variant: "destructive"
      });
    }
  };

  // Loading state
  if (campaigns === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Campaigns</h2>
            <p className="text-gray-600">Manage your influencer marketing campaigns</p>
          </div>
        </div>
        <div className="grid gap-6">
          {/* Loading skeleton */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (campaigns === null) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Campaigns</h2>
            <p className="text-gray-600">Manage your influencer marketing campaigns</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load campaigns. Please try again.</p>
        </div>
      </div>
    );
  }

  // Handlers
  const handleCreateCampaign = () => {
    router.push('/dashboard/brand/campaigns/create');
  };

  const handleEditCampaign = (campaignId: string) => {
    router.push(`/dashboard/brand/campaigns/${campaignId}/edit`);
  };

  const handleViewDetails = (campaignId: string) => {
    router.push(`/dashboard/brand/campaigns/${campaignId}/details`);
  };

  const handleManageCampaign = (campaignId: string) => {
    router.push(`/dashboard/brand/campaigns/${campaignId}/manage`);
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;
    
    try {
      await deleteCampaign({ campaignId: campaignToDelete._id });
      toast({
        title: "Campaign Deleted",
        description: `"${campaignToDelete.title}" has been deleted successfully`,
        variant: "success"
      });
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
        variant: "destructive"
      });
    }
  };

  const handleArchiveCampaign = async (campaignId: Id<"campaigns">) => {
    try {
      await updateCampaignStatus({ campaignId, status: 'archived' });
      toast({
        title: "Campaign Archived",
        description: "Campaign has been archived successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error archiving campaign:', error);
      toast({
        title: "Error",
        description: "Failed to archive campaign",
        variant: "destructive"
      });
    }
  };

  const handleActivateCampaign = async (campaignId: Id<"campaigns">) => {
    try {
      await updateCampaignStatus({ campaignId, status: 'active' });
      toast({
        title: "Campaign Activated",
        description: "Campaign has been activated successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error activating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to activate campaign",
        variant: "destructive"
      });
    }
  };

  const handleCompleteCampaign = async (campaignId: Id<"campaigns">) => {
    try {
      await updateCampaignStatus({ campaignId, status: 'completed' });
      toast({
        title: "Campaign Completed",
        description: "Campaign has been completed successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error completing campaign:', error);
      toast({
        title: "Error",
        description: "Failed to complete campaign",
        variant: "destructive"
      });
    }
  };

  const getBadgeVariant = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'draft':
        return 'outline';
      case 'archived':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getBadgeClassName = (status: Campaign['status']) => {
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

  // Helper function to calculate days since expiration
  const getDaysSinceExpired = (expiredAt?: string) => {
    if (!expiredAt) return 0;
    const now = new Date();
    const expiredDate = new Date(expiredAt);
    const diffTime = Math.abs(now.getTime() - expiredDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter campaigns to show non-expired by default, but allow expired campaigns to be shown for deletion
  const activeCampaigns = campaigns.filter(campaign => campaign.status !== 'expired');
  const expiredCampaigns = campaigns.filter(campaign => campaign.status === 'expired');

  const renderCampaignCard = (campaign: Campaign) => {
    // Get real-time stats for this campaign
    const stats = allApplicationStats?.[campaign._id] || { total: 0, approved: 0, pending: 0, rejected: 0 };
    const daysSinceExpired = campaign.status === 'expired' ? getDaysSinceExpired(campaign.expiredAt) : 0;
    
    return (
      <Card key={campaign._id} className={campaign.status === 'expired' ? 'border-red-200 bg-red-50/30' : ''}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">{campaign.title}</h3>
                {campaign.status === 'expired' && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                      Expired {daysSinceExpired} day{daysSinceExpired !== 1 ? 's' : ''} ago
                    </Badge>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-1">{campaign.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={getBadgeVariant(campaign.status)}
                className={getBadgeClassName(campaign.status)}
              >
                {campaign.status}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewDetails(campaign._id)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  
                  {campaign.status !== 'expired' && (
                    <>
                      <DropdownMenuItem onClick={() => handleEditCampaign(campaign._id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Campaign
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => handleManageCampaign(campaign._id)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Campaign
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {campaign.status === 'active' && (
                        <>
                          <DropdownMenuItem onClick={() => handleCompleteCampaign(campaign._id)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveCampaign(campaign._id)}>
                            Archive Campaign
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {campaign.status === 'draft' && (
                        <DropdownMenuItem onClick={() => handleActivateCampaign(campaign._id)}>
                          Activate Campaign
                        </DropdownMenuItem>
                      )}
                      
                      {(campaign.status === 'archived' || campaign.status === 'completed') && (
                        <DropdownMenuItem onClick={() => handleActivateCampaign(campaign._id)}>
                          Reactivate Campaign
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  
                  {campaign.status === 'expired' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(campaign)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Campaign
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-semibold">
                  {campaign.budget ? `$${campaign.budget.toLocaleString()}` : 'Not set'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold">
                  {campaign.startDate && campaign.endDate ? (
                    `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`
                  ) : campaign.duration ? (
                    campaign.duration
                  ) : (
                    'Not set'
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <div className="flex items-center gap-1">
                  <p className="font-semibold">{stats.total}</p>
                  {stats.pending > 0 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      {stats.pending} pending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-green-600">{stats.approved}</p>
                  {stats.rejected > 0 && (
                    <Badge variant="outline" className="text-xs px-1 py-0 text-red-600 border-red-200">
                      {stats.rejected} rejected
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Status Overview */}
          {stats.total > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Application Status:</span>
                <div className="flex gap-4">
                  <span className="text-blue-600">
                    Pending: {stats.pending}
                  </span>
                  <span className="text-green-600">
                    Approved: {stats.approved}
                  </span>
                  <span className="text-red-600">
                    Rejected: {stats.rejected}
                  </span>
                </div>
              </div>
              {stats.total > 0 && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(stats.approved / stats.total) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {campaign.contentTypes && campaign.contentTypes.length > 0 ? (
              campaign.contentTypes.map((type: string) => (
                <Badge key={type} variant="outline">
                  {type}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-gray-400">
                No content types specified
              </Badge>
            )}
          </div>

          {/* Expiration warning for expired campaigns */}
          {campaign.status === 'expired' && daysSinceExpired >= 5 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700">
                  {daysSinceExpired >= 7 
                    ? "This campaign will be automatically deleted soon."
                    : `This campaign will be automatically deleted in ${7 - daysSinceExpired} day${7 - daysSinceExpired !== 1 ? 's' : ''}.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Quick action buttons for active campaigns */}
          {campaign.status !== 'expired' && (
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDetails(campaign._id)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditCampaign(campaign._id)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm"
                onClick={() => handleManageCampaign(campaign._id)}
                className={stats.pending > 0 ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                <Settings className="w-4 h-4 mr-1" />
                Manage
                {stats.pending > 0 && (
                  <Badge className="ml-1 bg-white text-orange-600 text-xs">
                    {stats.pending}
                  </Badge>
                )}
              </Button>
            </div>
          )}
          
          {/* Delete button for expired campaigns */}
          {campaign.status === 'expired' && (
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDetails(campaign._id)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDeleteClick(campaign)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Campaigns</h2>
          <p className="text-gray-600">Manage your influencer marketing campaigns</p>
        </div>
        <div className="flex gap-2">
          {expiredCampaigns.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleAutoDeleteExpired}
              disabled={isCheckingExpired}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isCheckingExpired ? 'animate-spin' : ''}`} />
              Clean Up Expired
            </Button>
          )}
          <Button onClick={handleCreateCampaign}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No campaigns found</p>
          <Button onClick={handleCreateCampaign}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Campaign
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active campaigns */}
          {activeCampaigns.length > 0 && (
            <div className="grid gap-6">
              {activeCampaigns.map(renderCampaignCard)}
            </div>
          )}
          
          {/* Expired campaigns section */}
          {expiredCampaigns.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-700">Expired Campaigns</h3>
                  <Badge variant="destructive" className="ml-2">
                    {expiredCampaigns.length}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                These campaigns have expired and can be deleted permanently. Campaigns expired for more than 7 days will be automatically deleted.
              </p>
              <div className="grid gap-4">
                {expiredCampaigns.map(renderCampaignCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{campaignToDelete?.title}"? This action cannot be undone.
              All associated data including applications and analytics will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}






