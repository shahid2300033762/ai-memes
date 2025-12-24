import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface EditorProps {
  templateId: Id<"templates">;
  onBack: () => void;
}

export function Editor({ templateId, onBack }: EditorProps) {
  const template = useQuery(api.templates.getTemplate, { templateId });
  const generateCaption = useAction(api.ai.generateCaption);
  const createProject = useMutation(api.projects.createProject);

  const [prompt, setPrompt] = useState("");
  const [caption, setCaption] = useState("");
  const [tone, setTone] = useState<"funny" | "formal" | "casual" | "sarcastic" | "hinglish">("funny");
  const [isGenerating, setIsGenerating] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("2xl");
  const [animation, setAnimation] = useState("none");
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [textShadow, setTextShadow] = useState("strong");
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !template) return;

    setIsGenerating(true);
    try {
      const result = await generateCaption({
        prompt,
        category: template.category,
        tone,
      });
      setCaption(result.caption);
      if (result.backgroundImage) {
        setBackgroundImage(result.backgroundImage);
      }
      toast.success("Caption generated! 🎉");
    } catch (error) {
      toast.error("Failed to generate caption");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!caption.trim() || !template) {
      toast.error("Please add a caption first");
      return;
    }

    try {
      await createProject({
        templateId,
        title: prompt || "Untitled Project",
        caption,
        style: template.name,
        backgroundColor: backgroundColor || template.layout.backgroundColor,
        gradient: template.layout.gradient,
        textColor,
        fontSize,
        fontFamily: template.layout.fontFamily,
        animation,
        backgroundImage,
        textShadow,
        overlayOpacity,
        aiGenerated: true,
      });
      toast.success("Project saved! 💾");
    } catch (error) {
      toast.error("Failed to save project");
    }
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      
      const link = document.createElement("a");
      link.download = `meme-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success("Exported successfully! 📥");
    } catch (error) {
      toast.error("Failed to export");
    }
  };

  if (!template) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
      </div>
    );
  }

  const fontSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  };

  const animationClasses = {
    none: "",
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    float: "animate-float",
    glow: "animate-glow",
    zoomIn: "animate-zoom-in",
  };

  const textShadowStyles = {
    none: "none",
    light: "2px 2px 4px rgba(0,0,0,0.3)",
    strong: "3px 3px 6px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)",
    glow: "0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.4)",
    neon: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all hover:scale-105"
      >
        ← Back to Templates
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 animate-slide-in">
          <div className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-3xl">🤖</span> AI Caption Generator
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2 font-medium">What's your idea?</label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., College exams stress, Tech fest announcement..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-purple-200 mb-2 font-medium">Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {["funny", "formal", "casual", "sarcastic", "hinglish"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t as any)}
                      className={`px-3 py-2 rounded-lg font-medium capitalize transition-all transform hover:scale-105 ${
                        tone === t
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                          : "bg-white/10 text-purple-200 hover:bg-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating Magic...
                  </span>
                ) : (
                  "✨ Generate Caption & Image"
                )}
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-3xl">✏️</span> Customize
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2 font-medium">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Your caption will appear here..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Text Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                  >
                    <option value="sm">Small</option>
                    <option value="base">Base</option>
                    <option value="lg">Large</option>
                    <option value="xl">XL</option>
                    <option value="2xl">2XL</option>
                    <option value="3xl">3XL</option>
                    <option value="4xl">4XL</option>
                    <option value="5xl">5XL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-purple-200 mb-2 font-medium">Text Shadow</label>
                <select
                  value={textShadow}
                  onChange={(e) => setTextShadow(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                >
                  <option value="none">None</option>
                  <option value="light">Light</option>
                  <option value="strong">Strong</option>
                  <option value="glow">Glow</option>
                  <option value="neon">Neon</option>
                </select>
              </div>

              {template.type === "animated" && (
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">Animation</label>
                  <select
                    value={animation}
                    onChange={(e) => setAnimation(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                  >
                    <option value="none">None</option>
                    <option value="bounce">Bounce</option>
                    <option value="pulse">Pulse</option>
                    <option value="float">Float</option>
                    <option value="glow">Glow</option>
                    <option value="zoomIn">Zoom In</option>
                  </select>
                </div>
              )}

              {backgroundImage && (
                <div>
                  <label className="block text-purple-200 mb-2 font-medium">
                    Overlay Darkness: {Math.round(overlayOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-purple-200 mb-2 font-medium">Background Image URL (optional)</label>
                <input
                  type="text"
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  placeholder="Paste image URL or use AI generated"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  💾 Save Project
                </button>
                <button
                  onClick={handleExport}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  📥 Export PNG
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit animate-slide-in">
          <div className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-3xl">👁️</span> Live Preview
            </h3>
            
            <div
              ref={canvasRef}
              className="aspect-square rounded-xl flex items-center justify-center p-8 relative overflow-hidden shadow-2xl"
              style={{
                background: !backgroundImage 
                  ? (backgroundColor || template.layout.gradient || template.layout.backgroundColor)
                  : "transparent",
              }}
            >
              {backgroundImage && (
                <>
                  <img
                    src={backgroundImage}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onError={() => {
                      toast.error("Failed to load background image");
                      setBackgroundImage("");
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-black transition-opacity duration-300"
                    style={{ opacity: overlayOpacity }}
                  ></div>
                </>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"></div>
              
              {caption && (
                <p
                  className={`relative z-10 font-bold text-center break-words px-4 ${
                    fontSizeClasses[fontSize as keyof typeof fontSizeClasses]
                  } ${animationClasses[animation as keyof typeof animationClasses]}`}
                  style={{
                    color: textColor,
                    fontFamily: template.layout.fontFamily,
                    textShadow: textShadowStyles[textShadow as keyof typeof textShadowStyles],
                    WebkitTextStroke: textShadow === "strong" ? "1px rgba(0,0,0,0.5)" : "none",
                  }}
                >
                  {caption}
                </p>
              )}
              
              {!caption && (
                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-4 animate-float">🎨</div>
                  <p className="text-white/50 text-lg">
                    Your caption will appear here
                  </p>
                  <p className="text-white/30 text-sm mt-2">
                    Generate or type a caption to see the magic!
                  </p>
                </div>
              )}
            </div>

            {backgroundImage && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-purple-200 text-sm flex items-center gap-2">
                  <span>🖼️</span>
                  <span>Background image loaded successfully!</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
