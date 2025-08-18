// convex/brands.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";



export const insertBrandProfile = mutation({
  args: {
    companyName: v.string(),
    industry: v.string(),
    website: v.optional(v.string()),
    businessEmail: v.string(),
    contactPerson: v.string(),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    companySize: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    campaignGoal: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    influencerType: v.optional(v.string()),
    influencerNiche: v.optional(v.string()),
    budgetRange: v.optional(v.string()),
    contentType: v.optional(v.string()),
    campaignDescription: v.optional(v.string()),
    campaignCount: v.optional(v.number()),
    activeCampaigns: v.optional(v.array(v.id("campaigns"))),
    totalBudget: v.optional(v.number()),
    influencerCollaborations: v.optional(v.array(v.id("profiles")))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Find or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
    if (!user) {
      const newUserId = await ctx.db.insert("users", {
        tokenIdentifier: identity.tokenIdentifier,
        email: identity.email!,
        role: "brand",
      });
      user = await ctx.db.get(newUserId);
      if (!user) throw new Error("Failed to create user");
    }

    const existing = await ctx.db
      .query("brands")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args });
      return existing._id;
    } else {
      return await ctx.db.insert("brands", {
        userId: user._id,
        ...args,
      });
    }
  },
});

export const getMyBrandProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return null;

    return await ctx.db
      .query("brands")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
  },
});

export const updateBrandProfile = mutation({
  args: {
    companyName: v.string(),
    industry: v.string(),
    contactPerson: v.string(),
    businessEmail: v.string(),
    location: v.string(),
    campaignGoal: v.string(),
    targetAudience: v.string(),
    budgetRange: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()), 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }
    const brandProfile = await ctx.db
      .query("brands")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    console.log("Brand profile", brandProfile)

    if (!brandProfile) {
      const newProfileId = await ctx.db.insert("brands", {
        userId: user._id as Id<"users">,
        companyName: args.companyName,
        industry: args.industry,
        contactPerson: args.contactPerson,
        businessEmail: args.businessEmail,
        location: args.location,
        campaignGoal: args.campaignGoal,
        targetAudience: args.targetAudience,
        budgetRange: args.budgetRange,
        description: args.description,
      });
      return newProfileId;
    }

    // Update existing profile
    await ctx.db.patch(brandProfile._id, {
      companyName: args.companyName,
      industry: args.industry,
      contactPerson: args.contactPerson,
      businessEmail: args.businessEmail,
      location: args.location,
      campaignGoal: args.campaignGoal,
      targetAudience: args.targetAudience,
      budgetRange: args.budgetRange,
      description: args.description,
    });

    return brandProfile._id;
  },
});

export const listBrands = query({
  handler: async (ctx) => {
    return await ctx.db.query("brands").collect();
  }
});

export const countBrands = query({
  handler: async (ctx) => {
    const brands = await ctx.db.query("brands").collect();
    return brands.length;
  },
});