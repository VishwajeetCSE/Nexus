"use client";

import React from "react";
import { useCampus } from "@/context/CampusContext";
import PostCard from "./PostCard";
import { CategoryTag } from "@/lib/types";
import { 
  Sparkles, 
  PlusCircle, 
  MapPin, 
  CheckCircle2, 
  Filter, 
  Inbox,
  Radio
} from "lucide-react";

const CATEGORIES: CategoryTag[] = [
  "All",
  "Official Alert",
  "Fest/Events",
  "Lost & Found",
  "Exam Preparation",
];

export default function PulseFeed() {
  const {
    activeCampus,
    isPeeking,
    activePosts,
    selectedCategory,
    setSelectedCategory,
    setIsCreatePostModalOpen,
  } = useCampus();

  return (
    <div className="space-y-5">
      {/* Feed Hero Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>The Pulse &bull; Live Campus Feed</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeCampus.name}
              </h1>
              {activeCampus.is_verified && (
                <span title="Verified Campus Node">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{activeCampus.city}, {activeCampus.country}</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">Node dev: @{activeCampus.developer_github_handle}</span>
            </p>
          </div>

          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-glow-sm transition-all transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Broadcast Post</span>
          </button>
        </div>

        {/* Verification Legend Summary */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Badges:</span>
          <span className="flex items-center gap-1 text-blue-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Admin
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Clubs
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-500" /> Students
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filter:</span>
        </div>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-glow-sm"
                  : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {activePosts.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-slate-900/40 border border-slate-800/60">
            <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300 mb-1">
              No updates found in {selectedCategory}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Be the first member of {activeCampus.name} to broadcast a notification or announcement!
            </p>
            <button
              onClick={() => setIsCreatePostModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              + Create First Post
            </button>
          </div>
        ) : (
          activePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
