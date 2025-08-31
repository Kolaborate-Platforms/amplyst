// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Building, MapPin, Users, DollarSign, Calendar } from "lucide-react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Doc, Id } from "@/convex/_generated/dataModel";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import ApplicationModal from "../../../../../_components/applicationModal";
// import { useRouter } from "next/navigation";
// import { toast } from "@/components/ui/sonner";

// interface BrandDiscoveryProps {
//   brands: Doc<"brands">[];
//   campaigns: Doc<"campaigns">[];
// }

// const Page = ({ brands = [], campaigns = [] }: BrandDiscoveryProps) => {
//   const router = useRouter();
//   const [isClient, setIsClient] = useState(false);
//   const [selectedBrand, setSelectedBrand] = useState<Doc<"brands"> | null>(null);
//   const [showCampaigns, setShowCampaigns] = useState(false);
//   const [brandCampaigns, setBrandCampaigns] = useState<Doc<"campaigns">[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCampaign, setSelectedCampaign] = useState<Doc<"campaigns"> | null>(null);
//   const [formattedDates, setFormattedDates] = useState<Record<string, string>>({});

//   // For client-only rendering to avoid hydration mismatch
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Get all campaigns
//   const allCampaigns = useQuery(api.campaign.allCampaigns, {});
//   // Get influencer applications to check existing applications
//   const influencerApplications = useQuery(api.applications.listInfluencerApplications, {});
//   // Mutations for application actions
//   const createApplication = useMutation(api.applications.createApplication);

//   useEffect(() => {
//     if (selectedBrand && allCampaigns) {
//       const filtered = allCampaigns.filter(
//         campaign => campaign.creatorUserId === selectedBrand.userId
//       );
//       setBrandCampaigns(filtered);
//       // Format dates on client-side only
//       const dates: Record<string, string> = {};
//       filtered.forEach(campaign => {
//         if (campaign.endDate) {
//           dates[campaign._id] = new Date(campaign.endDate).toLocaleDateString();
//         }
//       });
//       setFormattedDates(dates);
//     }
//   }, [selectedBrand, allCampaigns]);

//   const getCampaignStats = (brandId: Id<"brands">) => {
//     const brand = brands.find(b => b._id === brandId);
//     if (!brand || !allCampaigns) {
//       return {
//         total: 0,
//         active: 0,
//         completed: 0,
//         upcoming: 0
//       };
//     }
//     const brandCampaigns = allCampaigns.filter(c => c.creatorUserId === brand.userId);
//     return {
//       total: brandCampaigns.length,
//       active: brandCampaigns.filter(c => c.status === 'active').length,
//       completed: brandCampaigns.filter(c => c.status === 'completed').length,
//       upcoming: brandCampaigns.filter(c => c.status === 'draft').length
//     };
//   };

//   const hasApplied = (campaignId: Id<"campaigns">) => {
//     return influencerApplications?.some(app => app.campaignId === campaignId) || false;
//   };

//   const getExistingApplication = (campaignId: Id<"campaigns">) => {
//     return influencerApplications?.find(app => app.campaignId === campaignId) || null;
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

//   if (!brands || !campaigns) {
//     return (
//       <Card>
//         <CardContent className="text-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5] mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading brands...</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Brand Discovery</h2>
//           <p className="text-gray-600 mt-1">Discover brands and their active campaigns</p>
//         </div>
//         <Badge variant="outline" className="bg-blue-50 text-blue-700">
//           {brands.length} Brands Available
//         </Badge>
//       </div>

//       {brands.length === 0 ? (
//         <Card>
//           <CardContent className="text-center py-12">
//             <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
//             <p className="text-gray-600">There are no brands available at the moment.</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {brands.map((brand) => {
//             const stats = getCampaignStats(brand._id);
//             return (
//               <Card key={brand._id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
//                 <CardHeader className="pb-4">
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <CardTitle className="text-lg text-gray-900">{brand.companyName}</CardTitle>
//                       <p className="text-sm text-gray-600 mt-1">{brand.industry}</p>
//                       {brand.website && (
//                         <a
//                           href={brand.website}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-xs text-blue-600 hover:underline mt-1 inline-block"
//                         >
//                           Visit Website
//                         </a>
//                       )}
//                     </div>
//                     <Badge variant="outline" className="bg-[#3A7CA5]/10 text-[#3A7CA5] border-[#3A7CA5]/20 shrink-0">
//                       {brand.location}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-2 gap-3 text-sm">
//                     <div className="flex items-center gap-2">
//                       <Users className="h-4 w-4 text-[#3A7CA5]" />
//                       <span className="font-medium">{stats.total} Campaigns</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <DollarSign className="h-4 w-4 text-[#88B04B]" />
//                       <span className="text-green-600 font-medium">{stats.active} Active</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-[#E19629]" />
//                       <span className="text-orange-600">{stats.upcoming} Upcoming</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Building className="h-4 w-4 text-gray-500" />
//                       <span className="text-gray-600">{stats.completed} Completed</span>
//                     </div>
//                   </div>

//                   {brand.description && (
//                     <p className="text-sm text-gray-700 line-clamp-2">{brand.description}</p>
//                   )}

//                   <div className="flex gap-2">
//                     <Button
//                       className="flex-1 bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white"
//                       onClick={() => {
//                         setSelectedBrand(brand);
//                         setShowCampaigns(true);
//                       }}
//                       disabled={stats.total === 0}
//                     >
//                       {stats.total === 0 ? 'No Campaigns' : 'View Campaigns'}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}

//       {/* Brand Campaigns Modal */}
//       <Dialog open={showCampaigns} onOpenChange={setShowCampaigns}>
//         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl">
//               {selectedBrand?.companyName}&apos;s Campaigns
//             </DialogTitle>
//             <p className="text-sm text-gray-600">
//               Explore all campaigns from this brand and find your next opportunity
//             </p>
//           </DialogHeader>

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
//         </DialogContent>
//       </Dialog>

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

// export default Page;






'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Users, DollarSign, Calendar } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ApplicationModal from "../../../../../_components/applicationModal";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";

const Page = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Doc<"brands"> | null>(null);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [brandCampaigns, setBrandCampaigns] = useState<Doc<"campaigns">[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Doc<"campaigns"> | null>(null);
  const [formattedDates, setFormattedDates] = useState<Record<string, string>>({});

  // Fetch data using Convex queries
  const brands = useQuery(api.brands.listBrands, {}) || [];
  const campaigns = useQuery(api.campaign.allCampaigns, {}) || [];

  // For client-only rendering to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get all campaigns
  const allCampaigns = useQuery(api.campaign.allCampaigns, {});
  // Get influencer applications to check existing applications
  const influencerApplications = useQuery(api.applications.listInfluencerApplications, {});
  // Mutations for application actions
  const createApplication = useMutation(api.applications.createApplication);

  useEffect(() => {
    if (selectedBrand && allCampaigns) {
      const filtered = allCampaigns.filter(
        campaign => campaign.creatorUserId === selectedBrand.userId
      );
      setBrandCampaigns(filtered);
      // Format dates on client-side only
      const dates: Record<string, string> = {};
      filtered.forEach(campaign => {
        if (campaign.endDate) {
          dates[campaign._id] = new Date(campaign.endDate).toLocaleDateString();
        }
      });
      setFormattedDates(dates);
    }
  }, [selectedBrand, allCampaigns]);

  const getCampaignStats = (brandId: Id<"brands">) => {
    const brand = brands.find(b => b._id === brandId);
    if (!brand || !allCampaigns) {
      return {
        total: 0,
        active: 0,
        completed: 0,
        upcoming: 0
      };
    }
    const brandCampaigns = allCampaigns.filter(c => c.creatorUserId === brand.userId);
    return {
      total: brandCampaigns.length,
      active: brandCampaigns.filter(c => c.status === 'active').length,
      completed: brandCampaigns.filter(c => c.status === 'completed').length,
      upcoming: brandCampaigns.filter(c => c.status === 'draft').length
    };
  };

  const hasApplied = (campaignId: Id<"campaigns">) => {
    return influencerApplications?.some(app => app.campaignId === campaignId) || false;
  };

  const getExistingApplication = (campaignId: Id<"campaigns">) => {
    return influencerApplications?.find(app => app.campaignId === campaignId) || null;
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

  // Loading state
  if (!brands || !campaigns) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7CA5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading brands...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Brand Discovery</h2>
          <p className="text-gray-600 mt-1">Discover brands and their active campaigns</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {brands.length} Brands Available
        </Badge>
      </div>

      {brands.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brands found</h3>
            <p className="text-gray-600">There are no brands available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => {
            const stats = getCampaignStats(brand._id);
            return (
              <Card key={brand._id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900">{brand.companyName}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{brand.industry}</p>
                      {brand.website && (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                    <Badge variant="outline" className="bg-[#3A7CA5]/10 text-[#3A7CA5] border-[#3A7CA5]/20 shrink-0">
                      {brand.location}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#3A7CA5]" />
                      <span className="font-medium">{stats.total} Campaigns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#88B04B]" />
                      <span className="text-green-600 font-medium">{stats.active} Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#E19629]" />
                      <span className="text-orange-600">{stats.upcoming} Upcoming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{stats.completed} Completed</span>
                    </div>
                  </div>

                  {brand.description && (
                    <p className="text-sm text-gray-700 line-clamp-2">{brand.description}</p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white"
                      onClick={() => {
                        setSelectedBrand(brand);
                        setShowCampaigns(true);
                      }}
                      disabled={stats.total === 0}
                    >
                      {stats.total === 0 ? 'No Campaigns' : 'View Campaigns'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Brand Campaigns Modal */}
      <Dialog open={showCampaigns} onOpenChange={setShowCampaigns}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedBrand?.companyName}&apos;s Campaigns
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Explore all campaigns from this brand and find your next opportunity
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {brandCampaigns.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                  <p className="text-gray-600">This brand hasn&apos;t created any campaigns yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {brandCampaigns.length} campaign{brandCampaigns.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-green-700 bg-green-50">
                      {brandCampaigns.filter(c => c.status === 'active').length} Active
                    </Badge>
                    <Badge variant="outline" className="text-gray-700 bg-gray-50">
                      {brandCampaigns.filter(c => c.status === 'draft').length} Draft
                    </Badge>
                  </div>
                </div>

                {brandCampaigns.map((campaign) => {
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
                              variant={campaign.status === 'active' ? 'default' : 'secondary'}
                              className={
                                campaign.status === 'active'
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : campaign.status === 'completed'
                                  ? 'bg-gray-100 text-gray-800 border-gray-200'
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              }
                            >
                              {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-[#88B04B]" />
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
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <span>{campaign.contentTypes?.join(", ") || "Various"}</span>
                          </div>
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
                            disabled={campaign.status !== 'active'}
                          >
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
            )}
          </div>
        </DialogContent>
      </Dialog>

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

export default Page;