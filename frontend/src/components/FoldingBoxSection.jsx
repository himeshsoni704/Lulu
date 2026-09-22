import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, CheckCircle2, RotateCw } from "lucide-react";
import FoldingBox from "./FoldingBox";

class FoldingBoxErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.warn("FoldingBox error captured by local boundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center p-6 text-center">
          <div className="max-w-md rounded-2xl border border-bone/15 bg-charcoal/80 p-6 backdrop-blur-md">
            <p className="font-mono text-xs uppercase tracking-widest text-tape">Simulation Notice</p>
            <p className="mt-2 text-sm text-bone/80">3D graphic acceleration is currently unavailable in this browser session.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function FoldingBoxSection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Sync with Lenis smooth scrolling if active
    let lenisUnsub = null;
    if (window.__lenis && typeof window.__lenis.on === "function") {
      lenisUnsub = window.__lenis.on("scroll", handleScroll);
    }

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (lenisUnsub && typeof lenisUnsub === "function") lenisUnsub();
      else if (window.__lenis && typeof window.__lenis.off === "function") {
        window.__lenis.off("scroll", handleScroll);
      }
    };
  }, []);

  // Stage label based on scroll progress
  const stageInfo =
    scrollProgress < 0.28
      ? { stage: "01", title: "Flat Die-Cut Blank", sub: "Scroll down to fold walls" }
      : scrollProgress < 0.58
      ? { stage: "02", title: "Vertical Wall Forming", sub: "Walls locking into 90° box" }
      : scrollProgress < 0.88
      ? { stage: "03", title: "Base & Flaps Interlocking", sub: "Top flaps folding inwards" }
      : { stage: "04", title: "Box Sealed & Dispatch Ready", sub: "Security tape sealed across top seam" };

  const isClosed = scrollProgress >= 0.88;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#13110f] text-bone select-none"
      style={{ height: "300vh" }}
      data-testid="folding-box-section"
    >
      {/* ─── STICKY PINNED FULLSCREEN VIEWPORT ─── */}
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden items-center justify-between">
        {/* Subtle atmospheric ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_35%,rgba(196,160,122,0.14),rgba(0,0,0,0))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4.5rem_4.5rem]" />

        {/* ── Top Sleek Brand Tag ── */}
        <header className="relative z-20 flex w-full max-w-[1400px] items-center justify-between px-5 pt-7 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-kraft animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-bone/70 sm:text-xs">
              Al Lulu Packaging • On-Scroll Folding Simulation
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/50 border border-bone/10 px-3 py-1 rounded-full backdrop-blur-sm">
            <RotateCw className="h-3 w-3 text-kraft" />
            <span>Drag box to rotate 3D</span>
          </div>
        </header>

        {/* ── Center Stage: Full Canvas ── */}
        <div className="relative z-10 flex-1 w-full min-h-0 flex items-center justify-center">
          <FoldingBoxErrorBoundary>
            <FoldingBox
              progress={scrollProgress}
              autoRotate={false}
              zoomLevel={1}
              className="h-full w-full"
            />
          </FoldingBoxErrorBoundary>
        </div>

        {/* ── Bottom Floating Status Pill ── */}
        <footer className="relative z-20 w-full max-w-xl px-5 pb-8 sm:px-8">
          <div className="flex flex-col gap-2 rounded-xl border border-bone/15 bg-charcoal/85 p-3.5 shadow-2xl backdrop-blur-md">
            {/* Progress & Stage Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-kraft">
                  {stageInfo.stage} / 04
                </span>
                <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wide text-bone">
                  {stageInfo.title}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-bone/60">
                {isClosed ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="h-3 w-3" /> Sealed
                  </span>
                ) : (
                  <span>{Math.round(scrollProgress * 100)}%</span>
                )}
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-bone/10">
              <div
                className={`h-full transition-all duration-100 ease-out ${
                  isClosed ? "bg-emerald-400" : "bg-gradient-to-r from-kraft to-tape"
                }`}
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>

            {/* Scroll cue text */}
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-bone/50">
              <span>{stageInfo.sub}</span>
              <span className="flex items-center gap-1 animate-bounce">
                {isClosed ? "Continue scrolling down ↓" : "Scroll down ↓"}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
