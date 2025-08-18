"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Pencil, User, Mail, CheckCircle, TrendingUp, BarChart2, Users, Activity } from "lucide-react";

// Dummy data for the dashboard
const brandProfile = {
    name: "Acme Corp",
    email: "contact@acme.com",
    avatarUrl: "",
    description: "Leading brand in innovative products.",
};

const campaigns = [
    {
        id: 1,
        title: "Summer Launch",
        status: "Active",
        description: "Promote our new summer collection.",
        reach: 120000,
        engagement: 0.08,
        applications: 12,
    },
    {
        id: 2,
        title: "Back to School",
        status: "Active",
        description: "Engage students for our back to school offers.",
        reach: 95000,
        engagement: 0.12,
        applications: 8,
    },
];

const influencers = [
    {
        id: 1,
        name: "Jane Doe",
        avatarUrl: "",
        email: "jane@influencer.com",
        followers: 12000,
        niche: "Fashion",
    },
    {
        id: 2,
        name: "John Smith",
        avatarUrl: "",
        email: "john@influencer.com",
        followers: 8500,
        niche: "Tech",
    },
];

const applications = [
    {
        id: 1,
        influencer: {
            name: "Alice Johnson",
            avatarUrl: "",
            email: "alice@influencer.com",
        },
        campaign: "Summer Launch",
        status: "Pending",
    },
    {
        id: 2,
        influencer: {
            name: "Bob Lee",
            avatarUrl: "",
            email: "bob@influencer.com",
        },
        campaign: "Back to School",
        status: "Approved",
    },
];

const tabItems = [
    { label: "Overview", value: "overview", href: "/brand" },
    { label: "Influencers", value: "influencers", href: "/brand/influencers" },
    { label: "Campaigns", value: "campaigns", href: "/brand/campaigns" },
    { label: "Applications", value: "applications", href: "/brand/applications" },
];

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
    const [activeTab, setActiveTab] = useState("overview");

    // Calculate campaign insights
    const totalReach = campaigns.reduce((acc, c) => acc + (c.reach || 0), 0);
    const avgEngagement = campaigns.length
        ? (campaigns.reduce((acc, c) => acc + (c.engagement || 0), 0) / campaigns.length)
        : 0;
    const totalApplications = campaigns.reduce((acc, c) => acc + (c.applications || 0), 0);

    return (
        <div className="min-h-screen">
            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full flex justify-start gap-2 mb-8 bg-card/80 shadow-sm border border-border rounded-lg">
                    {tabItems.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            asChild
                            className={`
                                px-5 py-2 rounded-lg font-medium transition
                                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                                focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none
                                hover:bg-primary/5
                            `}
                            tabIndex={0}
                            aria-label={tab.label}
                        >
                            <Link href={tab.href} tabIndex={-1} className="outline-none">
                                <span className="flex items-center gap-2">
                                    {/* Optionally add icons here in the future */}
                                    {tab.label}
                                </span>
                            </Link>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    {/* Brand Profile Section */}
                    <Card className="mb-8 border-0 shadow-lg bg-gradient-to-tr from-primary/5 to-background">
                        <CardHeader className="flex flex-row items-center gap-6">
                            <Avatar className="w-20 h-20 bg-primary/10 text-primary">
                                {brandProfile.avatarUrl ? (
                                    <img src={brandProfile.avatarUrl} alt={brandProfile.name} />
                                ) : (
                                    <span className="text-3xl font-bold">
                                        {brandProfile.name[0]}
                                    </span>
                                )}
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-2xl font-bold text-primary">{brandProfile.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{brandProfile.email}</p>
                                <p className="text-sm mt-2 text-foreground/80">{brandProfile.description}</p>
                            </div>
                            <Button variant="outline" size="sm" className="ml-auto border-primary text-primary hover:bg-primary/10">
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
                            value={totalReach.toLocaleString()}
                            accent="border-l-4 border-primary"
                        />
                        <StatCard
                            icon={<TrendingUp className="h-6 w-6" />}
                            label="Avg. Engagement Rate"
                            value={avgEngagement ? `${(avgEngagement * 100).toFixed(1)}%` : "0%"}
                            accent="border-l-4 border-accent"
                        />
                        <StatCard
                            icon={<Users className="h-6 w-6" />}
                            label="Influencers"
                            value={influencers.length}
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
                                    {influencers.length === 0 ? (
                                        <div className="py-8 text-center text-muted-foreground">
                                            No influencers yet.
                                        </div>
                                    ) : (
                                        influencers.map((influencer) => (
                                            <div key={influencer.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/30 transition">
                                                <Avatar className="w-12 h-12 bg-secondary/30 text-secondary">
                                                    {influencer.avatarUrl ? (
                                                        <img src={influencer.avatarUrl} alt={influencer.name} />
                                                    ) : (
                                                        <span className="text-xl font-bold">
                                                            {influencer.name[0]}
                                                        </span>
                                                    )}
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-foreground">{influencer.name}</div>
                                                    <div className="text-xs text-muted-foreground">{influencer.email}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">Niche: {influencer.niche}</div>
                                                </div>
                                                <div className="ml-auto text-xs text-primary font-semibold">
                                                    {influencer.followers.toLocaleString()} followers
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
                                <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Campaign
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    {campaigns.length === 0 ? (
                                        <div className="py-8 text-center text-muted-foreground">
                                            No active campaigns yet.
                                        </div>
                                    ) : (
                                        campaigns.map((campaign) => (
                                            <div key={campaign.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/30 transition">
                                                <div className="flex-1">
                                                    <div className="font-medium text-foreground">{campaign.title}</div>
                                                    <div className="text-xs text-muted-foreground">{campaign.description}</div>
                                                    <div className="flex gap-4 mt-2">
                                                        <span className="text-xs text-primary font-semibold">
                                                            Reach: {campaign.reach.toLocaleString()}
                                                        </span>
                                                        <span className="text-xs text-accent font-semibold">
                                                            Engagement: {(campaign.engagement * 100).toFixed(1)}%
                                                        </span>
                                                        <span className="text-xs text-secondary font-semibold">
                                                            Applications: {campaign.applications}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${campaign.status === "Active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                                                    {campaign.status}
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
                                {applications.length === 0 ? (
                                    <div className="py-8 text-center text-muted-foreground">
                                        No applications yet.
                                    </div>
                                ) : (
                                    applications.map((app) => (
                                        <div key={app.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/30 transition border border-border">
                                            <Avatar className="w-10 h-10 bg-secondary/30 text-secondary">
                                                {app.influencer.avatarUrl ? (
                                                    <img src={app.influencer.avatarUrl} alt={app.influencer.name} />
                                                ) : (
                                                    <span className="text-lg font-bold">
                                                        {app.influencer.name[0]}
                                                    </span>
                                                )}
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-foreground">{app.influencer.name}</div>
                                                <div className="text-xs text-muted-foreground">{app.influencer.email}</div>
                                                <div className="text-xs text-muted-foreground mt-1">Campaign: {app.campaign}</div>
                                            </div>
                                            <div className="ml-auto flex items-center">
                                                {app.status === "Approved" ? (
                                                    <span className="flex items-center text-xs text-green-600 font-medium">
                                                        <CheckCircle className="mr-1 h-4 w-4" /> {app.status}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-yellow-600 font-medium">{app.status}</span>
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
                        {influencers.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No influencers yet.
                                </CardContent>
                            </Card>
                        ) : (
                            influencers.map((influencer) => (
                                <Card key={influencer.id} className="border-0 shadow-md hover:shadow-lg transition">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <Avatar className="w-12 h-12 bg-secondary/30 text-secondary">
                                            {influencer.avatarUrl ? (
                                                <img src={influencer.avatarUrl} alt={influencer.name} />
                                            ) : (
                                                <span className="text-xl font-bold">
                                                    {influencer.name[0]}
                                                </span>
                                            )}
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base text-foreground">{influencer.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{influencer.email}</p>
                                            <p className="text-xs mt-1 text-muted-foreground">Niche: {influencer.niche}</p>
                                            <p className="text-xs text-primary font-semibold">Followers: {influencer.followers.toLocaleString()}</p>
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
                        <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Campaign
                        </Button>
                    </div>
                    <div className="grid gap-4">
                        {campaigns.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No campaigns yet.
                                </CardContent>
                            </Card>
                        ) : (
                            campaigns.map((campaign) => (
                                <Card key={campaign.id} className="border-0 shadow-md hover:shadow-lg transition">
                                    <CardHeader>
                                        <CardTitle className="text-foreground">{campaign.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{campaign.description}</p>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-xs text-primary font-semibold">
                                                Reach: {campaign.reach.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-accent font-semibold">
                                                Engagement: {(campaign.engagement * 100).toFixed(1)}%
                                            </span>
                                            <span className="text-xs text-secondary font-semibold">
                                                Applications: {campaign.applications}
                                            </span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${campaign.status === "Active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                                            {campaign.status}
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
                        {applications.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No applications yet.
                                </CardContent>
                            </Card>
                        ) : (
                            applications.map((app) => (
                                <Card key={app.id} className="border-0 shadow-md hover:shadow-lg transition">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <Avatar className="w-10 h-10 bg-secondary/30 text-secondary">
                                            {app.influencer.avatarUrl ? (
                                                <img src={app.influencer.avatarUrl} alt={app.influencer.name} />
                                            ) : (
                                                <span className="text-lg font-bold">
                                                    {app.influencer.name[0]}
                                                </span>
                                            )}
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base text-foreground">{app.influencer.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{app.influencer.email}</p>
                                            <p className="text-xs mt-1 text-muted-foreground">Campaign: {app.campaign}</p>
                                        </div>
                                        <div className="ml-auto flex items-center">
                                            {app.status === "Approved" ? (
                                                <span className="flex items-center text-xs text-green-600 font-medium">
                                                    <CheckCircle className="mr-1 h-4 w-4" /> {app.status}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-yellow-600 font-medium">{app.status}</span>
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
    );
}
