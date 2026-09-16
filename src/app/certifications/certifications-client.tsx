"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  image: string;
  driveUrl: string;
}

interface CertificationsClientProps {
  initialCertifications: Certification[];
}

export default function CertificationsClient({
  initialCertifications,
}: CertificationsClientProps) {
  if (initialCertifications.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center shadow-xs">
        <Award className="h-12 w-12 mx-auto text-blue-500/50" />
        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          No certifications synced
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Certifications from Google Drive will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {initialCertifications.map((cert) => (
        <motion.article
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          key={cert.id}
          className="glass-panel flex flex-col h-full rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:scale-[1.01] transition-all duration-300 group"
        >
          <a
            href={cert.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full aspect-video bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 group-hover:opacity-95"
          >
            <Image src={cert.image} alt={cert.title} fill className="object-cover" />

            {cert.year && (
              <span className="absolute bottom-3 right-3 rounded-full bg-blue-600/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                {cert.year}
              </span>
            )}
          </a>

          <div className="flex-1 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {cert.title}
              </h3>

              {cert.issuer && (
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {cert.issuer}
                </p>
              )}

              {cert.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cert.description}
                </p>
              )}
            </div>

            <a
              href={cert.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Open in Google Drive</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.article>
      ))}
    </div>
  );
}