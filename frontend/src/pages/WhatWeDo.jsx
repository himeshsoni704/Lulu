import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CAPABILITIES, IMG } from "../data/site";
import Reveal from "../components/Reveal";
import TapeReveal from "../components/TapeReveal";
import CTABand from "../components/CTABand";

const CAPTION_IMG = { "01": IMG.openBoxes, "02": IMG.boxesBrownBg, "03": IMG.sealing, "04": IMG.forklift };

const STEPS = [
  { num: "01", title: "Tell us what you pack", text: "Product, quantity, size or specification, and delivery location — through the quote form, WhatsApp or a phone call." },
  { num: "02", title: "We prepare a formal quotation", text: "Our team reviews your requirement and responds with a quotation your purchasing team can evaluate." },
  { num: "03", title: "You confirm, we supply", text: "Approve the quotation and your order is prepared for collection or delivery." },
];

export default function WhatWeDo() {
  return (
    <div data-testid="what-we-do-page">
      <section className="grain bg-charcoal pt-32 pb-16 text-bone lg:pb-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-tape" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-tape">What We Do</span>
          </div>
          <h1 className="max-w-4xl font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Packaging that works for your business.
          </h1>
          <p className="mt-6 max-w-xl text-bone/70 text-base sm:text-lg">
            From a single pallet of boxes to standing orders of tapes and films — Al Lulu Packaging keeps UAE businesses sealed, strapped and shipped.
          </p>
        </div>
      </section>

      <section className="bg-bone py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <TapeReveal>Capabilities</TapeReveal>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Four families of packaging supply</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.num} delay={(i % 2) * 0.07}>
                <Link to={c.link} data-testid={`wwd-capability-${c.num}`} className="group block overflow-hidden rounded-sm border border-line bg-white">
                  <div className="relative aspect-[16/9] overflow-hidden bg-paper">
                    <img src={CAPTION_IMG[c.num]} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    <span className="absolute left-3 top-3 bg-charcoal/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-bone">{c.num}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold tracking-tight group-hover:text-kraft transition-colors">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.desc}</p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">{c.products.join(" · ")}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-kraft">
                      Browse range <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grain bg-charcoal py-16 text-bone lg:py-24" data-testid="wwd-process">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <TapeReveal tone="tape">How quoting works</TapeReveal>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">From enquiry to supply</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.08}>
                <div className="border-l-2 border-kraft pl-6">
                  <span className="font-display text-5xl font-extrabold text-bone/15">{s.num}</span>
                  <h3 className="mt-3 font-display text-xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone/65">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
