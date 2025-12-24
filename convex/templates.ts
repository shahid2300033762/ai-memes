import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listTemplates = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("meme"),
        v.literal("event"),
        v.literal("announcement"),
        v.literal("club"),
        v.literal("social"),
        v.literal("all")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.category && args.category !== "all") {
      const validCategory = args.category as "meme" | "event" | "announcement" | "club" | "social";
      return await ctx.db
        .query("templates")
        .withIndex("by_category", (q) => q.eq("category", validCategory))
        .collect();
    }
    return await ctx.db.query("templates").collect();
  },
});

export const getTemplate = query({
  args: { templateId: v.id("templates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.templateId);
  },
});

export const seedTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const existingTemplates = await ctx.db.query("templates").collect();
    if (existingTemplates.length > 0) {
      return { message: "Templates already seeded" };
    }

    const templates = [
      {
        name: "Classic Meme",
        category: "meme" as const,
        type: "static" as const,
        thumbnail: "🎭",
        layout: {
          backgroundColor: "#ffffff",
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          textPosition: "center",
          fontSize: "2xl",
          fontFamily: "Impact",
        },
        isPopular: true,
      },
      {
        name: "Event Poster",
        category: "event" as const,
        type: "animated" as const,
        thumbnail: "🎉",
        layout: {
          backgroundColor: "#1a1a2e",
          gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          textPosition: "top",
          fontSize: "3xl",
          fontFamily: "Poppins",
        },
        isPopular: true,
      },
      {
        name: "Announcement",
        category: "announcement" as const,
        type: "static" as const,
        thumbnail: "📢",
        layout: {
          backgroundColor: "#0f172a",
          gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          textPosition: "center",
          fontSize: "xl",
          fontFamily: "Inter",
        },
        isPopular: false,
      },
      {
        name: "Club Promo",
        category: "club" as const,
        type: "animated" as const,
        thumbnail: "🎪",
        layout: {
          backgroundColor: "#1e293b",
          gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          textPosition: "bottom",
          fontSize: "2xl",
          fontFamily: "Montserrat",
        },
        isPopular: true,
      },
      {
        name: "Social Post",
        category: "social" as const,
        type: "static" as const,
        thumbnail: "📱",
        layout: {
          backgroundColor: "#ffffff",
          gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          textPosition: "center",
          fontSize: "xl",
          fontFamily: "Roboto",
        },
        isPopular: false,
      },
      {
        name: "Dank Meme",
        category: "meme" as const,
        type: "animated" as const,
        thumbnail: "😎",
        layout: {
          backgroundColor: "#000000",
          gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
          textPosition: "center",
          fontSize: "3xl",
          fontFamily: "Impact",
        },
        isPopular: true,
      },
    ];

    for (const template of templates) {
      await ctx.db.insert("templates", template);
    }

    return { message: "Templates seeded successfully" };
  },
});
