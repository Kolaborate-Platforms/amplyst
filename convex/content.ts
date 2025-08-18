import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "./auth";

export const submitContent = mutation({
    args: {
        applicationId: v.id("applications"),
        contentUrl: v.string(),
        caption: v.string(),
        hashtags: v.string(),
        postDate: v.optional(v.string()), 
    },

    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const application = await ctx.db.get(args.applicationId);
        if (!application || application.influencerId !== userId) {
            throw new Error("Invalid application or user not authorized");
        }

        const contentSubmission = {
            applicationId: args.applicationId,
            influencerId: userId,
            contentUrl: args.contentUrl,
            caption: args.caption,
            hashtags: args.hashtags,
            postDate: args.postDate ? new Date(args.postDate).toISOString() : undefined,
            createdAt: new Date().toISOString(),
        };

        const insertedContent = await ctx.db.insert("submittedContent", contentSubmission);

        return insertedContent;
    }


})