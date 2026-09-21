import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Package, MapPin } from "lucide-react";
import {
  COMPANY, CLIENTS, CAPABILITIES, MANIFESTO, PRODUCTS, INDUSTRIES,
  MARQUEE_ITEMS, IMG, WA_GENERAL,
} from "../data/site";
import Reveal from "../components/Reveal";
import TapeReveal from "../components/TapeReveal";
import Marquee from "../components/Marquee";
import ProductCard from "../components/ProductCard";
import CTABand from "../components/CTABand";
import WayWeSupplySection from "../components/WayWeSupplySection";
import ClientLogoMarquee from "../components/ClientLogoMarquee";

const ease = [0.22, 1, 0.36, 1];
const FEATURED = ["corrugated-boxes", "bopp-brown-tapes", "stretch-film-handgrade", "bubble-rolls", "pizza-boxes", "edge-protector"];

const MaskLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-[0.08em] -mb-[0.06em]">
    <motion.span className="block" initial={{ y: "112%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay, ease }}>
      {children}
    </motion.span>
  </span>
);

export default function Home() {
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const labelX = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const tapeX = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const featured = PRODUCTS.filter((p) => FEATURED.includes(p.id));

  return (
    <div data-testid="home-page">
      {/* ---------- HERO ---------- */}
      <section ref={heroRef} className="grain relative overflow-hidden bg-charcoal text-bone" data-testid="home-hero">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 pt-32 pb-20 sm:px-8 lg:min-h-[92vh] lg:grid-cols-12 lg:px-12 lg:pt-36 lg:pb-24">
          <div className="min-w-0 lg:col-span-7">
            <Reveal y={14}>
              <div className="mb-7 flex items-center gap-3">
                <img src="/logo-light.png" alt="Al Lulu Packaging" className="h-12 w-12 object-contain" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-tape">
                  {COMPANY.name} — Sharjah, UAE — Est. {COMPANY.established}
                </span>
              </div>
            </Reveal>
            <h1 className="font-display text-[clamp(2.1rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.98] tracking-tight">
              <MaskLine delay={0.05}>Packaging</MaskLine>
              <MaskLine delay={0.14}><span className="text-outline">Solutions</span></MaskLine>
              <MaskLine delay={0.23}>Built for</MaskLine>
              <MaskLine delay={0.32}>Business.</MaskLine>
            </h1>
            <Reveal delay={0.5} y={16}>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-bone/70 sm:text-lg">
                Reliable packaging solutions for businesses across the UAE, backed by quality, experience and dependable service.
              </p>
            </Reveal>
            <Reveal delay={0.62} y={16}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link to="/products" data-testid="hero-explore-button" className="group inline-flex items-center gap-2 bg-kraft px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:bg-kraft-dark">
                  Explore Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link to="/request-quote" data-testid="hero-quote-button" className="inline-flex items-center gap-2 border border-bone/40 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:bg-bone hover:text-charcoal">
                  Request a Quote
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <motion.div style={reduce ? {} : { y: imgY }} className="relative mt-2">
              <div className="dieline relative overflow-hidden rounded-sm shadow-2xl">
                <img
                  src={IMG.warehouseHigh}
                  alt="Al Lulu Packaging warehouse — Industrial Area #5, Sharjah"
                  className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[540px]"
                  fetchpriority="high"
                />
                <motion.span aria-hidden="true" style={reduce ? {} : { x: tapeX }} className="tape-strip left-[8%] right-[8%] top-5 h-6 -rotate-2 opacity-90" />
              </div>
              <motion.div style={reduce ? {} : { x: labelX }} className="absolute -bottom-5 left-4 z-[3] border border-line bg-bone px-5 py-4 shadow-xl sm:-left-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-kraft">Warehouse stock — Sharjah</p>
                <p className="mt-1 font-display text-sm font-bold uppercase">Kraft corrugated, sealed &amp; ready</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-7 left-5 hidden items-center gap-3 text-bone/60 sm:left-8 md:flex lg:left-12" data-testid="hero-scroll-cue">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="scroll-cue-line block h-9 w-px bg-bone/50" />
        </div>
      </section>

      <Marquee items={MARQUEE_ITEMS} />

      {/* ---------- CLIENTS (logo marquee) ---------- */}
      <section className="bg-bone" data-testid="clients-section">
        <div className="mx-auto max-w-[1400px] px-5 pt-16 pb-6 sm:px-8 lg:px-12 lg:pt-20">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <TapeReveal>Trust</TapeReveal>
              <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">
                Trusted by businesses across industries
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">Selected names from our client register, as supplied by Al Lulu Packaging.</p>
          </div>
        </div>
        <ClientLogoMarquee />
        <div className="mx-auto max-w-[1400px] px-5 py-4 sm:px-8 lg:px-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
            Client names shown as supplied by Al Lulu Packaging. No partnership, certification or endorsement is implied.
          </p>
        </div>
      </section>

      {/* ---------- WHAT WE DO ---------- */}
      <section className="bg-paper py-20 lg:py-28" data-testid="what-we-do-section">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <TapeReveal>What we do</TapeReveal>
              <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                Packaging that works for your business
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600">
                Al Lulu Packaging supplies the full spread of industrial packaging materials from our base in Sharjah — for factories, contractors, traders and food businesses across the UAE.
              </p>
              <div className="dieline dieline-dark relative mt-10 overflow-hidden rounded-sm">
                <img src={IMG.sealing} alt="Sealing a corrugated box with packaging tape" loading="lazy" className="h-72 w-full object-cover sm:h-80" />
                <span className="tape-strip -right-5 bottom-10 h-6 w-40 rotate-[18deg] opacity-90" aria-hidden="true" />
                <span className="absolute bottom-3 left-3 bg-charcoal/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-bone">Sealed the Al Lulu way</span>
              </div>
            </div>
            <div className="lg:col-span-7">
              {CAPABILITIES.map((c, i) => (
                <Reveal key={c.num} delay={i * 0.06}>
                  <Link to={c.link} data-testid={`capability-${c.num}`} className="group block border-t border-charcoal/10 py-8 transition-colors first:border-t-0 lg:py-9 hover:bg-bone/40">
                    <div className="flex items-start gap-6 px-1 sm:gap-10 sm:px-4">
                      <span className="font-mono text-xs text-kraft">{c.num}</span>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl group-hover:text-kraft transition-colors">{c.title}</h3>
                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">{c.desc}</p>
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">{c.products.join(" · ")}</p>
                      </div>
                      <ArrowRight className="mt-2 h-5 w-5 shrink-0 text-charcoal/30 transition-all group-hover:translate-x-1 group-hover:text-kraft" />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURED PRODUCTS (moved up) ---------- */}
      <section className="bg-bone py-20 lg:py-28" data-testid="featured-products-section">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <TapeReveal>Catalogue</TapeReveal>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Our products</h2>
            </div>
            <Link to="/products" data-testid="featured-view-all" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-kraft hover:gap-3 transition-all">
              Browse the full catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.07}><ProductCard p={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WAY WE SUPPLY + BOX CLOSING ---------- */}
      <WayWeSupplySection />

      {/* ---------- INDUSTRIES PREVIEW ---------- */}
      <section className="border-y border-line bg-paper py-20 lg:py-24" data-testid="industries-preview">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <TapeReveal>Applications</TapeReveal>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Where our packaging goes</h2>
            <Link to="/industries" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-kraft hover:gap-3 transition-all">All industries <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.slice(0, 4).map((ind, i) => (
              <Reveal key={ind.name} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col bg-bone p-7">
                  <span className="font-mono text-[10px] text-kraft">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight">{ind.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{ind.desc}</p>
                  {ind.clients.length > 0 && (
                    <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">Among our clients: {ind.clients.slice(0, 2).join(", ")}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- MAP STRIP ---------- */}
      <section className="bg-bone border-b border-line" data-testid="home-map-strip">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <TapeReveal>Find us</TapeReveal>
              <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">Our location</h2>
              <div className="mt-5 flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-kraft" />
                <div>
                  <p className="font-semibold text-charcoal">{COMPANY.legalName}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{COMPANY.poBox}</p>
                  <p className="text-sm text-slate-600">{COMPANY.address}</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Industrial+Area+5,+Sharjah,+UAE"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-charcoal px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:bg-kraft"
              >
                <MapPin className="h-3.5 w-3.5" /> Open in Google Maps
              </a>
            </div>
            <div className="overflow-hidden rounded-sm border border-line shadow-md">
              <iframe
                title="Al Lulu Packaging location"
                src="https://www.google.com/maps?q=Industrial%20Area%205%2C%20Sharjah%2C%20United%20Arab%20Emirates&output=embed"
                className="h-60 w-full lg:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ROCKY BAND ---------- */}
      <section className="bg-bone" data-testid="rocky-band">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-6 px-5 py-12 sm:px-8 sm:flex-row sm:items-center lg:px-12">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-charcoal text-bone"><Package className="h-5 w-5" /></span>
            <div>
              <p className="font-display font-bold uppercase tracking-tight">Meet Rocky — Al Lulu Packaging Assistant</p>
              <p className="text-sm text-slate-600">Not sure which product you need? Rocky will point you to the right one.</p>
            </div>
          </div>
          <button onClick={() => window.dispatchEvent(new Event("rocky:open"))} data-testid="home-rocky-open"
            className="shrink-0 border border-charcoal px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:bg-charcoal hover:text-bone">
            Ask Rocky
          </button>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
