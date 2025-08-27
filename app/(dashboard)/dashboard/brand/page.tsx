"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Pencil, User, Mail, CheckCircle, TrendingUp, BarChart2, Users, Activity } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SignedIn } from "@clerk/clerk-react";
import { Id } from "../../../../convex/_generated/dataModel";



function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: string }) {
    return (
        <Card className={`bg-card shadow-md border-0 ${accent ? accent : ""}`}>
            <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-full bg-primary/10 p-3 text-primary">{icon}</div>
                <div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function BrandDashboardPage() {
      const router = useRouter(); 
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("overview");

    // Real-time data fetching from Convex
    const brandProfile = useQuery(api.brands.getMyBrandProfile);
    const campaigns = useQuery(api.campaign.listMyCampaigns, { includeExpired: false });
    const influencers = useQuery(api.influencers.listInfluencers);
    const userRole = useQuery(api.users.getMyRole);
    const applications = useQuery(api.applications.listApplications);

    // Mutations
    const updateApplication = useMutation(api.applications.updateApplication);

    // Fallback to empty arrays/objects for safe operations
    const campaignData = campaigns || [];
    const influencerData = influencers || [];
    const applicationData = applications || [];
    const brand = brandProfile || {};
    const role = userRole || "brand";

    // Handle application actions
    const handleApproveApplication = async (applicationId: Id<"applications">) => {
        try {
            await updateApplication({
                applicationId,
                status: 'approved'
            });
            toast({
                title: "Application Approved",
                description: "The application has been approved successfully",
                variant: "success"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve application",
                variant: "destructive"
            });
        }
    };

    const handleRejectApplication = async (applicationId: Id<"applications">) => {
        try {
            await updateApplication({
                applicationId,
                status: 'rejected'
            });
            toast({
                title: "Application Rejected",
                description: "The application has been rejected",
                variant: "success"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject application",
                variant: "destructive"
            });
        }
    };

    // Show loading spinner while data is loading
    if (!brandProfile || !campaigns || !influencers || !userRole) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    // Calculate campaign insights from real data
    // const totalReach = campaignData.reduce((acc, c) => acc + (c.reach || 0), 0);
    // const avgEngagement = campaignData.length
    //     ? (campaignData.reduce((acc, c) => acc + (c.engagementRate || 0), 0) / campaignData.length)
    //     : 0;
    const totalApplications = applicationData.length || 0;

    return (
        <SignedIn>
            <div className="min-h-screen">
                {/* Tab Navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>


                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        {/* Brand Profile Section */}
                        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-tr from-primary/5 to-background">
                            <CardHeader className="flex flex-row items-center gap-6">
                                {/* <Avatar className="w-20 h-20 bg-primary/10 text-primary">
                                    {brandProfile.avatarUrl ? (
                                        <img src={brandProfile.avatarUrl} alt={brandProfile.companyName} />
                                    ) : (
                                        <span className="text-3xl font-bold">
                                            {brandProfile.companyName?.charAt(0) || "B"}
                                        </span>
                                    )}
                                </Avatar> */}
                                <div className="flex-1">
                                    <CardTitle className="text-2xl font-bold text-primary">
                                        {brandProfile.companyName || "Your brand"}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">{brandProfile.businessEmail || "No email"}</p>
                                    <p className="text-sm mt-2 text-foreground/80">{brandProfile.description || "No description available"}</p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="ml-auto border-primary text-primary hover:bg-primary/10"
                                    onClick={() => router.push('/dashboard/brand/profile/edit')}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </CardHeader>
                        </Card>

                        {/* Modern Stats & Insights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <StatCard
                                icon={<BarChart2 className="h-6 w-6" />}
                                label="Total Campaign Reach"
                                // value={totalReach.toLocaleString()}
                                value= "0"
                                accent="border-l-4 border-primary"
                            />
                            <StatCard
                                icon={<TrendingUp className="h-6 w-6" />}
                                label="Avg. Engagement Rate"
                                // value={avgEngagement ? `${(avgEngagement * 100).toFixed(1)}%` : "0%"}
                                  value="0"
                                accent="border-l-4 border-accent"
                            />
                            <StatCard
                                icon={<Users className="h-6 w-6" />}
                                label="Influencers"
                                value={influencerData.length}
                                accent="border-l-4 border-secondary"
                            />
                            <StatCard
                                icon={<Activity className="h-6 w-6" />}
                                label="Applications"
                                value={totalApplications}
                                accent="border-l-4 border-destructive"
                            />
                        </div>

                        {/* Recent Influencers & Campaigns */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                            {/* Recent Influencers */}
                            <Card className="bg-card/80 border-0 shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <h2 className="text-lg font-semibold text-foreground">Recent Influencers</h2>
                                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                        <User className="mr-2 h-4 w-4" />
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4">
                                        {influencerData.length === 0 ? (
                                            <div className="py-8 text-center text-muted-foreground">
                                                No influencers yet.
                                            </div>
                                        ) : (
                                            influencerData.slice(0, 3).map((influencer) => (
                                                <div key={influencer._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/30 transition">
                                                    {/* <Avatar className="w-12 h-12 bg-secondary/30 text-secondary">
                                                        {influencer.avatarUrl ? (
                                                            <img src={influencer.avatarUrl} alt={influencer.name} />
                                                        ) : (
                                                            <span className="text-xl font-bold">
                                                                {influencer.name?.charAt(0) || "?"}
                                                            </span>
                                                        )}
                                                    </Avatar> */}
                                                    <div>
                                                        <div className="font-medium text-foreground">{influencer.name}</div>
                                                        {/* <div className="text-xs text-muted-foreground">{influencer.email}</div> */}
                                                        <div className="text-xs text-muted-foreground mt-1">Niche: {influencer.niche}</div>
                                                    </div>
                                                    <div className="ml-auto text-xs text-primary font-semibold">
                                                        {influencer.followerCount?.toLocaleString() || 0} followers
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Campaign Insights */}
                            <Card className="bg-card/80 border-0 shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <h2 className="text-lg font-semibold text-foreground">Active Campaigns</h2>
                                    <Button 
                                        variant="default" 
                                        size="sm" 
                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                        onClick={() => router.push('/dashboard/brand/campaigns/create')}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Campaign
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4">
                                        {campaignData.length === 0 ? (
                                            <div className="py-8 text-center text-muted-foreground">
                                                No active campaigns yet.
                                            </div>
                                        ) : (
                                            campaignData.slice(0, 3).map((campaign) => (
                                                <div key={campaign._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/30 transition">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-foreground">{campaign.title}</div>
                                                        <div className="text-xs text-muted-foreground">{campaign.description}</div>
                                                        <div className="flex gap-4 mt-2">
                                                            <span className="text-xs text-primary font-semibold">
                                                                Budget: ${campaign.budget?.toLocaleString() || 0}
                                                            </span>
                                                            <span className="text-xs text-accent font-semibold">
                                                                Status: {campaign.status}
                                                            </span>
                                                            <span className="text-xs text-secondary font-semibold">
                                                                Applications: {applicationData.filter(app => app.campaignTitle === campaign.title).length}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${campaign.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                                                        {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Applications */}
                        <Card className="bg-card/80 border-0 shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
                                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                    <Mail className="mr-2 h-4 w-4" />
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {applicationData.length === 0 ? (
                                        <div className="py-8 text-center text-muted-foreground">
                                            No applications yet.
                                        </div>
                                    ) : (
                                        applicationData.slice(0, 4).map((app) => (
                                            <div key={app._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/30 transition border border-border">
                                                <Avatar className="w-10 h-10 bg-secondary/30 text-secondary">
                                                    <span className="text-lg font-bold">
                                                        {app.influencerName?.charAt(0) || "?"}
                                                    </span>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-foreground">{app.influencerName}</div>
                                                    <div className="text-xs text-muted-foreground">{app.influencerEmail}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">Campaign: {app.campaignTitle}</div>
                                                </div>
                                                <div className="ml-auto flex items-center">
                                                    {app.status === "approved" ? (
                                                        <span className="flex items-center text-xs text-green-600 font-medium">
                                                            <CheckCircle className="mr-1 h-4 w-4" /> Approved
                                                        </span>
                                                    ) : app.status === "rejected" ? (
                                                        <span className="text-xs text-red-600 font-medium">Rejected</span>
                                                    ) : (
                                                        <span className="text-xs text-yellow-600 font-medium">Pending</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Influencers Tab */}
                    <TabsContent value="influencers">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Influencers</h2>
                            <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Influencer
                            </Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {influencerData.length === 0 ? (
                                <Card>
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        No influencers yet.
                                    </CardContent>
                                </Card>
                            ) : (
                                influencerData.map((influencer) => (
                                    <Card key={influencer._id} className="border-0 shadow-md hover:shadow-lg transition">
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            {/* <Avatar className="w-12 h-12 bg-secondary/30 text-secondary">
                                                {influencer.avatarUrl ? (
                                                    <img src={influencer.avatarUrl} alt={influencer.name} />
                                                ) : (
                                                    <span className="text-xl font-bold">
                                                        {influencer.name?.charAt(0) || "?"}
                                                    </span>
                                                )}
                                            </Avatar> */}
                                            <div>
                                                <CardTitle className="text-base text-foreground">{influencer.name}</CardTitle>
                                                {/* <p className="text-xs text-muted-foreground">{influencer.email}</p> */}
                                                <p className="text-xs mt-1 text-muted-foreground">Niche: {influencer.niche}</p>
                                                <p className="text-xs text-primary font-semibold">Followers: {influencer.followerCount?.toLocaleString() || 0}</p>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Campaigns Tab */}
                    <TabsContent value="campaigns">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Campaigns</h2>
                            <Button 
                                variant="default" 
                                size="sm" 
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => router.push('/dashboard/brand/campaigns/create')}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Campaign
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            {campaignData.length === 0 ? (
                                <Card>
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        No campaigns yet.
                                    </CardContent>
                                </Card>
                            ) : (
                                campaignData.map((campaign) => (
                                    <Card key={campaign._id} className="border-0 shadow-md hover:shadow-lg transition">
                                        <CardHeader>
                                            <CardTitle className="text-foreground">{campaign.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">{campaign.description}</p>
                                            <div className="flex gap-4 mt-2">
                                                <span className="text-xs text-primary font-semibold">
                                                    Budget: ${campaign.budget?.toLocaleString() || 0}
                                                </span>
                                                <span className="text-xs text-accent font-semibold">
                                                    Duration: {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "TBD"} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "TBD"}
                                                </span>
                                                <span className="text-xs text-secondary font-semibold">
                                                    Applications: {applicationData.filter(app => app.campaignTitle === campaign.title).length}
                                                </span>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${campaign.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                                                {campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Applications</h2>
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                <Mail className="mr-2 h-4 w-4" />
                                View All
                            </Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {applicationData.length === 0 ? (
                                <Card>
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        No applications yet.
                                    </CardContent>
                                </Card>
                            ) : (
                                applicationData.map((app) => (
                                    <Card key={app._id} className="border-0 shadow-md hover:shadow-lg transition">
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <Avatar className="w-10 h-10 bg-secondary/30 text-secondary">
                                                <span className="text-lg font-bold">
                                                    {app.influencerName?.charAt(0) || "?"}
                                                </span>
                                            </Avatar>
                                            <div className="flex-1">
                                                <CardTitle className="text-base text-foreground">{app.influencerName}</CardTitle>
                                                <p className="text-xs text-muted-foreground">{app.influencerEmail}</p>
                                                <p className="text-xs mt-1 text-muted-foreground">Campaign: {app.campaignTitle}</p>
                                            </div>
                                            <div className="ml-auto flex flex-col items-end gap-2">
                                                {app.status === "approved" ? (
                                                    <span className="flex items-center text-xs text-green-600 font-medium">
                                                        <CheckCircle className="mr-1 h-4 w-4" /> Approved
                                                    </span>
                                                ) : app.status === "rejected" ? (
                                                    <span className="text-xs text-red-600 font-medium">Rejected</span>
                                                ) : (
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRejectApplication(app._id)}
                                                            className="text-red-600 border-red-300 hover:bg-red-50 text-xs px-2 py-1"
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApproveApplication(app._id)}
                                                            className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                                                        >
                                                            Approve
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </SignedIn>
    );
}