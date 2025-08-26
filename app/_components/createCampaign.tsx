"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "../hooks/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  CalendarIcon,
  Target,
  DollarSign,
  Users,
  Briefcase,
  Image,
  Video,
  Lock,
  FileText,
  ArrowLeft,
  AlertTriangle,
  Eye,
  Plus,
  Edit,
  Save,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import { Id } from "@/convex/_generated/dataModel";

const objectives = [
  "Brand Awareness",
  "Lead Generation", 
  "Sales Conversion",
  "Engagement",
  "Reach",
  "Website Traffic"
];

const contentTypes = [
  "Instagram Post",
  "Instagram Story",
  "Instagram Reel",
  "TikTok Video",
  "YouTube Video",
  "Blog Post",
  "Tweet",
  "LinkedIn Post"
];

interface CreateCampaignArgs {
  role: "influencer" | "brand" | "agency";
  title: string;
  description: string;
  budget?: number;
  status: "draft" | "active" | "completed" | "archived" | "expired" ; // Added ""
  targetAudience?: string;
  contentTypes?: string[];
  startDate?: string;
  endDate?: string;
  duration?: string;
  requirements?: string;
}

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
  status?: "draft" | "active" | "completed" | "archived" | "expired" ; // Added ""
  createdAt?: Date;
  hasApplications?: boolean;
}


interface CampaignCreationProps {
  campaignId?: Id<"campaigns"> | null;
  initialData?: CampaignData | null;
  mode?: 'create' | 'edit' | 'view';
  onSave?: (id: Id<"campaigns"> | null, data: CampaignData) => Promise<void>;
  onCancel?: () => void;
}

const steps = [
  { number: 1, title: "Campaign Details", icon: Briefcase },
  { number: 2, title: "Target & Budget", icon: Target },
  { number: 3, title: "Content Requirements", icon: Image },
  { number: 4, title: "Review & Launch", icon: Users }
];

// Campaign status types
const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  ARCHIVED: 'archived' // Added if needed
} as const;

type CampaignStatus = typeof CAMPAIGN_STATUS[keyof typeof CAMPAIGN_STATUS];

export default function CreateCampaign({ 
  campaignId = null,
  initialData = null,
  mode = 'create',
  onSave = () => Promise.resolve(),
  onCancel = () => {}
}: CampaignCreationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing] = useState(mode === 'edit');
  const [isViewing] = useState(mode === 'view');
  const router = useRouter();
  const { toast } = useToast();
  
  // Campaign status - determines if editing is allowed
  const [campaignStatus] = useState<CampaignStatus>(
    (initialData?.status as CampaignStatus) || CAMPAIGN_STATUS.DRAFT
  );

  const createCampaign = useMutation(api.campaign.createCampaign);
  const updateCampaign = useMutation(api.campaign.updateCampaign);
  const deleteCampaign = useMutation(api.campaign.deleteCampaign);

  // Business logic for edit/delete permissions
  const canEditOrDelete = useMemo(() => {
    if (!isEditing && !isViewing) return true; // Creating new campaign
    
    const now = new Date();
    const campaignEndDate = initialData?.endDate ? new Date(initialData.endDate) : null;
    const hasApplications = initialData?.hasApplications || false;
    
    // If campaign has applications and deadline hasn't been met, cannot edit/delete
    if (hasApplications && campaignEndDate && now < campaignEndDate) {
      return false;
    }
    
    // If campaign is completed or expired, cannot edit/delete
    if (campaignStatus === CAMPAIGN_STATUS.COMPLETED || campaignStatus === CAMPAIGN_STATUS.EXPIRED) {
      return false;
    }
    
    return true;
  }, [isEditing, isViewing, initialData, campaignStatus]);

  // Check if campaign can be edited
  const canEditCampaign = !isViewing && canEditOrDelete;
  
  // Check if specific fields can be edited (some fields might be locked even in editable campaigns)
  const canEditCriticalFields = campaignStatus === CAMPAIGN_STATUS.DRAFT && canEditOrDelete;

  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    budget: initialData?.budget || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
    objectives: initialData?.objectives || [],
    targetAudience: {
      ageRange: initialData?.targetAudience?.ageRange || "",
      location: initialData?.targetAudience?.location || "",
      interests: initialData?.targetAudience?.interests || []
    },
    deliverables: initialData?.deliverables || "",
    contentTypes: initialData?.contentTypes || [],
    brandGuidelines: initialData?.brandGuidelines || "",
    status: initialData?.status,
    createdAt: initialData?.createdAt,
    hasApplications: initialData?.hasApplications || false
  });

  // Delete campaign handler
  const handleDeleteCampaign = async () => {
    if (!campaignId || !canEditOrDelete) {
      toast({
        title: "Cannot Delete",
        description: "This campaign cannot be deleted because it has active applications or the deadline hasn't passed",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await deleteCampaign({ campaignId });
      
      toast({
        title: "Campaign Deleted",
        description: "Campaign has been deleted successfully",
        variant: "default"
      });
      
      router.push("/dashboard/brand");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Field handlers
  const handleObjectiveToggle = (objective: string) => {
    if (!canEditCampaign) return;
    
    setCampaignData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective)
        ? prev.objectives.filter(o => o !== objective)
        : [...prev.objectives, objective]
    }));
  };

  const handleContentTypeToggle = (type: string) => {
    if (!canEditCriticalFields) return;
    
    setCampaignData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
  };

  // Get status badge variant and text
const getStatusInfo = (status: CampaignStatus) => {
  switch (status) {
    case CAMPAIGN_STATUS.DRAFT:
      return { variant: "outline" as const, text: "Draft", color: "text-gray-600" };
    case CAMPAIGN_STATUS.ACTIVE:
      return { variant: "default" as const, text: "Active", color: "text-blue-600" };
    // case CAMPAIGN_STATUS.PAUSED:
    //   return { variant: "secondary" as const, text: "Paused", color: "text-yellow-600" };
    case CAMPAIGN_STATUS.COMPLETED:
      return { variant: "secondary" as const, text: "Completed", color: "text-gray-600" };
    case CAMPAIGN_STATUS.EXPIRED:
      return { variant: "destructive" as const, text: "Expired", color: "text-red-600" };
    case CAMPAIGN_STATUS.ARCHIVED:
      return { variant: "secondary" as const, text: "Archived", color: "text-gray-500" };
    default:
      return { variant: "outline" as const, text: "Unknown", color: "text-gray-600" };
  }
};

  // Get permission message
  const getPermissionMessage = () => {
    if (!canEditOrDelete && campaignData.hasApplications) {
      const endDate = campaignData.endDate?.toLocaleDateString();
      return `This campaign has received applications and cannot be modified until after the deadline (${endDate}).`;
    }
    if (campaignStatus === CAMPAIGN_STATUS.COMPLETED) {
      return "This campaign is completed and cannot be modified.";
    }
    if (campaignStatus === CAMPAIGN_STATUS.EXPIRED) {
      return "This campaign has expired and cannot be modified.";
    }
    return "";
  };

  // Render read-only field
  const ReadOnlyField = ({ label, value, icon: Icon }: { 
    label?: string; 
    value: string; 
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
        <Lock className="w-3 h-3" />
      </Label>
      <div className="px-3 py-2 bg-muted/50 border border-muted rounded-md text-muted-foreground">
        {value || "Not set"}
      </div>
    </div>
  );

  // Step renderers
  const renderStep1 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-4 sm:space-y-6"
    >
      {/* Status and permission indicators */}
      {(isEditing || isViewing) && (
        <div className="space-y-2">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {getPermissionMessage() || (canEditCampaign ? 
                "You are editing an existing campaign. Some fields may be restricted based on campaign status." :
                "You are viewing this campaign in read-only mode."
              )}
            </AlertDescription>
          </Alert>
          
          {campaignData.hasApplications && (
            <Alert className="border-orange-200 bg-orange-50">
              <Users className="h-4 w-4" />
              <AlertDescription>
                This campaign has received applications from influencers.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="campaignName">Campaign Name</Label>
        {canEditCampaign ? (
          <Input
            id="campaignName"
            placeholder="Enter campaign name..."
            value={campaignData.name}
            onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
            required
          />
        ) : (
          <ReadOnlyField value={campaignData.name} />
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        {canEditCampaign ? (
          <Textarea
            id="description"
            placeholder="Describe your campaign goals and vision..."
            value={campaignData.description}
            onChange={(e) => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1"
            rows={4}
            required
          />
        ) : (
          <ReadOnlyField value={campaignData.description} />
        )}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        {canEditCriticalFields ? (
          <Select 
            value={campaignData.category}
            onValueChange={(value) => setCampaignData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select campaign category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fashion">Fashion & Style</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="fitness">Health & Fitness</SelectItem>
              <SelectItem value="food">Food & Beverage</SelectItem>
              <SelectItem value="beauty">Beauty & Skincare</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="arts">Arts & Crafts</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <ReadOnlyField value={campaignData.category} icon={Lock} />
        )}
      </div>

      <div>
        <Label>Campaign Objectives</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {objectives.map(objective => (
            <Badge
              key={objective}
              variant={campaignData.objectives.includes(objective) ? "default" : "outline"}
              className={`${canEditCampaign ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} transition-colors ${
                campaignData.objectives.includes(objective) 
                  ? "bg-primary text-white hover:bg-primary/90" 
                  : canEditCampaign ? "hover:bg-gray-50" : ""
              }`}
              onClick={() => handleObjectiveToggle(objective)}
            >
              {objective}
              {!canEditCampaign && campaignData.objectives.includes(objective) && (
                <Lock className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
        {!canEditCampaign && (
          <p className="text-xs text-muted-foreground mt-1">Campaign objectives cannot be changed</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-4 sm:space-y-6"
    >
      <div>
        <Label htmlFor="budget">Campaign Budget</Label>
        {canEditCriticalFields ? (
          <div className="relative mt-1">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="budget"
              placeholder="Enter total budget..."
              value={campaignData.budget}
              onChange={(e) => setCampaignData(prev => ({ ...prev, budget: e.target.value }))}
              className="pl-10"
              required
            />
          </div>
        ) : (
          <ReadOnlyField value={`$${campaignData.budget}`} icon={DollarSign} />
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          {canEditCriticalFields ? (
            <Input
              type="date"
              value={campaignData.startDate ? campaignData.startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setCampaignData(prev => ({ 
                ...prev, 
                startDate: e.target.value ? new Date(e.target.value) : undefined 
              }))}
              className="mt-1"
            />
          ) : (
            <ReadOnlyField value={campaignData.startDate?.toLocaleDateString() || ""} icon={CalendarIcon} />
          )}
        </div>
        <div>
          <Label>End Date</Label>
          {canEditCriticalFields ? (
            <Input
              type="date"
              value={campaignData.endDate ? campaignData.endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setCampaignData(prev => ({ 
                ...prev, 
                endDate: e.target.value ? new Date(e.target.value) : undefined 
              }))}
              className="mt-1"
            />
          ) : (
            <ReadOnlyField value={campaignData.endDate?.toLocaleDateString() || ""} icon={CalendarIcon} />
          )}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <Label htmlFor="ageRange">Target Age Range</Label>
        {canEditCampaign ? (
          <Select 
            value={campaignData.targetAudience.ageRange}
            onValueChange={(value) => setCampaignData(prev => ({ 
              ...prev, 
              targetAudience: { ...prev.targetAudience, ageRange: value }
            }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select age range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18-24">18-24</SelectItem>
              <SelectItem value="25-34">25-34</SelectItem>
              <SelectItem value="35-44">35-44</SelectItem>
              <SelectItem value="45-54">45-54</SelectItem>
              <SelectItem value="55+">55+</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <ReadOnlyField value={campaignData.targetAudience.ageRange} />
        )}
      </div>
      
      <div>
        <Label htmlFor="location">Target Location</Label>
        {canEditCampaign ? (
          <Select 
            value={campaignData.targetAudience.location}
            onValueChange={(value) => setCampaignData(prev => ({ 
              ...prev, 
              targetAudience: { ...prev.targetAudience, location: value }
            }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select target location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ug">Uganda</SelectItem>
              <SelectItem value="ke">Kenya</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <ReadOnlyField value={campaignData.targetAudience.location} />
        )}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="space-y-4 sm:space-y-6"
    >
      <div>
        <Label>Content Types Required</Label>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {contentTypes.map(type => (
            <div
              key={type}
              className={`p-3 sm:p-4 border rounded-lg transition-all hover:shadow-sm ${
                campaignData.contentTypes.includes(type)
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-gray-200"
              } ${
                canEditCriticalFields ? 'cursor-pointer hover:border-gray-300' : 'cursor-not-allowed opacity-60'
              }`}
              onClick={() => handleContentTypeToggle(type)}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {type.includes('Video') ? <Video className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : 
                 type.includes('Post') || type.includes('Story') ? <Image className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : 
                 <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                <span className="text-sm sm:text-base font-medium">{type}</span>
                {!canEditCriticalFields && campaignData.contentTypes.includes(type) && (
                  <Lock className="w-3 h-3 ml-auto" />
                )}
              </div>
            </div>
          ))}
        </div>
        {!canEditCriticalFields && (
          <p className="text-xs text-muted-foreground mt-2">Content types cannot be changed after launch or while campaign has applications</p>
        )}
      </div>

      {/* Additional requirements */}
      <div>
        <Label htmlFor="deliverables">Deliverables & Requirements</Label>
        {canEditCampaign ? (
          <Textarea
            id="deliverables"
            placeholder="Describe specific deliverables, posting schedules, hashtags, etc..."
            value={campaignData.deliverables}
            onChange={(e) => setCampaignData(prev => ({ ...prev, deliverables: e.target.value }))}
            className="mt-1"
            rows={3}
          />
        ) : (
          <ReadOnlyField value={campaignData.deliverables} />
        )}
      </div>

      <div>
        <Label htmlFor="brandGuidelines">Brand Guidelines</Label>
        {canEditCampaign ? (
          <Textarea
            id="brandGuidelines"
            placeholder="Share your brand voice, style guidelines, do's and don'ts..."
            value={campaignData.brandGuidelines}
            onChange={(e) => setCampaignData(prev => ({ ...prev, brandGuidelines: e.target.value }))}
            className="mt-1"
            rows={3}
          />
        ) : (
          <ReadOnlyField value={campaignData.brandGuidelines} />
        )}
      </div>
    </motion.div>
  );

  const renderStep4 = () => {
    const statusInfo = getStatusInfo(campaignStatus);
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: -20 }} 
        className="space-y-4 sm:space-y-6"
      >
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg sm:text-xl">Campaign Summary</h3>
            {(isEditing || isViewing) && (
              <Badge variant={statusInfo.variant} className={statusInfo.color}>
                {statusInfo.text}
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Name:</span> 
              <span className="text-sm sm:text-base">{campaignData.name || "Not set"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Category:</span> 
              <span className="text-sm sm:text-base capitalize">{campaignData.category || "Not set"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Budget:</span> 
              <span className="text-sm sm:text-base">${campaignData.budget || "Not set"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium text-sm sm:text-base">Duration:</span>
              <span className="text-sm sm:text-base">
                {campaignData.startDate && campaignData.endDate
                  ? `${campaignData.startDate.toLocaleDateString()} - ${campaignData.endDate.toLocaleDateString()}`
                  : "Not set"}
              </span>
            </div>
            {campaignData.createdAt && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-medium text-sm sm:text-base">Created:</span>
                <span className="text-sm sm:text-base">{campaignData.createdAt.toLocaleDateString()}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-sm sm:text-base">Objectives:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaignData.objectives.length > 0 ? campaignData.objectives.map(obj => (
                  <Badge key={obj} variant="secondary">{obj}</Badge>
                )) : <span className="text-sm text-gray-500">None selected</span>}
              </div>
            </div>
            <div>
              <span className="font-medium text-sm sm:text-base">Content Types:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaignData.contentTypes.length > 0 ? campaignData.contentTypes.map(type => (
                  <Badge key={type} variant="outline">{type}</Badge>
                )) : <span className="text-sm text-gray-500">None selected</span>}
              </div>
            </div>
            <div>
              <span className="font-medium text-sm sm:text-base">Target Audience:</span>
              <div className="text-sm sm:text-base mt-1">
                {campaignData.targetAudience.ageRange && campaignData.targetAudience.location ? (
                  <span>
                    Age: {campaignData.targetAudience.ageRange}, Location: {campaignData.targetAudience.location}
                  </span>
                ) : (
                  <span className="text-gray-500">Not fully configured</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Status-specific alerts */}
   {campaignStatus === CAMPAIGN_STATUS.ACTIVE ? (
          <Alert className="border-blue-200 bg-blue-50">
            <Target className="h-4 w-4" />
            <AlertDescription>
              This campaign is active and accepting applications.
            </AlertDescription>
          </Alert>
        ) : campaignStatus === CAMPAIGN_STATUS.EXPIRED ? (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This campaign has expired and is no longer accepting applications.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-blue-200 bg-blue-50">
            <Briefcase className="h-4 w-4" />
            <AlertDescription>
              {isEditing ? 
                "You can save changes to update this campaign." : 
                "Your campaign will be saved as draft and visible to influencers once you launch it."
              }
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    );
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!canEditCampaign && (isEditing || isViewing)) {
      toast({
        title: "Cannot Save",
        description: getPermissionMessage(),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const campaignPayload: CreateCampaignArgs = {
        role: "brand", 
        title: campaignData.name,
        description: campaignData.description,
        budget: campaignData.budget ? parseInt(campaignData.budget) : undefined,
        status: campaignStatus,
        targetAudience: `Age: ${campaignData.targetAudience.ageRange}, Location: ${campaignData.targetAudience.location}`,
        contentTypes: campaignData.contentTypes,
        startDate: campaignData.startDate ? campaignData.startDate.toISOString() : undefined,
        endDate: campaignData.endDate ? campaignData.endDate.toISOString() : undefined,
        requirements: campaignData.deliverables || campaignData.brandGuidelines,
      };

      console.log("Submitting campaign payload:", campaignPayload);

      if (isEditing && campaignId) {
        // Update existing campaign
        await updateCampaign({
          campaignId,
          ...campaignPayload
        });

        toast({
          title: "Campaign Updated",
          description: `${campaignData.name} has been updated successfully`,
          variant: "default"
        });
      } else {
        // Create new campaign
        const newCampaignId = await createCampaign(campaignPayload);
        
        toast({
          title: "Campaign Created",
          description: `${campaignData.name} has been created successfully`,
          variant: "default"
        });
        
        console.log("New campaign created with ID:", newCampaignId);
      }

      await onSave(campaignId, campaignData);
      
      // Navigate back to dashboard
      router.push("/dashboard/brand");
   
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} campaign. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  // Validation function
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return campaignData.name && campaignData.description && campaignData.category && campaignData.objectives.length > 0;
      case 2:
        return campaignData.budget && campaignData.startDate && campaignData.endDate && campaignData.targetAudience.ageRange && campaignData.targetAudience.location;
      case 3:
        return campaignData.contentTypes.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/brand")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {/* Action buttons for edit/view mode */}
          {(isEditing || isViewing) && (
            <div className="flex items-center gap-2">
              {/* Delete button */}
              {canEditOrDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteCampaign}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
              
              {/* Mode indicator */}
              <Badge variant="secondary" className="flex items-center gap-2">
                {isViewing ? (
                  <>
                    <Eye className="w-3 h-3" />
                    View Only
                  </>
                ) : canEditCampaign ? (
                  <>
                    <Edit className="w-3 h-3" />
                    Editing
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    Locked
                  </>
                )}
              </Badge>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            {isViewing ? `View Campaign: ${campaignData.name || 'Untitled'}` :
             isEditing ? `Edit Campaign: ${campaignData.name || 'Untitled'}` : 
             'Create New Campaign'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {isViewing ? 
              'Review your campaign details' :
              isEditing ? 
                `Modify your campaign details${!canEditCampaign ? ' (Limited editing due to active applications)' : ''}` : 
                'Set up your influencer marketing campaign in just a few steps'
            }
          </p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            {/* Desktop Progress */}
            <div className="hidden lg:flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-3 ${
                    step.number <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.number <= currentStep 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm opacity-75">Step {step.number}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-px mx-4 ${
                      step.number < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Mobile/Tablet Progress */}
            <div className="lg:hidden">
              <div className="flex items-center justify-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  'bg-primary text-primary-foreground'
                }`}>
                  {(() => {
                    const StepIcon = steps[currentStep - 1].icon;
                    return <StepIcon className="w-5 h-5" />;
                  })()}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-primary">{steps[currentStep - 1].title}</p>
                  <p className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex-1 h-2 rounded-full ${
                      step.number <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps.find(s => s.number === currentStep)?.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || loading}
            className="order-2 sm:order-1"
          >
            Previous
          </Button>
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={!canProceedToNextStep() || loading}
              className="order-1 sm:order-2"
            >
              Next Step
            </Button>
          ) : (
            <div className="flex gap-2 order-1 sm:order-2">
              {/* Show different buttons based on mode */}
              {isViewing ? (
                <Button
                  onClick={() => router.push("/brand")}
                  className="flex-1 sm:flex-none"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !canProceedToNextStep() || !canEditCampaign}
                  className="flex-1 sm:flex-none"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Campaign
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Campaign
                        </>
                      )}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}