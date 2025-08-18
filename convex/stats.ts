// convex/stats.ts
import { query } from "./_generated/server";

export const getStats = query({
  handler: async (ctx) => {
    // Influencers count
    const influencers = await ctx.db
      .query("profiles")
      .filter(q => q.eq(q.field("role"), "influencer"))
      .collect();
    const influencerCount = influencers.length;

    // Campaigns count
    const campaigns = await ctx.db.query("campaigns").collect();
    const campaignsCount = campaigns.length;
    const avgRating = 4.8; 

    return {
      influencerCount,
      campaignsCount,
      avgRating,
    };
  }
});
