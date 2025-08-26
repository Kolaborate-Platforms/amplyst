import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "./auth";

// List all applications for a brand
export const listApplications = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get the user's brand profile
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user || user.role !== "brand") {
      return [];
    }

    // Get the brand profile
    const brandProfile = await ctx.db
      .query("brands")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (!brandProfile) {
      return [];
    }

    // Get all applications for the brand's campaigns
    const applications = await ctx.db
      .query("applications")
      .filter((q) => q.eq(q.field("brandId"), brandProfile._id))
      .collect();

      // console.log("Applications in applications.ts", applications)

    // Get additional details for each application
    const applicationsWithDetails = await Promise.all(
      applications.map(async (application) => {
        const campaign = await ctx.db.get(application.campaignId);
        const influencer = await ctx.db.get(application.influencerId);
        if (!influencer) {
          return application;
        }
        const influencerProfile = await ctx.db
          .query("profiles")
          .filter((q) => q.eq(q.field("userId"), influencer._id))
          .first();

        return {
          ...application,
          campaignTitle: campaign?.title,
          influencerName: influencerProfile?.name,
          influencerEmail: influencer.email,
          influencerNiche: influencerProfile?.niche,
        };
      })
    );

    return applicationsWithDetails;
  },
});

// Create a new application
export const createApplication = mutation({
  args: {
    campaignId: v.id("campaigns"),
    message: v.string(),
    proposedContent: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user's profile
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user || user.role !== "influencer") {
      throw new Error("Not authorized");
    }

    // Get the campaign
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Get the brand profile
    const brandProfile = await ctx.db
      .query("brands")
      .filter((q) => q.eq(q.field("userId"), campaign.creatorUserId))
      .first();

    if (!brandProfile) {
      throw new Error("Brand profile not found");
    }

    // Get the influencer profile
    const influencerProfile = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (!influencerProfile) {
      throw new Error("Influencer profile not found");
    }

    // Create the application
    const applicationId = await ctx.db.insert("applications", {
      campaignId: args.campaignId,
      influencerId: user._id,
      brandId: brandProfile._id,
      status: "pending",
      message: args.message,
      proposedContent: args.proposedContent,
      influencerName: influencerProfile.name,
      influencerEmail: user.email,
      influencerNiche: influencerProfile.niche || "",
      campaignTitle: campaign.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return applicationId;
  },
});

// Update an application's status
export const updateApplication = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user's brand profile
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user || user.role !== "brand") {
      throw new Error("Not authorized");
    }

    // Get the application
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Verify the brand owns the campaign
    const brandProfile = await ctx.db
      .query("brands")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (!brandProfile || application.brandId !== brandProfile._id) {
      throw new Error("Not authorized to update this application");
    }

    // Update the application
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.applicationId;
  },
});

// List all applications for an influencer
export const listInfluencerApplications = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Get the user first
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user || user.role !== "influencer") {
      return [];
    }

    return await ctx.db
      .query("applications")
      .withIndex("by_influencer", q => q.eq("influencerId", user._id))
      .collect();
  },
}); 

export const listApprovedApplicationsForInfluencer = query(async (ctx) => {
    const influencerId = await getAuthUserId(ctx);
  if (!influencerId) return [];


  const approvedApps = await ctx.db.query("applications")
  .withIndex("by_influencer", (q) => q.eq("influencerId", influencerId))
  .filter(q => q.eq(q.field("status"), "approved"))
  .collect();

  if (approvedApps.length === 0) return [];

  const campaignIds = approvedApps.map(app => app.campaignId);

  const campaigns = await ctx.db.query("campaigns")
    .filter(q => q.or(...campaignIds.map(id => q.eq(q.field("_id"), id))))
    .collect();

  return approvedApps.map(app => {
    const campaign = campaigns.find(c => c._id === (app.campaignId));
    return {
      applicationId: app._id,
      campaign,
      contentTypes: campaign?.contentTypes ?? [],
    };
  });
});

export const getApplicationsByCampaign = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Ensure user is the creator of this campaign
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user || user._id !== campaign.creatorUserId) {
      throw new Error("Unauthorized to view applications for this campaign");
    }

    // Fetch applications for this campaign
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    console.log("Applications in getApplicationsByCampaign function", applications)

    return applications;
  },
});


export const getApplicationStatsByCampaign = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { pending: 0, approved: 0, rejected: 0 };

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) return { pending: 0, approved: 0, rejected: 0 };

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user || user._id !== campaign.creatorUserId) {
      throw new Error("Unauthorized to view application stats for this campaign");
    }

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    
console.log("applications in getApplicationStatsByCampaign", applications)
    const stats = { pending: 0, approved: 0, rejected: 0 };
    for (const app of applications) {
      stats[app.status] += 1;
    }

    return stats;
  },
});


export const getCampaignWithApplications = query({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) return null;

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    console.log("applications in getCampaignWithApplications function", applications)

    return { ...campaign, applications };
  },
});

export const withdrawApplication = mutation({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user's profile
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user || user.role !== "influencer") {
      throw new Error("Not authorized");
    }

    // Get the application
    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Verify the user owns this application
    if (application.influencerId !== user._id) {
      throw new Error("Not authorized to withdraw this application");
    }

    // Delete the application
    await ctx.db.delete(args.applicationId);

    return { success: true };
  },
});


export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      // v.literal("withdrawn")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    // Check authorization based on user role and action
    if (user.role === "influencer" && application.influencerId !== user._id) {
      throw new Error("Not authorized to modify this application");
    }

    if (user.role === "brand") {
      const brandProfile = await ctx.db
        .query("brands")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();

      if (!brandProfile || application.brandId !== brandProfile._id) {
        throw new Error("Not authorized to modify this application");
      }
    }

    // Update the application
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return args.applicationId;
  },
});