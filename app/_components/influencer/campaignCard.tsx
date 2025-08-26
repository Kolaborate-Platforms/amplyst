"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  status: "active" | "closed" | "draft";
  brandName: string;
  description: string;
  budget: string | number;
  requiredInfluencers: number;
  deadline: string | Date;
}

interface CampaignCardProps {
  campaign: Campaign;
  onApply?: (campaign: Campaign) => void;
}

const CampaignCard = ({ campaign, onApply }: CampaignCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"; // or create a success variant if available
      case "closed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {campaign.title}
          {campaign.status === "active" && (
            <Badge variant={getStatusVariant("active")} className="bg-green-100 text-green-800 hover:bg-green-100">
              Active
            </Badge>
          )}
          {campaign.status === "closed" && (
            <Badge variant="destructive">
              Closed
            </Badge>
          )}
        </CardTitle>
        <div className="text-sm text-gray-500">{campaign.brandName}</div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-gray-700 line-clamp-3">{campaign.description}</div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-2">
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" /> {campaign.budget}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {campaign.requiredInfluencers} influencers
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {formatDate(campaign.deadline)}
          </span>
        </div>
        {onApply && campaign.status === "active" && (
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => onApply(campaign)}
          >
            Apply
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignCard;