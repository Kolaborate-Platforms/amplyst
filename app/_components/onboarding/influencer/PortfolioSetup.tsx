"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Plus, X, Image, Video, FileText } from "lucide-react";

// Types
export interface SocialMediaProfileData {
  tiktok?: TikTokProfileData;
  instagram?: InstagramProfileData;
}

interface TikTokProfileData {
  name?: string;
  fans?: number;
  heart?: number;
  following?: number;
}

interface InstagramProfileData {
  username?: string;
  fullName?: string;
  followersCount?: number;
  followsCount?: number;
  biography?: string;
  private?: boolean;
  verified?: boolean;
  profilePicUrl?: string;
}

export interface PortfolioItem {
  id?: number;
  type: "image" | "video" | "story";
  title: string;
  description: string;
  url: string;
  metrics: {
    followers: string;
    likes: string;
    comments: string;
    shares: string;
  };
}

type PortfolioItemWithoutId = Omit<PortfolioItem, 'id'>;

interface PortfolioSetupProps {
  data: {
    portfolio?: PortfolioItem[];
    profileData?: SocialMediaProfileData;
    primaryPlatform?: string;
  };
  onUpdate: (data: { portfolio: PortfolioItem[] }) => void;
  setNewItemFromSocial?: (item: PortfolioItemWithoutId) => void; 
}

const PortfolioSetup: React.FC<PortfolioSetupProps> = ({ data, onUpdate }) => {
  const [newItem, setNewItem] = useState<PortfolioItemWithoutId>({
    type: "image",
    title: "",
    description: "",
    url: "",
    metrics: {
      followers: "",
      likes: "",
      comments: "",
      shares: ""
    }
  });

  const addPortfolioItem = () => {
    if (newItem.title && newItem.url) {
      onUpdate({
        portfolio: [...(data.portfolio || []), { ...newItem, id: Date.now() }]
      });
      setNewItem({
        type: "image",
        title: "",
        description: "",
        url: "",
        metrics: { followers: "", likes: "", comments: "", shares: "" }
      });
    }
  };

  const removePortfolioItem = (id: number | undefined) => {
    if (!id || !data.portfolio) return;
    onUpdate({
      portfolio: data.portfolio.filter((item: PortfolioItem) => item.id !== id)
    });
  };

  const contentTypes = [
    { value: "image", label: "Image Post", icon: Image },
    { value: "video", label: "Video Content", icon: Video },
    { value: "story", label: "Story/Reel", icon: FileText }
  ] as const;

  // Add auto-generation of portfolio items from social media data
  const generateFromSocialMedia = () => {
    if (!data.profileData) return;
    
    const newPortfolioItems: PortfolioItemWithoutId[] = [];
    
    // Generate for TikTok if available
    if (data.profileData.tiktok) {
      const tiktokData = data.profileData.tiktok;
      newPortfolioItems.push({
        type: "video",
        title: `TikTok Content by @${tiktokData.name || "me"}`,
        description: `Engaging TikTok content with ${tiktokData.fans || 0} followers`,
        url: `https://tiktok.com/@${tiktokData.name || ""}`,
        metrics: {
          followers: tiktokData.fans?.toString() || "0",
          likes: tiktokData.heart?.toString() || "0",
          comments: "0", // TikTok API doesn't provide this
          shares: "0"    // TikTok API doesn't provide this
        }
      });
    }
    
    // Generate for Instagram if available
    if (data.profileData.instagram) {
      const instaData = data.profileData.instagram;
      newPortfolioItems.push({
        type: "image",
        title: `Instagram Content by @${instaData.username || "me"}`,
        description: instaData.biography || "My Instagram content",
        url: instaData.profilePicUrl || `https://instagram.com/${instaData.username}`,
        metrics: {
          followers: instaData.followersCount?.toString() || "0",
          likes: "0", // Instagram API doesn't provide this
          comments: "0", // Instagram API doesn't provide this
          shares: "0"    // Instagram API doesn't provide this
        }
      });
    }
    
    if (newPortfolioItems.length > 0) {
      // Add all new portfolio items
      onUpdate({
        portfolio: [...(data.portfolio || []), ...newPortfolioItems.map(item => ({ ...item, id: Date.now() + Math.random() }))]
      });

      // Set the first item as the current new item
      setNewItem(newPortfolioItems[0]);
    }
  };

  // Handle file upload (placeholder for Next.js 15)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real Next.js 15 app, you would upload to your API route
    // Example: POST to /api/upload
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // This would be your actual upload logic
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const { url } = await response.json();
      
      // For now, just use a placeholder URL
      const placeholderUrl = URL.createObjectURL(file);
      setNewItem({ ...newItem, url: placeholderUrl });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Build Your Portfolio</h3>
        <p className="text-gray-600 text-sm">Showcase your best content to attract the right brand partnerships</p>
      </div>

      {/* Auto-generate from social media */}
      {data.profileData && (data.profileData.tiktok || data.profileData.instagram) && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Generate from Social Media</h4>
                <p className="text-sm text-blue-700">
                  Automatically create portfolio items from your connected accounts
                </p>
              </div>
              <Button 
                onClick={generateFromSocialMedia}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Generate Items
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Portfolio Item */}
      <Card className="border-dashed border-2 border-gray-300 hover:border-primary transition-colors duration-200">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Add Content Piece</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <div className="flex space-x-2">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={newItem.type === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewItem({ ...newItem, type: type.value })}
                        className="flex items-center space-x-1"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentTitle">Content Title</Label>
                <Input
                  id="contentTitle"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Give your content a title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentUrl">Content URL or Upload</Label>
              <div className="flex space-x-2">
                <Input
                  id="contentUrl"
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  placeholder="Paste URL or upload file"
                  className="flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentDescription">Description</Label>
              <Textarea
                id="contentDescription"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Describe this content piece and its performance..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {Object.entries(newItem.metrics).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs capitalize">{key}</Label>
                  <Input
                    value={value}
                    onChange={(e) => setNewItem({
                      ...newItem,
                      metrics: { ...newItem.metrics, [key]: e.target.value }
                    })}
                    placeholder="0"
                    className="text-sm"
                  />
                </div>
              ))}
            </div>

            <Button 
              onClick={addPortfolioItem}
              disabled={!newItem.title || !newItem.url}
              className="w-full"
            >
              Add to Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Items */}
      {data.portfolio && data.portfolio.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Your Portfolio ({data.portfolio.length} items)</h4>
          {data.portfolio.map((item: PortfolioItem) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {item.type === "image" && <Image className="h-4 w-4 text-blue-600" />}
                      {item.type === "video" && <Video className="h-4 w-4 text-red-600" />}
                      {item.type === "story" && <FileText className="h-4 w-4 text-green-600" />}
                      <h5 className="font-medium">{item.title}</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex space-x-4 text-xs text-gray-500">
                      {Object.entries(item.metrics).map(([key, value]) => (
                        value && typeof value === 'string' && value.trim() !== '' && (
                          <span key={key} className="capitalize">
                            {key}: {String(value)}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePortfolioItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioSetup;