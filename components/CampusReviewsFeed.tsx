"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { CampusReview } from "@/lib/review-types";
import { formatRelativeTime } from "@/lib/utils";
import { 
  Star, 
  ShieldCheck, 
  ArrowBigUp, 
  ThumbsUp, 
  MessageSquare, 
  Check, 
  X, 
  Clock, 
  Building, 
  PlusCircle, 
  AlertCircle,
  Briefcase
} from "lucide-react";

export default function CampusReviewsFeed() {
  const { 
    activeCampus, 
    reviews, 
    upvoteReview, 
    verifiedStudent, 
    setIsStudentVerifyModalOpen,
    setIsCreateReviewModalOpen 
  } = useCampus();

  const [selectedBranch, setSelectedBranch] = useState("All");

  const campusReviews = reviews.filter((r) => r.campus_id === activeCampus.id);

  const filteredReviews = campusReviews.filter((r) => {
    if (selectedBranch === "All") return true;
    return r.branch.toLowerCase().includes(selectedBranch.toLowerCase());
  });

  const avgOverallRating = campusReviews.length > 0
    ? (campusReviews.reduce((acc, r) => acc + r.overall_rating, 0) / campusReviews.length).toFixed(1)
    : "4.5";

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-slate-700"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleCreateReviewClick = () => {
    if (!verifiedStudent) {
      setIsStudentVerifyModalOpen(true);
    } else {
      setIsCreateReviewModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Header & Summary Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Campus Reviews &amp; Student Insights</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeCampus.name} Student Voice
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Authentic reviews submitted exclusively by verified students with university ID credentials.
            </p>
          </div>

          <button
            onClick={handleCreateReviewClick}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-all transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write Verified Review</span>
          </button>
        </div>

        {/* Rating Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <div className="text-3xl font-black text-amber-400">
              {avgOverallRating}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-300">Overall Rating</div>
              <div className="text-[10px] text-slate-500">{campusReviews.length} verified reviews</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] text-slate-400">Placement Support</div>
            <div className="text-lg font-bold text-blue-400 mt-0.5">4.6 / 5.0</div>
            <span className="text-[10px] text-slate-500">Tier-1 drives</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] text-slate-400">Academics &amp; Faculty</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">4.3 / 5.0</div>
            <span className="text-[10px] text-slate-500">Curriculum balance</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] text-slate-400">Campus Infrastructure</div>
            <div className="text-lg font-bold text-purple-400 mt-0.5">4.1 / 5.0</div>
            <span className="text-[10px] text-slate-500">Labs &amp; libraries</span>
          </div>
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">
              No verified reviews for this campus yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Are you an active student or alumni? Verify your student ID to publish the first review!
            </p>
            <button
              onClick={handleCreateReviewClick}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              + Submit First Verified Review
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <article
              key={rev.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all space-y-4"
            >
              {/* Review Header: Student Identity & Verification Shield */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                    {rev.student_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">
                        {rev.student_name}
                      </span>
                      {rev.is_verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Student ID
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {rev.branch} &bull; Class of {rev.grad_year}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5">
                      {renderStarRating(rev.overall_rating)}
                      <span className="text-xs font-bold text-amber-400">
                        {rev.overall_rating}.0
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(rev.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Title & Body */}
              <div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  &ldquo;{rev.review_title}&rdquo;
                </h3>
                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  {rev.review_text}
                </p>
              </div>

              {/* Sub-Category Ratings Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Placements</span>
                  <span className="font-bold text-blue-400">{rev.placement_rating}/5</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Infrastructure</span>
                  <span className="font-bold text-purple-400">{rev.infrastructure_rating}/5</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Academics</span>
                  <span className="font-bold text-emerald-400">{rev.academics_rating}/5</span>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-400 mb-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Pros</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{rev.pros}</p>
                </div>

                <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-rose-200">
                  <div className="font-bold flex items-center gap-1.5 text-rose-400 mb-1">
                    <X className="w-3.5 h-3.5" />
                    <span>Cons</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{rev.cons}</p>
                </div>
              </div>

              {/* Visiting Companies Encountered */}
              {rev.visiting_companies_experienced && rev.visiting_companies_experienced.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    Recruiters Interviewed:
                  </span>
                  {rev.visiting_companies_experienced.map((company, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-semibold text-[11px]"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              )}

              {/* Backlog Advice Callout */}
              {rev.backlog_advice && (
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Senior Advice on Backlogs &amp; Preparation:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {rev.backlog_advice}
                  </p>
                </div>
              )}

              {/* Review Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                <span className="text-slate-500 text-[11px]">
                  Verified Enrollment ID &bull; Authenticated Submission
                </span>

                <button
                  onClick={() => upvoteReview(rev.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-xs font-semibold"
                >
                  <ArrowBigUp className="w-4 h-4" />
                  <span>Helpful ({rev.upvotes_count})</span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
