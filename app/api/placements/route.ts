import { NextRequest, NextResponse } from "next/server";
import { CAMPUS_PLACEMENT_STATS } from "@/lib/placement-mock-data";
import { PlacementStats } from "@/lib/review-types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campusId = searchParams.get("campus_id");

  if (!campusId) {
    return NextResponse.json(
      { success: false, message: "campus_id query parameter is required" },
      { status: 400 }
    );
  }

  // Return campus-specific placement stats or baseline template for new nodes
  const stats: PlacementStats = CAMPUS_PLACEMENT_STATS[campusId] || {
    campus_id: campusId,
    academic_year: "2025-26",
    highest_ctc_lpa: 36.0,
    avg_ctc_lpa: 10.5,
    placement_rate_pct: 82.0,
    total_offers: 450,
    total_eligible_students: 550,
    top_recruiters: [
      { name: "Tech Mahindra", tier: "High-Growth Tech", avg_package_lpa: 8.5, backlog_criteria: "Max 1 cleared backlog" },
      { name: "Infosys / TCS Digital", tier: "Core", avg_package_lpa: 9.0, backlog_criteria: "No active backlogs at time of joining" },
      { name: "Accenture", tier: "Consulting", avg_package_lpa: 7.5, backlog_criteria: "Cleared backlogs permitted" },
    ],
    backlog_trends: {
      zero_backlogs_required_pct: 65,
      cleared_backlogs_allowed_pct: 25,
      active_backlogs_allowed_pct: 10,
      policy_summary: "Tier-1 recruiters filter strictly for 0 active backlogs, while mass recruiters permit up to 1-2 cleared history backlogs.",
      critical_advice: "Focus on semester arrears clearance before the recruitment drive kicks off in pre-final year.",
    },
    past_years_comparison: [
      { year: "2024-25", highest_ctc_lpa: 32.0, avg_ctc_lpa: 9.8, placement_rate_pct: 80.0, total_offers: 410 },
      { year: "2023-24", highest_ctc_lpa: 28.0, avg_ctc_lpa: 8.9, placement_rate_pct: 78.0, total_offers: 380 },
    ],
  };

  return NextResponse.json({
    success: true,
    campus_id: campusId,
    stats,
  });
}
