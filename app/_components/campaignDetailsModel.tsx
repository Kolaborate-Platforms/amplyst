'use client';

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Doc } from "../../convex/_generated/dataModel";

// Temporary type definitions - replace with your actual types
type Id<T> = string;
interface Campaign<T> {
  _id: Id<T>;
  title: string;
  description: string;
  budget?: number;
  endDate?: string;
  contentTypes?: string[];
  requirements?: string;
  status?: string;
}

interface CampaignDetailsModalProps {
  open: boolean;
  onClose: () => void;
  campaign: Campaign<"campaigns"> | null;
  navigateToCreateContent: (id: Id<"campaigns">) => void;
}

const CampaignDetailsModal = ({ 
  open, 
  onClose, 
  campaign, 
  navigateToCreateContent 
}: CampaignDetailsModalProps) => {
  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{campaign.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">{campaign.description}</p>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Budget:</span> 
              <span className="text-gray-700">{campaign.budget ? `$${campaign.budget}` : "N/A"}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">End Date:</span> 
              <span className="text-gray-700">{campaign.endDate ?? "N/A"}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Content Type:</span> 
              <span className="text-gray-700">{campaign.contentTypes?.join(", ") ?? "N/A"}</span>
            </div>
            
            <div className="space-y-2">
              <span className="font-semibold text-gray-900">Requirements:</span>
              <p className="text-gray-700 text-xs leading-relaxed">
                {campaign.requirements ?? "No specific requirements listed."}
              </p>
            </div>
          </div>

          {campaign.status === "active" && 
            campaign.contentTypes?.includes("TikTok Video") && (
              <Button
                className="mt-6 w-full bg-[#3A7CA5] hover:bg-[#3A7CA5]/90 text-white"
                onClick={() => {
                  onClose();
                  navigateToCreateContent(campaign._id);
                }}
              >
                Create Content
              </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDetailsModal;