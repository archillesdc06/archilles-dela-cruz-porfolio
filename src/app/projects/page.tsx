import React from "react";
import { type Metadata } from "next";
import { api, HydrateClient } from "~/trpc/server";
import ProjectsClient from "./projects-client";

export const metadata: Metadata = {
  title: "Projects Portfolio | Archilles Dela Cruz",
  description: "Browse the software development and IT projects of Archilles Dela Cruz, including Phone Accessories Multi-Branching Management, Teachers Evaluator, and BAC Office Tracking systems.",
};

export default async function ProjectsPage() {
  // Fetch projects from the tRPC router
  const projects = await api.portfolio.getProjects();

  return (
    <HydrateClient>
      <div className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Projects Portfolio
            </h1>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full mx-auto" />
            <p className="text-lg text-slate-600 dark:text-slate-400">
              A gallery of web applications, database tools, and branch management systems that I have built and collaborated on.
            </p>
          </div>

          {/* Interactive Client Projects filtering and grid */}
          <ProjectsClient initialProjects={projects} />
          
        </div>
      </div>
    </HydrateClient>
  );
}
