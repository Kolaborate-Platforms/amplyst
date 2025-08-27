'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
// Import types - adjust paths based on your project structure
// import { useQuery } from "convex/react";
// import { api } from "convex/_generated/api";
import CampaignDetailsModal from "../campaignDetailsModel";

// Temporary type definitions - replace with your actual types
interface Campaign {
  _id: string;
  title: string;
  description: string;
  budget?: number;
  endDate?: string;
  requirements?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'approved';
  creatorUserId: string;
}

interface MyApplicationsProps {
  applications?: Campaign[]; // Optional prop for passing data from parent
}

const MyApplications = ({ applications: propsApplications }: MyApplicationsProps = {}) => {
  // Comment out Convex-specific code - replace with your data fetching solution
  // const applications = useQuery(api.campaign.campaignsForInfluencer);
  const applications = propsApplications || []; // Use props or empty array as fallback
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case "pending":
        return "bg-[#E19629]/10 text-[#E19629] border-[#E19629]/20";
      case "accepted":
        return "bg-[#88B04B]/10 text-[#88B04B] border-[#88B04B]/20";
      case "rejected":
        return "bg-red-50 text-red-600 border-red-200";
      case "approved":
        return "bg-green-50 text-green-600 border-green-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // Remove the loading check for now since we're not using async data fetching
  // if (!applications) {
  //   return <div>Loading...</div>;
  // }

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedCampaign(null);
  };

  const navigateToCreateContent = (campaignId: string) => {
    router.push(`/create-content/${campaignId}`);
  };

  return (
    <div className="space-y-6">
      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">You haven't applied to any campaigns yet.</p>
          </CardContent>
        </Card>
      ) : (
        applications.map((campaign) => (
          <Card key={campaign._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <p className="text-sm text-gray-600">by {campaign.creatorUserId}</p>
                </div>
                <Badge className={`border ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">{campaign.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#88B04B]" />
                  <span className="font-medium">{campaign.budget ? `$${campaign.budget}` : "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#E19629]" />
                  <span>{campaign.endDate || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Requirements:</h4>
                <p className="text-sm text-gray-700">{campaign.requirements || "No specific requirements listed."}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90"
                  onClick={() => handleViewDetails(campaign)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}


      <CampaignDetailsModal
        open={showDetails}
        onClose={handleCloseModal}
        campaign={selectedCampaign}
        navigateToCreateContent={navigateToCreateContent}
      />
    </div>
  );
};

export default MyApplications;