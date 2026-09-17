"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import SOSCard from "./SOSCard";
import { 
  LifeBuoy, 
  Plus, 
  ShieldAlert, 
  EyeOff, 
  Send, 
  X, 
  Sparkles,
  TrendingUp,
  MapPin
} from "lucide-react";

export default function SOSHub() {
  const { activeCampus, activeSOSPosts, addPost } = useCampus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userName, setUserName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true); // Default to Anonymous for SOS

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addPost({
      title: title.trim(),
      content: content.trim(),
      category_tag: "SOS Query",
      user_name: isAnonymous ? "Anonymous Student" : userName.trim() || "Student",
      user_role_tag: "student",
      is_sos: true,
      is_anonymous: isAnonymous,
    });

    setTitle("");
    setContent("");
    setUserName("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* SOS Hub Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 shadow-glow-sos/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
              <LifeBuoy className="w-4 h-4 text-rose-400 animate-spin" />
              <span>Peer-to-Peer SOS Query Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Emergency &amp; Crowdsourced Queries
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Urgent problem solving for <strong className="text-slate-200">{activeCampus.name}</strong>. Ask sensitive questions anonymously. Highest upvoted answers automatically float to the top.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-bold shadow-glow-sos transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post Urgent SOS</span>
          </button>
        </div>

        {/* SOS Guidelines Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-rose-300">
            <EyeOff className="w-3.5 h-3.5" />
            <span>100% Anonymous Identity Masking</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Upvote Consensus Ranking</span>
          </div>
        </div>
      </div>

      {/* SOS List */}
      <div className="space-y-4">
        {activeSOSPosts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/60">
            <ShieldAlert className="w-12 h-12 text-rose-400/60 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200 mb-1">
              No active SOS queries on this campus
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Have an urgent doubt regarding exams, syllabus, accommodation, or campus admin? Ask your peers now.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
            >
              Broadcast First SOS Query
            </button>
          </div>
        ) : (
          activeSOSPosts.map((post) => <SOSCard key={post.id} post={post} />)
        )}
      </div>

      {/* SOS Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <LifeBuoy className="w-5 h-5 text-rose-500 animate-spin" />
                <span>Submit SOS Query</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Query Headline *
                </label>
                <input
                  type="text"
                  placeholder="e.g. URGENT: Need past year DSP question paper or notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder-slate-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Problem Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your situation in detail. What syllabus topic, location, or issue do you need immediate help with?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl p-3.5 text-sm text-slate-100 outline-none placeholder-slate-500 transition-colors"
                  required
                />
              </div>

              {/* Anonymous Toggle: Critical requirement */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isAnonymous ? "bg-rose-500/20 text-rose-400" : "bg-slate-800 text-slate-400"}`}>
                    <EyeOff className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Post Anonymously</div>
                    <div className="text-[11px] text-slate-400">Hides your real name and identity from peers</div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {!isAnonymous && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Name / Handle
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your student name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-glow-sos transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast SOS Query</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
