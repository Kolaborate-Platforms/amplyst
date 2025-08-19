"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "../../../hooks/use-toast";
import { 
  Search, 
  Star, 
  Eye, 
  MessageSquare, 
  MapPin, 
  Users, 
  TrendingUp,
  Send,
  X 
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface Influencer {
  _id: Id<"profiles">;
  name: string;
  niche: string;
  location: string;
  followerCount: number;
  engagementRate: number;
  price: string;
  primaryPlatform: string[];
  bio?: string;
  email?: string;
  role: string;
  _creationTime: number;
  [key: string]: any;
}

interface ContactFormData {
  subject: string;
  message: string;
}

export default function DiscoverInfluencers() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNiche, setFilterNiche] = useState("all");
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch influencers from Convex
  const influencers = useQuery(api.influencers.listInfluencers) as Influencer[] | undefined;
  
  // Get specific influencer profile when viewing details
//   const influencerProfile = useQuery(
//     selectedInfluencer ? api.influencers.getInfluencerProfileById : "skip",
//     selectedInfluencer ? { profileId: selectedInfluencer._id } : undefined
//   );

  // Filter influencers based on search and niche
  const filteredInfluencers = useMemo(() => {
    if (!influencers) return [];

    return influencers.filter((influencer) => {
      const matchesSearch = !searchTerm || 
        influencer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.niche?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesNiche = filterNiche === "all" || influencer.niche === filterNiche;

      return matchesSearch && matchesNiche;
    });
  }, [influencers, searchTerm, filterNiche]);

  const handleViewInfluencerProfile = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
  };

  const handleContactInfluencer = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setShowContactModal(true);
    setContactForm({
      subject: `Collaboration Opportunity with ${influencer.name}`,
      message: `Hi ${influencer.name},\n\nI hope this message finds you well. I came across your profile and I'm impressed with your content in the ${influencer.niche} space.\n\nI'd love to discuss a potential collaboration opportunity that I think would be a great fit for your audience.\n\nLooking forward to hearing from you!\n\nBest regards,`
    });
  };

  const handleSendMessage = async () => {
    if (!selectedInfluencer || !contactForm.subject.trim() || !contactForm.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the message through your Convex mutation
      // For now, we'll simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "Message Sent!",
        description: `Your message has been sent to ${selectedInfluencer.name}.`,
        variant: "default"
      });

      setShowContactModal(false);
      setContactForm({ subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeProfileModal = () => {
    setSelectedInfluencer(null);
  };

  const renderDiscoverInfluencers = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search influencers by name or niche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterNiche} onValueChange={setFilterNiche}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Niches</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="beauty">Beauty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Influencers Grid */}
      {filteredInfluencers && filteredInfluencers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((influencer) => (
            <Card key={influencer._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-[#3A7CA5] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {influencer.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{influencer.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{influencer.niche}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{influencer.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Followers
                    </span>
                    <span className="font-semibold">{influencer.followerCount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Engagement
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{influencer.engagementRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rate Range</span>
                    <span className="font-semibold text-green-600">{influencer.price}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {influencer.primaryPlatform?.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewInfluencerProfile(influencer)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleContactInfluencer(influencer)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : influencers === undefined ? (
        // Loading state
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Influencers...</h3>
          <p className="text-gray-600">Finding the best influencers for you</p>
        </div>
      ) : (
        // No results state
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Influencers Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterNiche !== "all" 
              ? "Try adjusting your search or filters" 
              : "No influencers available at the moment"
            }
          </p>
        </div>
      )}

      {/* Profile View Modal */}
      <Dialog open={!!selectedInfluencer && !showContactModal} onOpenChange={(open: boolean) => !open && closeProfileModal()}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Influencer Profile</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeProfileModal}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedInfluencer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-300 to-[#3A7CA5] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedInfluencer.name?.charAt(0) || "?"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedInfluencer.name}</h2>
                  <p className="text-gray-600">{selectedInfluencer.niche}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedInfluencer.location}
                  </div>
                </div>
              </div>

              {selectedInfluencer.bio && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-700">{selectedInfluencer.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Followers</p>
                  <p className="font-bold">{selectedInfluencer.followerCount?.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="font-bold">{selectedInfluencer.engagementRate}%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl mx-auto mb-2 block">💰</span>
                  <p className="text-sm text-gray-600">Rate</p>
                  <p className="font-bold text-green-600">{selectedInfluencer.price}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInfluencer.primaryPlatform?.map((platform) => (
                    <Badge key={platform} variant="secondary">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => handleContactInfluencer(selectedInfluencer)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Influencer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={(open: boolean) => !open && setShowContactModal(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact {selectedInfluencer?.name}</DialogTitle>
            <DialogDescription>
              Send a message to discuss potential collaboration opportunities.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter message subject"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Write your message..."
                rows={6}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowContactModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSendMessage}
                disabled={isSubmitting || !contactForm.subject.trim() || !contactForm.message.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return renderDiscoverInfluencers();
}