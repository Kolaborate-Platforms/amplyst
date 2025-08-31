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


export const createOrGetUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called createOrGetUser without authentication");
    }

 
    if (typeof identity.publicMetadata !== 'object' || identity.publicMetadata === null) {
      throw new Error("User identity public metadata is missing or malformed");
    }

    const publicMetadata = (identity.unsafeMetadata ?? identity.publicMetadata) as { role?: "influencer" | "brand" | "agency" };

    if (!publicMetadata.role) {
      throw new Error("User role is missing in public metadata");
    }

    const role = publicMetadata.role;

 
    console.log("createOrGetUser: Checking for existing user with tokenIdentifier:", identity.tokenIdentifier);
    const user = await ctx.db.query("users").withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();

    if (user) {
      console.log("createOrGetUser: User already exists, returning ID:", user._id);
      return user._id;
    }

    console.log("createOrGetUser: Creating new user with tokenIdentifier:", identity.tokenIdentifier);
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email!,
      role
    });

    return userId;
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
  ): Promise<{ role: "influencer" | "brand" | "agency"; exists: boolean } | null> => {
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








// export const insertProfile = mutation({
//   args: {
//     role: v.union(
//       v.literal("influencer"),
//       v.literal("brand"),
//       v.literal("agency"),
//     ),
//     name: v.string(),
//     bio: v.string(),
//     profilePictureUrl: v.optional(v.string()),
//     niche: v.string(),
//     location: v.string(),
//     followerCount: v.optional(v.string()),
//     socialAccounts: v.object({
//       instagram: v.string(),
//       tiktok: v.string(),
//       youtube: v.string(),
//       twitter: v.string(),
//     }),
//     portfolio: v.array(
//       v.object({
//         id: v.number(),
//         type: v.string(),
//         title: v.string(),
//         description: v.string(),
//         url: v.string(),
//         metrics: v.object({
//           username: v.string(),
//           followers: v.string(),
//           likes: v.string(),
//           following: v.string(),
//         }),
//       })
//     ),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new Error("Not authenticated");
//     }

//     // Check if user already exists
//     const existingUser = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
//       .unique();

//     console.log("Existing profile:", existingUser);

//     if (existingUser) {
//       // Update existing user with basic fields
//       await ctx.db.patch(existingUser._id, {
//         role: args.role,
//         email: identity.email!,
//       });

//       // Update or create profile
//       const existingProfile = await ctx.db
//         .query("profiles")
//         .withIndex("by_userId", (q) => q.eq("userId", existingUser._id))
//         .unique();

//       if (existingProfile) {
//         return await ctx.db.patch(existingProfile._id, {
//           role: args.role,
//           name: args.name,
//           bio: args.bio,
//           profilePictureUrl: args.profilePictureUrl,
//           niche: args.niche,
//           location: args.location,
//           followerCount: args.followerCount,
//           socialAccounts: args.socialAccounts,
//           portfolio: args.portfolio,
//         });
//       } else {
//         return await ctx.db.insert("profiles", {
//           userId: existingUser._id,
//           role: args.role,
//           name: args.name,
//           bio: args.bio,
//           profilePictureUrl: args.profilePictureUrl,
//           niche: args.niche,
//           location: args.location,
//           followerCount: args.followerCount,
//           socialAccounts: args.socialAccounts,
//           portfolio: args.portfolio,
//         });
//       }
//     } else {
//       // Create new user with basic fields
//       const userId = await ctx.db.insert("users", {
//         tokenIdentifier: identity.tokenIdentifier,
//         email: identity.email!,
//         role: args.role,
//       });

//       // Create new profile
//      const profileInserted =  await ctx.db.insert("profiles", {
//         userId,
//         role: args.role,
//         name: args.name,
//         bio: args.bio,
//         profilePictureUrl: args.profilePictureUrl,
//         niche: args.niche,
//         location: args.location,
//         followerCount: args.followerCount,
//         socialAccounts: args.socialAccounts,
//         portfolio: args.portfolio,
//       });

//       console.log("New profile inserted in users.ts:", profileInserted);

//       return profileInserted;
//     }
//   },
// });


// export const getCurrentUserWithProfile = query({
//   handler: async (ctx): Promise<{ user: Doc<"users">; profile: Doc<"profiles"> | null } | null> => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       return null;
//     }

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
//       .unique();

//     if (!user) {
//       return null;
//     }

//     const profile = await ctx.db
//       .query("profiles")
//       .withIndex("by_userId", (q) => q.eq("userId", user._id))
//       .unique();

//     return { user, profile };
//   },
// });