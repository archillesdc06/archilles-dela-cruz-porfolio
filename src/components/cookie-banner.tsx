"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "archilles_cookie_consent";

type Consent = "accepted" | "declined";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // ── Show only if the visitor has not made a choice yet ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "accepted" || stored === "declined") return;
    } catch {}

    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = useCallback((choice: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {}
    setIsLeaving(true);
    setTimeout(() => setIsVisible(false), 300);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={`cookie-banner-enter fixed inset-x-0 bottom-0 z-40 print:hidden ${
        isLeaving ? "cookie-banner-leave" : ""
      }`}
    >
      <style>{`
        .cookie-banner-enter {
          animation: cookieBannerIn 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        @keyframes cookieBannerIn {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cookie-banner-leave {
          animation: cookieBannerOut 0.3s ease-in forwards;
        }
        @keyframes cookieBannerOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(100%); }
        }
      `}</style>

      <div className="glass-panel border-t border-slate-200 shadow-2xl dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:pr-24">
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Cookie className="h-4 w-4" />
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Gumagamit ako ng cookies para mapabuti ang iyong karanasan sa site at
                ma-analyze ang traffic. Basahin ang aking{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex w-full flex-shrink-0 items-center gap-2 sm:w-auto">
              <button
                onClick={() => handleChoice("declined")}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:flex-none"
              >
                Decline
              </button>
              <button
                onClick={() => handleChoice("accepted")}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 sm:flex-none"
              >
                Accept
              </button>
              <button
                onClick={() => handleChoice("declined")}
                aria-label="Close cookie banner"
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
