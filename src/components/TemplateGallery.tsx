import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface TemplateGalleryProps {
  onTemplateSelect: (templateId: Id<"templates">) => void;
}

export function TemplateGallery({ onTemplateSelect }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const templates = useQuery(api.templates.listTemplates, {
    category: selectedCategory as any,
  });

  const categories = [
    { id: "all", name: "All", icon: "🎯" },
    { id: "meme", name: "Memes", icon: "😂" },
    { id: "event", name: "Events", icon: "🎉" },
    { id: "announcement", name: "Announcements", icon: "📢" },
    { id: "club", name: "Clubs", icon: "🎪" },
    { id: "social", name: "Social", icon: "📱" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-white mb-4">
          Choose Your Canvas
        </h2>
        <p className="text-xl text-purple-200">
          Select a template and let AI do the magic ✨
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/50"
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {templates === undefined ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template._id}
              onClick={() => onTemplateSelect(template._id)}
              className="group cursor-pointer"
            >
              <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30">
                <div
                  className="aspect-square rounded-xl mb-4 flex items-center justify-center text-6xl relative overflow-hidden"
                  style={{
                    background: template.layout.gradient || template.layout.backgroundColor,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  <span className="relative z-10 transform group-hover:scale-110 transition-transform">
                    {template.thumbnail}
                  </span>
                  {template.type === "animated" && (
                    <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Animated
                    </div>
                  )}
                  {template.isPopular && (
                    <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      🔥 Popular
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                <p className="text-purple-200 text-sm capitalize">{template.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
