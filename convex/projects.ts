import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return projects;
  },
});

export const createProject = mutation({
  args: {
    templateId: v.id("templates"),
    title: v.string(),
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
    aiGenerated: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const projectId = await ctx.db.insert("projects", {
      userId,
      templateId: args.templateId,
      title: args.title,
      content: {
        caption: args.caption,
        style: args.style,
        backgroundColor: args.backgroundColor,
        gradient: args.gradient,
        textColor: args.textColor,
        fontSize: args.fontSize,
        fontFamily: args.fontFamily,
        animation: args.animation,
        backgroundImage: args.backgroundImage,
        textShadow: args.textShadow,
        overlayOpacity: args.overlayOpacity,
      },
      aiGenerated: args.aiGenerated,
    });

    return projectId;
  },
});

export const createGeneration = internalMutation({
  args: {
    prompt: v.string(),
    category: v.string(),
    tone: v.string(),
    generatedCaption: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("aiGenerations", {
      userId,
      prompt: args.prompt,
      category: args.category,
      tone: args.tone,
      generatedCaption: args.generatedCaption,
      language: args.language,
    });

    return null;
  },
});

export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== userId) {
      throw new Error("Project not found or unauthorized");
    }

    await ctx.db.delete(args.projectId);
    return null;
  },
});
