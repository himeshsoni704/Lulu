import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { COMPANY, WA_GENERAL } from "../data/site";
import TapeReveal from "../components/TapeReveal";
import Reveal from "../components/Reveal";

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const fd = new FormData(e.currentTarget);
      const body = Object.fromEntries(fd.entries());
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Could not send. Please try WhatsApp.");
      setDone(true);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <section className="grain bg-charcoal pt-32 pb-14 text-bone">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-tape" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-tape">Contact</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight leading-[1.02] sm:text-5xl lg:text-6xl">Talk to the team.</h1>
          <p className="mt-4 max-w-xl text-bone/70">Call, message on WhatsApp, or leave a note — we respond with straight answers.</p>
        </div>
      </section>

      <section className="bg-bone py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="space-y-8 lg:col-span-5">
            <Reveal>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-charcoal text-bone"><MapPin className="h-4 w-4" /></span>
                  <div>
                    <p className="field-label">Address</p>
                    <p className="text-sm font-semibold sm:text-base">{COMPANY.legalName}</p>
                    <p className="text-sm text-slate-600">{COMPANY.address}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-charcoal text-bone"><Phone className="h-4 w-4" /></span>
                  <div>
                    <p className="field-label">Phone</p>
                    <a href={`tel:${COMPANY.phoneIntl.replace(/\s/g, "")}`} data-testid="contact-phone-link" className="text-sm font-semibold hover:text-kraft sm:text-base">{COMPANY.phoneDisplay}</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-[#1FA855] text-white"><MessageCircle className="h-4 w-4" /></span>
                  <div>
                    <p className="field-label">WhatsApp</p>
                    <a href={WA_GENERAL} target="_blank" rel="noreferrer" data-testid="contact-whatsapp-link" className="text-sm font-semibold hover:underline sm:text-base">Chat with us on WhatsApp</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-charcoal text-bone"><Mail className="h-4 w-4" /></span>
                  <div>
                    <p className="field-label">Email</p>
                    <a href={`mailto:${COMPANY.emailPrimary}`} className="block text-sm hover:text-kraft sm:text-base">{COMPANY.emailPrimary}</a>
                    <a href={`mailto:${COMPANY.emailSecondary}`} className="block text-sm hover:text-kraft sm:text-base">{COMPANY.emailSecondary}</a>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-sm border border-line" data-testid="contact-map">
                <iframe
                  title="Al Lulu Packaging location — Industrial Area #5, Sharjah"
                  src="https://www.google.com/maps?q=Industrial%20Area%205%2C%20Sharjah%2C%20United%20Arab%20Emirates&output=embed"
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <div className="bg-white border border-line rounded-sm p-6 sm:p-10" data-testid="contact-form-card">
                <TapeReveal>Send a message</TapeReveal>
                <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight">We&apos;ll get back to you</h2>
                {done ? (
                  <div className="mt-8 flex flex-col items-center gap-3 py-10 text-center" data-testid="contact-success">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#1FA855] text-white"><Check className="h-6 w-6" /></span>
                    <p className="font-display text-lg font-bold uppercase">Message received</p>
                    <p className="max-w-xs text-sm text-slate-600">Thank you. Our team will get back to you shortly.</p>
                    <Link to="/products" className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-kraft underline underline-offset-4">Continue browsing</Link>
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-7 space-y-5" data-testid="contact-form">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div><label className="field-label" htmlFor="c-name">Name *</label><input id="c-name" name="name" required className="field" placeholder="Your name" data-testid="contact-field-name" /></div>
                      <div><label className="field-label" htmlFor="c-email">Email *</label><input id="c-email" name="email" type="email" required className="field" placeholder="you@company.ae" data-testid="contact-field-email" /></div>
                      <div className="sm:col-span-2"><label className="field-label" htmlFor="c-phone">Phone / WhatsApp</label><input id="c-phone" name="phone" type="tel" className="field" placeholder="+971 …" data-testid="contact-field-phone" /></div>
                      <div className="sm:col-span-2"><label className="field-label" htmlFor="c-msg">Message *</label><textarea id="c-msg" name="message" rows="5" required className="field resize-none" placeholder="How can we help?" data-testid="contact-field-message" /></div>
                    </div>
                    <button type="submit" disabled={sending} data-testid="contact-submit-button"
                      className="inline-flex w-full items-center justify-center gap-3 bg-charcoal px-8 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:bg-ink disabled:opacity-60 sm:w-auto">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {sending ? "Sending…" : "Send Message"}
                    </button>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">For quotations, use the Request a Quote form — it captures sizes and quantities.</p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
