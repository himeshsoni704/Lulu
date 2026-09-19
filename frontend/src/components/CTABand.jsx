import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { WA_GENERAL } from "../data/site";
import Reveal from "./Reveal";

export default function CTABand() {
  return (
    <section className="bg-kraft text-bone" data-testid="cta-band">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:px-12 lg:py-20">
        <Reveal>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-bone/70">Ready when you are</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-4xl lg:text-5xl">
              Tell us what you pack.<br />We&apos;ll quote it.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-3">
            <Link to="/request-quote" data-testid="cta-quote-button" className="bg-charcoal px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:bg-ink">Request a Quote</Link>
            <a href={WA_GENERAL} target="_blank" rel="noreferrer" data-testid="cta-whatsapp-button" className="inline-flex items-center gap-2 bg-[#1FA855] px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
