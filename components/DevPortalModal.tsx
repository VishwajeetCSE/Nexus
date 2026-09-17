"use client";

import React, { useState } from "react";
import { useCampus } from "@/context/CampusContext";
import { 
  PlusCircle, 
  X, 
  Github, 
  Mail, 
  Building2, 
  MapPin, 
  Globe2, 
  User, 
  CheckCircle,
  Sparkles,
  Rocket
} from "lucide-react";

export default function DevPortalModal() {
  const { isDevModalOpen, setIsDevModalOpen, registerCampus, setActiveCampusById } = useCampus();

  const [devName, setDevName] = useState("");
  const [devEmail, setDevEmail] = useState("");
  const [devGithub, setDevGithub] = useState("");
  const [campusName, setCampusName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [successCampus, setSuccessCampus] = useState<{ id: string; name: string } | null>(null);

  if (!isDevModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!campusName || !city || !country || !devName || !devEmail || !devGithub) {
      alert("Please fill in all required fields.");
      return;
    }

    // Register campus node
    const newCampus = registerCampus({
      name: campusName.trim(),
      city: city.trim(),
      country: country.trim(),
      developer_name: devName.trim(),
      developer_email: devEmail.trim(),
      developer_github_handle: devGithub.trim(),
    });

    setSuccessCampus({ id: newCampus.id, name: newCampus.name });
  };

  const handleClose = () => {
    setSuccessCampus(null);
    setIsDevModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Spin up a Campus Node
              </h2>
              <p className="text-[11px] text-slate-400">
                Global Developer Portal &bull; Decentralized Node Deployment
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {successCampus ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Campus Node Deployed!
            </h3>
            <p className="text-sm text-slate-300">
              <strong className="text-blue-400">{successCampus.name}</strong> has been registered to the global directory. Your feed is now live.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveCampusById(successCampus.id);
                  handleClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-glow-sm"
              >
                View Live Campus Node &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* Spin up Form */
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Registering a campus node allows students at your university to search, post alerts, and crowdsource solutions instantly.
              </span>
            </div>

            {/* Campus Details Section */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>University Campus Details</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Campus / University Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Massachusetts Institute of Technology (MIT)"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder-slate-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cambridge"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Developer Authentication & Requirements Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Developer Credentials</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Developer Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>University Domain Email *</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. alex@mit.edu or alex@alumni.ox.ac.uk"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Must be an institutional or university-affiliated email address.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Github className="w-3 h-3 text-slate-400" />
                  <span>GitHub Profile URL or Handle *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://github.com/alexrivera or alexrivera"
                  value={devGithub}
                  onChange={(e) => setDevGithub(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none placeholder-slate-600"
                  required
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Deploy Campus Node</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
