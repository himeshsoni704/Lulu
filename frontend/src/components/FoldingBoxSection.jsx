import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, ZoomIn, ZoomOut, RotateCcw, Box, Sparkles, CheckCircle2 } from "lucide-react";
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

const STAGES = [
  { id: 1, label: "Flat Die-Cut Sheet", desc: "Precision fluting and scorelines laid flat.", target: 0 },
  { id: 2, label: "Vertical Wall Forming", desc: "Walls rise 90° into an upright box structure.", target: 0.38 },
  { id: 3, label: "Base Flaps Interlocked", desc: "Lower flaps fold inwards to form a rigid floor.", target: 0.68 },
  { id: 4, label: "Sealed & Dispatch Ready", desc: "Top lid closes flush, ready for strapping & freight.", target: 1 },
];

export default function FoldingBoxSection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualProgress, setManualProgress] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Active progress is manual override if recently clicked, otherwise scroll-driven
  const currentProgress = manualProgress !== null ? manualProgress : scrollProgress;

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      // When the top of section hits the top of viewport:
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setScrollProgress(progress);

      // If user starts scrolling again, resume scroll-driven progress
      if (manualProgress !== null) {
        setManualProgress(null);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [manualProgress]);

  // Current active stage
  const activeStage =
    currentProgress < 0.25 ? 1 : currentProgress < 0.55 ? 2 : currentProgress < 0.88 ? 3 : 4;

  const handleZoom = (delta) => {
    setZoomLevel((z) => Math.max(0.6, Math.min(1.8, Number((z + delta).toFixed(2)))));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setManualProgress(0);
    setAutoRotate(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#161412] text-bone"
      style={{ height: "240vh" }}
      data-testid="folding-box-section"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        {/* Ambient background accents */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(191,165,136,0.15),rgba(0,0,0,0))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Top Header Bar */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 pt-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded bg-kraft/20 text-kraft">
              <Box className="h-4 w-4" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-tape">
                Interactive 3D Simulation
              </p>
              <h2 className="font-display text-base font-extrabold uppercase tracking-wide text-bone sm:text-lg">
                On-Scroll Folding Cardboard Box
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded border border-bone/15 bg-charcoal/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-bone/70 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-kraft" />
            <span>Scroll down to fold • Drag to rotate 3D</span>
          </div>
        </div>

        {/* Center Canvas & Side Narrative */}
        <div className="relative z-10 mx-auto flex flex-1 w-full max-w-[1400px] flex-col lg:flex-row items-center px-5 sm:px-8 lg:px-12">
          {/* Left Narrative Column */}
          <div className="w-full lg:w-[380px] shrink-0 pt-4 lg:pt-0 z-20">
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-tape">
                Stage 0{activeStage} of 04
              </p>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-bone sm:text-3xl">
                {STAGES[activeStage - 1].label}
              </h3>
              <p className="text-sm leading-relaxed text-bone/70">
                {STAGES[activeStage - 1].desc}
              </p>
            </div>

            {/* Stage Selector Pills */}
            <div className="mt-6 flex flex-wrap lg:flex-col gap-2">
              {STAGES.map((s) => {
                const isSelected = activeStage === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setManualProgress(s.target)}
                    className={`flex items-center gap-2.5 rounded px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wider transition-all ${
                      isSelected
                        ? "bg-kraft text-bone shadow-md"
                        : "border border-bone/10 bg-charcoal/40 text-bone/60 hover:border-bone/30 hover:text-bone"
                    }`}
                  >
                    <span className="shrink-0">{isSelected ? <CheckCircle2 className="h-3.5 w-3.5" /> : `0${s.id}`}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Progress Meter */}
            <div className="mt-6 hidden lg:block">
              <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-bone/40 mb-1.5">
                <span>Fold Progress</span>
                <span>{Math.round(currentProgress * 100)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-bone/10">
                <div
                  className="h-full bg-kraft transition-all duration-150 ease-out"
                  style={{ width: `${Math.round(currentProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: 3D Three.js Canvas Container */}
          <div className="relative flex-1 h-[45vh] lg:h-[75vh] w-full min-w-0">
            <FoldingBoxErrorBoundary>
              <FoldingBox
                progress={currentProgress}
                autoRotate={autoRotate}
                zoomLevel={zoomLevel}
                className="h-full w-full"
              />
            </FoldingBoxErrorBoundary>

            {/* Floating Interaction Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-bone/15 bg-charcoal/80 p-1.5 shadow-2xl backdrop-blur-md">
              <button
                onClick={() => setAutoRotate((v) => !v)}
                title={autoRotate ? "Pause Auto-Rotation" : "Enable Auto-Rotation"}
                className={`grid h-8 w-8 place-items-center rounded transition-colors ${
                  autoRotate ? "bg-kraft text-bone" : "text-bone/70 hover:text-bone hover:bg-bone/10"
                }`}
              >
                {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>

              <div className="h-4 w-px bg-bone/20" />

              <button
                onClick={() => handleZoom(0.2)}
                title="Zoom In"
                disabled={zoomLevel >= 1.8}
                className="grid h-8 w-8 place-items-center rounded text-bone/70 transition-colors hover:bg-bone/10 hover:text-bone disabled:opacity-30"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleZoom(-0.2)}
                title="Zoom Out"
                disabled={zoomLevel <= 0.6}
                className="grid h-8 w-8 place-items-center rounded text-bone/70 transition-colors hover:bg-bone/10 hover:text-bone disabled:opacity-30"
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              <div className="h-4 w-px bg-bone/20" />

              <button
                onClick={handleReset}
                title="Reset View"
                className="grid h-8 w-8 place-items-center rounded text-bone/70 transition-colors hover:bg-bone/10 hover:text-bone"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Cue */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 pb-5 sm:px-8 lg:px-12 text-bone/40 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span>Corrugated Fluting Frequency: 5.0 • 3-Ply Board</span>
          <span className="animate-pulse">↓ Continue scrolling down</span>
        </div>
      </div>
    </section>
  );
}
