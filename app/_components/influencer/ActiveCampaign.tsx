import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Eye } from "lucide-react";

// Update these type definitions to match your Next.js data structure
interface Campaign {
  _id: string;
  title: string;
  creatorUserId: string;
  status: "active" | "draft" | "completed" | "archived";
  budget?: number;
  endDate?: string;
  requirements?: string;
}

interface Profile {
  _id: string;
  // Add other profile properties as needed
}

interface ActiveCampaignsProps {
  campaigns: Campaign[];
  profile: Profile;
}

const ActiveCampaigns = ({ campaigns, profile }: ActiveCampaignsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#3A7CA5]/10 text-[#3A7CA5] border-[#3A7CA5]/20";
      case "draft":
        return "bg-gray-50 text-gray-600 border-gray-200";
      case "completed":
        return "bg-[#88B04B]/10 text-[#88B04B] border-[#88B04B]/20";
      case "archived":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active campaigns</h3>
            <p className="text-gray-600">You don't have any active campaigns at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        campaigns.map((campaign) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Button size="sm" className="bg-[#3A7CA5] hover:bg-[#3A7CA5]/90">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {/* <Button size="sm" variant="outline" className="border-[#88B04B] text-[#88B04B] hover:bg-[#88B04B]/5">
                  Upload Content
                </Button> */}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ActiveCampaigns;