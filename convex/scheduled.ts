import { internalAction, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Delete campaigns that have been expired for more than 7 days
export const deleteExpiredCampaigns = mutation({
  handler: async (ctx) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const campaignsToDelete = await ctx.db
      .query("campaigns")
      .withIndex("by_status", (q) => q.eq("status", "expired"))
      .filter((q) => q.lt(q.field("expiredAt"), sevenDaysAgo))
      .collect();

    for (const campaign of campaignsToDelete) {
      await ctx.db.delete(campaign._id);
    }

    return campaignsToDelete.length;
  },
});

// Run every hour to check for expired campaigns
export const checkCampaignExpiration = internalAction({
  handler: async (ctx) => {
    await ctx.runAction(internal.scheduled.checkCampaignExpiration);
    // await ctx.runMutation(internal.scheduled);
  },
});