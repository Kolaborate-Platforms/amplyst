'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Save,
  X,
  Plus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

interface CampaignEditProps {
  params: {
    id: string;
  };
}

const CONTENT_TYPES = [
  'Instagram Post',
  'Instagram Story',
  'Instagram Reel',
  'TikTok Video',
  'YouTube Video',
  'YouTube Short',
  'Blog Post',
  'Podcast',
  'Twitter Post',
  'LinkedIn Post',
  'Facebook Post',
  'Snapchat Story'
];

export default function CampaignEdit({ params }: CampaignEditProps) {
  const router = useRouter();
  const campaignId = params.id as Id<"campaigns">;
  
  // Fetch campaign data
  const campaign = useQuery(api.campaign.getCampaignById, { campaignId });
  
  // Mutations
  const updateCampaign = useMutation(api.campaign.updateCampaign);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    startDate: '',
    endDate: '',
    duration: '',
    niche: '',
    targetAudience: '',
    contentTypes: [] as string[]
  });
  
  const [selectedContentType, setSelectedContentType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when campaign loads
  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title || '',
        description: campaign.description || '',
        budget: campaign.budget?.toString() || '',
        startDate: campaign.startDate || '',
        endDate: campaign.endDate || '',
        duration: campaign.duration || '',
        niche: campaign.niche || '',
        targetAudience: campaign.targetAudience || '',
        contentTypes: campaign.contentTypes || []
      });
    }
  }, [campaign]);

  // Loading state
  if (campaign === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found state
  if (campaign === null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Campaign Not Found</h1>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">The requested campaign could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addContentType = () => {
    if (selectedContentType && !formData.contentTypes.includes(selectedContentType)) {
      setFormData(prev => ({
        ...prev,
        contentTypes: [...prev.contentTypes, selectedContentType]
      }));
      setSelectedContentType('');
    }
  };

  const removeContentType = (typeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.filter(type => type !== typeToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateCampaign({
        campaignId,
        title: formData.title,
        description: formData.description,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        duration: formData.duration || undefined,
        niche: formData.niche || undefined,
        targetAudience: formData.targetAudience || undefined,
        contentTypes: formData.contentTypes.length > 0 ? formData.contentTypes : undefined
      });

      toast({
        title: "Campaign Updated",
        description: `${formData.title} has been updated successfully`,
      });

      router.push('/dashboard/brand/campaigns');
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Campaign</h1>
          <p className="text-gray-600">Update your campaign details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter campaign title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your campaign objectives and requirements"
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                value={formData.niche}
                onChange={(e) => handleInputChange('niche', e.target.value)}
                placeholder="e.g., Fashion, Tech, Food, Lifestyle"
              />
            </div>
            
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Describe your target audience demographics and interests"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget & Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Budget & Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="Enter total campaign budget"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (Alternative to dates)</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 2 weeks, 1 month, 3 days"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Types */}
        <Card>
          <CardHeader>
            <CardTitle>Content Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline" 
                onClick={addContentType}
                disabled={!selectedContentType}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.contentTypes.map((type) => (
                <Badge key={type} variant="outline" className="flex items-center gap-1">
                  {type}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeContentType(type)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
              {formData.contentTypes.length === 0 && (
                <p className="text-sm text-gray-500">No content types selected</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !formData.title || !formData.description}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Updating...' : 'Update Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
}