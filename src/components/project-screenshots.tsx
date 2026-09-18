"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  ScrollText,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface ProjectVisualsProps {
  image: string;
  screenshots?: string[];
  fullScreenshots?: string[];
  projectName: string;
  children: React.ReactNode;
}

export default function ProjectVisuals({
  image,
  screenshots = [],
  fullScreenshots = [],
  projectName,
  children,
}: ProjectVisualsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const visible = screenshots.length + fullScreenshots.length > 0;
  const viewers = [image, ...screenshots, ...fullScreenshots];
  const total = viewers.length;

  const imageSrc = openIndex !== null ? viewers[openIndex] ?? image : image;

  const currentLabel =
    openIndex === null || openIndex === 0
      ? `View of ${projectName}`
      : openIndex <= screenshots.length
        ? `${projectName} screenshot ${openIndex}`
        : `${projectName} full page ${openIndex - screenshots.length}`;

  const openImage = (index: number) => {
    const clamped = (index + total) % total;
    setOpenIndex(clamped);
    setZoomed(false);
  };

  return (
    <>
      {/* Cover banner */}
      <button
        type="button"
        onClick={() => visible && setOpenIndex(0)}
        className={`group relative block w-full aspect-video bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 ${
          visible ? "cursor-zoom-in" : ""
        }`}
        aria-label={visible ? `View ${projectName} screenshots` : projectName}
        disabled={!visible}
      >
        <Image
          src={image}
          alt={projectName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {visible && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur-xs px-3 py-1.5 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="h-3.5 w-3.5" />
            <span>Click to view</span>
          </span>
        )}
      </button>

      {children}

      {screenshots.length > 0 && (
        <div className="p-6 pt-0 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <MonitorPlay className="h-3.5 w-3.5" />
            <span>System Screenshots</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {screenshots.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpenIndex(i + 1)}
                className="group relative aspect-video overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`View screenshot ${i + 1} of ${projectName}`}
              >
                <Image
                  src={src}
                  alt={`${projectName} screenshot ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {fullScreenshots.length > 0 && (
        <div className="p-6 pt-0 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <ScrollText className="h-3.5 w-3.5" />
            <span>Full Page Design</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {fullScreenshots.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpenIndex(screenshots.length + i + 1)}
                className="group relative h-64 w-40 flex-none overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`View full page ${i + 1} of ${projectName}`}
              >
                <Image
                  src={src}
                  alt={`${projectName} full page ${i + 1}`}
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen viewer via portal to document.body */}
      {typeof document !== "undefined" &&
        openIndex !== null &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4 sm:p-8"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
              aria-label="Close viewer"
            >
              <X className="h-5 w-5" />
            </button>

            {visible && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openImage(openIndex - 1);
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-10"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openImage(openIndex + 1);
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors z-10"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div
              className={`relative ${zoomed ? "max-h-[85vh] max-w-[92vw] overflow-auto" : ""}`}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={imageSrc}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => visible && setZoomed((z) => !z)}
                className="cursor-zoom-in"
              >
                <Image
                  src={imageSrc}
                  alt={currentLabel}
                  width={1920}
                  height={1080}
                  priority
                  className={`rounded-xl bg-white shadow-2xl transition-all duration-200 ${
                    zoomed
                      ? "w-auto h-auto max-w-none max-h-none"
                      : "w-auto h-auto max-w-[min(95vw,1700px)] max-h-[82vh]"
                  } object-contain`}
                />
              </motion.div>
              {zoomed && (
                <p className="mt-3 text-center text-xs text-white/60">
                  Scroll or drag to explore the full screenshot · click to zoom out
                </p>
              )}
            </div>

            {visible && (
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
              >
                {zoomed ? (
                  <ZoomOut className="h-3.5 w-3.5" />
                ) : (
                  <ZoomIn className="h-3.5 w-3.5" />
                )}
                <span>{zoomed ? "Fit view" : "Zoom"}</span>
              </button>
            )}

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
              {currentLabel} · {openIndex + 1} / {total}
            </p>
          </motion.div>,
          document.body,
        )}
    </>
  );
}
