"use client";

import React from "react";
import { useCampus } from "@/context/CampusContext";
import PulseFeed from "@/components/PulseFeed";
import SOSHub from "@/components/SOSHub";
import PlacementStatsWidget from "@/components/PlacementStatsWidget";
import CampusReviewsFeed from "@/components/CampusReviewsFeed";
import { 
  Radio, 
  LifeBuoy, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Github, 
  ExternalLink,
  PlusCircle,
  Database,
  ShieldCheck,
  Server,
  Briefcase,
  Star
} from "lucide-react";

export default function Home() {
  const { 
    activeCampus, 
    homeCampus, 
    campuses, 
    activeTab, 
    setActiveTab, 
    setActiveCampusById,
    setIsDevModalOpen,
    activeSOSPosts,
    activePosts,
    isPeeking
  } = useCampus();

  const externalCampuses = campuses.filter((c) => c.id !== activeCampus.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main Feed Column */}
      <div className="lg:col-span-8 space-y-4">
        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center justify-between bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setActiveTab("pulse")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === "pulse"
                  ? "bg-blue-600 text-white shadow-glow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>The Pulse</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-white/10 text-[10px]">
                {activePosts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("sos")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === "sos"
                  ? "bg-rose-600 text-white shadow-glow-sos"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>SOS Hub</span>
              {activeSOSPosts.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-rose-500/30 text-rose-200 text-[10px] font-extrabold">
                  {activeSOSPosts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("placements")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === "placements"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Placements &amp; Reviews</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 pr-2 text-xs text-slate-400 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-300 truncate max-w-[150px]">
              {activeCampus.name.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Dynamic View rendering */}
        {activeTab === "pulse" && <PulseFeed />}
        {activeTab === "sos" && <SOSHub />}
        {activeTab === "placements" && (
          <div className="space-y-6">
            <PlacementStatsWidget />
            <CampusReviewsFeed />
          </div>
        )}
      </div>

      {/* Sidebar (Desktop / Tablet) */}
      <aside className="hidden lg:block lg:col-span-4 space-y-5">
        {/* Active Node Info Card */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Current Campus Node
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
                <span>{activeCampus.name}</span>
                {activeCampus.is_verified && (
                  <span title="Verified Campus">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  </span>
                )}
              </h2>
            </div>
            {isPeeking ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Peeking
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Home Node
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-medium text-slate-200">{activeCampus.city}, {activeCampus.country}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Campus ID:</span>
              <code className="font-mono text-xs text-blue-400 bg-slate-950 px-2 py-0.5 rounded">
                {activeCampus.id}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Node Developer:</span>
              <a
                href={`https://github.com/${activeCampus.developer_github_handle}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                <Github className="w-3.5 h-3.5" />
                <span>@{activeCampus.developer_github_handle}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Global Campus Quick-Switch / Peek List */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Peek External Campuses</span>
            </h3>
            <span className="text-[10px] text-slate-500">1-Click Switch</span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {externalCampuses.slice(0, 5).map((campus) => (
              <button
                key={campus.id}
                onClick={() => setActiveCampusById(campus.id)}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all flex items-center justify-between group"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-blue-300">
                    {campus.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {campus.city}, {campus.country}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Developer Spin up Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-950/50 via-slate-900 to-indigo-950/40 border border-blue-500/30 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <PlusCircle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">
              Launch Your University Node
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you a student developer or campus lead? Spin up a verified node for your college with your university email &amp; GitHub profile.
          </p>
          <button
            onClick={() => setIsDevModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-sm transition-all"
          >
            Deploy Node in 60s &rarr;
          </button>
        </div>

        {/* Hackathon Architecture Footer Info */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Hackathon Architecture: Unified Engine</span>
          </div>
          <p className="leading-relaxed text-slate-500">
            Unified global schema filtering across all campuses by <code className="text-blue-400">campus_id</code>. Ready for 1-click Vercel deployment.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Server className="w-3 h-3 text-emerald-400" />
              Vercel Production Ready
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
