"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Route, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { getAllRoutes } from "@/lib/api/routes";
import type { RouteData } from "@/lib/types/routes";
import { cn } from "@/lib/utils";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RouteData[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getAllRoutes();
        if (res.success) {
          const q = query.toLowerCase();
          const filtered = res.data.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.routeNumber?.toString().includes(q) ||
              r.origin?.name?.toLowerCase().includes(q) ||
              r.destination?.name?.toLowerCase().includes(q),
          );
          setResults(filtered);
          setOpen(true);
          setHighlighted(-1);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const goToRoute = useCallback(
    (route: RouteData) => {
      setOpen(false);
      setQuery("");
      router.push(`/manage-routes`);
    },
    [router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlighted >= 0) {
      goToRoute(results[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-2xl hidden md:block">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none"
        size={18}
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search routes by name, number, or stop..."
        className="h-11 pl-12 pr-10 bg-surface-page border-surface-subtle rounded-full focus:ring-brand focus:border-brand w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        autoComplete="off"
      />
      {query && (
        <button
          onClick={() => { setQuery(""); setOpen(false); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
        >
          <X size={15} />
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-surface-subtle z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-subtle animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-1/2 bg-surface-subtle rounded animate-pulse" />
                    <div className="h-2.5 w-1/3 bg-surface-subtle rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-semibold text-content-primary">No routes found</p>
              <p className="text-xs text-content-muted mt-1">
                Try a different route name or number
              </p>
            </div>
          ) : (
            <div className="py-2 max-h-80 overflow-y-auto">
              <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-content-muted">
                Routes — {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((route, i) => (
                <button
                  key={route._id}
                  onClick={() => goToRoute(route)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    highlighted === i
                      ? "bg-brand-light text-brand"
                      : "hover:bg-surface-page",
                  )}
                  onMouseEnter={() => setHighlighted(i)}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                    <Route size={15} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-content-primary truncate">
                      {route.name}
                      {route.routeNumber && (
                        <span className="ml-2 text-xs font-semibold text-content-muted">
                          #{route.routeNumber}
                        </span>
                      )}
                    </p>
                    {(route.origin?.name || route.destination?.name) && (
                      <p className="text-xs text-content-muted truncate">
                        {route.origin?.name}
                        {route.origin?.name && route.destination?.name && " → "}
                        {route.destination?.name}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
