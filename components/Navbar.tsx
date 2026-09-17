"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCampus } from "@/context/CampusContext";
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  Home, 
  Compass, 
  ArrowLeftRight, 
  PlusCircle, 
  Radio, 
  ExternalLink,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
  const {
    campuses,
    activeCampus,
    homeCampus,
    isPeeking,
    setActiveCampusById,
    returnToHomeCampus,
    setIsDevModalOpen,
    searchQuery,
    setSearchQuery,
    filteredCampuses,
    setIsCampusSwitcherOpen,
  } = useCampus();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Peeking Alert Bar - appears when peeking into external campus */}
      {isPeeking && (
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              Peeking into <strong className="text-white">{activeCampus.name}</strong> ({activeCampus.city})
            </span>
          </div>
          <button
            onClick={returnToHomeCampus}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-100 font-medium transition-colors border border-amber-400/40"
          >
            <Home className="w-3 h-3" />
            <span>Return to Home ({homeCampus.city})</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-glow-sm">
              <Radio className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
                  NEXUS
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Global
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block">
                CampusPulse Micro-Network
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar with Real-time Filter Dropdown */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search any university worldwide..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-slate-900/90 hover:bg-slate-900 border border-slate-800 focus:border-blue-500 text-sm text-slate-100 placeholder-slate-500 rounded-full pl-10 pr-4 py-2 outline-none transition-all shadow-inner focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              <div className="p-2 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span>CAMPUS DIRECTORY ({filteredCampuses.length})</span>
                <span className="text-[10px] text-slate-500">Click to switch or peek</span>
              </div>
              {filteredCampuses.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No campuses found for &ldquo;{searchQuery}&rdquo;.
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setIsDevModalOpen(true);
                    }}
                    className="block mt-2 mx-auto text-xs text-blue-400 hover:underline"
                  >
                    + Register your university node now
                  </button>
                </div>
              ) : (
                filteredCampuses.map((campus) => {
                  const isCurrent = campus.id === activeCampus.id;
                  const isHome = campus.id === homeCampus.id;

                  return (
                    <button
                      key={campus.id}
                      onClick={() => {
                        setActiveCampusById(campus.id);
                        setIsSearchOpen(false);
                      }}
                      className={`w-full text-left p-3 hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-2 border-b border-slate-800/40 last:border-none ${
                        isCurrent ? "bg-blue-600/10" : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-slate-200 truncate">
                            {campus.name}
                          </span>
                          {campus.is_verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{campus.city}, {campus.country}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isHome && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Home
                          </span>
                        )}
                        {isCurrent ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 group-hover:text-blue-400">
                            Peek &rarr;
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Campus Switcher & Developer Spin-up Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Campus Badge Dropdown Trigger */}
          <button
            onClick={() => setIsCampusSwitcherOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all hover:bg-slate-850"
            title="Switch or manage campus"
          >
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                {isPeeking ? "Peeking Campus" : "Home Campus"}
              </span>
              <span className="font-semibold text-xs text-blue-400 truncate max-w-[120px] sm:max-w-[150px]">
                {activeCampus.name.split(" ")[0]} ({activeCampus.city})
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dev Portal: Spin up a campus button */}
          <button
            onClick={() => setIsDevModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm transition-all transform active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Spin up Campus</span>
          </button>
        </div>
      </div>
    </header>
  );
}
