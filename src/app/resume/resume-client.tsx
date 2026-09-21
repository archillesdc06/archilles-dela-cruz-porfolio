"use client";

import React from "react";
import { Printer, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Github } from "~/components/brand-icons";

interface Experience {
  id: number;
  role: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string;
  highlights: string[];
}

interface Achievement {
  id: number;
  title: string;
  issuer: string;
  date: string;
  category: string;
  description: string | null;
  link?: string;
}

interface ResumeClientProps {
  experiences: Experience[];
  achievements: Achievement[];
}

export default function ResumeClient({ experiences, achievements }: ResumeClientProps) {
  const handlePrint = () => {
    window.print();
  };



  return (
    <div className="space-y-8 print:space-y-0 print:p-0">
      
      {/* Action Buttons (Hidden when printing) */}
      <div className="flex flex-wrap justify-center gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Export PDF</span>
        </button>
        
        <a
          href="mailto:archillesdelacruzemail@gmail.com?subject=Inquiry regarding Resume"
          className="flex items-center space-x-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
        >
          <Mail className="h-4 w-4" />
          <span>Email Inquiry</span>
        </a>
      </div>

      {/* Main Resume Sheet */}
      <div className="mx-auto max-w-5xl rounded-2xl shadow-md p-8 sm:p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 print-sheet print:border-none print:shadow-none print:bg-white print:text-black print:dark:text-black print:p-0">
        
        {/* Resume Header */}
        <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 print:border-slate-300">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white print:text-black print:text-3xl">
            ARCHILLES D. DELA CRUZ
          </h1>
          <p className="text-base font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase mt-1 print:text-slate-600">
            Software Developer
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 print:grid-cols-12 print:gap-10">
          
          {/* LEFT COLUMN */}
          <div className="md:col-span-5 print:col-span-5 space-y-8">
            
            {/* Personal Profile */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider border-b border-blue-500 pb-1 print:text-black print:border-slate-400">
                Personal Profile
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify print:text-slate-700">
                A motivated Software Developer with hands-on experience gained through personal projects and a 2-month virtual assistant role involving software development tasks, demonstrating strong understanding of development workflows, coding fundamentals, and system support, with the ability to quickly learn, adapt, and deliver functional and user-focused applications.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider border-b border-blue-500 pb-1 print:text-black print:border-slate-400">
                Contact Details
              </h2>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">
                <div className="flex items-start space-x-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400 print:text-slate-600 mt-0.5 shrink-0" />
                  <span>Mobile: 0975 077 3561</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400 print:text-slate-600 mt-0.5 shrink-0" />
                  <a href="mailto:archillesdelacruzemail@gmail.com" className="hover:underline">
                    archillesdelacruzemail@gmail.com
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <Github className="h-3.5 w-3.5 text-slate-400 print:text-slate-600 mt-0.5 shrink-0" />
                  <a href="https://github.com/archillesdc06" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    github.com/archillesdc06
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 print:text-slate-600 mt-0.5 shrink-0" />
                  <span>Philippines</span>
                </div>
              </div>
            </div>

            {/* Academic Profile */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider border-b border-blue-500 pb-1 print:text-black print:border-slate-400">
                Academic Profile
              </h2>
              <div className="space-y-4 text-xs">
                {/* SEAT */}
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white print:text-black">
                    South East Asian Institute of Technology Inc
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 print:text-slate-600 italic">
                    Bachelor of Science in Information Technology Major in Business Analytics - Class of 2025
                  </p>
                  <ul className="list-disc pl-4 text-slate-600 dark:text-slate-400 space-y-0.5 print:text-slate-700">
                    <li>Business Manager Officer (3rd Year College)</li>
                    <li>Dean&apos;s Lister</li>
                  </ul>
                </div>
                {/* DNHS */}
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-900 dark:text-white print:text-black">
                    Dadiangas North High School
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 print:text-slate-600">
                    Graduated Class of 2019
                  </p>
                </div>
                {/* JPLES */}
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-900 dark:text-white print:text-black">
                    Jose P Laurel Elementary School
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 print:text-slate-600">
                    Graduated Class of 2016
                  </p>
                </div>
              </div>
            </div>

            {/* Skills & Abilities */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider border-b border-blue-500 pb-1 print:text-black print:border-slate-400">
                Skills and Abilities
              </h2>
              
              {/* Technical Skills */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 print:text-black uppercase tracking-wide">
                  Technical Skills
                </h3>
<ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-0.5 print:text-slate-700">
                  <li>Web Developer (Full-Stack Web Application Development)</li>
                  <li>Next.js &amp; React Development</li>
                  <li>T3 Full Stack (Next.js, tRPC, Prisma, Tailwind CSS)</li>
                  <li>TypeScript &amp; JavaScript</li>
                  <li>PHP (Web Development)</li>
                  <li>MYSQL / Database Management</li>
                  <li>HTML5, CSS3</li>
                  <li>Basic CRUD System Development</li>
                  <li>System Development using PHP (custom web applications)</li>
                  <li>Basic API Integration</li>
                  <li>File Handling &amp; Data Management</li>
                  <li>Microsoft Office (Word, Excel) for documentation and reporting</li>
                </ul>
              </div>

              {/* Office / Support Skills */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 print:text-black uppercase tracking-wide">
                  Office / Support Skills
                </h3>
                <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-0.5 print:text-slate-700">
                  <li>Document Management and Archiving</li>
                  <li>Data Encoding and Record Keeping</li>
                  <li>Administrative Support</li>
                  <li>File Scanning and Digital Conversion</li>
                  <li>Workflows and Document Processing (BAC/OBO experience)</li>
                </ul>
              </div>

              {/* Development Skills */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 print:text-black uppercase tracking-wide">
                  Development Skills
                </h3>
                <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-0.5 print:text-slate-700">
                  <li>Web Application Development</li>
                  <li>Debugging and Troubleshooting</li>
                  <li>System Documentation</li>
                  <li>Basic Software Testing</li>
                  <li>Version Control</li>
                </ul>
              </div>
            </div>

            {/* Contact Reference */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider border-b border-blue-500 pb-1 print:text-black print:border-slate-400">
                Contact Reference
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white print:text-black">
                    Irish Tenioso De Luna
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 print:text-slate-600">
                    Administrative Aide II - OBO Gensan
                  </p>
                  <p className="font-medium text-slate-600 dark:text-slate-400 print:text-slate-700">
                    09973212722
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white print:text-black">
                    Emmanuel C Awayan
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 print:text-slate-600">
                    Division Chief - Office of the Building Official
                  </p>
                  <p className="font-medium text-slate-600 dark:text-slate-400 print:text-slate-700">
                    09235556878
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white print:text-black">
                    Angelica Carino
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 print:text-slate-600">
                    SEO Manager
                  </p>
                  <p className="font-medium text-slate-600 dark:text-slate-400 print:text-slate-700">
                    anjphillipcarino@gmail.com
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-7 print:col-span-7 space-y-8">
            
            {/* Projects Development */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider border-b border-blue-500 pb-1 print:text-black print:border-slate-400">
                Projects Development
              </h2>
              
              {/* Budget Tracker */}
              <div className="space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white print:text-black leading-tight">
                  Budget Tracker App | <span className="font-normal text-xs text-blue-600 dark:text-blue-400 print:text-blue-700">React Native · Expo · T3 Stack · AI Integration</span>
                </h3>
                <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-1 print:text-slate-700">
                  <li>Built a cross-platform mobile app for tracking income, expenses, and savings goals in real time, solving the common problem of poor financial visibility and overspending.</li>
                  <li>Developed an AI-powered budgeting assistant that analyzes user spending patterns and delivers personalized financial recommendations — overcoming challenges in integrating predictive logic with a responsive UI.</li>
                  <li>Implemented a clean, intuitive dashboard with real-time data sync and cross-platform support for iOS and Android.</li>
                </ul>
              </div>

              {/* Galor Dental System */}
              <div className="space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white print:text-black leading-tight">
                  Galor Dental Care System | <span className="font-normal text-xs text-blue-600 dark:text-blue-400 print:text-blue-700">PHP · HTML · CSS · MySQL</span>
                </h3>
                <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-1 print:text-slate-700">
                  <li>Developed a full-featured web-based dental clinic management system handling patient records, appointment scheduling, treatment tracking, and billing.</li>
                  <li>Designed a streamlined communication interface between dental staff and patients, reducing manual coordination overhead.</li>
                </ul>
              </div>

              {/* MediCore POS */}
              <div className="space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white print:text-black leading-tight">
                  MediCore POS - Pharmacy Point of Sale &amp; Inventory System | <span className="font-normal text-xs text-blue-600 dark:text-blue-400 print:text-blue-700">Next.js · TypeScript · Tailwind CSS · shadcn/ui · Recharts</span>
                </h3>
                <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-1 print:text-slate-700">
                  <li>Built a premium pharmacy point-of-sale and inventory management system for Philippine community pharmacies with VAT-aware checkout, batch and expiry tracking, and purchase orders.</li>
                  <li>Implemented role-based access, audit logs, and comprehensive sales, inventory, and supplier reports.</li>
                  <li>Designed a responsive dashboard with real-time inventory insights and data visualization using Recharts.</li>
                </ul>
              </div>

              {/* OBO-PAMS */}
              <div className="space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white print:text-black leading-tight">
                  OBO-PAMS - Permit Application Management System | <span className="font-normal text-xs text-blue-600 dark:text-blue-400 print:text-blue-700">PHP 8 · MySQL · JavaScript · Custom CSS</span>
                </h3>
                <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-1 print:text-slate-700">
                  <li>Developed a role-based permit application management system for the Office of the Building Official (LGU-General Santos).</li>
                  <li>Implemented order-of-payment encoding, permit workflow tracking, approval, releasing records, and on-site ocular inspection checklists.</li>
                  <li>Added audit logs, reports, team leaders, and user/module access management for full administrative control.</li>
                </ul>
              </div>
            </div>

            {/* Certifications and Licenses */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider border-b border-blue-500 pb-1 print:text-black print:border-slate-400">
                Certifications and Licenses
              </h2>
              <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-2 print:text-slate-700">
                {achievements.map((ach) => (
                  <li key={ach.id}>
                    {ach.link ? (
                      <a
                        href={ach.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline print:text-black print:no-underline"
                      >
                        {ach.title}
                      </a>
                    ) : (
                      <span className="font-bold text-slate-900 dark:text-white print:text-black">{ach.title}</span>
                    )}
                    <p className="text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5">
                      {ach.issuer} • {ach.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Employment History */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider border-b border-blue-500 pb-1 print:text-black print:border-slate-400">
                Employment History
              </h2>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white print:text-black leading-snug">
                          {exp.role}
                        </h3>
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 print:text-blue-700">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 flex items-center font-medium shrink-0">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{exp.startDate} - {exp.endDate}</span>
                      </div>
                    </div>
                    
                    <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-1 print:text-slate-700">
                      {exp.highlights.map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
