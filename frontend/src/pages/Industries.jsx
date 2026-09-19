import { Link } from "react-router-dom";
import { INDUSTRIES, PRODUCTS } from "../data/site";
import Reveal from "../components/Reveal";
import TapeReveal from "../components/TapeReveal";
import CTABand from "../components/CTABand";

const byName = (n) => PRODUCTS.find((p) => p.name === n);

export default function Industries() {
  return (
    <div data-testid="industries-page">
      <section className="grain bg-charcoal pt-32 pb-16 text-bone lg:pb-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-tape" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-tape">Industries &amp; Applications</span>
          </div>
          <h1 className="max-w-4xl font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Where our packaging goes.
          </h1>
          <p className="mt-6 max-w-xl text-bone/70 text-base sm:text-lg">
            The industries we supply, built on our client register and the catalogue they draw from.
          </p>
        </div>
      </section>

      <section className="bg-bone py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.name} delay={0.02}>
              <div className="grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-10 lg:py-14" data-testid={`industry-row-${i}`}>
                <div className="lg:col-span-5">
                  <span className="font-mono text-xs text-kraft">0{i + 1}</span>
                  <h2 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl lg:text-4xl">{ind.name}</h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">{ind.desc}</p>
                  {ind.clients.length > 0 && (
                    <p className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-slate-400">
                      Among our clients: {ind.clients.join(", ")}
                    </p>
                  )}
                </div>
                <div className="lg:col-span-7">
                  <p className="field-label">Packaging for this industry</p>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {ind.products.map((name) => {
                      const p = byName(name);
                      return p ? (
                        <Link key={name} to={`/products/${p.id}`} data-testid={`industry-product-${p.id}`}
                          className="group flex items-center justify-between border border-line bg-white px-4 py-3.5 transition-colors hover:border-charcoal">
                          <span className="text-sm font-semibold">{name}</span>
                          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400 group-hover:text-kraft">View</span>
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
          <p className="border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
            Client names shown as supplied by Al Lulu Packaging. No partnership, certification or endorsement is implied.
          </p>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
