import { NextRequest, NextResponse } from "next/server";
import { StudentVerificationPayload, VerifiedStudentSession } from "@/lib/review-types";
import { INITIAL_CAMPUSES } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as StudentVerificationPayload;

    const { name, university_email, roll_number, campus_id, branch, grad_year, id_card_preview } = body;

    // Validation checks
    if (!name?.trim() || !university_email?.trim() || !roll_number?.trim() || !campus_id) {
      return NextResponse.json(
        { success: false, message: "Missing required student credentials (Name, University Email, Roll Number)." },
        { status: 400 }
      );
    }

    const email = university_email.trim().toLowerCase();
    
    // Check for educational / university email domain format
    const isEduDomain = 
      email.endsWith(".edu") || 
      email.endsWith(".ac.in") || 
      email.endsWith(".edu.in") || 
      email.endsWith(".org") ||
      email.includes("campus") ||
      email.includes("student") ||
      email.includes("univ");

    if (!email.includes("@") || !isEduDomain) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Please use your official university or student domain email address (e.g., yourname@university.edu or @campus.ac.in)." 
        },
        { status: 422 }
      );
    }

    const campus = INITIAL_CAMPUSES.find((c) => c.id === campus_id) || {
      name: "Global Campus Node",
    };

    // Generate secure session token and student ID
    const randomHex = Math.random().toString(36).substring(2, 10);
    const token = `nexus_std_${Date.now()}_${randomHex}`;
    const studentId = `std_${campus_id.slice(0, 4)}_${roll_number.replace(/[^a-zA-Z0-9]/g, "").slice(-4)}`;

    const verifiedSession: VerifiedStudentSession = {
      student_id: studentId,
      campus_id,
      campus_name: campus.name,
      name: name.trim(),
      email,
      roll_number: roll_number.trim(),
      branch: branch || "Computer Science",
      grad_year: Number(grad_year) || 2026,
      is_verified: true,
      id_card_url: id_card_preview || undefined,
      session_token: token,
      verified_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Student credentials verified for ${campus.name}`,
      session: verifiedSession,
    });
  } catch (error) {
    console.error("Student verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error verifying student credentials" },
      { status: 500 }
    );
  }
}
