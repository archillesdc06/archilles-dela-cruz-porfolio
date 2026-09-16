"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Certifications", href: "/certifications" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <header className="sticky top-0 z-50 w-full glass-nav shadow-xs transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="group flex items-center space-x-1 font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              onClick={closeMenu}
            >
              <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                Archilles
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold group-hover:translate-x-0.5 transition-transform duration-200">
                .
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-medium text-sm transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 ${
                    isActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span 
                      layoutId="activeNavBorder"
                      className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-blue-600 dark:bg-blue-400"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Theme Toggle & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {mounted && currentTheme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>

            {/* Resume Call To Action */}
            <a
              href="https://drive.google.com/file/d/1P2_V0SEAAiAFUYLdcX4wmKENbdHYLLaB/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:outline-hidden transition-all duration-200"
            >
              <span>View Resume</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Theme Toggle (Mobile) */}
            <button
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {mounted && currentTheme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={toggleMenu}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-hidden dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="space-y-1 px-4 py-4 pb-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className={`block rounded-lg px-4 py-3 text-base font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 px-4">
                <a
                  href="https://drive.google.com/file/d/1P2_V0SEAAiAFUYLdcX4wmKENbdHYLLaB/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex items-center justify-center space-x-2 w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-all duration-200"
                >
                  <span>View Resume</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
