"use client";

import React from "react";
import { useCampus } from "@/context/CampusContext";
import { Radio, LifeBuoy, Compass, PlusCircle } from "lucide-react";

export default function MobileBottomNav() {
  const { 
    activeTab, 
    setActiveTab, 
    setIsCampusSwitcherOpen, 
    setIsDevModalOpen,
    activeSOSPosts 
  } = useCampus();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {/* Pulse Feed Tab */}
      <button
        onClick={() => setActiveTab("pulse")}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
          activeTab === "pulse"
            ? "text-blue-400 bg-blue-500/15"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Radio className="w-5 h-5" />
        <span className="text-[10px] font-bold">The Pulse</span>
      </button>

      {/* SOS Hub Tab */}
      <button
        onClick={() => setActiveTab("sos")}
        className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
          activeTab === "sos"
            ? "text-rose-400 bg-rose-500/15"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <div className="relative">
          <LifeBuoy className="w-5 h-5" />
          {activeSOSPosts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </div>
        <span className="text-[10px] font-bold">SOS Hub</span>
      </button>

      {/* Switch Campus */}
      <button
        onClick={() => setIsCampusSwitcherOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-slate-200 transition-all"
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-bold">Switch</span>
      </button>

      {/* Spin up Campus Node */}
      <button
        onClick={() => setIsDevModalOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-400 hover:text-blue-400 transition-all"
      >
        <PlusCircle className="w-5 h-5" />
        <span className="text-[10px] font-bold">Spin Node</span>
      </button>
    </nav>
  );
}
