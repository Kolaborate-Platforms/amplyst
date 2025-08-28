"use client";

import { motion } from "framer-motion";
import { useState,useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { SignedIn } from "@clerk/clerk-react";
// import Layout from "../../(dashboard)/layout";
// import Layout from "../../(dashboard)/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "../../hooks/use-toast";
import {
  DollarSign,
  Edit,
  Target,
  MessageSquare,
  Star,
  Calendar,
  Clock,
  CheckCircle,
  Users,
  Play,
  Search,
  XCircle,
  TrendingUp,
  Award,
  Eye,
  User
} from "lucide-react";
// import CampaignDiscovery from "../../_components/influencer/campaignDiscovery";
import CampaignDiscovery from "../../(dashboard)/dashboard/influencer/discover/campaigns/page";
import BrandDiscovery from "../influencer/brandDiscovery";
import { useRouter, useSearchParams } from "next/navigation";
// import MyApplications from "../../_components/influencer/MyApplications";



const InfluencerDashboard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get active tab from URL params, default to 'overview'
  const urlTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(urlTab);
  
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [showViewProfile, setShowViewProfile] = useState(false);
  const { toast } = useToast();

  // Sync activeTab with URL params
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    
    // Update URL without full page reload
    const newUrl = newTab === 'overview' 
      ? '/dashboard/influencer' 
      : `/dashboard/influencer?tab=${newTab}`;
      
    router.push(newUrl);
  };

  // Live data queries
  const profile = useQuery(api.users.getInfluencerProfile, {});
  const allCampaigns = useQuery(api.campaign.allCampaigns);
  const activeCampaigns = useQuery(api.campaign.activeForInfluencer);
  const applications = useQuery(api.applications.listInfluencerApplications);
  const allBrands = useQuery(api.brands.listBrands);

  // Mutations
  const updateProfile = useMutation(api.users.insertProfile);

  const handleViewProfile = () => {
    setShowViewProfile(true);
  };

  const handleEditProfile = () => {
    setEditingProfile({
      name: profile?.name || '',
      bio: profile?.bio || '',
      niche: profile?.niche || '',
      location: profile?.location || '',
      portfolio: profile?.portfolio || [],
      socialAccounts: profile?.socialAccounts || {
        instagram: '',
        tiktok: '',
        youtube: '',
        twitter: '',
      },
    });
    setShowEditProfile(true);
    setShowViewProfile(false);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedPortfolio = editingProfile.portfolio.length > 0 
        ? [
            {
              ...editingProfile.portfolio[0],
              metrics: {
                ...editingProfile.portfolio[0].metrics,
                followers: editingProfile.followerCount
              }
            },
            ...editingProfile.portfolio.slice(1)
          ]
        : [{
            type: "image",
            title: "Profile",
            description: "Profile metrics",
            url: "",
            metrics: {
              followers: editingProfile.followerCount,
              likes: "0",
              comments: "0",
              shares: "0"
            }
          }];

      await updateProfile({
        role: "influencer",
        ...editingProfile,
        portfolio: updatedPortfolio
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        // variant: "success"
      });
      setShowEditProfile(false);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Calculate stats
  const approvedApplicationsCount = applications ? applications.filter(app => app.status === 'approved').length : 0;
  const activeCampaignsCount = allCampaigns ? allCampaigns.filter(campaign => campaign.status === 'active').length : 0;
  const totalEarnings = profile?.totalEarnings || 0;

  if (!profile || !allCampaigns || !activeCampaigns || !applications || !allBrands) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
    );
  }

  const renderEditProfileModal = () => (
    <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <Input
              id="name"
              value={editingProfile?.name || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                name: e.target.value
              })}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
            <Textarea
              id="bio"
              value={editingProfile?.bio || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                bio: e.target.value
              })}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full resize-none"
            />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-sm font-medium">Niche</Label>
              <Input
                id="niche"
                value={editingProfile?.niche || ''}
                onChange={(e) => setEditingProfile({
                  ...editingProfile,
                  niche: e.target.value
                })}
                placeholder="e.g. Fashion, Tech, Lifestyle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                value={editingProfile?.location || ''}
                onChange={(e) => setEditingProfile({
                  ...editingProfile,
                  location: e.target.value
                })}
                placeholder="City, Country"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="followerCount" className="text-sm font-medium">Total Followers</Label>
            <Input
              id="followerCount"
              type="number"
              value={editingProfile?.portfolio?.[0]?.metrics?.followers || ''}
              onChange={(e) => setEditingProfile({
                ...editingProfile,
                followerCount: e.target.value
              })}
              placeholder="10000"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">Social Media Accounts</Label>
            <div className="grid gap-3">
              {[
                { key: 'instagram', placeholder: 'Instagram username or URL', icon: '📷' },
                { key: 'tiktok', placeholder: 'TikTok username or URL', icon: '🎵' },
                { key: 'youtube', placeholder: 'YouTube channel URL', icon: '📺' },
                { key: 'twitter', placeholder: 'Twitter/X username or URL', icon: '🐦' }
              ].map(({ key, placeholder, icon }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  <Input
                    placeholder={placeholder}
                    value={editingProfile?.socialAccounts?.[key] || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      socialAccounts: {
                        ...editingProfile.socialAccounts,
                        [key]: e.target.value
                      }
                    })}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setShowEditProfile(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Update Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderViewProfileModal = () => (
    <Dialog open={showViewProfile} onOpenChange={setShowViewProfile}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Profile Overview</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {profile?.name?.charAt(0)}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{profile?.name}</h3>
                <p className="text-gray-600 mt-1">{profile?.bio}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Niche</p>
                  <p className="text-gray-900">{profile?.niche || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{profile?.location || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Followers</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {Number(profile?.portfolio?.find(item => item.type === 'image')?.metrics?.followers || 0).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${totalEarnings.toLocaleString()}
                  </p>
                </div>
              </div>
              {profile?.socialAccounts && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-500">Social Media Accounts</p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(profile.socialAccounts).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url.toString()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                        >
                          {platform === 'instagram' && '📷'}
                          {platform === 'tiktok' && '🎵'}
                          {platform === 'youtube' && '📺'}
                          {platform === 'twitter' && '🐦'}
                          <span className="capitalize">{platform}</span>
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleEditProfile} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 sm:p-8 text-white"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back, {profile?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Track your campaigns, discover new opportunities, and grow your influence.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleViewProfile}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            title: "Total Earnings",
            value: `$${totalEarnings.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
            // change: "+12.5%",
            // changeType: "positive"
          },
          {
            title: "Active Campaigns",
            value: activeCampaignsCount.toString(),
            icon: Target,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            // change: "+3",
            // changeType: "positive"
          },
          {
            title: "Applications",
            value: applications.length.toString(),
            icon: MessageSquare,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            // change: "+5",
            // changeType: "positive"
          },
          {
            title: "Available Campaigns",
            value: activeCampaignsCount.toString(),
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            // change: "+8",
            // changeType: "positive"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {/* <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div> */}
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profile Quick View Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <CardTitle className="flex items-center gap-2">
                {/* <User className="w-5 h-5 text-blue-600" /> */}
                Profile Overview
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={handleViewProfile}
                className="w-full sm:w-auto bg-white hover:bg-gray-100 hover:border-gray-200 text-primary-600 transition-all duration-200"
              >
                <Edit className="w-4 h-4 mr-2" />
                Manage Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {profile?.name?.charAt(0)}
              </div>
              <div className="flex-1 space-y-4 min-w-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {profile?.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {profile?.bio || 'No bio added yet'}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Niche</p>
                    <p className="text-gray-900 truncate">
                      {profile?.niche || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Location</p>
                    <p className="text-gray-900 truncate">
                      {profile?.location || 'Not set'}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-gray-500 font-medium">Followers</p>
                    <p className="text-blue-600 font-semibold">
                      {Number(profile?.portfolio?.find(item => item.type === 'image')?.metrics?.followers || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Campaigns Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Active Campaigns
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Your approved campaigns that are currently running
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleTabChange('discover')}
                className="w-full sm:w-auto hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <Search className="w-4 h-4 mr-2" />
                Find More
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeCampaigns.filter(campaign => campaign.status === 'active').length > 0 ? (
              <div className="space-y-4">
                {activeCampaigns
                  .filter(campaign => campaign.status === 'active')
                  .slice(0, 3) // Show only first 3 on overview
                  .map((campaign, index) => (
                    <motion.div
                      key={campaign._id}
                      className="p-4 sm:p-6 border rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {campaign.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            by {campaign.creatorUserId}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Badge 
                            variant="default"
                            className="bg-green-100 text-green-800 border-green-200"
                          >
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Active
                            </div>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="truncate">
                            ${campaign.budget?.toLocaleString() ?? 'TBD'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                          <span className="truncate">
                            {campaign.targetAudience || 'General'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          <span className="truncate">
                            {campaign.contentTypes?.join(', ') || 'Various'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                          <Play className="w-4 h-4 mr-2" />
                          Upload Content
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                
                {activeCampaigns.filter(campaign => campaign.status === 'active').length > 3 && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleTabChange('discover')}
                      className="hover:bg-blue-50 hover:border-blue-200"
                    >
                      View All {activeCampaigns.filter(campaign => campaign.status === 'active').length} Active Campaigns
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Campaigns
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start exploring campaigns to find your next opportunity and grow your influence.
                </p>
                <Button 
                  onClick={() => handleTabChange('discover')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Discover Campaigns
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Applications Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Recent Applications
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Your latest campaign applications and their status
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleTabChange('applications')}
                className="w-full sm:w-auto hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
              >
                View All Applications
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {applications && applications.length > 0 ? (
              <div className="space-y-3">
                {applications
                  .slice(0, 3)
                  .map((application, index) => (
                    <motion.div
                      key={application._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {application.campaignTitle?.charAt(0) || "C"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {application.campaignTitle}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(application._creationTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          application.status === 'pending' ? 'secondary' :
                          application.status === 'approved' ? 'default' :
                          'destructive'
                        }
                        className={
                          application.status === 'approved' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }
                      >
                        <div className="flex items-center gap-1">
                          {application.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {application.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {application.status === 'pending' && <Clock className="w-3 h-3" />}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </div>
                      </Badge>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start applying to campaigns to see your applications here
                </p>
                <Button 
                  onClick={() => handleTabChange('discover')} 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Campaigns
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderApplications = () => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          My Applications
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Track the status of your campaign applications
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="font-medium">Total: </span>
            <span className="text-gray-600">{applications?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="font-medium">Pending: </span>
            <span className="text-yellow-600">
              {applications?.filter(app => app.status === 'pending').length || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Approved: </span>
            <span className="text-green-600">
              {applications?.filter(app => app.status === 'approved').length || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-medium">Rejected: </span>
            <span className="text-red-600">
              {applications?.filter(app => app.status === 'rejected').length || 0}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {applications?.length > 0 ? (
            applications
              .sort((a, b) => {
                const statusPriority = { pending: 0, approved: 1, rejected: 2 };
                if (statusPriority[a.status] !== statusPriority[b.status]) {
                  return statusPriority[a.status] - statusPriority[b.status];
                }
                return b._creationTime - a._creationTime;
              })
              .map((application, index) => (
                <motion.div 
                  key={application._id}
                  className="p-4 sm:p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {application.campaignTitle?.charAt(0) || "C"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 truncate">
                            {application.campaignTitle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Applied by: {application.influencerName}
                          </p>
                        </div>
                      </div>
                      
                      {application.message && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Application Message:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {application.message}
                          </p>
                        </div>
                      )}
                      
                      {application.proposedContent && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Proposed Content:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {application.proposedContent}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge 
                          variant={
                            application.status === 'pending' ? 'secondary' :
                            application.status === 'approved' ? 'default' :
                            'destructive'
                          }
                          className={
                            application.status === 'approved' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : application.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }
                        >
                          <div className="flex items-center gap-1">
                            {application.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                            {application.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {application.status === 'pending' && <Clock className="w-3 h-3" />}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </div>
                        </Badge>
                        
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied: {new Date(application._creationTime).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Status Messages */}
                      {application.status === 'approved' && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Congratulations! Your application has been approved. You can now start working on this campaign.
                          </p>
                        </div>
                      )}
                      
                      {application.status === 'rejected' && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Your application was not selected for this campaign. Keep applying to other opportunities!
                          </p>
                        </div>
                      )}
                      
                      {application.status === 'pending' && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Your application is under review. We'll notify you once there's an update.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    {application.status === 'approved' && (
                      <div className="flex flex-row lg:flex-col gap-2 lg:w-48">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <Play className="w-4 h-4 mr-1" />
                          Start Campaign
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact Brand
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your campaign applications will appear here. Start browsing and applying to campaigns to get started.
              </p>
              <Button 
                onClick={() => handleTabChange('discover')} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Discover Campaigns
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SignedIn>
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="brands">Brands</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="discover">
              <div className="text-center py-10">
                <CampaignDiscovery campaigns={allCampaigns} profile={profile} />
              </div>
            </TabsContent>

            <TabsContent value="brands">
               <BrandDiscovery brands={allBrands} campaigns={allCampaigns} />
            </TabsContent>

            <TabsContent value="applications">
              {renderApplications()}
            </TabsContent>
          </Tabs>
        </div>

      {/* Modals */}
      {renderEditProfileModal()}
      {renderViewProfileModal()}
    </SignedIn>
  );
};

export default InfluencerDashboard;






// const renderApplications = () => {
//   // Helper function to check if campaign has expired
//   const isCampaignExpired = (endDate: string | number | Date) => {
//     if (!endDate) return false;
//     return new Date(endDate) < new Date();
//   };

//   // Helper function to withdraw an application
//   const handleWithdrawApplication = async (applicationId) => {
//     try {
//       await withdrawApplication({ applicationId });
//       // Optionally show success message
//       console.log("Application withdrawn successfully");
//     } catch (error) {
//       console.error("Failed to withdraw application:", error);
//       // Handle error appropriately
//     }
//   };

//   return (
//     <Card className="hover:shadow-lg transition-all duration-300">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <MessageSquare className="w-5 h-5 text-purple-600" />
//           My Applications
//         </CardTitle>
//         <p className="text-sm text-gray-500 mt-1">
//           Track the status of your campaign applications
//         </p>
//         <div className="flex flex-wrap gap-4 mt-4 text-sm">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
//             <span className="font-medium">Total: </span>
//             <span className="text-gray-600">{applications?.length || 0}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
//             <span className="font-medium">Pending: </span>
//             <span className="text-yellow-600">
//               {applications?.filter(app => app.status === 'pending').length || 0}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <span className="font-medium">Approved: </span>
//             <span className="text-green-600">
//               {applications?.filter(app => app.status === 'approved').length || 0}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//             <span className="font-medium">Rejected: </span>
//             <span className="text-red-600">
//               {applications?.filter(app => app.status === 'rejected').length || 0}
//             </span>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-6">
//           {applications?.length > 0 ? (
//             applications
//               .sort((a, b) => {
//                 const statusPriority = { pending: 0, approved: 1, rejected: 2 };
//                 if (statusPriority[a.status] !== statusPriority[b.status]) {
//                   return statusPriority[a.status] - statusPriority[b.status];
//                 }
//                 return b._creationTime - a._creationTime;
//               })
//               .map((application, index) => {
//                 const isExpired = isCampaignExpired(allCampaigns.endDate);
//                 const canWithdraw = application.status === 'pending' && !isExpired;
                
//                 return (
//                   <motion.div 
//                     key={application._id}
//                     className="p-4 sm:p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                   >
//                     <div className="flex flex-col lg:flex-row gap-6">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-4 mb-4">
//                           <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
//                             {application.campaignTitle?.charAt(0) || "C"}
//                           </div>
//                           <div className="min-w-0 flex-1">
//                             <h3 className="font-semibold text-lg text-gray-900 truncate">
//                               {application.campaignTitle}
//                               {isExpired && (
//                                 <span className="ml-2 text-xs bg-gray-500 text-white px-2 py-1 rounded-full">
//                                   EXPIRED
//                                 </span>
//                               )}
//                             </h3>
//                             <p className="text-sm text-gray-600">
//                               Applied by: {application.influencerName}
//                             </p>
//                           </div>
//                         </div>
                        
//                         {application.message && (
//                           <div className="mb-3">
//                             <p className="text-sm font-medium text-gray-700 mb-1">Application Message:</p>
//                             <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//                               {application.message}
//                             </p>
//                           </div>
//                         )}
                        
//                         {application.proposedContent && (
//                           <div className="mb-4">
//                             <p className="text-sm font-medium text-gray-700 mb-1">Proposed Content:</p>
//                             <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//                               {application.proposedContent}
//                             </p>
//                           </div>
//                         )}
                        
//                         <div className="flex flex-wrap items-center gap-4">
//                           <Badge 
//                             variant={
//                               application.status === 'pending' ? 'secondary' :
//                               application.status === 'approved' ? 'default' :
//                               'destructive'
//                             }
//                             className={
//                               application.status === 'approved' 
//                                 ? 'bg-green-100 text-green-800 border-green-200' 
//                                 : application.status === 'rejected'
//                                 ? 'bg-red-100 text-red-800 border-red-200'
//                                 : 'bg-yellow-100 text-yellow-800 border-yellow-200'
//                             }
//                           >
//                             <div className="flex items-center gap-1">
//                               {application.status === 'approved' && <CheckCircle className="w-3 h-3" />}
//                               {application.status === 'rejected' && <XCircle className="w-3 h-3" />}
//                               {application.status === 'pending' && <Clock className="w-3 h-3" />}
//                               {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//                             </div>
//                           </Badge>
                          
//                           <span className="text-sm text-gray-500 flex items-center gap-1">
//                             <Calendar className="w-4 h-4" />
//                             Applied: {new Date(application._creationTime).toLocaleDateString()}
//                           </span>

//                           {/* Campaign End Date Display */}
//                           {application.campaignEndDate && (
//                             <span className={`text-sm flex items-center gap-1 ${
//                               isExpired ? 'text-red-600' : 'text-gray-500'
//                             }`}>
//                               <Clock className="w-4 h-4" />
//                               Campaign ends: {new Date(application.campaignEndDate).toLocaleDateString()}
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Status Messages */}
//                         {application.status === 'approved' && !isExpired && (
//                           <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//                             <p className="text-sm text-green-800 flex items-center gap-2">
//                               <CheckCircle className="w-4 h-4" />
//                               Congratulations! Your application has been approved. You can now start working on this campaign.
//                             </p>
//                           </div>
//                         )}

//                         {application.status === 'approved' && isExpired && (
//                           <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
//                             <p className="text-sm text-gray-800 flex items-center gap-2">
//                               <Clock className="w-4 h-4" />
//                               This campaign has expired. No further action can be taken.
//                             </p>
//                           </div>
//                         )}
                        
//                         {application.status === 'rejected' && (
//                           <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                             <p className="text-sm text-red-800 flex items-center gap-2">
//                               <XCircle className="w-4 h-4" />
//                               Your application was not selected for this campaign. Keep applying to other opportunities!
//                             </p>
//                           </div>
//                         )}
                        
//                         {application.status === 'pending' && !isExpired && (
//                           <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                             <p className="text-sm text-yellow-800 flex items-center gap-2">
//                               <Clock className="w-4 h-4" />
//                               Your application is under review. We'll notify you once there's an update.
//                             </p>
//                           </div>
//                         )}

//                         {application.status === 'pending' && isExpired && (
//                           <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
//                             <p className="text-sm text-gray-800 flex items-center gap-2">
//                               <Clock className="w-4 h-4" />
//                               This campaign has expired while your application was pending.
//                             </p>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Action Buttons */}
//                       <div className="flex flex-row lg:flex-col gap-2 lg:w-48">
//                         {/* Approved campaign actions */}
//                         {application.status === 'approved' && !isExpired && (
//                           <>
//                             <Button 
//                               size="sm" 
//                               className="flex-1 bg-green-600 hover:bg-green-700"
//                               disabled={application.campaignStarted} // You'll need to track this state
//                             >
//                               <Play className="w-4 h-4 mr-1" />
//                               {application.campaignStarted ? 'Campaign Started' : 'Start Campaign'}
//                             </Button>
//                             <Button size="sm" variant="outline" className="flex-1">
//                               <MessageSquare className="w-4 h-4 mr-1" />
//                               Contact Brand
//                             </Button>
//                           </>
//                         )}

//                         {/* Approved but expired campaign */}
//                         {application.status === 'approved' && isExpired && (
//                           <Button 
//                             size="sm" 
//                             variant="outline" 
//                             className="flex-1" 
//                             disabled
//                           >
//                             <XCircle className="w-4 h-4 mr-1" />
//                             Campaign Expired
//                           </Button>
//                         )}

//                         {/* Withdraw application button */}
//                         {canWithdraw && (
//                           <Button 
//                             size="sm" 
//                             variant="destructive" 
//                             className="flex-1"
//                             onClick={() => handleWithdrawApplication(application._id)}
//                           >
//                             <XCircle className="w-4 h-4 mr-1" />
//                             Withdraw Application
//                           </Button>
//                         )}

//                         {/* Show ongoing campaign controls if started */}
//                         {application.status === 'approved' && application.campaignStarted && !isExpired && (
//                           <Button 
//                             size="sm" 
//                             variant="outline" 
//                             className="flex-1"
//                           >
//                             <Eye className="w-4 h-4 mr-1" />
//                             View Progress
//                           </Button>
//                         )}

//                         {/* Disable ongoing campaign if expired */}
//                         {application.status === 'approved' && application.campaignStarted && isExpired && (
//                           <Button 
//                             size="sm" 
//                             variant="secondary" 
//                             className="flex-1"
//                             disabled
//                           >
//                             <StopCircle className="w-4 h-4 mr-1" />
//                             Campaign Ended
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })
//           ) : (
//             <div className="text-center py-12">
//               <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-6" />
//               <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Yet</h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 Your campaign applications will appear here. Start browsing and applying to campaigns to get started.
//               </p>
//               <Button 
//                 onClick={() => handleTabChange('discover')} 
//                 className="bg-purple-600 hover:bg-purple-700"
//               >
//                 <Search className="w-4 h-4 mr-2" />
//                 Discover Campaigns
//               </Button>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };


     