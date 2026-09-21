import { Link } from "react-router-dom";
import { COMPANY, IMG } from "../data/site";
import Reveal from "../components/Reveal";
import TapeReveal from "../components/TapeReveal";
import CTABand from "../components/CTABand";

const VALUES = [
  { title: "Dependable supply", text: "Businesses plan around our deliveries. We keep the everyday essentials stocked and answer with straight answers, fast." },
  { title: "The complete catalogue", text: "Corrugated, boxes, tapes, films and protection — one supplier instead of five, with quotations to match." },
  { title: "Business-to-business, always", text: "We speak procurement: quantities, sizes, specifications and formal quotations your purchasing team can work with." },
];

export default function About() {
  return (
    <div data-testid="about-page">
      <section className="grain bg-charcoal pt-32 pb-16 text-bone lg:pb-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo-light.png" alt="Al Lulu Packaging" className="h-8 w-8 object-contain" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-tape">About Al Lulu Packaging — Est. {COMPANY.established}</span>
          </div>
          <h1 className="max-w-4xl font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Packaging experience built around business needs.
          </h1>
          <p className="mt-6 max-w-xl text-bone/70 text-base sm:text-lg">
            A UAE packaging materials company operating from {COMPANY.address}, since {COMPANY.established}.
          </p>
        </div>
      </section>

      <section className="bg-bone py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-5">
            <TapeReveal>The company</TapeReveal>
            <h2 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Complete packaging, from Sharjah industry.</h2>
            <div className="mt-6 flex items-center gap-4 border border-line bg-paper/60 p-4 rounded-sm">
              <img src="/logo.png" alt="Al Lulu Packaging official emblem" className="h-20 w-20 object-contain shrink-0" />
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-wide text-charcoal">{COMPANY.legalName}</p>
                <p className="font-mono text-[11px] text-slate-600 mt-1">{COMPANY.fullAddress}</p>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">Tel: {COMPANY.phoneDisplay} | Fax: {COMPANY.faxDisplay}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6 text-base leading-relaxed text-slate-700">
            <p>
              <strong className="font-semibold text-charcoal">{COMPANY.legalName}</strong> supplies packaging materials to businesses across the UAE — corrugated rolls, sheets and boxes, masking and BOPP tapes, bubble wrap, stretch films, edge protection, paper cores and strapping.
            </p>
            <p>
              Since {COMPANY.established} we have worked the way industrial customers need: a complete catalogue under one roof, practical advice on what fits the product being shipped, and formal quotations prepared properly so purchasing teams can plan with confidence.
            </p>
            <div className="grid gap-6 pt-4 sm:grid-cols-3">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.07}>
                  <div className="border-t-2 border-kraft pt-4">
                    <h3 className="font-display text-base font-bold uppercase tracking-tight">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-14 lg:py-20" data-testid="about-facility">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <TapeReveal>Our facility</TapeReveal>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Stocked, stacked and ready in Industrial Area #5</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-sm">
                <img src={IMG.facility} alt="Packaging warehouse stocked with corrugated boxes and pallets" loading="lazy" className="h-[320px] w-full object-cover sm:h-[440px]" />
                <span className="tape-strip -left-6 top-8 h-6 w-44 -rotate-[18deg] opacity-90" aria-hidden="true" />
                <p className="absolute bottom-3 left-3 bg-charcoal/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-bone">Our facility — Sharjah, UAE</p>
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-4">
              <img src={IMG.warehouseHigh} alt="Warehouse operations with racked packaging stock" loading="lazy" className="h-full min-h-[220px] w-full flex-1 object-cover rounded-sm" />
              <p className="text-sm leading-relaxed text-slate-600">
                Pallets of corrugated boxes, racks of tapes and films, and the handling equipment to load out — the stock our customers phone for is on the floor, not on order.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone py-14 lg:py-20" data-testid="about-operations">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <TapeReveal>Our operations</TapeReveal>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Goods in, goods out</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <img src={IMG.operations} alt="Team handling packaging stock with a forklift" loading="lazy" className="h-72 w-full object-cover rounded-sm sm:h-80" />
            <img src={IMG.loadbay} alt="Loading packaging supply with a forklift" loading="lazy" className="h-72 w-full object-cover rounded-sm sm:h-80" />
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Editorial imagery — to be replaced with official company photography.</p>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
