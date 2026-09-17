"use client";

import React from "react";
import { useCampus } from "@/context/CampusContext";
import { X, MapPin, CheckCircle2, Home, Compass, Plus, Github } from "lucide-react";

export default function CampusSwitcherModal() {
  const {
    campuses,
    activeCampus,
    homeCampus,
    setActiveCampusById,
    setHomeCampusById,
    isCampusSwitcherOpen,
    setIsCampusSwitcherOpen,
    setIsDevModalOpen,
  } = useCampus();

  if (!isCampusSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <span>Campus Node Switcher</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your active campus or set your primary Home Campus
            </p>
          </div>
          <button
            onClick={() => setIsCampusSwitcherOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Card */}
        <div className="p-5 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Current Home Campus
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>{homeCampus.name}</span>
              <span className="text-xs text-blue-400 font-normal">({homeCampus.city})</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-300">Viewing:</span>
            <strong className="text-emerald-400">{activeCampus.city}</strong>
          </div>
        </div>

        {/* Campus List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {campuses.map((campus) => {
            const isActive = campus.id === activeCampus.id;
            const isHome = campus.id === homeCampus.id;

            return (
              <div
                key={campus.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? "bg-blue-600/15 border-blue-500/50 shadow-glow-sm"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-100 truncate">
                      {campus.name}
                    </span>
                    {campus.is_verified && (
                      <span title="Verified Campus Node">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {campus.city}, {campus.country}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Github className="w-3 h-3" />
                      @{campus.developer_github_handle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isHome ? (
                    <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      Home
                    </span>
                  ) : (
                    <button
                      onClick={() => setHomeCampusById(campus.id)}
                      className="px-2 py-1 text-[11px] text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Set as permanent Home Campus"
                    >
                      Make Home
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveCampusById(campus.id);
                      setIsCampusSwitcherOpen(false);
                    }}
                    disabled={isActive}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                    }`}
                  >
                    {isActive ? "Active View" : "Peek Here"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Can&apos;t find your campus?
          </p>
          <button
            onClick={() => {
              setIsCampusSwitcherOpen(false);
              setIsDevModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Spin up New Node</span>
          </button>
        </div>
      </div>
    </div>
  );
}
