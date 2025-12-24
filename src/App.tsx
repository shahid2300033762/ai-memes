import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { TemplateGallery } from "./components/TemplateGallery";
import { Editor } from "./components/Editor";
import { ProjectGallery } from "./components/ProjectGallery";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  const [view, setView] = useState<"home" | "editor" | "projects">("home");
  const [selectedTemplateId, setSelectedTemplateId] = useState<Id<"templates"> | null>(null);
  const seedTemplates = useMutation(api.templates.seedTemplates);

  useEffect(() => {
    seedTemplates();
  }, []);

  const handleTemplateSelect = (templateId: Id<"templates">) => {
    setSelectedTemplateId(templateId);
    setView("editor");
  };

  const handleBackToHome = () => {
    setView("home");
    setSelectedTemplateId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="animated-bg"></div>
      
      {/* Floating particles effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-3xl transform group-hover:scale-110 transition-transform">🎨</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              MemeForge AI
            </h1>
            <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full">
              PRO
            </span>
          </div>
          
          <Authenticated>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setView("home")}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  view === "home"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                🎯 Templates
              </button>
              <button
                onClick={() => setView("projects")}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  view === "projects"
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                📁 My Projects
              </button>
              <SignOutButton />
            </div>
          </Authenticated>
        </div>
      </header>

      <main className="relative z-10">
        <Unauthenticated>
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
            <div className="w-full max-w-md animate-zoom-in">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-float">🚀</div>
                <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Create Viral Content
                </h2>
                <p className="text-xl text-purple-200 mb-2">
                  AI-powered memes, posters & social creatives
                </p>
                <p className="text-lg text-purple-300">
                  ✨ Professional • 🎨 Creative • ⚡ Instant
                </p>
              </div>
              <div className="glass-card rounded-2xl p-8 shadow-2xl">
                <SignInForm />
              </div>
            </div>
          </div>
        </Unauthenticated>

        <Authenticated>
          {view === "home" && <TemplateGallery onTemplateSelect={handleTemplateSelect} />}
          {view === "editor" && selectedTemplateId && (
            <Editor templateId={selectedTemplateId} onBack={handleBackToHome} />
          )}
          {view === "projects" && <ProjectGallery />}
        </Authenticated>
      </main>

      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
          },
        }}
      />
    </div>
  );
}
