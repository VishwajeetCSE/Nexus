"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { 
  ShieldCheck, 
  X, 
  Mail, 
  GraduationCap, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  IdCard,
  Building,
  Calendar
} from "lucide-react";

export default function StudentVerificationModal() {
  const {
    activeCampus,
    isStudentVerifyModalOpen,
    setIsStudentVerifyModalOpen,
    verifiedStudent,
    verifyStudentSession,
    logoutStudent,
  } = useCampus();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [gradYear, setGradYear] = useState(2026);
  const [idCardFile, setIdCardFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isStudentVerifyModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoFastVerify = () => {
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      verifyStudentSession({
        student_id: `std-${Date.now().toString().slice(-5)}`,
        campus_id: activeCampus.id,
        campus_name: activeCampus.name,
        name: "Alex Rivera",
        email: `alex.rivera@${activeCampus.id.split("-")[0]}.edu`,
        roll_number: "2023CSB1042",
        branch: "Computer Science & Engineering",
        grad_year: 2026,
        is_verified: true,
        session_token: `nexus_std_${Date.now()}_demo_token`,
        verified_at: new Date().toISOString(),
      });

      setIsLoading(false);
      setSuccessMsg("Demo student ID verified successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        setIsStudentVerifyModalOpen(false);
      }, 1200);
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          university_email: email.trim(),
          roll_number: rollNumber.trim(),
          campus_id: activeCampus.id,
          branch,
          grad_year: Number(gradYear),
          id_card_preview: idCardFile || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Failed to verify student credentials");
        setIsLoading(false);
        return;
      }

      verifyStudentSession(data.session);
      setSuccessMsg(`Identity verified for ${activeCampus.name}!`);

      setTimeout(() => {
        setSuccessMsg("");
        setIsStudentVerifyModalOpen(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error verifying student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Student ID Verification
              </h2>
              <p className="text-[11px] text-slate-400">
                Unlock authenticated reviews, placement packages &amp; backlog insights
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsStudentVerifyModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Already Verified Status Banner */}
        {verifiedStudent ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Verified Campus Student 🎓
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Authenticated as <strong className="text-blue-400">{verifiedStudent.name}</strong> ({verifiedStudent.email})
              </p>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Roll: {verifiedStudent.roll_number} &bull; {verifiedStudent.branch} ({verifiedStudent.grad_year})
              </div>
            </div>

            <div className="pt-3 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsStudentVerifyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-glow-sm"
              >
                Done
              </button>
              <button
                onClick={logoutStudent}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-xs font-semibold transition-all border border-slate-700"
              >
                Log Out / Switch ID
              </button>
            </div>
          </div>
        ) : (
          /* Verification Form */
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* Quick Demo Verification Callout */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-blue-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-[11px]">
                  Evaluating for hackathon? Use 1-click test verification:
                </span>
              </div>
              <button
                type="button"
                onClick={handleDemoFastVerify}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-sm transition-all whitespace-nowrap"
              >
                ⚡ Fast Demo Verify
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>University Domain Email *</span>
              </label>
              <input
                type="email"
                placeholder={`e.g. priya@${activeCampus.id.split("-")[0]}.ac.in or .edu`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Must be an institutional address ending with .edu, .ac.in, or university domain.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <IdCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Roll / Student ID *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 211114088"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Graduation Year</span>
                </label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none"
                >
                  <option value={2025}>2025 (Final Year)</option>
                  <option value={2026}>2026 (Pre-Final Year)</option>
                  <option value={2027}>2027 (Sophomore)</option>
                  <option value={2028}>2028 (Freshman)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Department / Branch</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science, Mechanical, Electronics"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
              />
            </div>

            {/* Student ID Card Upload Simulation */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Student ID Card (Photo or Scan)
              </label>
              <label className="border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/60">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-300 font-medium">
                  {idCardFile ? "ID Card Uploaded (Click to change)" : "Upload or drop student ID card photo"}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  PNG, JPG or PDF under 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsStudentVerifyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-sm transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoading ? "Verifying..." : "Verify & Unlock Access"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
