import { v } from "convex/values";
import { getManyFrom } from "convex-helpers/server/relationships";
import { mutation, query } from "./_generated/server";

export const createPlaidItem = mutation({
  args: {
    clerkUserId: v.string(),
    item: v.object({
      plaidId: v.string(),
      accessToken: v.string(),
      requestId: v.string(),
      institutionId: v.string(),
      institutionName: v.string(),
    }),
    accounts: v.array(v.object({
      plaidId: v.string(),
      mask: v.string(),
      name: v.string(),
      subtype: v.string(),
      type: v.string(),
    })),
  },
  handler: async (ctx, { item, accounts, clerkUserId }) => {
    const itemId = await ctx.db.insert("plaidItems", { ...item, clerkUserId });
    for (const account of accounts) {
      await ctx.db.insert("plaidAccounts", { ...account, clerkUserId, itemId });
    }
  },
});

export const getPlaidItem = query({
  args: {
    clerkUserId: v.string(),
    itemId: v.string(),
  },
  handler: async ({ db }, { clerkUserId, itemId }) => {
    const id = db.normalizeId("plaidItems", itemId);
    if (!id)
      return null;
    const item = await db.get(id);
    if (item?.clerkUserId !== clerkUserId) {
      return null;
    }
    return item;
  },
});

export const getPlaidItems = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async ({ db }, { clerkUserId }) => {
    const items = await getManyFrom(db, "plaidItems", "by_clerkUserId", clerkUserId);
    return Promise.all(items.map(async (item) => {
      const accounts = await getManyFrom(db, "plaidAccounts", "by_itemId", item._id);
      return { ...item, accounts };
    }));
  },
});
