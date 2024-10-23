import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  plaidItems: defineTable({
    accessToken: v.string(),
    clerkUserId: v.string(),
    institutionId: v.string(),
    institutionName: v.string(),
    plaidId: v.string(),
    requestId: v.string(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_plaidId", ["plaidId"]),
  plaidAccounts: defineTable({
    itemId: v.id("plaidItems"),
    clerkUserId: v.string(),
    mask: v.string(),
    name: v.string(),
    plaidId: v.string(),
    subtype: v.string(),
    type: v.string(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_itemId", ["itemId"]),
});
