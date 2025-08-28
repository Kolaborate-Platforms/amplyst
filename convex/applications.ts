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



export const getAllApplicationStatsByBrand = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    // Get all campaigns owned by this user
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_creatorUserId", q => q.eq("creatorUserId", user._id))
      .collect();

    // Get all applications for all campaigns
    const allApplications = await ctx.db
      .query("applications")
      .collect();

    // Filter applications that belong to user's campaigns and group by campaign
    const statsMap: Record<string, { total: number; approved: number; pending: number; rejected: number }> = {};
    
    // Initialize stats for all campaigns (even those with no applications)
    campaigns.forEach(campaign => {
      statsMap[campaign._id] = { total: 0, approved: 0, rejected: 0, pending: 0 };
    });

    // Count applications by campaign and status
    allApplications.forEach(app => {
      const campaignExists = campaigns.some(c => c._id === app.campaignId);
      if (campaignExists) {
        const campaignId = app.campaignId;
        if (!statsMap[campaignId]) {
          statsMap[campaignId] = { total: 0, approved: 0, rejected: 0, pending: 0 };
        }
        
        statsMap[campaignId].total++;
        if (app.status === "approved") {
          statsMap[campaignId].approved++;
        } else if (app.status === "rejected") {
          statsMap[campaignId].rejected++;
        } else {
          statsMap[campaignId].pending++;
        }
      }
    });

    return statsMap;
  }
});

export const getApplicationStatsByCampaign = query({
  args: { 
    campaignId: v.id("campaigns") 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get the user to verify they own the campaign
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    // Verify the user owns the campaign
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign || campaign.creatorUserId !== user._id) {
      throw new Error("Not authorized to view this campaign's applications");
    }

    // Get all applications for this campaign
    const applications = await ctx.db
      .query("applications")
      .filter(q => q.eq(q.field("campaignId"), args.campaignId))
      .collect();

    // Count by status
    const stats = applications.reduce((acc, app) => {
      acc.total++;
      if (app.status === "approved") {
        acc.approved++;
      } else if (app.status === "rejected") {
        acc.rejected++;
      } else {
        acc.pending++;
      }
      return acc;
    }, {
      total: 0,
      approved: 0,
      rejected: 0,
      pending: 0
    });

    return stats;
  }
});


// Enhanced version of listInfluencerApplications to include campaign data
export const listInfluencerApplicationsWithCampaignData = query({
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

    // Get all applications for this influencer
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_influencer", q => q.eq("influencerId", user._id))
      .collect();

    // Get campaign details for each application
    const applicationsWithCampaignData = await Promise.all(
      applications.map(async (application) => {
        const campaign = await ctx.db.get(application.campaignId);
        
        return {
          ...application,
          campaignEndDate: campaign?.endDate,
          campaignStartDate: campaign?.startDate,
          campaignStatus: campaign?.status,
        };
      })
    );

    return applicationsWithCampaignData;
  },
});

// New mutation to mark a campaign as started by influencer
export const startCampaignWork = mutation({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    // Get the application
    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");

    // Verify the user owns this application
    if (application.influencerId !== user._id) {
      throw new Error("Not authorized");
    }

    // Verify the application is approved
    if (application.status !== "approved") {
      throw new Error("Can only start work on approved applications");
    }

    // Get the campaign to check if it's not expired
    const campaign = await ctx.db.get(application.campaignId);
    if (!campaign) throw new Error("Campaign not found");

    // Check if campaign has expired
    if (campaign.endDate && new Date(campaign.endDate) < new Date()) {
      throw new Error("Cannot start work on expired campaign");
    }

    // Update the application to mark as started
    // await ctx.db.patch(args.applicationId, {
    //   startDate: true,
    //   workStartedAt: Date.now(),
    //   updatedAt: Date.now(),
    // });

    return true;
  },
});

// Enhanced withdraw application function
export const withdrawInfluencerApplication = mutation({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    // Get the application
    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");

    // Verify the user owns this application
    if (application.influencerId !== user._id) {
      throw new Error("Not authorized to withdraw this application");
    }

    // Get the campaign to check if it's not expired
    const campaign = await ctx.db.get(application.campaignId);
    if (!campaign) throw new Error("Campaign not found");

    // Check if campaign has expired
    if (campaign.endDate && new Date(campaign.endDate) < new Date()) {
      throw new Error("Cannot withdraw application for expired campaign");
    }

    // Can only withdraw pending applications
    if (application.status !== "pending") {
      throw new Error("Can only withdraw pending applications");
    }

    // Delete the application
    await ctx.db.delete(args.applicationId);

    return { success: true };
  },
});

// Function to check and update expired campaigns
export const markExpiredCampaigns = mutation({
  handler: async (ctx) => {
    const now = new Date().toISOString();
    
    // Find all active campaigns that have passed their end date
    const expiredCampaigns = await ctx.db
      .query("campaigns")
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "active"),
          q.lt(q.field("endDate"), now)
        )
      )
      .collect();

    // Mark campaigns as expired
    for (const campaign of expiredCampaigns) {
      await ctx.db.patch(campaign._id, {
        status: "expired",
      });
    }

    return expiredCampaigns.length;
  },
});

// Function to get application with campaign status check
export const getApplicationWithStatus = query({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (!application) return null;

    const campaign = await ctx.db.get(application.campaignId);
    if (!campaign) return application;

    // Check if campaign is expired
    const isExpired = campaign.endDate && new Date(campaign.endDate) < new Date();

    return {
      ...application,
      campaignEndDate: campaign.endDate,
      campaignStartDate: campaign.startDate,
      campaignStatus: campaign.status,
      isExpired: isExpired,
    };
  },
});

// Function to end campaign work (for when campaign expires while in progress)
export const endCampaignWork = mutation({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("User not found");

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");

    console.log("Applications", application)

    // Verify the user owns this application
    if (application.influencerId !== user._id) {
      throw new Error("Not authorized");
    }

    // Update the application to mark as ended
    // await ctx.db.patch(args.applicationId, {
    //   endDate: true,
    //   workEndedAt: Date.now(),
    //   updatedAt: Date.now(),
    // });

    return true;
  },
});