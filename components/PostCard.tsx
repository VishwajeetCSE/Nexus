"use client";

import React, { useState } from "react";
import { Post, UserRoleTag } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { useCampus } from "@/context/CampusContext";
import { 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  ArrowBigUp, 
  Share2, 
  Clock, 
  Check, 
  AlertTriangle,
  Calendar,
  Search,
  BookOpen
} from "lucide-react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { upvotePost } = useCampus();
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUpvote = () => {
    upvotePost(post.id);
    setHasUpvoted(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Badge Configuration based on User Role Tag
  const renderVerificationBadge = (role: UserRoleTag) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Verified</span>
          </span>
        );
      case "club":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Club Announcement</span>
          </span>
        );
      case "student":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
            <GraduationCap className="w-3 h-3 text-slate-400" />
            <span>Student</span>
          </span>
        );
    }
  };

  // Category Tag Pill Color & Icon
  const renderCategoryPill = (category: string) => {
    switch (category) {
      case "Official Alert":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Official Alert
          </span>
        );
      case "Fest/Events":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Calendar className="w-3 h-3 text-purple-400" />
            Fest & Events
          </span>
        );
      case "Lost & Found":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Search className="w-3 h-3 text-amber-400" />
            Lost & Found
          </span>
        );
      case "Exam Preparation":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <BookOpen className="w-3 h-3 text-teal-400" />
            Exam Prep
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
            {category}
          </span>
        );
    }
  };

  const isOfficial = post.user_role_tag === "admin";

  return (
    <article
      className={`rounded-2xl p-5 transition-all duration-200 border ${
        isOfficial
          ? "bg-gradient-to-b from-blue-950/40 via-slate-900/90 to-slate-900 border-blue-500/40 shadow-glow-sm"
          : "bg-slate-900/80 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700"
      }`}
    >
      {/* Top Meta: Badges & Timestamp */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {renderVerificationBadge(post.user_role_tag)}
          {renderCategoryPill(post.category_tag)}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{formatRelativeTime(post.timestamp)}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug tracking-tight">
        {post.title}
      </h3>

      {/* Content */}
      <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Bottom Footer: Author & Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
        <div className="text-slate-400 font-medium">
          Posted by <span className="text-slate-200 font-semibold">{post.user_name}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              hasUpvoted
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
            }`}
          >
            <ArrowBigUp className={`w-4 h-4 ${hasUpvoted ? "fill-white" : ""}`} />
            <span>{post.upvotes_count}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Copy link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}
