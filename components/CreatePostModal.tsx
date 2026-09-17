"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { CategoryTag, UserRoleTag } from "@/lib/types";
import { 
  X, 
  Send, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Radio, 
  AlertTriangle,
  Calendar,
  Search,
  BookOpen
} from "lucide-react";

const CATEGORIES: Exclude<CategoryTag, "All" | "SOS Query">[] = [
  "Official Alert",
  "Fest/Events",
  "Lost & Found",
  "Exam Preparation",
];

export default function CreatePostModal() {
  const { 
    activeCampus, 
    isCreatePostModalOpen, 
    setIsCreatePostModalOpen, 
    addPost 
  } = useCampus();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Exclude<CategoryTag, "All" | "SOS Query">>("Official Alert");
  const [roleTag, setRoleTag] = useState<UserRoleTag>("admin");
  const [authorName, setAuthorName] = useState("");

  if (!isCreatePostModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let defaultName = "Student Member";
    if (roleTag === "admin") defaultName = "Campus Administration";
    if (roleTag === "club") defaultName = "Student Activity Council";

    addPost({
      title: title.trim(),
      content: content.trim(),
      category_tag: category,
      user_name: authorName.trim() || defaultName,
      user_role_tag: roleTag,
      is_sos: false,
      is_anonymous: false,
    });

    setTitle("");
    setContent("");
    setAuthorName("");
    setIsCreatePostModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
            <div>
              <h2 className="text-base font-bold text-white">
                Broadcast to The Pulse
              </h2>
              <p className="text-[11px] text-slate-400">
                Posting live to <strong className="text-slate-200">{activeCampus.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreatePostModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Role Verification Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Verification Badge
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRoleTag("admin")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  roleTag === "admin"
                    ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-glow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-[11px]">Admin (Blue)</span>
              </button>

              <button
                type="button"
                onClick={() => setRoleTag("club")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  roleTag === "club"
                    ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-[11px]">Club (Green)</span>
              </button>

              <button
                type="button"
                onClick={() => setRoleTag("student")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  roleTag === "student"
                    ? "bg-slate-800 border-slate-600 text-slate-200 shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-[11px]">Student (Gray)</span>
              </button>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Author / Entity Name
            </label>
            <input
              type="text"
              placeholder={
                roleTag === "admin"
                  ? "e.g. Dean of Academics / Exam Cell"
                  : roleTag === "club"
                  ? "e.g. Coding Society / Cultural Council"
                  : "e.g. Your Name (e.g. Alex Sharma)"
              }
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
            />
          </div>

          {/* Category Tag Pills */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Post Category Tag
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all ${
                    category === cat
                      ? "bg-blue-600/20 border-blue-500 text-blue-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Mid-term Exam Schedule or Campus Hackathon Announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Broadcast Message Content *
            </label>
            <textarea
              rows={4}
              placeholder="Enter full details, venue, time, or document links..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-3 text-sm text-slate-100 outline-none placeholder-slate-600"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatePostModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
