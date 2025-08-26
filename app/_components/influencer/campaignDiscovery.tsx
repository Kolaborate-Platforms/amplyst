'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { 
  DollarSign, 
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
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CampaignWithCreator, Profile } from "../../../lib/types/index";
import { motion } from "framer-motion";

interface CampaignDiscoveryProps {
  campaigns: CampaignWithCreator[];
  profile: Profile;
}

const CampaignDiscovery = ({ campaigns, profile }: CampaignDiscoveryProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const allCampaigns = useQuery(api.campaign.allCampaigns);
  const activeCampaigns = useQuery(api.campaign.activeForInfluencer);
  const applications = useQuery(api.applications.listInfluencerApplications);
  const allBrands = useQuery(api.brands.listBrands);

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format date consistently
  const formatDate = (dateString: string | undefined) => {
    if (!dateString || !isClient) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "N/A";
    }
  };

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

  // Format creation time consistently
  const getCreationTime = (creationTime: number | undefined) => {
    return creationTime || 0;
  };

  const filteredCampaigns = activeCampaigns
    .filter(campaign => campaign.status === "active") // Only show active campaigns
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

  const handleApplyClick = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}/apply`);
  };

  const handleViewDetails = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#3A7CA5]" />
            Discover Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-300"
            />
             */}
            <Select value={selectedNiche} onValueChange={setSelectedNiche}>
              <SelectTrigger>
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

            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger>
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Active Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length > 0 ? (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign, index) => (
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
                        by {campaign.creatorUserId || 'Unknown Brand'}
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
                  
                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {campaign.description}
                  </p>
                  
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
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(campaign.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Additional badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {campaign.platform && (
                      <Badge variant="outline" className="text-xs">
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

                  {/* Requirements */}
                  {campaign.requirements && (
                    <div className="text-xs text-gray-600 mb-4">
                      <span className="font-medium">Requirements:</span> {campaign.requirements}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => handleViewDetails(campaign._id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleApplyClick(campaign._id)}
                      disabled={profile.role !== "influencer"}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Active Campaigns Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your filters to discover more campaign opportunities.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedNiche("all");
                  setSelectedPlatform("all");
                  setSortBy("newest");
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDiscovery;