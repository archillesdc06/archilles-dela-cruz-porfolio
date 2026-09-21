import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Github, Jobstreet, Facebook } from "~/components/brand-icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/archillesdc06",
      icon: <Github className="h-5 w-5" />,
      color: "hover:text-slate-900 dark:hover:text-white",
    },
    {
      name: "JobStreet",
      href: "https://ph.jobstreet.com/profiles/archilles-delacruz-c1fvrLpmB4",
      icon: <Jobstreet className="h-5 w-5" />,
      color: "hover:text-blue-800 dark:hover:text-blue-600",
    },
    {
      name: "Facebook",
      href: "https://facebook.com/archillesdc",
      icon: <Facebook className="h-5 w-5" />,
      color: "hover:text-blue-700 dark:hover:text-blue-500",
    },
    {
      name: "Email",
      href: "mailto:archillesdelacruzemail@gmail.com",
      icon: <Mail className="h-5 w-5" />,
      color: "hover:text-rose-600 dark:hover:text-rose-400",
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white/50 py-12 dark:border-slate-800 dark:bg-slate-950/50 backdrop-blur-md print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          
          {/* Brand/About */}
          <div className="space-y-3">
            <Link href="/" className="font-sans text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              Archilles<span className="text-blue-600 dark:text-blue-400">.</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto md:mx-0">
              Aspiring Software Developer and IT Specialist dedicated to building efficient systems and modern web experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex justify-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="/projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Projects
            </Link>
            <Link href="/certifications" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Certifications
            </Link>
            <Link href="/resume" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Resume
            </Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Contact
            </Link>
            <Link href="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy
            </Link>
          </div>

          {/* Social Icons & Copyright */}
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-slate-400 transition-colors duration-200 ${social.color}`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              &copy; {currentYear} Archilles Dela Cruz. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

