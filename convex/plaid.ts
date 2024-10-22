import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createPlaidItem = mutation({
  args: {
    externalUserId: v.string(),
    accessToken: v.string(),
    itemId: v.string(),
    requestId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("plaidItems", args);
  },
});
