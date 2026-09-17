"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Sparkles, Star, GitBranch } from "lucide-react";
import { Github } from "~/components/brand-icons";
import ProjectVisuals from "~/components/project-screenshots";

interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  screenshots?: string[];
  techStack: string;
  liveUrl: string | null;
  githubUrl: string | null;
  category: string;
  featured: boolean;
  stars?: number;
  language?: string;
  lastUpdated?: string;
  source?: "static" | "github";
}

interface ProjectsClientProps {
  initialProjects: Project[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = [
    { key: "all", label: "All Projects" },
    { key: "system", label: "Systems & Desktop" },
    { key: "web", label: "Web Applications" },
  ];

  const filteredProjects = activeFilter === "all"
    ? initialProjects
    : initialProjects.filter(p => p.category === activeFilter);

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveFilter(cat.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold tracking-wide shadow-xs transition-all duration-300 focus:outline-hidden ${
              activeFilter === cat.key
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Projects */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.article
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              key={project.id}
              className="glass-panel relative flex flex-col h-full rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 group"
            >
              {project.featured && (
                <div className="absolute top-4 right-4 flex items-center space-x-1 rounded-full bg-blue-600/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white shadow-xs z-10">
                  <Sparkles className="h-3 w-3" />
                  <span>Featured</span>
                </div>
              )}

              <ProjectVisuals
                image={project.image}
                screenshots={project.screenshots}
                projectName={project.name}
              >
                {/* Card Body */}
                <div className="flex-1 p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="inline-block rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 uppercase tracking-wider dark:bg-blue-950/40 dark:text-blue-400">
                      {project.category === "system" ? "Systems / Desktop" : "Web System"}
                    </span>
                    
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                    
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.split(",").map((tech) => (
                        <span 
                          key={tech.trim()} 
                          className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    {/* GitHub Metadata */}
                    {project.source === "github" && (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        {project.language && (
                          <span className="inline-flex items-center space-x-1">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                            <span>{project.language}</span>
                          </span>
                        )}
                        {typeof project.stars === "number" && (
                          <span className="inline-flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>{project.stars}</span>
                          </span>
                        )}
                        {project.lastUpdated && (
                          <span className="inline-flex items-center space-x-1">
                            <GitBranch className="h-3 w-3" />
                            <span>{new Date(project.lastUpdated).toLocaleDateString()}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-sm font-semibold">
                      {project.liveUrl ? (
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-1"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 text-xs font-normal italic">
                          Local Deployment Only
                        </span>
                      )}

                      {project.githubUrl ? (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white inline-flex items-center space-x-1.5"
                        >
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 text-xs font-normal">
                          Private Repository
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ProjectVisuals>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
