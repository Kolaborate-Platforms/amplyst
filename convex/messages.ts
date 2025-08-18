import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";

// Get all conversations for the current user
export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get all conversations and filter on the server side
    const allConversations = await ctx.db
      .query("conversations")
      .order("desc")
      .collect();

    const conversations = allConversations.filter(conv => 
      conv.participantIds.includes(userId)
    );

    // Get participant details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipantId = conversation.participantIds.find(id => id !== userId);
        const otherParticipant = otherParticipantId ? await ctx.db.get(otherParticipantId) : null;
        
        // Get unread message count
        const unreadCount = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
          .filter((q) => 
            q.neq(q.field("senderUserId"), userId)
          )
          .collect();

        return {
          ...conversation,
          otherParticipant,
          unreadCount: unreadCount.length,
        };
      })
    );

    return conversationsWithDetails;
  },
});

// Get messages for a specific conversation
export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify user is part of this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || (conversation.participantIds[0] !== userId && conversation.participantIds[1] !== userId)) {
      throw new Error("Not authorized to view this conversation");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();

    // Get sender details for each message
    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderUserId);
        return {
          ...message,
          sender,
        };
      })
    );

    return messagesWithSenders;
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    conversationId: v.optional(v.id("conversations")),
    recipientId: v.optional(v.id("users")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    let conversationId = args.conversationId;

    // If no conversation ID provided, create or find existing conversation
    if (!conversationId && args.recipientId) {
      // Check if conversation already exists between these users
      const allConversations = await ctx.db
        .query("conversations")
        .collect();

      const existingConversations = allConversations.filter(conv => 
        conv.participantIds.includes(userId) && conv.participantIds.includes(args.recipientId!)
      );

      if (existingConversations.length > 0) {
        conversationId = existingConversations[0]._id;
      } else {
        // Create new conversation
        conversationId = await ctx.db.insert("conversations", {
          participantIds: [userId, args.recipientId],
          lastMessageAt: Date.now(),
          lastMessage: args.content,
          lastMessageSenderId: userId,
        });
      }
    }

    if (!conversationId) {
      throw new Error("No conversation specified");
    }

    // Verify user is part of this conversation
    const conversation = await ctx.db.get(conversationId);
    if (!conversation || (conversation.participantIds[0] !== userId && conversation.participantIds[1] !== userId)) {
      throw new Error("Not authorized to send message to this conversation");
    }

    // Insert the message
    const messageId = await ctx.db.insert("messages", {
      conversationId,
      senderUserId: userId,
      content: args.content,
      sentAt: Date.now(),
      readBy: [userId], // Mark as read by sender
    });

    // Update conversation's last message info
    await ctx.db.patch(conversationId, {
      lastMessageAt: Date.now(),
      lastMessage: args.content,
      lastMessageSenderId: userId,
    });

    return messageId;
  },
});

// Mark messages as read
export const markMessagesAsRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify user is part of this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || (conversation.participantIds[0] !== userId && conversation.participantIds[1] !== userId)) {
      throw new Error("Not authorized");
    }

    // Get all unread messages in this conversation
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
      .filter((q) => 
        q.neq(q.field("senderUserId"), userId)
      )
      .collect();

    // Mark each message as read
    await Promise.all(
      unreadMessages.map(async (message) => {
        const currentReadBy = message.readBy || [];
        const isAlreadyRead = currentReadBy.some(id => id === userId);
        if (!isAlreadyRead) {
          await ctx.db.patch(message._id, {
            readBy: [...currentReadBy, userId],
          });
        }
      })
    );
  },
});

// Search users to start new conversations
export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    if (args.searchTerm.length < 2) {
      return [];
    }

    const allUsers = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("_id"), userId))
      .collect();

    // Filter users by search term on the server side
    const users = allUsers
      .filter(user => 
        (user.username && user.username.toLowerCase().includes(args.searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(args.searchTerm.toLowerCase()))
      )
      .slice(0, 10);

      console.log("Users in the messages api", users)

    return users;
  },
});
