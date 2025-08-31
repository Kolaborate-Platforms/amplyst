import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

  export const createCampaign = mutation({
      args: {
        role: v.union(
          v.literal("influencer"),
          v.literal("brand"),
          v.literal("agency"),
        ),
        title: v.string(),
        description: v.string(),
        budget: v.optional(v.number()),
        status: v.union(
          v.literal("draft"),
          v.literal("active"),
          v.literal("completed"),
          v.literal("archived"),
          v.literal("expired")
        ),
        targetAudience: v.optional(v.string()),
        contentTypes: v.optional(v.array(v.string())),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        duration: v.optional(v.string()),
        requirements: v.optional(v.string()),
      },
      handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        console.log("Creating campaign with args:", args);

        if (!identity) throw new Error("Not authenticated");

        let user = await ctx.db
          .query("users")
          .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
          .unique();
       

         // 3. If user doesn't exist, create them
        if (!user) {
          const newUserId = await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier,
            email: identity.email!,
            role: args.role,
          });

          console.log("New user created in campaign with ID:", newUserId);

          user = await ctx.db.get(newUserId);
          if (!user) {
            throw new Error("Failed to retrieve newly created user");
          }
        }

       // if (!user) throw new Error("User not found");

        return await ctx.db.insert("campaigns", {
          creatorUserId: user._id,
          ...args,
        });
      },
    });

  export const listMyCampaigns = query({
    args: {
      includeExpired: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
      // Wait a bit for auth to be established
      const identity = await ctx.auth.getUserIdentity();
      
      if (!identity) {
        console.log("No identity found - user may not be authenticated");
        throw new Error("Authentication required to fetch campaigns");
      }

      console.log("Identity found:", identity.tokenIdentifier);

      // Find the user with better error handling
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();

      if (!user) {
        console.log("User not found for token:", identity.tokenIdentifier);
        // This might indicate the user hasn't completed registration
        throw new Error("User profile not found. Please complete your registration.");
      }

      console.log("User found:", user._id);

      try {
        const campaigns = await ctx.db
          .query("campaigns")
          .withIndex("by_creatorUserId", (q) => q.eq("creatorUserId", user._id))
          .filter((q) => 
            args.includeExpired 
              ? q.eq(q.field("status"), q.field("status")) // Always true
              : q.neq(q.field("status"), "expired")
          )
          .collect();

        console.log(`Found ${campaigns.length} campaigns for user ${user._id}`);
        return campaigns;
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        throw new Error("Failed to fetch campaigns");
      }
    },
  });

  export const getCampaignDetails = query({
    args: { campaignId: v.id("campaigns") },
    handler: async (ctx, args): Promise<Doc<"campaigns"> | null> => {
      return await ctx.db.get(args.campaignId);
    },
  });

  export const allCampaigns = query({
    handler: async (ctx) => {
      return await ctx.db.query("campaigns").collect();
    }
  });

  export const allCampaignsWithCreators = query({
    handler: async (ctx) => {
      const campaigns = await ctx.db.query("campaigns").collect();
      
      // Get creator details for each campaign
      const campaignsWithCreators = await Promise.all(
        campaigns.map(async (campaign) => {
          // Get the creator's profile
          const creatorProfile = await ctx.db
            .query("profiles")
            .withIndex("by_userId", (q) => q.eq("userId", campaign.creatorUserId))
            .first();
          
          // Get the creator's user info as fallback
          const creatorUser = await ctx.db.get(campaign.creatorUserId);
          
          return {
            ...campaign,
            creatorName: creatorProfile?.name ||  creatorUser?.username || "Unknown Creator",
            // creatorHandle: creatorProfile?.handle,
            // creatorVerified: creatorProfile?.verified,
            creatorProfilePicture: creatorProfile?.profilePictureUrl,
          };
        })
      );
      
      return campaignsWithCreators;
    }
  });


  export const getCampaignById = query({
    args: { campaignId: v.id("campaigns") },
    handler: async (ctx, args): Promise<Doc<"campaigns"> | null> => {
      return await ctx.db.get(args.campaignId);
    },
  });

  export const campaignsForInfluencer = query({
    handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) return [];
      // Assuming you have a campaignApplications table:
      const applications = await ctx.db.query("applications")
        .withIndex("by_influencer", q => q.eq("influencerId", userId))
        .collect();
      const campaignIds = applications.map(app => app.campaignId);
      if (campaignIds.length === 0) {
        return []; // No campaign IDs, so no campaigns to return
      }
      return await ctx.db.query("campaigns")
        .filter(q => q.or(...campaignIds.map(id => q.eq(q.field("_id"), id))))
        .collect();
    }
  });


  export const activeForInfluencer = query({
    handler: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) return [];
      // Fetch applications where this influencer is 'active' (customize status as needed)
      const activeApplications = await ctx.db
        .query("applications")
        .withIndex("by_influencer", q => q.eq("influencerId", userId))
        .filter(q => q.eq(q.field("status"), "approved")) // Using approved as per schema
        .collect();
        
      const campaignIds = activeApplications.map(app => app.campaignId);
      if (campaignIds.length === 0) return [];
      // Fetch campaign details for these IDs
      return await ctx.db
        .query("campaigns")
        .filter(q => q.or(...campaignIds.map(id => q.eq(q.field("_id"), id))))
        .collect();
    }
  });

  export const getTotalApplicationsForMyCampaigns = query({
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return 0;
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!user) return 0;

      const myCampaigns = await ctx.db
        .query("campaigns")
        .withIndex("by_creatorUserId", q => q.eq("creatorUserId", user._id))
        .collect();

      let totalApplications = 0;
      for (const campaign of myCampaigns) {
        const applications = await ctx.db
          .query("applications")
          .filter(q => q.eq(q.field("campaignId"), campaign._id))
          .collect();
        totalApplications += applications.length;
      }
      return totalApplications;
    }
  });

  export const campaignsByNiche = query({
    args: { niche: v.string() },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("campaigns")
        .filter(q => q.eq(q.field("targetAudience"), args.niche))
        .collect();
    }
  });

  export const withdrawApplication = mutation({
    args: {
      campaignId: v.id("campaigns"),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Find influencer user
      const influencer = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!influencer) throw new Error("User not found");

      // Find the application
      const application = await ctx.db
        .query("applications")
        .filter(q => 
          q.and(
            q.eq(q.field("campaignId"), args.campaignId),
            q.eq(q.field("influencerId"), influencer._id)
          )
        )
        .first();

      if (!application) throw new Error("No application found for this campaign");

      // Delete the application
      await ctx.db.delete(application._id);
      return true;
    }
  });

  export const applyToCampaign = mutation({
    args: {
      campaignId: v.id("campaigns"),
      pitch: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Find influencer user
      const influencer = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!influencer) throw new Error("User not found");

      // Check for existing application
      const existing = await ctx.db
        .query("applications")
        .filter(q => 
          q.and(
            q.eq(q.field("campaignId"), args.campaignId),
            q.eq(q.field("influencerId"), influencer._id)
          )
        )
        .first();

      if (existing) {
        // If there's an existing application, update it instead of creating a new one
        await ctx.db.patch(existing._id, {
          message: args.pitch || "",
          status: "pending",
          updatedAt: Date.now(),
        });
        return existing._id;
      }

      // Get the campaign to get the creator user ID
      const campaign = await ctx.db.get(args.campaignId);
      if (!campaign) throw new Error("Campaign not found");
      
      // Get the brand associated with the creator user
      const brand = await ctx.db
        .query("brands")
        .withIndex("by_userId", q => q.eq("userId", campaign.creatorUserId))
        .unique();
      if (!brand) throw new Error("Brand not found for this campaign");
      
      // Create new application
      return await ctx.db.insert("applications", {
        campaignId: args.campaignId,
        brandId: brand._id,
        influencerId: influencer._id,
        status: "pending",
        message: args.pitch || "",
        influencerNiche: "",
        proposedContent: "",
        influencerName: influencer.username || influencer.email || "",
        influencerEmail: influencer.email || "",
        campaignTitle: campaign.title || "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  });

  export const updateApplicationStatus = mutation({
    args: {
      applicationId: v.id("applications"),
      status: v.string(),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Find the application
      const application = await ctx.db.get(args.applicationId);
      if (!application) throw new Error("Application not found");

      // Get the campaign to verify ownership
      const campaign = await ctx.db.get(application.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      // Verify the user owns the campaign
      const brand = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!brand || brand._id !== campaign.creatorUserId) {
        throw new Error("Not authorized to update this application");
      }

      // Update the application status
      await ctx.db.patch(args.applicationId, {
        status: args.status as "pending" | "approved" | "rejected",
        updatedAt: Date.now(),
      });

      return true;
    },
  });

// In your convex/campaign.ts file, add these mutations:


export const updateCampaignStatus = mutation({
  args: { 
    campaignId: v.id("campaigns"),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("completed"), v.literal("archived"), v.literal("expired"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) throw new Error("Campaign not found");
    
    await ctx.db.patch(args.campaignId, { status: args.status });
  },
});


  export const updateCampaign = mutation({
    args: {
      campaignId: v.id("campaigns"),
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      budget: v.optional(v.number()),
      status: v.optional(v.union(
        v.literal("draft"),
        v.literal("active"),
        v.literal("completed"),
        v.literal("archived"),
        v.literal("expired")
      )),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      targetAudience: v.optional(v.string()),
      niche: v.optional(v.string()),
      contentTypes: v.optional(v.array(v.string())),
      duration: v.optional(v.string()),
      requirements: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Get the campaign
      const campaign = await ctx.db.get(args.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      // Verify the user owns the campaign
      const brand = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!brand || brand._id !== campaign.creatorUserId) {
        throw new Error("Not authorized to update this campaign");
      }

      // Remove campaignId from args before updating
      const { campaignId, ...updateData } = args;

      // Update the campaign
      await ctx.db.patch(args.campaignId, updateData);
      return true;
    },
  });



  export const extendCampaign = mutation({
    args: {
      campaignId: v.id("campaigns"),
      newEndDate: v.string(),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Get the campaign
      const campaign = await ctx.db.get(args.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      // Verify the user owns the campaign
      const brand = await ctx.db
        .query("users")
        .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      if (!brand || brand._id !== campaign.creatorUserId) {
        throw new Error("Not authorized to extend this campaign");
      }

      // Update the campaign end date
      await ctx.db.patch(args.campaignId, {
        endDate: args.newEndDate,
      });
      return true;
    },
  });

export const deleteCampaign = mutation({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) throw new Error("Campaign not found");
    
    // Only allow deletion of expired campaigns
    if (campaign.status !== "expired") {
      throw new Error("Only expired campaigns can be deleted");
    }
    
    await ctx.db.delete(args.campaignId);
  },
});

  // Check for expired campaigns and mark them as expired
  export const checkExpiredCampaigns = mutation({
    handler: async (ctx) => {
      const now = new Date().toISOString();
      
      // Find all active campaigns that have passed their end date
      const expiredCampaigns = await ctx.db
        .query("campaigns")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .filter((q) => q.lt(q.field("endDate"), now))
        .collect();

      // Mark campaigns as expired
      for (const campaign of expiredCampaigns) {
        await ctx.db.patch(campaign._id, {
          status: "expired",
          expiredAt: now
        });
      }

      return expiredCampaigns.length;
    },
  });

  // Delete campaigns that have been expired for more than 7 days
  export const deleteExpiredCampaigns = mutation({
    handler: async (ctx) => {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      // Find all expired campaigns that have been expired for more than 7 days
      const campaignsToDelete = await ctx.db
        .query("campaigns")
        .withIndex("by_status", (q) => q.eq("status", "expired"))
        .filter((q) => q.lt(q.field("expiredAt"), sevenDaysAgo))
        .collect();

      // Delete the campaigns
      for (const campaign of campaignsToDelete) {
        await ctx.db.delete(campaign._id);
      }

      return campaignsToDelete.length;
    },
  });

  export const campaignsByBrand = query({
    args: { brandUserId: v.id("users") },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("campaigns")
        .withIndex("by_creatorUserId", q => q.eq("creatorUserId", args.brandUserId))
        .collect();
    }
  });
