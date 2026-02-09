'use client';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-mono mb-4">
            {'<projects />'}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Featured Work
          </h2>
          <p className="text-[#a3a3a3] max-w-2xl mx-auto">
            A showcase of projects that demonstrate my expertise in building secure, scalable solutions.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#525252] text-lg">Projects coming soon...</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div className="project-card group relative">
      <div
        className={`flex flex-col ${
          isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
        } gap-8 items-center p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] hover:border-indigo-500/30 transition-all duration-500`}
      >
        {/* Project Image/Preview */}
        <div className="relative w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 to-cyan-500/10">
          <div className="project-image absolute inset-0 flex items-center justify-center">
            {/* Placeholder gradient when no image */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-cyan-600/20" />
            
            {/* Mock app UI */}
            <div className="relative z-10 w-4/5 h-4/5 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-[#525252] font-mono ml-2">{project.title}</span>
              </div>
              {/* Content placeholder */}
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
                <div className="h-20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-lg mt-4" />
                <div className="flex gap-2 mt-4">
                  <div className="h-8 w-20 bg-indigo-500/20 rounded" />
                  <div className="h-8 w-20 bg-white/5 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors duration-500" />
        </div>

        {/* Project Info */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Project number */}
          <span className="text-7xl font-bold text-white/5 font-mono">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Title */}
          <h3 className="text-3xl font-bold text-white -mt-12">{project.title}</h3>

          {/* Description */}
          <p className="text-[#a3a3a3] leading-relaxed">{project.description}</p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-mono border border-indigo-500/20"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full btn-primary text-white text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full btn-glass text-white text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            )}
            {!project.liveUrl && !project.githubUrl && (
              <span className="text-[#525252] text-sm font-mono">Coming soon...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
