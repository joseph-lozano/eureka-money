import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  plaidItems: defineTable({
    externalUserId: v.string(),
    accessToken: v.string(),
    itemId: v.string(),
    requestId: v.string(),
  })
    .index("by_externalUserId", ["externalUserId"])
    .index("by_itemId", ["itemId"]),
});
