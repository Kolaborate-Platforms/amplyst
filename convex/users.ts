import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";


export const getMyProfile = query({
  handler: async (ctx): Promise<Doc<"profiles"> | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    return profile;
  },
});

export const getUserByToken = query({
  args: {
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    return user;
  },
});




export const getCurrentUserWithProfile = query({
  handler: async (ctx): Promise<{ user: Doc<"users">; profile: Doc<"profiles"> | null } | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    return { user, profile };
  },
});


export const insertProfile = mutation({
  args: {
    role: v.union(
      v.literal("influencer"),
      v.literal("brand"),
      v.literal("agency"),
    ),
    name: v.string(),
    bio: v.string(),
    profilePictureUrl: v.optional(v.string()),
    niche: v.string(),
    location: v.string(),
    followerCount: v.optional(v.string()),
    socialAccounts: v.object({
      instagram: v.string(),
      tiktok: v.string(),
      youtube: v.string(),
      twitter: v.string(),
    }),
    portfolio: v.array(
      v.object({
        id: v.number(),
        type: v.string(),
        title: v.string(),
        description: v.string(),
        url: v.string(),
        metrics: v.object({
          username: v.string(),
          followers: v.string(),
          likes: v.string(),
          following: v.string(),
        }),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existingUser) {
      // Update existing user basics
      await ctx.db.patch(existingUser._id, {
        role: args.role,
        email: identity.email!,
      });

      // Check for existing profile
      const existingProfile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", existingUser._id))
        .unique();

      if (existingProfile) {
        // Update profile: spread all args and keep userId
        return await ctx.db.patch(existingProfile._id, {
          userId: existingUser._id,
          ...args,
        });
      } else {
        // Insert new profile with all fields and userId
        return await ctx.db.insert("profiles", {
          userId: existingUser._id,
          ...args,
        });
      }
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        tokenIdentifier: identity.tokenIdentifier,
        email: identity.email!,
        role: args.role,
      });

      // Insert new profile with all fields
      const profileInserted = await ctx.db.insert("profiles", {
        userId,
        ...args,
      });

      console.log("New profile inserted in users.ts:", profileInserted);

      return profileInserted;
    }
  },
});




// export const createOrGetUser = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new Error("Called createOrGetUser without authentication");
//     }

//     // Try to get metadata from both possible locations
//     const metadata = (identity.unsafeMetadata || identity.publicMetadata || {}) as {
//       role?: "influencer" | "brand" | "agency"
//     };

//     // Check if user already exists first - they might have completed onboarding
//     console.log("createOrGetUser: Checking for existing user with tokenIdentifier:", identity.tokenIdentifier);
//     const existingUser = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
//       .unique();

//     if (existingUser) {
//       console.log("createOrGetUser: User already exists, returning ID:", existingUser._id);
//       return existingUser._id;
//     }

//     // Only require role if creating a new user
//     if (!metadata.role) {
//       throw new Error("User role is missing in metadata. Please complete the sign-up process.");
//     }

//     const role = metadata.role;

//     console.log("createOrGetUser: Creating new user with tokenIdentifier:", identity.tokenIdentifier);
//     const userId = await ctx.db.insert("users", {
//       tokenIdentifier: identity.tokenIdentifier,
//       email: identity.email!,
//       role
//     });

//     return userId;
//   },
// });


export const createOrGetUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called createOrGetUser without authentication");
    }

    const metadata = (identity.unsafeMetadata || identity.publicMetadata || {}) as {
      role?: "influencer" | "brand" | "agency"
    };

    console.log("createOrGetUser: Checking for existing user with tokenIdentifier:", identity.tokenIdentifier);
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existingUser) {
      console.log("createOrGetUser: User already exists, returning ID:", existingUser._id);
      return existingUser._id;
    }

    // ✅ Use "pending" as default role for new users
    const role = metadata.role || "pending";

    console.log("createOrGetUser: Creating new user with role:", role);
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email!,
      role: role as "influencer" | "brand" | "agency" | "pending"
    });

    return userId;
  },
});

export const createProfile = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("influencer"),
      v.literal("brand"),
      v.literal("agency"),
    ),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingProfile) {
      // Update existing profile
      return await ctx.db.patch(existingProfile._id, {
        role: args.role,
        name: args.name,
      });
    }

    // Create new profile with minimal fields
    return await ctx.db.insert("profiles", {
      userId: args.userId,
      role: args.role,
      name: args.name,
      bio: "",
      niche: "",
      location: "",
      socialAccounts: {
        instagram: "",
        tiktok: "",
        youtube: "",
        twitter: "",
      },
      portfolio: [],
    });
  },
});


export const getInfluencerProfile = query({
  args: { userId: v.optional(v.id("profiles")) },
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db.get(args.userId);
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) return null;

    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .unique();
  }
});

export const getMyRole = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    return user?.role ?? null;
  }
});

export const hasCompletedOnboarding = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return false;
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .unique();
    return !!profile;
  }
});

export const checkInfluencerProfile = mutation({
  args: { identifier: v.string() },
  handler: async (ctx, { identifier }) => {

    const user = await ctx.db
      .query("users")
      .filter(q =>
        q.or(
          q.eq(q.field("username"), identifier),
          q.eq(q.field("email"), identifier)
        )
      )
      .unique();
    if (!user) return false;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", user._id))
      .unique();

    return !!profile;
  }
});

export const getUserByIdentifier = query({
  args: { identifier: v.string() },
  handler: async (ctx, { identifier }) => {
    const user = await ctx.db
      .query("users")
      .filter(q =>
        q.or(
          q.eq(q.field("username"), identifier),
          q.eq(q.field("email"), identifier)
        )
      )
      .unique();
    return user;
  }
});

export const getUserRoleByIdentifier = action({
  args: { identifier: v.string() },
  handler: async (
    ctx,
    { identifier }
  ): Promise<{ role: "influencer" | "brand" | "agency" | "pending"; exists: boolean } | null> => {
    const user = await ctx.runQuery(api.users.getUserByIdentifier, { identifier });
    if (!user) return null;
    return { role: user.role, exists: true };
  },
});

export const getInfluencerProfileById = query({
  args: { userId: v.id("profiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  }
});






