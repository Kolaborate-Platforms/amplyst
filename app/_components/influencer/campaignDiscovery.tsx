'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { 
   
  Calendar,
  Users, 
  TrendingUp,
  Eye,
  Heart,
  Star,
  Play,
  Search,
  Target
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CampaignWithCreator, Profile } from "../../../lib/types/index";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import ApplicationModal from "../applicationModal";

interface CampaignDiscoveryProps {
  // campaigns: CampaignWithCreator[];
  profile: Profile;
   campaigns: Doc<"campaigns">[];
}

const CampaignDiscovery = ({ campaigns = [] , profile }: CampaignDiscoveryProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Doc<"campaigns"> | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [formattedDates, setFormattedDates] = useState<Record<string, string>>({});
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [brandCampaigns, setBrandCampaigns] = useState<Doc<"campaigns">[]>([]);

  const allCampaigns = useQuery(api.campaign.allCampaigns);
  const activeCampaigns = useQuery(api.campaign.allCampaignsWithCreators);

  console.log("Active campaigns", activeCampaigns)
  const applications = useQuery(api.applications.listInfluencerApplications);
  const allBrands = useQuery(api.brands.listBrands);

  // Mutations for application actions
  const createApplication = useMutation(api.applications.createApplication);

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format dates on client-side only to avoid hydration mismatch
  useEffect(() => {
    if (activeCampaigns && isClient) {
      const dates: Record<string, string> = {};
      activeCampaigns.forEach(campaign => {
        if (campaign.endDate) {
          dates[campaign._id] = new Date(campaign.endDate).toLocaleDateString();
        }
      });
      setFormattedDates(dates);
    }
  }, [activeCampaigns, isClient]);

  if (!profile || !allCampaigns || !activeCampaigns || !applications || !allBrands) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper functions from BrandDiscovery
  const hasApplied = (campaignId: Id<"campaigns">) => {
    return applications?.some(app => app.campaignId === campaignId) || false;
  };

  const getExistingApplication = (campaignId: Id<"campaigns">) => {
    return applications?.find(app => app.campaignId === campaignId) || null;
  };

  const handleApplyNow = (campaign: Doc<"campaigns">) => {
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  const handleViewCampaignDetails = (campaignId: Id<"campaigns">) => {
    router.push(`/campaigns/${campaignId}`);
  };

  const handleSubmitApplication = async (pitch: string) => {
    if (!selectedCampaign) return;
    try {
      await createApplication({
        campaignId: selectedCampaign._id,
        message: pitch,
        proposedContent: pitch
      });
      toast.success("Application submitted successfully!");
      setShowModal(false);
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error("Failed to submit application. Please try again.");
      throw error;
    }
  };

  const handleWithdrawApplication = async () => {
    if (!selectedCampaign) return;
    try {
      console.log('Withdrawing application for campaign:', selectedCampaign._id);
      toast.success("Application withdrawn successfully!");
      setShowModal(false);
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error("Failed to withdraw application. Please try again.");
      throw error;
    }
  };

  // Format creation time consistently
  const getCreationTime = (creationTime: number | undefined) => {
    return creationTime || 0;
  };

  const filteredCampaigns = activeCampaigns
    .filter(campaign => campaign.status === "active") 
    .filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesNiche = selectedNiche === "all" ||
                           (campaign.targetAudience && campaign.targetAudience.toLowerCase().includes(selectedNiche.toLowerCase())) ||
                           (campaign.niche && campaign.niche.toLowerCase().includes(selectedNiche.toLowerCase())) ||
                           (campaign.contentTypes && campaign.contentTypes.some(type => type.toLowerCase().includes(selectedNiche.toLowerCase())));

      const matchesPlatform = selectedPlatform === "all" || (campaign.platform && campaign.platform.toLowerCase() === selectedPlatform.toLowerCase());
      
      return matchesSearch && matchesNiche && matchesPlatform;
    }).sort((a, b) => {
      if (sortBy === "newest") {
        return getCreationTime(b._creationTime) - getCreationTime(a._creationTime);
      } else if (sortBy === "payment-high") {
        return (b.budget || 0) - (a.budget || 0);
      } else if (sortBy === "payment-low") {
        return (a.budget || 0) - (b.budget || 0);
      } else if (sortBy === "deadline") {
        if (a.endDate && b.endDate) {
          const dateA = new Date(a.endDate);
          const dateB = new Date(b.endDate);
          // Check if dates are valid
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0;
          }
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      }
      return 0;
    });

    console.log("filtered campaigns", filteredCampaigns )

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="h-5 w-5 text-[#3A7CA5]" />
                Discover Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-600">Loading campaigns...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-4 sm:space-y-6">
        {/* Search and Filters Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="h-5 w-5 text-[#3A7CA5] shrink-0" />
              <span className="truncate">Discover Campaigns</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search campaigns by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            
            {/* Filter Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 hidden sm:block">Niche</label>
                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Niches</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                    <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Beauty & Skincare">Beauty & Skincare</SelectItem>
                    <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Parenting">Parenting</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                    <SelectItem value="Arts & Crafts">Arts & Crafts</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 hidden sm:block">Platform</label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 hidden sm:block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="payment-high">Highest Payment</SelectItem>
                    <SelectItem value="payment-low">Lowest Payment</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedNiche("all");
                    setSelectedPlatform("all");
                    setSortBy("newest");
                  }}
                  className="w-full sm:w-auto whitespace-nowrap"
                  size="sm"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Campaigns Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="h-5 w-5 text-green-600 shrink-0" />
                <span className="truncate">Active Campaigns</span>
              </CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit">
                {filteredCampaigns.length} Available
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredCampaigns.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {filteredCampaigns.map((campaign, index) => {
                  const hasUserApplied = hasApplied(campaign._id);
                  const existingApp = getExistingApplication(campaign._id);

                  return (
                    <motion.div
                      key={campaign._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-all duration-200 border border-gray-200">
                        <CardHeader className="pb-3 sm:pb-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base sm:text-lg text-gray-900 line-clamp-2 mb-1 sm:mb-2">
                                {campaign.title}
                              </CardTitle>
                              <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
                                {campaign.description}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-wrap sm:flex-col sm:items-end">
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-800 border-green-200 text-xs whitespace-nowrap"
                              >
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
                                </div>
                              </Badge>
                              {hasUserApplied && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs whitespace-nowrap">
                                  Applied
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {/* Campaign Stats Grid - Responsive */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                              <span className="font-medium truncate">
                                {campaign.budget ? `$${campaign.budget.toLocaleString()}` : "Budget TBD"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md" suppressHydrationWarning>
                              <Calendar className="h-4 w-4 text-[#E19629] shrink-0" />
                              <span className="truncate">
                                {isClient
                                  ? formattedDates[campaign._id] || "No deadline"
                                  : "Loading..."}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                              <Users className="h-4 w-4 text-[#3A7CA5] shrink-0" />
                              <span className="truncate">{campaign.targetAudience || "All audiences"}</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                              <Star className="h-4 w-4 text-gray-500 shrink-0" />
                              <span className="truncate">{campaign.contentTypes?.join(", ") || "Various"}</span>
                            </div>
                          </div>

                          {/* Campaign Tags */}
                          <div className="flex flex-wrap gap-2">
                            {campaign.platform && (
                              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                                {campaign.platform}
                              </Badge>
                            )}
                            {campaign.niche && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                {campaign.niche}
                              </Badge>
                            )}
                            {campaign.duration && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {campaign.duration}
                              </Badge>
                            )}
                          </div>

                          {/* Requirements Section */}
                          {campaign.requirements && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
                              <div className="bg-gray-50 p-3 rounded-md border-l-4 border-gray-300">
                                <p className="text-sm text-gray-700 line-clamp-3">
                                  {campaign.requirements}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons - Responsive */}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCampaignDetails(campaign._id)}
                              className="w-full sm:flex-1 justify-center"
                            >
                              <Eye className="w-4 h-4 mr-2 shrink-0" />
                              <span className="truncate">View Details</span>
                            </Button>
                            <Button
                              size="sm"
                              className={`w-full sm:flex-1 justify-center ${
                                hasUserApplied
                                  ? 'bg-gray-500 hover:bg-gray-600'
                                  : 'bg-[#3A7CA5] hover:bg-[#3A7CA5]/90'
                              } text-white`}
                              onClick={() => handleApplyNow(campaign)}
                              disabled={campaign.status !== 'active' || profile.role !== "influencer"}
                            >
                              <Play className="w-4 h-4 mr-2 shrink-0" />
                              <span className="truncate">
                                {campaign.status === 'active'
                                  ? hasUserApplied
                                    ? 'View Application'
                                    : 'Apply Now'
                                  : 'Not Available'}
                              </span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Campaigns Found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
                  Try adjusting your filters to discover more campaign opportunities that match your interests.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedNiche("all");
                    setSelectedPlatform("all");
                    setSortBy("newest");
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Modal */}
        {showModal && selectedCampaign && (
          <ApplicationModal
            campaign={selectedCampaign}
            onClose={() => {
              setShowModal(false);
              setSelectedCampaign(null);
            }}
            onSubmit={handleSubmitApplication}
            onWithdraw={handleWithdrawApplication}
            existingApplication={getExistingApplication(selectedCampaign._id)}
          />
        )}
      </div>
    </div>
  );
};

export default CampaignDiscovery;