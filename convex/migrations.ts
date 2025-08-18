import { mutation } from "./_generated/server";

export const migrateApplications = mutation({
  handler: async (ctx) => {
    const all = await ctx.db.query("applications").collect();
    let updated = 0;
    let errors = 0;

    for (const doc of all) {
      const updates: any = {};

      // Convert string timestamps to numbers
      if (typeof doc.createdAt === "string") {
        updates.createdAt = Date.parse(doc.createdAt);
      }
      if (typeof doc.updatedAt === "string") {
        updates.updatedAt = Date.parse(doc.updatedAt);
      }

      // Map old status to new status
      if ((doc.status as string) === "accepted") {
        updates.status = "approved";
      }

      if (Object.keys(updates).length > 0) {
        try {
          await ctx.db.patch(doc._id, updates);
          updated++;
        } catch (error) {
          console.error("Failed to update doc:", doc._id, error);
          errors++;
        }
      }
    }

    return { updated, errors, total: all.length };
  }
});