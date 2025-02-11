"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchArchiveItems, COLLECTIONS, YEARS } from "../../lib/archive";
import ArtifactCard from "./ArtifactCard";
import { ChevronDown, Clock, Info, Archive } from "lucide-react";

export default function TimePortal() {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedMode, setSelectedMode] = useState(""); // mode selection
  const [selectedTheme, setSelectedTheme] = useState(""); // free text for Deep Dive
  const [showFilters, setShowFilters] = useState(false);
  const [seenIds, setSeenIds] = useState(new Set());

  // Ref for the observer's target element
  const observerTarget = useRef(null);

  // Function to load more artifacts
  const loadMoreArtifacts = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const { items } = await fetchArchiveItems(
        selectedYear,
        // When a mode is selected (other than default) ignore the basic collection.
        selectedMode === "" ? selectedCollection : "",
        selectedMode,
        selectedTheme
      );

      if (items && items.length > 0) {
        // Avoid duplicates
        if (!seenIds.has(items[0].identifier)) {
          setArtifacts((prev) => [...prev, items[0]]);
          setSeenIds((prev) => new Set([...prev, items[0].identifier]));
        } else {
          // If duplicate, try loading another artifact.
          loadMoreArtifacts();
        }
      }
    } catch (error) {
      console.error("Error loading artifacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer callback – triggers loadMoreArtifacts when the sentinel is visible
  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        loadMoreArtifacts();
      }
    },
    [loading] // loadMoreArtifacts is defined outside; this callback re-runs when loading changes.
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  // Reload artifacts when filters change.
  useEffect(() => {
    setArtifacts([]);
    setSeenIds(new Set());
    loadMoreArtifacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedCollection, selectedMode, selectedTheme]);

  // Disable background scrolling when the filter panel is open.
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  const getFilterDescription = () => {
    if (selectedMode) {
      switch (selectedMode) {
        case "vintagetube":
          return "VintageTube – Enjoy random historical video clips";
        case "lostmedia":
          return "Lost Media Explorer – Discover forgotten and obscure media";
        case "deepdive":
          return "Deep Dive Mode – Explore curated themes";
        default:
          return "";
      }
    } else if (!selectedYear && !selectedCollection) {
      return "Random content from all years and types";
    } else if (selectedYear && !selectedCollection) {
      return `Random content from ${selectedYear}`;
    } else if (!selectedYear && selectedCollection) {
      return `Random ${COLLECTIONS[selectedCollection]}`;
    } else {
      return `Random ${COLLECTIONS[selectedCollection]} from ${selectedYear}`;
    }
  };

  return (
    <div className="relative">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent pb-16">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-6 h-6" />
              <span className="text-xl font-bold">TimePortal</span>
            </div>
          </a>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
          >
            <span className="text-sm font-medium">Filter Content</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <div
        className={`fixed top-0 right-0 left-0 z-40 h-screen overflow-y-auto bg-black/95 backdrop-blur-sm transition-all duration-300 ${
          showFilters ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-3xl mx-auto p-8 pt-24">
          <div className="mb-8 text-white/80">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-2">
              <Info className="w-5 h-5" />
              About TimePortal
            </h2>
            <p className="mb-4">
              Explore the Internet Archive's vast collection through time.
              Discover historical content, including books, videos, software,
              and more, all with visual representations.
            </p>
            <p className="mb-4">{getFilterDescription()}.</p>
            <p className="mb-4">
              Brought to you with ❤️ by Kyle C{" "}
              <a href="https://linkin.bio/thedevfounder/">@devfounder</a>
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Archive className="w-4 h-4" />
              <span>Powered by Internet Archive</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Year Filter */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Select Year (Optional)
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white"
              >
                <option value="">Random Year</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Collection Filter – shown only if no mode is selected */}
            {(!selectedMode || selectedMode === "") && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Content Type (Optional)
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                >
                  <option value="">Random Type</option>
                  {Object.entries(COLLECTIONS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mode Filter */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Select Mode (Optional)
              </label>
              <select
                value={selectedMode}
                onChange={(e) => {
                  setSelectedMode(e.target.value);
                  // Reset theme when mode changes (if not deepdive)
                  if (e.target.value !== "deepdive") {
                    setSelectedTheme("");
                  }
                }}
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white"
              >
                <option value="">Default</option>
                <option value="vintagetube">VintageTube</option>
                <option value="lostmedia">Lost Media Explorer</option>
                <option value="deepdive">Deep Dive Mode</option>
              </select>
            </div>

            {/* Deep Dive Theme Free Text Input (only for Deep Dive Mode) */}
            {selectedMode === "deepdive" && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Enter Theme Keyword (Optional)
                </label>
                <input
                  type="text"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  placeholder="e.g. 'Space Race' or 'Internet History'"
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 transition-colors"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16">
        {artifacts.map((item, index) => (
          <div key={`${item.identifier}-${index}`} className="h-screen w-full">
            <ArtifactCard
              item={{
                ...item,
                // Fallback to Archive's image service if no thumbnail exists.
                thumbs:
                  item.thumbs && item.thumbs.length > 0
                    ? item.thumbs
                    : [`https://archive.org/services/img/${item.identifier}`],
              }}
            />
          </div>
        ))}

        {/* Sentinel element for the IntersectionObserver */}
        <div ref={observerTarget} className="h-10 -mt-1" />

        {loading && (
          <div className="h-screen w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white" />
          </div>
        )}
      </div>
    </div>
  );
}
