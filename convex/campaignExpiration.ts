import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

// Get all expired campaigns
export const getExpiredCampaigns = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("campaigns")
      .withIndex("by_status", (q) => q.eq("status", "expired"))
      .collect();
  },
}); 