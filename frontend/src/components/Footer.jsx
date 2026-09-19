import { Link } from "react-router-dom";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { COMPANY, WA_GENERAL, CATEGORIES } from "../data/site";

const catLink = (c) => `/products?category=${encodeURIComponent(c)}`;

export default function Footer() {
  return (
    <footer className="grain relative bg-charcoal text-bone" data-testid="site-footer">
      <div className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 lg:px-12 lg:pt-24 pb-10">
        <p className="font-display text-[clamp(2rem,6vw,4.5rem)] font-extrabold uppercase leading-none tracking-tight text-bone/95">
          Al Lulu<br />Packaging
        </p>

        <div className="mt-12 grid gap-10 border-t border-bone/10 pt-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-tape">Company</p>
            <p className="max-w-xs text-sm leading-relaxed text-bone/70">
              Reliable packaging solutions for businesses across the UAE — corrugated products, boxes, tapes and protective films since {COMPANY.established}.
            </p>
            <a href={WA_GENERAL} target="_blank" rel="noreferrer" data-testid="footer-whatsapp-button"
               className="inline-flex items-center gap-2 bg-[#1FA855] px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:scale-[1.03]">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-tape">Products</p>
            <ul className="space-y-2.5 text-sm text-bone/70">
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <li key={c}><Link to={catLink(c)} className="hover:text-bone transition-colors" data-testid={`footer-link-${c.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{c}</Link></li>
              ))}
              <li><Link to="/products" className="hover:text-bone transition-colors">Full catalogue</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-tape">Navigate</p>
            <ul className="space-y-2.5 text-sm text-bone/70">
              <li><Link to="/" className="hover:text-bone">Home</Link></li>
              <li><Link to="/about" className="hover:text-bone">About</Link></li>
              <li><Link to="/what-we-do" className="hover:text-bone">What We Do</Link></li>
              <li><Link to="/industries" className="hover:text-bone">Industries</Link></li>
              <li><Link to="/contact" className="hover:text-bone">Contact</Link></li>
              <li><Link to="/request-quote" className="hover:text-bone text-tape">Request a Quote</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-tape">Contact</p>
            <ul className="space-y-3 text-sm text-bone/70">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bone/50" /><span>{COMPANY.address}</span></li>
              <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-bone/50" /><a href={`tel:${COMPANY.phoneIntl.replace(/\s/g, "")}`} className="hover:text-bone">{COMPANY.phoneDisplay}</a></li>
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-bone/50" />
                <span className="flex flex-col">
                  <a href={`mailto:${COMPANY.emailPrimary}`} className="hover:text-bone break-all">{COMPANY.emailPrimary}</a>
                  <a href={`mailto:${COMPANY.emailSecondary}`} className="hover:text-bone break-all">{COMPANY.emailSecondary}</a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-bone/10 pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/40 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {COMPANY.legalName}</span>
          <span>Industrial Area #5, Sharjah — Est. {COMPANY.established}</span>
        </div>
      </div>
    </footer>
  );
}
