"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { 
  X, 
  Send, 
  Star, 
  ShieldCheck, 
  AlertCircle, 
  Briefcase, 
  Check, 
  Sparkles 
} from "lucide-react";

export default function CreateReviewModal() {
  const {
    activeCampus,
    isCreateReviewModalOpen,
    setIsCreateReviewModalOpen,
    verifiedStudent,
    setIsStudentVerifyModalOpen,
    addReview,
  } = useCampus();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [overallRating, setOverallRating] = useState(5);
  const [academicsRating, setAcademicsRating] = useState(4);
  const [infrastructureRating, setInfrastructureRating] = useState(4);
  const [placementRating, setPlacementRating] = useState(5);
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [companiesInput, setCompaniesInput] = useState("");
  const [backlogAdvice, setBacklogAdvice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateReviewModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (!verifiedStudent) {
      setIsCreateReviewModalOpen(false);
      setIsStudentVerifyModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    const companies = companiesInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    await addReview({
      title: title.trim(),
      content: content.trim(),
      overall_rating: overallRating,
      academics_rating: academicsRating,
      infrastructure_rating: infrastructureRating,
      placement_rating: placementRating,
      pros: pros.trim() || "High quality faculty and peer culture.",
      cons: cons.trim() || "Workload can be rigorous.",
      visiting_companies_experienced: companies.length > 0 ? companies : ["Campus Drives"],
      backlog_advice: backlogAdvice.trim() || "Clear all semester arrears before the 7th-semester cutoff.",
    });

    setIsSubmitting(false);
    setIsCreateReviewModalOpen(false);

    // Reset form
    setTitle("");
    setContent("");
    setPros("");
    setCons("");
    setCompaniesInput("");
    setBacklogAdvice("");
  };

  const renderStarInput = (val: number, setVal: (n: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setVal(s)}
            className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
          >
            <Star
              className={`w-5 h-5 ${
                s <= val ? "text-amber-400 fill-amber-400" : "text-slate-700"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Submit Campus &amp; Placement Review
              </h2>
              <p className="text-[11px] text-slate-400">
                Reviewing <strong className="text-slate-200">{activeCampus.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateReviewModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Check */}
        {!verifiedStudent ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Student ID Verification Required
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                To maintain authentic placement data and avoid bot spam, only verified university students can submit campus reviews.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsCreateReviewModalOpen(false);
                  setIsStudentVerifyModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow-sm transition-all"
              >
                Verify Student ID Now &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* Verified Review Form */
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* Authenticated Banner */}
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Posting as {verifiedStudent.name} ({verifiedStudent.branch})
              </span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                ID Verified
              </span>
            </div>

            {/* Ratings Grid */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">Overall Campus Rating:</span>
                {renderStarInput(overallRating, setOverallRating)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-900">
                <div>
                  <span className="text-slate-400 block mb-1">Placements:</span>
                  <select
                    value={placementRating}
                    onChange={(e) => setPlacementRating(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Academics:</span>
                  <select
                    value={academicsRating}
                    onChange={(e) => setAcademicsRating(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Infrastructure:</span>
                  <select
                    value={infrastructureRating}
                    onChange={(e) => setInfrastructureRating(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                placeholder="e.g. Excellent tier-1 tech placements and supportive professors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
                required
              />
            </div>

            {/* Detailed Review Text */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Detailed Campus &amp; Placement Experience *
              </label>
              <textarea
                rows={3}
                placeholder="Share your genuine experience regarding semester exams, coding culture, hostels, and placement drives..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-100 outline-none placeholder-slate-600"
                required
              />
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-emerald-400">
                  Pros
                </label>
                <input
                  type="text"
                  placeholder="e.g. Active coding clubs, great labs"
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-rose-400">
                  Cons
                </label>
                <input
                  type="text"
                  placeholder="e.g. Strict attendance, mess food"
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3 py-2 text-slate-100 outline-none placeholder-slate-600"
                />
              </div>
            </div>

            {/* Companies Visiting */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Companies Interviewed (comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Microsoft, Oracle, Amazon, TCS Digital"
                value={companiesInput}
                onChange={(e) => setCompaniesInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-slate-100 outline-none placeholder-slate-600"
              />
            </div>

            {/* Backlog Advice for Juniors */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Advice on Backlogs &amp; Eligibility Criteria for Juniors</span>
              </label>
              <textarea
                rows={2}
                placeholder="Did visiting companies filter for backlogs? What is your advice for students with arrears?"
                value={backlogAdvice}
                onChange={(e) => setBacklogAdvice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-slate-100 outline-none placeholder-slate-600"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateReviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Publishing..." : "Publish Verified Review"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
