"use client"



import CampaignCreation from '../../../../../_components/createCampaign';

import { Id } from "../../../../../../convex/_generated/dataModel";
import { useRouter } from 'next/navigation';

interface CampaignData {
  name: string;
  description: string;
  category: string;
  budget: string;
  startDate?: Date;
  endDate?: Date;
  objectives: string[];
  targetAudience: {
    ageRange: string;
    location: string;
    interests: string[];
  };
  deliverables: string;
  contentTypes: string[];
  brandGuidelines: string;
  status?: "draft" | "active" | "completed" | "archived" | "expired" | "paused";
  createdAt?: Date;
  hasApplications?: boolean;
}

export default function Page() {
    const router = useRouter();

  const handleSave = async (id: Id<"campaigns"> | null, data: CampaignData): Promise<void> => {
    // Optional: you can handle post-save actions here if needed
    console.log('Campaign saved:', id, data);
  };

  const handleCancel = (): void => {
    // Optional cancel handler, for example, navigate back to dashboard
    router.push( '/dashboard/brand');
  };

  return (
    <CampaignCreation
      campaignId={null}      // No campaign id on create
      initialData={null}     // No initial data; empty form
      mode="create"          // Set mode to create
      onSave={handleSave}    // Optional save callback
      onCancel={handleCancel} // Optional cancel handler
    />
  );
}