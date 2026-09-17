export interface VerifiedStudentSession {
  student_id: string;
  campus_id: string;
  campus_name: string;
  name: string;
  email: string;
  roll_number: string;
  branch: string;
  grad_year: number;
  is_verified: boolean;
  id_card_url?: string;
  session_token: string;
  verified_at: string;
}

export interface BacklogPolicyBreakdown {
  zero_backlogs_required_pct: number; // e.g. 70% of companies require strictly 0 backlogs
  cleared_backlogs_allowed_pct: number; // e.g. 20% allow if cleared before joining
  active_backlogs_allowed_pct: number; // e.g. 10% allow active backlogs
  policy_summary: string;
  critical_advice: string;
}

export interface YearPlacementData {
  year: string; // e.g. "2024-25", "2023-24"
  highest_ctc_lpa: number;
  avg_ctc_lpa: number;
  placement_rate_pct: number;
  total_offers: number;
}

export interface PlacementStats {
  campus_id: string;
  academic_year: string;
  highest_ctc_lpa: number;
  avg_ctc_lpa: number;
  placement_rate_pct: number;
  total_offers: number;
  total_eligible_students: number;
  top_recruiters: Array<{
    name: string;
    tier: 'Tier-1 Product' | 'Core' | 'Consulting' | 'High-Growth Tech';
    avg_package_lpa: number;
    backlog_criteria: string;
  }>;
  backlog_trends: BacklogPolicyBreakdown;
  past_years_comparison: YearPlacementData[];
}

export interface CampusReview {
  id: string;
  campus_id: string;
  student_id: string;
  student_name: string;
  student_roll_prefix: string; // e.g., "2111140XX"
  branch: string;
  grad_year: number;
  is_verified: boolean;
  overall_rating: number; // 1 to 5
  academics_rating: number; // 1 to 5
  infrastructure_rating: number; // 1 to 5
  placement_rating: number; // 1 to 5
  review_title: string;
  review_text: string;
  pros: string;
  cons: string;
  visiting_companies_experienced: string[];
  backlog_advice: string;
  upvotes_count: number;
  timestamp: string;
}

export interface StudentVerificationPayload {
  name: string;
  university_email: string;
  roll_number: string;
  campus_id: string;
  branch: string;
  grad_year: number;
  id_card_preview?: string;
}
