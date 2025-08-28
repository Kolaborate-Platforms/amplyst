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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
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
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Active Campaigns
            </CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {filteredCampaigns.length} Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length > 0 ? (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign, index) => {
                const hasUserApplied = hasApplied(campaign._id);
                const existingApp = getExistingApplication(campaign._id);

                return (
                  <Card key={campaign._id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900">{campaign.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 border-green-200"
                          >
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
                            </div>
                          </Badge>
                          {hasUserApplied && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Applied
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="font-medium">
                            {campaign.budget ? `$${campaign.budget.toLocaleString()}` : "Budget TBD"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2" suppressHydrationWarning>
                          <Calendar className="h-4 w-4 text-[#E19629]" />
                          <span>
                            {isClient
                              ? formattedDates[campaign._id] || "No deadline"
                              : "Loading..."}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#3A7CA5]" />
                          <span>{campaign.targetAudience || "All audiences"}</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <Star className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span>{campaign.contentTypes?.join(", ") || "Various"}</span>
                        </div>
                      </div>

           
                      <div className="flex flex-wrap gap-2">
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

                      {campaign.requirements && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                            {campaign.requirements}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCampaignDetails(campaign._id)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className={`flex-1 ${
                            hasUserApplied
                              ? 'bg-gray-500 hover:bg-gray-600'
                              : 'bg-[#3A7CA5] hover:bg-[#3A7CA5]/90'
                          } text-white`}
                          onClick={() => handleApplyNow(campaign)}
                          disabled={campaign.status !== 'active' || profile.role !== "influencer"}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {campaign.status === 'active'
                            ? hasUserApplied
                              ? 'View Application'
                              : 'Apply Now'
                            : 'Not Available'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
  );
};

export default CampaignDiscovery;










// 'use client';

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
// import { Button } from "../../../components/ui/button";
// import { Badge } from "../../../components/ui/badge";
// import { Input } from "../../../components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
// import { 
//   DollarSign, 
//   Calendar,
//   Users, 
//   TrendingUp,
//   Eye,
//   Heart,
//   Star,
//   Play,
//   Search,
//   Target,
//   Building
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Doc, Id } from "../../../convex/_generated/dataModel";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "../../../convex/_generated/api";
// import { CampaignWithCreator, Profile } from "../../../lib/types/index";
// import { motion } from "framer-motion";
// import { toast } from "@/components/ui/sonner";
// import ApplicationModal from "../applicationModal";

// interface CampaignDiscoveryProps {
//   // campaigns: CampaignWithCreator[];
//   profile: Profile;
//    campaigns: Doc<"campaigns">[];
// }

// const CampaignDiscovery = ({ campaigns = [] , profile }: CampaignDiscoveryProps) => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedNiche, setSelectedNiche] = useState("all");
//   const [selectedPlatform, setSelectedPlatform] = useState("all");
//   const [sortBy, setSortBy] = useState("newest");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCampaign, setSelectedCampaign] = useState<Doc<"campaigns"> | null>(null);
//   const [isClient, setIsClient] = useState(false);
//   const [formattedDates, setFormattedDates] = useState<Record<string, string>>({});
//   const [showCampaigns, setShowCampaigns] = useState(false);
//     const [brandCampaigns, setBrandCampaigns] = useState<Doc<"campaigns">[]>([]);

//   const allCampaigns = useQuery(api.campaign.allCampaigns);
//   const activeCampaigns = useQuery(api.campaign.activeForInfluencer);
//   const applications = useQuery(api.applications.listInfluencerApplications);
//   const allBrands = useQuery(api.brands.listBrands);

//   // Mutations for application actions
//   const createApplication = useMutation(api.applications.createApplication);

//   // Fix hydration by ensuring client-side rendering
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Format dates on client-side only to avoid hydration mismatch
//   useEffect(() => {
//     if (activeCampaigns && isClient) {
//       const dates: Record<string, string> = {};
//       activeCampaigns.forEach(campaign => {
//         if (campaign.endDate) {
//           dates[campaign._id] = new Date(campaign.endDate).toLocaleDateString();
//         }
//       });
//       setFormattedDates(dates);
//     }
//   }, [activeCampaigns, isClient]);


//   if (!profile || !allCampaigns || !activeCampaigns || !applications || !allBrands) {
//     return (
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="text-center space-y-4">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="text-gray-600">Loading your dashboard...</p>
//           </div>
//         </div>
//     );
//   }

//   // Helper functions from BrandDiscovery
//   const hasApplied = (campaignId: Id<"campaigns">) => {
//     return applications?.some(app => app.campaignId === campaignId) || false;
//   };

//   const getExistingApplication = (campaignId: Id<"campaigns">) => {
//     return applications?.find(app => app.campaignId === campaignId) || null;
//   };

//   const handleApplyNow = (campaign: Doc<"campaigns">) => {
//     setSelectedCampaign(campaign);
//     setShowModal(true);
//   };

//   const handleViewCampaignDetails = (campaignId: Id<"campaigns">) => {
//     router.push(`/campaigns/${campaignId}`);
//   };

//   const handleSubmitApplication = async (pitch: string) => {
//     if (!selectedCampaign) return;
//     try {
//       await createApplication({
//         campaignId: selectedCampaign._id,
//         message: pitch,
//         proposedContent: pitch
//       });
//       toast.success("Application submitted successfully!");
//       setShowModal(false);
//       setSelectedCampaign(null);
//     } catch (error) {
//       console.error('Error submitting application:', error);
//       toast.error("Failed to submit application. Please try again.");
//       throw error;
//     }
//   };

//   const handleWithdrawApplication = async () => {
//     if (!selectedCampaign) return;
//     try {
//       console.log('Withdrawing application for campaign:', selectedCampaign._id);
//       toast.success("Application withdrawn successfully!");
//       setShowModal(false);
//       setSelectedCampaign(null);
//     } catch (error) {
//       console.error('Error withdrawing application:', error);
//       toast.error("Failed to withdraw application. Please try again.");
//       throw error;
//     }
//   };

//   // Format creation time consistently
//   const getCreationTime = (creationTime: number | undefined) => {
//     return creationTime || 0;
//   };

//   const filteredCampaigns = activeCampaigns
//     .filter(campaign => campaign.status === "active") 
//     .filter(campaign => {
//       const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            campaign.description.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesNiche = selectedNiche === "all" ||
//                            (campaign.targetAudience && campaign.targetAudience.toLowerCase().includes(selectedNiche.toLowerCase())) ||
//                            (campaign.niche && campaign.niche.toLowerCase().includes(selectedNiche.toLowerCase())) ||
//                            (campaign.contentTypes && campaign.contentTypes.some(type => type.toLowerCase().includes(selectedNiche.toLowerCase())));

//       const matchesPlatform = selectedPlatform === "all" || (campaign.platform && campaign.platform.toLowerCase() === selectedPlatform.toLowerCase());
      
//       return matchesSearch && matchesNiche && matchesPlatform;
//     }).sort((a, b) => {
//       if (sortBy === "newest") {
//         return getCreationTime(b._creationTime) - getCreationTime(a._creationTime);
//       } else if (sortBy === "payment-high") {
//         return (b.budget || 0) - (a.budget || 0);
//       } else if (sortBy === "payment-low") {
//         return (a.budget || 0) - (b.budget || 0);
//       } else if (sortBy === "deadline") {
//         if (a.endDate && b.endDate) {
//           const dateA = new Date(a.endDate);
//           const dateB = new Date(b.endDate);
//           // Check if dates are valid
//           if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
//             return 0;
//           }
//           return dateA.getTime() - dateB.getTime();
//         }
//         return 0;
//       }
//       return 0;
//     });

//     console.log("filtered campaigns", filteredCampaigns )

//   // Don't render until client-side hydration is complete
//   if (!isClient) {
//     return (
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-[#3A7CA5]" />
//               Discover Campaigns
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-center py-12">
//               <p className="text-gray-600">Loading campaigns...</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }
  
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <TrendingUp className="h-5 w-5 text-[#3A7CA5]" />
//             Discover Campaigns
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {brandCampaigns.length === 0 ? (
//               <Card>
//                 <CardContent className="text-center py-12">
//                   <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
//                   <p className="text-gray-600">This brand hasn&apos;t created any campaigns yet.</p>
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-gray-600">
//                     Showing {brandCampaigns.length} campaign{brandCampaigns.length !== 1 ? 's' : ''}
//                   </p>
//                   <div className="flex gap-2">
//                     <Badge variant="outline" className="text-green-700 bg-green-50">
//                       {brandCampaigns.filter(c => c.status === 'active').length} Active
//                     </Badge>
//                     <Badge variant="outline" className="text-gray-700 bg-gray-50">
//                       {brandCampaigns.filter(c => c.status === 'draft').length} Draft
//                     </Badge>
//                   </div>
//                 </div>

//                 {brandCampaigns.map((campaign) => {
//                   const hasUserApplied = hasApplied(campaign._id);
//                   const existingApp = getExistingApplication(campaign._id);

//                   return (
//                     <Card key={campaign._id} className="hover:shadow-md transition-shadow">
//                       <CardHeader className="pb-4">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <CardTitle className="text-lg text-gray-900">{campaign.title}</CardTitle>
//                             <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.description}</p>
//                           </div>
//                           <div className="flex gap-2">
//                             <Badge
//                               variant={campaign.status === 'active' ? 'default' : 'secondary'}
//                               className={
//                                 campaign.status === 'active'
//                                   ? 'bg-green-100 text-green-800 border-green-200'
//                                   : campaign.status === 'completed'
//                                   ? 'bg-gray-100 text-gray-800 border-gray-200'
//                                   : 'bg-yellow-100 text-yellow-800 border-yellow-200'
//                               }
//                             >
//                               {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
//                             </Badge>
//                             {hasUserApplied && (
//                               <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                                 Applied
//                               </Badge>
//                             )}
//                           </div>
//                         </div>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                           <div className="flex items-center gap-2">
//                             <DollarSign className="h-4 w-4 text-[#88B04B]" />
//                             <span className="font-medium">
//                               {campaign.budget ? `$${campaign.budget.toLocaleString()}` : "Budget TBD"}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2" suppressHydrationWarning>
//                             <Calendar className="h-4 w-4 text-[#E19629]" />
//                             <span>
//                               {isClient
//                                 ? formattedDates[campaign._id] || "No deadline"
//                                 : "Loading..."}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Users className="h-4 w-4 text-[#3A7CA5]" />
//                             <span>{campaign.targetAudience || "All audiences"}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Building className="h-4 w-4 text-gray-500" />
//                             <span>{campaign.contentTypes?.join(", ") || "Various"}</span>
//                           </div>
//                         </div>

//                         {campaign.requirements && (
//                           <div className="space-y-2">
//                             <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
//                             <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
//                               {campaign.requirements}
//                             </p>
//                           </div>
//                         )}

//                         <div className="flex gap-2 pt-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleViewCampaignDetails(campaign._id)}
//                             className="flex-1"
//                           >
//                             View Details
//                           </Button>
//                           <Button
//                             size="sm"
//                             className={`flex-1 ${
//                               hasUserApplied
//                                 ? 'bg-gray-500 hover:bg-gray-600'
//                                 : 'bg-[#3A7CA5] hover:bg-[#3A7CA5]/90'
//                             } text-white`}
//                             onClick={() => handleApplyNow(campaign)}
//                             disabled={campaign.status !== 'active'}
//                           >
//                             {campaign.status === 'active'
//                               ? hasUserApplied
//                                 ? 'View Application'
//                                 : 'Apply Now'
//                               : 'Not Available'}
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle className="flex items-center gap-2">
//               <Target className="h-5 w-5 text-green-600" />
//               Active Campaigns
//             </CardTitle>
//             <Badge variant="outline" className="bg-blue-50 text-blue-700">
//               {filteredCampaigns.length} Available
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {filteredCampaigns.length > 0 ? (
//             <div className="space-y-4">
//               {filteredCampaigns.map((campaign, index) => {
//                 const hasUserApplied = hasApplied(campaign._id);
//                 const existingApp = getExistingApplication(campaign._id);

//                 return (
//                   <Card key={campaign._id} className="hover:shadow-md transition-shadow">
//                     <CardHeader className="pb-4">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <CardTitle className="text-lg text-gray-900">{campaign.title}</CardTitle>
//                           <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.description}</p>
//                         </div>
//                         <div className="flex gap-2">
//                           <Badge
//                             variant="default"
//                             className="bg-green-100 text-green-800 border-green-200"
//                           >
//                             <div className="flex items-center gap-1">
//                               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                               {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
//                             </div>
//                           </Badge>
//                           {hasUserApplied && (
//                             <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                               Applied
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                         <div className="flex items-center gap-2">
//                           <DollarSign className="h-4 w-4 text-[#88B04B]" />
//                           <span className="font-medium">
//                             {campaign.budget ? `$${campaign.budget.toLocaleString()}` : "Budget TBD"}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2" suppressHydrationWarning>
//                           <Calendar className="h-4 w-4 text-[#E19629]" />
//                           <span>
//                             {isClient
//                               ? formattedDates[campaign._id] || "No deadline"
//                               : "Loading..."}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Users className="h-4 w-4 text-[#3A7CA5]" />
//                           <span>{campaign.targetAudience || "All audiences"}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Star className="h-4 w-4 text-gray-500" />
//                           <span>{campaign.contentTypes?.join(", ") || "Various"}</span>
//                         </div>
//                       </div>

//                       {/* Additional badges */}
//                       <div className="flex flex-wrap gap-2">
//                         {campaign.platform && (
//                           <Badge variant="outline" className="text-xs">
//                             {campaign.platform}
//                           </Badge>
//                         )}
//                         {campaign.niche && (
//                           <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
//                             {campaign.niche}
//                           </Badge>
//                         )}
//                         {campaign.duration && (
//                           <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
//                             {campaign.duration}
//                           </Badge>
//                         )}
//                       </div>

//                       {campaign.requirements && (
//                         <div className="space-y-2">
//                           <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
//                           <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
//                             {campaign.requirements}
//                           </p>
//                         </div>
//                       )}

//                       <div className="flex gap-2 pt-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleViewCampaignDetails(campaign._id)}
//                           className="flex-1"
//                         >
//                           <Eye className="w-4 h-4 mr-2" />
//                           View Details
//                         </Button>
//                         <Button
//                           size="sm"
//                           className={`flex-1 ${
//                             hasUserApplied
//                               ? 'bg-gray-500 hover:bg-gray-600'
//                               : 'bg-[#3A7CA5] hover:bg-[#3A7CA5]/90'
//                           } text-white`}
//                           onClick={() => handleApplyNow(campaign)}
//                           disabled={campaign.status !== 'active' || profile.role !== "influencer"}
//                         >
//                           <Play className="w-4 h-4 mr-2" />
//                           {campaign.status === 'active'
//                             ? hasUserApplied
//                               ? 'View Application'
//                               : 'Apply Now'
//                             : 'Not Available'}
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Target className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No Active Campaigns Found
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 Try adjusting your filters to discover more campaign opportunities.
//               </p>
//               <Button 
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSelectedNiche("all");
//                   setSelectedPlatform("all");
//                   setSortBy("newest");
//                 }}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 <Search className="w-4 h-4 mr-2" />
//                 Clear Filters
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Application Modal */}
//       {showModal && selectedCampaign && (
//         <ApplicationModal
//           campaign={selectedCampaign}
//           onClose={() => {
//             setShowModal(false);
//             setSelectedCampaign(null);
//           }}
//           onSubmit={handleSubmitApplication}
//           onWithdraw={handleWithdrawApplication}
//           existingApplication={getExistingApplication(selectedCampaign._id)}
//         />
//       )}
//     </div>
//   );
// };

// export default CampaignDiscovery;