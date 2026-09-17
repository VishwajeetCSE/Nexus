"use client";

import React, { useState } from "react";
import { Post } from "@/lib/types";
import { useCampus } from "@/context/CampusContext";
import { formatRelativeTime } from "@/lib/utils";
import { 
  LifeBuoy, 
  ArrowBigUp, 
  MessageSquare, 
  Clock, 
  Send, 
  EyeOff, 
  CheckCircle2, 
  Flame, 
  Sparkles 
} from "lucide-react";

interface SOSCardProps {
  post: Post;
}

export default function SOSCard({ post }: SOSCardProps) {
  const { upvotePost, addSOSAnswer, upvoteAnswer } = useCampus();
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [responderName, setResponderName] = useState("");
  const [isAnswerAnonymous, setIsAnswerAnonymous] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handlePostUpvote = () => {
    upvotePost(post.id);
    setHasUpvoted(true);
  };

  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    addSOSAnswer(
      post.id,
      answerContent.trim(),
      responderName.trim() || "Peer Student",
      isAnswerAnonymous
    );

    setAnswerContent("");
    setShowAnswerForm(false);
  };

  const answers = post.answers || [];
  // Highest voted answer floats to top
  const sortedAnswers = [...answers].sort((a, b) => b.upvotes_count - a.upvotes_count);
  const topAnswer = sortedAnswers[0];

  return (
    <div className="rounded-3xl p-5 bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 border border-rose-500/30 shadow-glow-sos/10 hover:border-rose-500/50 transition-all">
      {/* SOS Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <LifeBuoy className="w-3.5 h-3.5 text-rose-400 animate-spin" />
            Urgent SOS Query
          </span>

          {post.is_anonymous ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
              <EyeOff className="w-3 h-3 text-slate-400" />
              Anonymous Student
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">
              by <strong className="text-slate-300">{post.user_name}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{formatRelativeTime(post.timestamp)}</span>
        </div>
      </div>

      {/* Query Title */}
      <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
        {post.title}
      </h3>

      {/* Query Body */}
      <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed mb-4 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
        {post.content}
      </p>

      {/* Action Strip: Upvote Query & Reply Button */}
      <div className="flex items-center justify-between pt-2 mb-4 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePostUpvote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              hasUpvoted
                ? "bg-rose-600 text-white shadow-glow-sos"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            <ArrowBigUp className={`w-4 h-4 ${hasUpvoted ? "fill-white" : ""}`} />
            <span>{post.upvotes_count} Upvotes</span>
          </button>

          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{answers.length} Peer Solutions</span>
          </span>
        </div>

        <button
          onClick={() => setShowAnswerForm(!showAnswerForm)}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
        >
          {showAnswerForm ? "Cancel" : "+ Offer Solution"}
        </button>
      </div>

      {/* Answer Input Drawer */}
      {showAnswerForm && (
        <form onSubmit={handleAddAnswer} className="mb-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Provide Crowdsourced Solution
          </h4>

          <textarea
            rows={3}
            placeholder="Write verified advice, notes link, or solution..."
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-sm text-slate-100 rounded-xl p-3 outline-none transition-all placeholder-slate-500"
            required
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              {!isAnswerAnonymous && (
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 outline-none placeholder-slate-500 w-40"
                />
              )}

              {/* Anonymous Toggle for Reply */}
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnswerAnonymous}
                  onChange={(e) => setIsAnswerAnonymous(e.target.checked)}
                  className="rounded border-slate-700 text-rose-600 focus:ring-rose-500"
                />
                <span>Post as Anonymous</span>
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Send className="w-3 h-3" />
              <span>Submit Answer</span>
            </button>
          </div>
        </form>
      )}

      {/* Solutions List - Automatically floats highest-voted answer to top */}
      {sortedAnswers.length > 0 ? (
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Ranked Solutions (Highest Voted on Top)</span>
          </div>

          {sortedAnswers.map((ans, idx) => {
            const isTopVoted = idx === 0 && ans.upvotes_count > 0;

            return (
              <div
                key={ans.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isTopVoted
                    ? "bg-slate-950 border-amber-500/40 shadow-sm"
                    : "bg-slate-950/70 border-slate-800/80"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">
                      {ans.user_name}
                    </span>
                    {isTopVoted && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <CheckCircle2 className="w-3 h-3 text-amber-400" />
                        Top Solution
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {formatRelativeTime(ans.timestamp)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-2">
                  {ans.content}
                </p>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => upvoteAnswer(post.id, ans.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  >
                    <ArrowBigUp className="w-3.5 h-3.5" />
                    <span>{ans.upvotes_count}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-slate-500 italic text-center py-2">
          No peer solutions yet. Be the first to save a fellow student!
        </div>
      )}
    </div>
  );
}
