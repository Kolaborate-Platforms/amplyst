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
  Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CampaignWithCreator, Profile } from "../../../lib/types/index";

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

  // Format creation time consistently
  const getCreationTime = (creationTime: number | undefined) => {
    return creationTime || 0;
  };

  const filteredCampaigns = campaigns
    .filter(campaign => campaign.status === "active") // Only show active campaigns
    .filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesNiche = selectedNiche === "all" ||
                           (campaign.targetAudience && campaign.targetAudience.toLowerCase().includes(selectedNiche.toLowerCase())) ||
                           (campaign.niche && campaign.niche.toLowerCase().includes(selectedNiche.toLowerCase())) ||
                           (campaign.contentTypes && campaign.contentTypes.some(type => type.toLowerCase().includes(selectedNiche.toLowerCase())));

      const matchesPlatform = !selectedPlatform || (campaign.platform && campaign.platform.toLowerCase() === selectedPlatform.toLowerCase());
      
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
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-300"
            />
            
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
              {/* <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="payment-high">Highest Payment</SelectItem>
                <SelectItem value="payment-low">Lowest Payment</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent> */}
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign._id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-[#3A7CA5]">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{campaign.title}</CardTitle>
                  {campaign.creatorName && (
                    <p className="text-sm text-gray-600 mt-1">by {campaign.creatorName}</p>
                  )}
                </div>
                <Badge 
                  variant={campaign.status === 'active' ? 'default' : 'secondary'}
                  className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">{campaign.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#88B04B]" />
                  <span className="font-medium text-[#88B04B]">
                    {campaign.budget ? `$${campaign.budget.toLocaleString()}` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#E19629]" />
                  <span>{formatDate(campaign.endDate)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {campaign.targetAudience && (
                    <Badge variant="secondary" className="text-xs bg-[#3A7CA5]/10 text-[#3A7CA5]">
                      {campaign.targetAudience}
                    </Badge>
                  )}
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
                  {campaign.contentTypes && campaign.contentTypes.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
                
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Requirements:</span> {campaign.requirements || "N/A"}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1 bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white"
                  size="sm"
                  onClick={() => handleApplyClick(campaign._id)}
                  disabled={profile.role !== "influencer"} // Only influencers can apply
                >
                  Apply Now
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#3A7CA5] text-[#3A7CA5] hover:bg-[#3A7CA5]/5"
                >
                  Save
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {campaign.duration && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {campaign.duration}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more campaigns.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignDiscovery;