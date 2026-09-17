import { NextRequest, NextResponse } from "next/server";
import { CampusReview } from "@/lib/review-types";
import { INITIAL_CAMPUS_REVIEWS } from "@/lib/placement-mock-data";

// In-memory store for server-side demo sessions
let serverReviews: CampusReview[] = [...INITIAL_CAMPUS_REVIEWS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campusId = searchParams.get("campus_id");

  if (!campusId) {
    return NextResponse.json(
      { success: false, message: "campus_id query parameter is required" },
      { status: 400 }
    );
  }

  const campusReviews = serverReviews.filter((r) => r.campus_id === campusId);

  return NextResponse.json({
    success: true,
    campus_id: campusId,
    total: campusReviews.length,
    reviews: campusReviews,
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const body = await req.json();

    const {
      campus_id,
      session_token,
      student_name,
      branch,
      grad_year,
      overall_rating,
      academics_rating,
      infrastructure_rating,
      placement_rating,
      review_title,
      review_text,
      pros,
      cons,
      visiting_companies_experienced,
      backlog_advice,
    } = body;

    // Verify token either in Authorization header or in payload body
    const token = authHeader?.replace("Bearer ", "") || session_token;
    if (!token || !token.startsWith("nexus_std_")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Only verified campus students can publish reviews. Please verify your Student ID.",
        },
        { status: 401 }
      );
    }

    if (!campus_id || !review_title?.trim() || !review_text?.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing required review fields (Title, Review text, Ratings)." },
        { status: 400 }
      );
    }

    const newReview: CampusReview = {
      id: `rev-${Date.now()}`,
      campus_id,
      student_id: `std-${token.slice(-6)}`,
      student_name: student_name?.trim() || "Verified Student",
      student_roll_prefix: "Verified Roll",
      branch: branch || "Engineering",
      grad_year: Number(grad_year) || 2026,
      is_verified: true,
      overall_rating: Number(overall_rating) || 5,
      academics_rating: Number(academics_rating) || 4,
      infrastructure_rating: Number(infrastructure_rating) || 4,
      placement_rating: Number(placement_rating) || 5,
      review_title: review_title.trim(),
      review_text: review_text.trim(),
      pros: pros?.trim() || "Great student community.",
      cons: cons?.trim() || "Campus administration could be faster.",
      visiting_companies_experienced: Array.isArray(visiting_companies_experienced)
        ? visiting_companies_experienced
        : [],
      backlog_advice: backlog_advice?.trim() || "Focus on building solid projects and clear any backlogs before 7th semester.",
      upvotes_count: 1,
      timestamp: new Date().toISOString(),
    };

    serverReviews = [newReview, ...serverReviews];

    return NextResponse.json({
      success: true,
      message: "Review successfully posted by verified campus student",
      review: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error creating review" },
      { status: 500 }
    );
  }
}
