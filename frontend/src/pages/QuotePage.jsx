import { useSearchParams, Link } from "react-router-dom";
import { Mail, MessageCircle, Phone } from "lucide-react";
import QuoteForm from "../components/QuoteForm";
import { COMPANY, WA_GENERAL } from "../data/site";

const STEPS = [
  { num: "01", title: "Review", text: "Our team reviews your requirements against the catalogue." },
  { num: "02", title: "Quotation", text: "We prepare a formal quotation with the sizes and quantities you asked for." },
  { num: "03", title: "Confirm", text: "You approve, and your supply is arranged." },
];

export default function QuotePage() {
  const [params] = useSearchParams();
  const product = params.get("product") || "";

  return (
    <div data-testid="quote-page">
      <section className="grain bg-charcoal pt-32 pb-14 text-bone">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-tape" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-tape">Quotation / Enquiry</span>
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-extrabold uppercase tracking-tight leading-[1.02] sm:text-5xl lg:text-6xl">
            Request a Quotation
          </h1>
          <p className="mt-5 max-w-xl text-bone/70">
            Tell us what you need. This is a quotation request — not a confirmed order. Our team reviews every enquiry and responds with a formal quotation.
          </p>
        </div>
      </section>

      <section className="bg-bone py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-7">
            <QuoteForm initialProduct={product} />
          </div>

          <aside className="lg:col-span-4 lg:col-start-9 space-y-10">
            <div>
              <p className="field-label">What happens next</p>
              <div className="mt-3 space-y-5">
                {STEPS.map((s) => (
                  <div key={s.num} className="flex gap-4 border-t border-line pt-4">
                    <span className="font-mono text-xs text-kraft">{s.num}</span>
                    <div>
                      <h3 className="font-display text-base font-bold uppercase tracking-tight">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-charcoal p-7 text-bone" data-testid="quote-aside-contact">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-tape">Direct lines</p>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-bone/50" />
                  <a href={`tel:${COMPANY.phoneIntl.replace(/\s/g, "")}`} className="hover:text-tape">{COMPANY.phoneDisplay}</a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-bone/50" />
                  <a href={WA_GENERAL} target="_blank" rel="noreferrer" data-testid="quote-aside-whatsapp" className="hover:text-tape">WhatsApp Sales</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-bone/50" />
                  <a href={`mailto:${COMPANY.emailPrimary}`} className="hover:text-tape break-all">{COMPANY.emailPrimary}</a>
                </li>
              </ul>
              <p className="mt-6 border-t border-bone/10 pt-4 text-xs leading-relaxed text-bone/50">
                Prefer to browse first? <Link to="/products" className="underline underline-offset-4 text-bone/80">View the catalogue</Link> and request quotes from any product page.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
