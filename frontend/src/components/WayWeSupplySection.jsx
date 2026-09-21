import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ─── Cardboard colours ─── */
const C = {
  front:  "linear-gradient(160deg, #D4A85A 0%, #B8883A 100%)",
  side:   "linear-gradient(180deg, #A07030 0%, #8B5E22 100%)",
  top:    "linear-gradient(180deg, #C09040 0%, #A07030 100%)",
  dark:   "#7A5218",
  border: "2px solid #4A3010",
  tape:   "repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 18px,rgba(0,0,0,.06) 18px 22px), linear-gradient(180deg,rgba(230,210,180,.95),rgba(200,175,140,.95))",
  corrugation: "repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 13px,rgba(0,0,0,.07) 13px 15px)",
};

/* ─── CSS 3-D box ─── */
function Box3D({ p }) {
  const reduce = useReducedMotion();

  // p: 0 = wide open, 1 = fully closed
  // Front flap swings from -88° (open/standing up) → 0° (flat/closed)
  // Back  flap swings from +88° → 0°
  // L/R   flaps swing from ±72° → 0°
  const fF  = reduce ? 0 : -88 + p * 88;   // front flap X
  const bF  = reduce ? 0 :  88 - p * 88;   // back  flap X
  const lF  = reduce ? 0 : -72 + p * 72;   // left  flap Y
  const rF  = reduce ? 0 :  72 - p * 72;   // right flap Y

  const sealO = Math.max(0, (p - 0.7) / 0.3);   // 0→1 in last 30%
  const tapeO = Math.max(0, (p - 0.75) / 0.25);

  const W  = 230;   // box width
  const H  = 175;   // box height
  const D  = 230;   // box depth (same as W → square footprint)
  const FH = 115;   // flap height
  const SD = 70;    // visible side depth

  const face = (style) => ({
    position: "absolute",
    boxSizing: "border-box",
    border: C.border,
    ...style,
  });

  return (
    <div
      style={{
        perspective: "700px",
        perspectiveOrigin: "55% 45%",
        width: W + SD + 60,
        height: H + FH + 80,
        flexShrink: 0,
      }}
    >
      {/* Whole box assembly, tilted for 3-D view */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(12deg) rotateY(-28deg)",
          position: "relative",
          width: W,
          height: H,
          marginTop: FH + 40,
          marginLeft: 30,
        }}
      >
        {/* ══ STATIC BODY ══ */}

        {/* Front face */}
        <div style={face({
          width: W, height: H, left: 0, top: 0,
          background: `${C.corrugation}, ${C.front}`,
        })}>
          {/* Brand label – fades in when sealed */}
          <div style={{
            position: "absolute", bottom: 18, left: "50%",
            transform: "translateX(-50%)",
            opacity: sealO,
            background: "#F8F6F0",
            border: "1.5px solid #4A3010",
            padding: "7px 14px",
            textAlign: "center",
            minWidth: 155,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}>
            <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 7, letterSpacing: "0.22em", textTransform: "uppercase", color: "#A07030", margin: 0 }}>
              Sharjah, U.A.E · Est. 2013
            </p>
            <p style={{ fontFamily: "Georgia,serif", fontSize: 13, fontWeight: "bold", textTransform: "uppercase", color: "#121619", margin: "3px 0 0" }}>
              Al Lulu Packaging
            </p>
            <div style={{ height: 2, background: "#C8A446", margin: "4px 0" }} />
            <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 7, color: "#6B7280", letterSpacing: "0.12em", margin: 0 }}>
              SEALED &amp; DISPATCH READY
            </p>
          </div>
        </div>

        {/* Right side face (depth) */}
        <div style={face({
          width: SD, height: H,
          left: W - 2, top: 0,
          background: `${C.corrugation}, ${C.side}`,
          transform: `skewY(-12deg)`,
          transformOrigin: "left top",
          borderLeft: "none",
        })} />

        {/* Top edge strip (visible opening rim) */}
        <div style={face({
          width: W, height: SD * 0.55,
          left: 0, top: -SD * 0.55,
          background: `${C.corrugation}, ${C.top}`,
          transform: `skewX(-28deg)`,
          transformOrigin: "bottom left",
          borderBottom: "none",
        })} />

        {/* ══ ANIMATED FLAPS ══ */}

        {/* Front flap — pivots on bottom edge → swings down to close */}
        <motion.div
          style={face({
            width: W, height: FH,
            left: 0, top: -FH - 2,
            background: `${C.corrugation}, ${C.front}`,
            transformOrigin: "bottom center",
            transformStyle: "preserve-3d",
            zIndex: 10,
          })}
          animate={{ rotateX: fF }}
          transition={{ duration: 0 }}
        >
          {/* Tape seal */}
          <div style={{
            position: "absolute",
            top: "45%", left: -10, right: -10, height: 18,
            opacity: tapeO,
            background: C.tape,
            boxShadow: "0 1px 4px rgba(0,0,0,.25)",
            transition: "opacity .1s",
          }} />
        </motion.div>

        {/* Back flap — pivots on bottom edge → swings up to close */}
        <motion.div
          style={face({
            width: W, height: FH,
            left: 0, top: -FH - 2,
            background: `${C.corrugation}, ${C.top}`,
            transformOrigin: "bottom center",
            zIndex: 5,
          })}
          animate={{ rotateX: bF }}
          transition={{ duration: 0 }}
        />

        {/* Left flap */}
        <motion.div
          style={face({
            width: FH * 0.88, height: FH,
            left: 0, top: -FH - 2,
            background: `${C.corrugation}, ${C.side}`,
            transformOrigin: "right center",
            zIndex: 8,
          })}
          animate={{ rotateY: lF }}
          transition={{ duration: 0 }}
        />

        {/* Right flap */}
        <motion.div
          style={face({
            width: FH * 0.88, height: FH,
            right: 0, top: -FH - 2,
            background: `${C.corrugation}, ${C.side}`,
            transformOrigin: "left center",
            zIndex: 8,
          })}
          animate={{ rotateY: rF }}
          transition={{ duration: 0 }}
        />
      </div>
    </div>
  );
}

/* ─── Promises list ─── */
const PROMISES = [
  "On-time dispatch from Sharjah",
  "Formal quotation within 24 hours",
  "Full-range supply under one roof",
  "Quality checked before it leaves",
];

/* ─── 01 02 03 supply steps ─── */
const STEPS = [
  {
    num: "01",
    title: "One supplier. The full range.",
    text: "Corrugated products, boxes, tapes, protective films and accessories — the catalogue our customers rely on, all under one roof.",
  },
  {
    num: "02",
    title: "Rooted in Sharjah industry.",
    text: "Operating from Industrial Area #5 since 2013, close to the UAE's manufacturing and logistics corridors.",
  },
  {
    num: "03",
    title: "Supply built for business.",
    text: "Quotation-based B2B supply. Tell us the product, the size and the quantity — our team responds with a formal quotation.",
  },
];

export default function WayWeSupplySection() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  /* Drive animation from raw scroll – tight window so box closes fast */
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;
      // Close happens while the TOP of the section travels from 70% → 10% of viewport
      const start = vh * 0.70;
      const end   = vh * 0.10;
      const raw   = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="grain bg-charcoal text-bone overflow-hidden"
      data-testid="way-we-supply-section"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-24 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-start">

          {/* ── LEFT: 01 02 03 ── */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tape mb-4">
              Why Al Lulu
            </p>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl mb-14">
              The way<br />we supply
            </h2>

            <div className="divide-y divide-bone/10">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex items-start gap-8 py-9">
                  <span
                    className="font-display font-extrabold shrink-0 leading-none select-none"
                    style={{ fontSize: "clamp(3rem,5.5vw,4.2rem)", color: "rgba(248,246,240,0.08)" }}
                  >
                    {s.num}
                  </span>
                  <div className="flex-1 border-l-2 border-kraft pl-7">
                    <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-bone/60">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Box + Promises (sticky) ── */}
          <div className="flex flex-col items-center gap-10 lg:pt-16 lg:sticky lg:top-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tape self-start lg:self-center">
              Promises we deliver
            </p>

            {/* 3-D animated box */}
            <Box3D p={progress} />

            {/* Progress indicator */}
            <div className="w-full max-w-xs">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-tape">
                  {progress < 0.25 ? "Box open" : progress < 0.6 ? "Flaps folding…" : progress < 0.9 ? "Sealing…" : "Sealed & ready"}
                </span>
                <div className="flex-1 h-px bg-bone/10">
                  <div
                    className="h-px bg-kraft transition-all duration-75"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>

              {/* Promises */}
              <ul className="flex flex-col gap-3 border border-bone/12 bg-bone/5 p-5">
                {PROMISES.map((promise, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-kraft flex items-center justify-center"
                      style={{ background: "rgba(160,90,44,0.12)" }}
                    >
                      <span className="block h-1.5 w-1.5 rounded-full bg-kraft" />
                    </span>
                    <span className="text-sm leading-snug text-bone/75">{promise}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
