import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { internal } from "./_generated/api";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const generateCaption = action({
  args: {
    prompt: v.string(),
    category: v.string(),
    tone: v.union(
      v.literal("funny"),
      v.literal("formal"),
      v.literal("casual"),
      v.literal("sarcastic"),
      v.literal("hinglish")
    ),
  },
  handler: async (ctx, args) => {
    const systemPrompts = {
      funny: "You are a witty meme creator. Generate short, punchy, and hilarious captions.",
      formal: "You are a professional content creator. Generate formal and polished captions.",
      casual: "You are a friendly content creator. Generate casual and relatable captions.",
      sarcastic: "You are a sarcastic content creator. Generate witty and sarcastic captions.",
      hinglish: "You are a Hinglish content creator. Mix Hindi and English naturally for relatable captions.",
    };

    const categoryContext = {
      meme: "for a meme that will make people laugh",
      event: "for a college event or fest announcement",
      announcement: "for an important announcement or notice",
      club: "for a college club or society promotion",
      social: "for a social media post",
    };

    const userPrompt = `Create a caption ${categoryContext[args.category as keyof typeof categoryContext] || "for a creative post"} about: ${args.prompt}. Keep it under 100 characters. Make it catchy and engaging.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompts[args.tone] },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 100,
    });

    const generatedCaption = response.choices[0].message.content || "Caption generation failed";

    // Fetch background image from Unsplash
    let backgroundImage = "";
    try {
      const searchQuery = args.prompt.split(" ").slice(0, 3).join(" ");
      const unsplashUrl = `https://source.unsplash.com/800x800/?${encodeURIComponent(searchQuery)}`;
      backgroundImage = unsplashUrl;
    } catch (error) {
      console.log("Using default background");
    }

    await ctx.runMutation(internal.projects.createGeneration, {
      prompt: args.prompt,
      category: args.category,
      tone: args.tone,
      generatedCaption,
      language: args.tone === "hinglish" ? "hinglish" : "english",
    });

    return { caption: generatedCaption, backgroundImage };
  },
});

export const saveGeneration = action({
  args: {
    prompt: v.string(),
    category: v.string(),
    tone: v.string(),
    generatedCaption: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.runMutation(internal.projects.createGeneration, {
      prompt: args.prompt,
      category: args.category,
      tone: args.tone,
      generatedCaption: args.generatedCaption,
      language: args.language,
    });

    return null;
  },
});
