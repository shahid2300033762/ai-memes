import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  templates: defineTable({
    name: v.string(),
    category: v.union(
      v.literal("meme"),
      v.literal("event"),
      v.literal("announcement"),
      v.literal("club"),
      v.literal("social")
    ),
    type: v.union(v.literal("static"), v.literal("animated")),
    thumbnail: v.string(),
    layout: v.object({
      backgroundColor: v.string(),
      gradient: v.optional(v.string()),
      textPosition: v.string(),
      fontSize: v.string(),
      fontFamily: v.string(),
    }),
    isPopular: v.boolean(),
  }).index("by_category", ["category"]),

  projects: defineTable({
    userId: v.id("users"),
    templateId: v.id("templates"),
    title: v.string(),
    content: v.object({
      caption: v.string(),
      style: v.string(),
      backgroundColor: v.string(),
      gradient: v.optional(v.string()),
      textColor: v.string(),
      fontSize: v.string(),
      fontFamily: v.string(),
      animation: v.optional(v.string()),
      backgroundImage: v.optional(v.string()),
      textShadow: v.optional(v.string()),
      overlayOpacity: v.optional(v.number()),
    }),
    aiGenerated: v.boolean(),
    exportFormat: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  aiGenerations: defineTable({
    userId: v.id("users"),
    prompt: v.string(),
    category: v.string(),
    tone: v.string(),
    generatedCaption: v.string(),
    language: v.string(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
