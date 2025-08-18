// convex/influencers.ts
import { query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

export const filterInfluencers = query({
  args: {
    niche: v.optional(v.string()),
    minFollowers: v.optional(v.number()),
    maxFollowers: v.optional(v.number()),
    location: v.optional(v.string()),
    minEngagement: v.optional(v.number()),
    maxEngagement: v.optional(v.number()),
    search: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    sortOrder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Start with base query for profiles with role "influencer"
    let influencersQuery = ctx.db.query("profiles").filter(q => q.eq(q.field("role"), "influencer"));

    if (args.niche) {
      influencersQuery = influencersQuery.filter(q => 
        q.eq(q.field("niche"), args.niche)
      );
    }

    if (args.location) {
      influencersQuery = influencersQuery.filter(q => 
        q.eq(q.field("location"), args.location)
      );
    }

    if (args.minFollowers !== undefined) {
      influencersQuery = influencersQuery.filter(q => 
        q.gte(q.field("followerCount"), args.minFollowers!)
      );
    }

    if (args.maxFollowers !== undefined) {
      influencersQuery = influencersQuery.filter(q => 
        q.lte(q.field("followerCount"), args.maxFollowers!)
      );
    }

    //  all influencers
    const influencers = await influencersQuery.collect();

    // Apply search filter in memory
    let filteredInfluencers = influencers;
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      filteredInfluencers = filteredInfluencers.filter(influencer => 
        influencer.name?.toLowerCase().includes(searchLower) ||
        influencer.bio?.toLowerCase().includes(searchLower)
      );
    }

    // Apply engagement rate filter in memory since it's a computed value
    filteredInfluencers = filteredInfluencers.filter(influencer => {
      const engagementRate = influencer.engagementRate || 0;
      const matchesMinEngagement = !args.minEngagement || engagementRate >= args.minEngagement;
      const matchesMaxEngagement = !args.maxEngagement || engagementRate <= args.maxEngagement;
      return matchesMinEngagement && matchesMaxEngagement;
    });

    if (args.sortBy) {
      filteredInfluencers.sort((a, b) => {
        const aValue = a[args.sortBy as keyof typeof a] || 0;
        const bValue = b[args.sortBy as keyof typeof b] || 0;
        const multiplier = args.sortOrder === "desc" ? -1 : 1;
        return (Number(aValue) - Number(bValue)) * multiplier;
      });
    }

    return filteredInfluencers;
  },
});


export const listInfluencers = query({
      args: {}, 
      handler: async (ctx) => {
        const influencers = await ctx.db
          .query("profiles")
          .filter((q) => q.eq(q.field("role"), "influencer"))
          .collect();

        return influencers;
      },
});

export const getInfluencerProfileByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const [profile] = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("role"), "influencer"))
      .collect();

    console.log("Profile in influencers.ts", [profile])
    return profile ?? null;
  },
});

// In your Convex functions
export const getInfluencerProfileById = query({
  args: {
    profileId: v.id("profiles"), // or whatever table your influencers are in
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    console.log("profile in influencer function", profile)
    return profile ?? null;
  },
});