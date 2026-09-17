import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CampusProvider } from "@/context/CampusContext";
import Navbar from "@/components/Navbar";
import CampusSwitcherModal from "@/components/CampusSwitcherModal";
import DevPortalModal from "@/components/DevPortalModal";
import CreatePostModal from "@/components/CreatePostModal";
import StudentVerificationModal from "@/components/StudentVerificationModal";
import CreateReviewModal from "@/components/CreateReviewModal";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Nexus: CampusPulse Global | Interconnected Worldwide Campus Network",
  description: "Global campus micro-network where students can search any university worldwide, view real-time notifications, post peer-to-peer SOS queries, and connect across borders.",
  keywords: ["campus", "university", "student network", "SOS queries", "campus feed", "Nexus", "CampusPulse"],
  authors: [{ name: "Nexus Team - First Commit Hackathon" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 sm:pb-0">
        <CampusProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            {children}
          </main>
          <CampusSwitcherModal />
          <DevPortalModal />
          <CreatePostModal />
          <CreateReviewModal />
          <StudentVerificationModal />
          <MobileBottomNav />
        </CampusProvider>
      </body>
    </html>
  );
}
