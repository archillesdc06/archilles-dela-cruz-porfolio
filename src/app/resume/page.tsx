import React from "react";
import { type Metadata } from "next";
import { api, HydrateClient } from "~/trpc/server";
import ResumeClient from "./resume-client";

export const metadata: Metadata = {
  title: "Professional Resume | Archilles Dela Cruz",
  description: "View and print the professional resume of Archilles Dela Cruz, listing qualifications in software development, web development, IT, and office administration.",
};

export default async function ResumePage() {
  // Parallel fetch experience and achievements data
  const experiences = await api.portfolio.getExperiences();
  const achievements = await api.portfolio.getAchievements();

  return (
    <HydrateClient>
      <div className="py-16 md:py-24 print:py-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 print:px-0">
          
          {/* Header (Hidden when printing) */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 print:hidden">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Professional Resume
            </h1>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full mx-auto" />
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Interactive curriculum vitae. You can preview, print, or download this profile as a PDF.
            </p>
          </div>

          {/* Interactive Resume Sheet */}
          <ResumeClient experiences={experiences} achievements={achievements} />
          
        </div>
      </div>
    </HydrateClient>
  );
}
