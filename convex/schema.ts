import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define potential statuses for an email
const emailStatus = v.union(
  v.literal("draft"),
  v.literal("scheduled"),
  v.literal("sending"), 
  v.literal("sent"),
  v.literal("failed")
);

const applicationTables = {
  users: defineTable({
    tokenIdentifier:v.optional(v.string()), // Identifier from auth provider
    email: v.string(),                 // User's email address
    username: v.optional(v.string()),  // User's chosen username
    passwordHash: v.optional(v.string()), // Hashed password (never store plain passwords!)
    // firstName: v.optional(v.string()), // Optional first name
    // lastName: v.optional(v.string()),  // Optional last name
    role: v.union(
      v.literal("influencer"),
      v.literal("brand"),
      v.literal("agency")
    ),
  })
  .index("by_token", ["tokenIdentifier"]) 
  .index("by_email", ["email"]),  


  profiles : defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("influencer"),
      v.literal("brand"),
      v.literal("agency")
    ),
    name: v.string(),
    handle: v.optional(v.string()), // <-- Add this
    verified: v.optional(v.boolean()), // <-- Add this
    profilePictureUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    niche: v.optional(v.string()),
    location: v.optional(v.string()),
    followerCount: v.optional(v.string()),
    engagementRate: v.optional(v.number()),
    socialAccounts: v.optional(
      v.object({
        instagram: v.string(),
        tiktok: v.string(),
        youtube: v.string(),
        twitter: v.string(),
      })
    ),
    portfolio: v.optional(v.array(v.any())),
    primaryPlatform: v.optional(v.array(v.string())),
    recentPost: v.optional(v.string()), // <-- Add this
    price: v.optional(v.string()), // <-- Add this
    rating: v.optional(v.number()), // <-- Add this
    // Brand/agency-specific fields
    companyName: v.optional(v.string()),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    description: v.optional(v.string()),
    contactPerson: v.optional(v.string()),
    businessEmail: v.optional(v.string()),
    campaignGoal: v.optional(v.string()),
    targetAudience: v.optional(v.string()),
    influencerType: v.optional(v.array(v.string())),
    influencerNiche: v.optional(v.array(v.string())),
    budgetRange: v.optional(v.string()),
    contentType: v.optional(v.array(v.string())),
    campaignDescription: v.optional(v.string()),
    campaignCount: v.optional(v.number()),
    activeCampaigns: v.optional(v.array(v.id("campaigns"))),
    totalBudget: v.optional(v.number()),
    totalEarnings: v.optional(v.number()),
  })
  .index("by_userId", ["userId"]),
  
  campaigns : defineTable({
    creatorUserId: v.id("users"), // Brand or agency user
    role: v.union(
      v.literal("influencer"),
      v.literal("brand"),
      v.literal("agency")
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
    duration: v.optional(v.string()),
    platform: v.optional(v.string()), // e.g., "instagram", "tiktok"
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    requirements: v.optional(v.string()),
    niche: v.optional(v.string()),
    expiredAt: v.optional(v.string()), // When the campaign was marked as expired
    workStartedAt: v.optional(v.number()),
    workEndedAt: v.optional(v.number()),
    // Add more campaign fields as needed
  }).index("by_creatorUserId", ["creatorUserId"])
    .index("by_status", ["status"])
    .index("by_expired", ["expiredAt"]),

  applications: defineTable({
    campaignId: v.id("campaigns"),
    influencerId: v.id("users"),
    brandId: v.optional(v.id("brands")),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    message: v.optional(v.string()),
    proposedContent: v.optional(v.string()),
    influencerName: v.optional(v.string()),
    influencerEmail: v.optional(v.string()),
    influencerNiche: v.optional(v.string()),
    campaignTitle: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_campaign", ["campaignId"])
    .index("by_influencer", ["influencerId"])
    .index("by_brand", ["brandId"]),

  // Messaging
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderUserId: v.id("users"),
    content: v.string(),
    sentAt: v.number(),
    readBy: v.optional(v.array(v.id("users"))),
  }).index("by_conversationId", ["conversationId"])
    .index("by_sentAt", ["sentAt"]),


  conversations: defineTable({
    participantIds: v.array(v.id("users")),
    lastMessageAt: v.number(),
    lastMessage: v.optional(v.string()),
    lastMessageSenderId: v.optional(v.id("users")),
    })
      .index("by_participant", ["participantIds"])
      .index("by_lastMessageAt", ["lastMessageAt"]),

  // Analytics
  analytics : defineTable({
    campaignId: v.id("campaigns"),
    influencerId: v.id("users"),
    platform: v.string(),
    impressions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    likes: v.optional(v.number()),
    comments: v.optional(v.number()),
    shares: v.optional(v.number()),
    conversions: v.optional(v.number()),
    engagementRate: v.optional(v.number()),
    fetchedAt: v.string(),
  }).index("by_campaignId", ["campaignId"]),

  // Payments
  payments : defineTable({
    campaignId: v.id("campaigns"),
    influencerId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    status: v.string(), // "pending", "paid", "failed"
    paidAt: v.optional(v.string()),
    method: v.optional(v.string()),
  }).index("by_influencerId", ["influencerId"]),

  //brands
  brands: defineTable({
    userId: v.id("users"),
    companyName: v.string(),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    description: v.optional(v.string()),
    contactPerson: v.optional(v.string()),
    businessEmail: v.optional(v.string()),
    location: v.optional(v.string()),
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
    influencerCollaborations: v.optional(v.array(v.id("profiles"))),
    totalReach: v.optional(v.number()),
    reachChange: v.optional(v.number()),
    totalSpent: v.optional(v.number()),
    avgEngagement: v.optional(v.number()),
    engagementChange: v.optional(v.number())
  }).index("by_userId", ["userId"]),

  submittedContent: defineTable({
    applicationId: v.id("applications"),
    influencerId: v.id("users"),
    contentUrl: v.string(),
    caption: v.string(),
    hashtags: v.string(),
    postDate: v.optional(v.string()),
    createdAt: v.string(), 
  }),

};

  export default defineSchema({
    ...applicationTables
  });
