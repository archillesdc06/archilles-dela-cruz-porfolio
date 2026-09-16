import React from "react";
import { type Metadata } from "next";
import { api, HydrateClient } from "~/trpc/server";
import CertificationsClient from "./certifications-client";

export const metadata: Metadata = {
  title: "Certifications | Archilles Dela Cruz",
  description: "Browse the certifications, training, and recognition earned by Archilles Dela Cruz.",
};

export default async function CertificationsPage() {
  const certifications = await api.portfolio.getCertifications();

  return (
    <HydrateClient>
      <div className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Certifications
            </h1>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full mx-auto" />
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Certificates, trainings, and recognitions I have earned throughout my academic and professional journey.
            </p>
          </div>

          <CertificationsClient initialCertifications={certifications} />
        </div>
      </div>
    </HydrateClient>
  );
}