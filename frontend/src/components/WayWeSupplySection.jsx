import React from "react";
import Reveal from "./Reveal";
import TapeReveal from "./TapeReveal";
import { Check } from "lucide-react";

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
  return (
    <section
      className="grain bg-charcoal text-bone overflow-hidden py-24 lg:py-32"
      data-testid="way-we-supply-section"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <TapeReveal tone="tape">Why Al Lulu</TapeReveal>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            The way we supply
          </h2>
          <p className="mt-4 text-base leading-relaxed text-bone/65">
            A decade of direct industrial supply across Sharjah, Dubai and the Northern Emirates.
          </p>
        </div>

        {/* ── 3 PILLARS ── */}
        <div className="mt-14 grid gap-8 md:grid-cols-3 lg:gap-12">
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.08}>
              <div className="flex h-full flex-col border-l-2 border-kraft pl-6">
                <span className="font-display text-5xl font-extrabold text-bone/15 select-none">
                  {s.num}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight sm:text-2xl text-bone">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── PROMISES BAR ── */}
        <div className="mt-16 border border-bone/15 bg-bone/5 p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-tape mb-4">
            Our Standard Delivery Commitment
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map((promise, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-kraft/20 text-kraft">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium text-bone/85">{promise}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
