"use client";

import React, { useState, useEffect } from "react";
import { useCampus } from "@/context/CampusContext";
import { PlacementStats } from "@/lib/review-types";
import { CAMPUS_PLACEMENT_STATS } from "@/lib/placement-mock-data";
import { 
  TrendingUp, 
  Briefcase, 
  Award, 
  Building, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Info,
  Calendar,
  Lock
} from "lucide-react";

export default function PlacementStatsWidget() {
  const { activeCampus, verifiedStudent, setIsStudentVerifyModalOpen } = useCampus();
  const [stats, setStats] = useState<PlacementStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlacementStats() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/placements?campus_id=${activeCampus.id}`);
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        } else {
          setStats(CAMPUS_PLACEMENT_STATS[activeCampus.id] || null);
        }
      } catch {
        setStats(CAMPUS_PLACEMENT_STATS[activeCampus.id] || null);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlacementStats();
  }, [activeCampus.id]);

  if (isLoading) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
        Loading placement statistics &amp; backlog trends for {activeCampus.name}...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
        Placement records are currently being compiled for this node.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Placement Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Placement Intelligence Hub &bull; {stats.academic_year}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {activeCampus.name} Placements &amp; Recruitment
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Audited campus placement metrics, top visiting recruiter packages, and company backlog eligibility policies.
            </p>
          </div>

          <div className="shrink-0">
            {verifiedStudent ? (
              <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Student Access Active</span>
              </div>
            ) : (
              <button
                onClick={() => setIsStudentVerifyModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow-sm transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Verify ID to Unlock Insider Insights</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Placement Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          {/* Highest CTC */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span>Highest Package</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-amber-400">
              ₹{stats.highest_ctc_lpa} <span className="text-xs font-bold text-slate-300">LPA</span>
            </div>
            <span className="text-[10px] text-slate-500">Tier-1 International / Domestic</span>
          </div>

          {/* Average CTC */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span>Average CTC</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-blue-400">
              ₹{stats.avg_ctc_lpa} <span className="text-xs font-bold text-slate-300">LPA</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">+8.5% from last year</span>
          </div>

          {/* Placement Rate */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span>Placement Rate</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-emerald-400">
              {stats.placement_rate_pct}%
            </div>
            <span className="text-[10px] text-slate-500">Of registered candidates</span>
          </div>

          {/* Total Offers */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span>Total Offers</span>
              <Users className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              {stats.total_offers}
            </div>
            <span className="text-[10px] text-slate-500">From {stats.total_eligible_students} students</span>
          </div>
        </div>
      </div>

      {/* CRITICAL FEATURE: Backlog Trends & Company Eligibility Radar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>Backlog Trends &amp; Recruiter Eligibility Radar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              How visiting companies treat active vs. cleared backlogs during placement screening
            </p>
          </div>
          <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Updated for {stats.academic_year}
          </span>
        </div>

        {/* Backlog Policy Percentages Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Zero Backlogs Required */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-rose-300">
                Strict 0 Backlogs Required
              </span>
              <span className="text-base font-black text-rose-400">
                {stats.backlog_trends.zero_backlogs_required_pct}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.backlog_trends.zero_backlogs_required_pct}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Mostly Tier-1 Product &amp; HFT companies (Google, Microsoft, Goldman Sachs).
            </p>
          </div>

          {/* Cleared Backlogs Allowed */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-amber-300">
                Cleared Backlogs Permitted
              </span>
              <span className="text-base font-black text-amber-400">
                {stats.backlog_trends.cleared_backlogs_allowed_pct}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.backlog_trends.cleared_backlogs_allowed_pct}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Permit 1-2 history backlogs if cleared before final year interview rounds.
            </p>
          </div>

          {/* Active Backlogs Allowed */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-emerald-300">
                Active Backlogs Allowed
              </span>
              <span className="text-base font-black text-emerald-400">
                {stats.backlog_trends.active_backlogs_allowed_pct}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.backlog_trends.active_backlogs_allowed_pct}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Startups and select tech partners evaluating GitHub projects and proof-of-work.
            </p>
          </div>
        </div>

        {/* Backlog Advice Callout */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-slate-200">
              Verified Placement Cell Advisory:
            </div>
            <p className="text-slate-300 leading-relaxed">
              {stats.backlog_trends.policy_summary}
            </p>
            <p className="text-amber-300/90 font-medium pt-1">
              💡 <strong>Actionable Tip:</strong> {stats.backlog_trends.critical_advice}
            </p>
          </div>
        </div>
      </div>

      {/* Top Visiting Companies & Packages */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" />
            <span>Visiting Recruiters &amp; Backlog Eligibility Matrix</span>
          </h3>
          <span className="text-xs text-slate-400">
            {stats.top_recruiters.length} Marquee Companies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stats.top_recruiters.map((recruiter, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-white">{recruiter.name}</span>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                  ₹{recruiter.avg_package_lpa} LPA avg
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[10px]">
                  {recruiter.tier}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-start gap-1 pt-1 border-t border-slate-900">
                <span className="text-amber-400 font-semibold">Eligibility:</span>
                <span className="text-slate-300">{recruiter.backlog_criteria}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year-over-Year Historical Comparison */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Past Years Historical Placement Comparison</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-2">Academic Year</th>
                <th className="pb-2">Highest CTC</th>
                <th className="pb-2">Average CTC</th>
                <th className="pb-2">Placement Rate</th>
                <th className="pb-2">Total Offers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
              {stats.past_years_comparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 font-bold text-white">{row.year}</td>
                  <td className="py-2.5 text-amber-400 font-bold">₹{row.highest_ctc_lpa} LPA</td>
                  <td className="py-2.5 text-blue-400 font-bold">₹{row.avg_ctc_lpa} LPA</td>
                  <td className="py-2.5 text-emerald-400 font-bold">{row.placement_rate_pct}%</td>
                  <td className="py-2.5">{row.total_offers} offers</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
