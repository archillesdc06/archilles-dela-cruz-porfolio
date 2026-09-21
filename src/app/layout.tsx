import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Outfit } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";
import ChatWidget from "~/components/chat-widget";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Archilles Dela Cruz | Software Developer Portfolio",
  description: "Archilles Dela Cruz - Software Developer, Web Developer, IT Staff. View portfolio, projects, certifications, and work experience.",
  metadataBase: new URL("https://archilles-d-dela-cruz-2.vercel.app"), // Fallback base URL for metadata
  icons: [{ rel: "icon", url: "/images/profile-avatar.jpg" }],
  keywords: [
    "Archilles Dela Cruz",
    "Software Developer Portfolio",
    "IT Specialist Philippines",
    "Web Developer Portfolio",
    "Systems Administration",
    "BAC Office document tracking",
  ],
  authors: [{ name: "Archilles Dela Cruz" }],
  creator: "Archilles Dela Cruz",
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://archilles-d-dela-cruz-2.vercel.app",
    title: "Archilles Dela Cruz | Software Developer Portfolio",
    description: "Archilles Dela Cruz - Software Developer, Web Developer, IT Staff. View portfolio, projects, certifications, and work experience.",
    siteName: "Archilles Dela Cruz Portfolio",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Archilles Dela Cruz Portfolio Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Archilles Dela Cruz | Software Developer Portfolio",
    description: "Archilles Dela Cruz - Software Developer, Web Developer, IT Staff. View portfolio, projects, certifications, and work experience.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen relative overflow-hidden grid-bg">
              {/* Blur accent glow spheres for premium visual effect */}
              <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none dark:bg-blue-600/5" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none dark:bg-indigo-600/5" />
              
              <Navbar />
              <main className="flex-1 w-full relative z-10">
                {children}
              </main>
              <Footer />
              <ChatWidget />
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
