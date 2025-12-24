import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ProjectGallery() {
  const projects = useQuery(api.projects.listProjects);
  const deleteProject = useMutation(api.projects.deleteProject);

  const handleDelete = async (projectId: any) => {
    try {
      await deleteProject({ projectId });
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  if (projects === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-zoom-in">
        <div className="text-6xl mb-4 animate-float">📁</div>
        <h2 className="text-3xl font-bold text-white mb-4">No projects yet</h2>
        <p className="text-xl text-purple-200">Create your first masterpiece!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 animate-slide-in">
        <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          My Projects
        </h2>
        <p className="text-xl text-purple-200">Your creative collection 🎨</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div 
            key={project._id} 
            className="glass-card rounded-2xl p-6 group hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-slide-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className="aspect-square rounded-xl mb-4 flex items-center justify-center p-6 relative overflow-hidden shadow-lg"
              style={{
                background: !project.content.backgroundImage 
                  ? (project.content.gradient || project.content.backgroundColor)
                  : "transparent",
              }}
            >
              {project.content.backgroundImage && (
                <>
                  <img
                    src={project.content.backgroundImage}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div 
                    className="absolute inset-0 bg-black"
                    style={{ opacity: project.content.overlayOpacity || 0.5 }}
                  ></div>
                </>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
              
              <p
                className="relative z-10 text-center font-bold break-words"
                style={{
                  color: project.content.textColor,
                  fontSize: project.content.fontSize === "4xl" ? "2rem" : 
                           project.content.fontSize === "3xl" ? "1.75rem" :
                           project.content.fontSize === "2xl" ? "1.5rem" : "1.25rem",
                  fontFamily: project.content.fontFamily,
                  textShadow: project.content.textShadow === "strong"
                    ? "3px 3px 6px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)"
                    : project.content.textShadow === "glow"
                    ? "0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)"
                    : "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {project.content.caption}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white truncate">{project.title}</h3>
              <div className="flex items-center justify-between text-sm">
                <p className="text-purple-200">
                  {new Date(project._creationTime).toLocaleDateString()}
                </p>
                {project.aiGenerated && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                    ✨ AI Generated
                  </span>
                )}
              </div>

              <button
                onClick={() => handleDelete(project._id)}
                className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all transform hover:scale-105"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
