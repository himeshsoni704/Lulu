import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS, WA_GENERAL, COMPANY } from "../data/site";

const Worker = ({ flip }) => (
  <svg width="26" height="34" viewBox="0 0 22 30" aria-hidden="true" style={{ transform: flip ? "scaleX(-1)" : "none" }}>
    <path d="M4.5 8 a6.5 5 0 0 1 13 0 Z" fill="#D9A036" />
    <rect x="2.5" y="7.4" width="17" height="2.2" rx="1.1" fill="#C88D2D" />
    <circle cx="11" cy="12" r="3" fill="#B9A68C" />
    <rect x="5.5" y="15.5" width="11" height="8.5" rx="2.4" fill="#A05A2C" />
    <rect x="7" y="24.5" width="3" height="5" rx="1" fill="#1A202C" />
    <rect x="12" y="24.5" width="3" height="5" rx="1" fill="#1A202C" />
  </svg>
);

const ease = [0.22, 1, 0.36, 1];

const QuoteSuccess = ({ onReset }) => {
  const reduce = useReducedMotion();
  const seq = (i) => (reduce ? {} : { delay: i });

  const stage = (children) =>
    reduce ? <div>{children}</div> : children;

  return (
    <div className="flex flex-col items-center px-4 py-8 text-center" data-testid="quote-success">
      <div className="relative h-48 w-64" aria-hidden="true">
        <motion.div className="absolute bottom-1 left-1/2 h-3 w-44 -translate-x-1/2 rounded-[50%] bg-charcoal/10"
          initial={reduce ? {} : { opacity: 0, scaleX: 0.4 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.4, ease: "easeOut" }} />

        <motion.div className="absolute bottom-3 left-1/2 -translate-x-1/2"
          initial={reduce ? {} : { opacity: 0, y: 26, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease }}>
          <motion.div animate={reduce ? {} : { y: [0, -7, 0] }} transition={{ delay: 1.65, duration: 0.38, ease: "easeInOut" }} className="relative h-24 w-40">
            <div className="relative h-full w-full overflow-hidden rounded-[3px] border border-[#9a6d3d] bg-gradient-to-b from-[#C89A63] to-[#AF7F4A]">
              <div className="absolute inset-x-0 top-0 h-3 bg-[#B58A54]/90" />
              <motion.div className="absolute left-1/2 top-6 w-[74px] -translate-x-1/2 rounded-[2px] border border-line bg-bone px-1.5 py-1 text-left"
                initial={reduce ? {} : { opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25, ease: "backOut" }}>
                <div className="h-[3px] w-8 bg-charcoal/60" />
                <div className="mt-1 h-[2px] w-full bg-charcoal/20" />
                <div className="mt-[3px] h-[2px] w-2/3 bg-charcoal/20" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-4 left-0 sm:left-2" initial={reduce ? {} : { x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.35, ease: "easeOut" }}>
          <Worker flip />
        </motion.div>
        <motion.div className="absolute bottom-4 right-0 sm:right-2" initial={reduce ? {} : { x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.35, ease: "easeOut" }}>
          <Worker />
        </motion.div>

        <motion.div className="tape-amber left-1/2 top-[74px] h-[13px] w-44 -translate-x-1/2 -rotate-1"
          initial={reduce ? {} : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45, ease, delay: 1.15 }} />
      </div>

      {stage(
        <motion.div initial={reduce ? {} : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 1.95 }} className="mt-6 flex flex-col items-center">
          <span className="tape-amber -rotate-1 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-charcoal">Sealed &amp; logged</span>
          <h3 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-tight" data-testid="quote-success-title">Quotation Request Received</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">Thank you. Our team will review your requirements and get back to you.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/products" data-testid="quote-success-continue" className="bg-charcoal px-6 py-3.5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:bg-ink">Continue Browsing</Link>
            <a href={WA_GENERAL} target="_blank" rel="noreferrer" data-testid="quote-success-whatsapp" className="inline-flex items-center justify-center gap-2 bg-[#1FA855] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white">Chat on WhatsApp</a>
          </div>
          <button onClick={onReset} data-testid="quote-success-reset" className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 underline underline-offset-4 hover:text-charcoal">Submit another request</button>
        </motion.div>
      )}
    </div>
  );
};

export default function QuoteForm({ initialProduct = "" }) {
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  const extraOption = initialProduct && !PRODUCTS.some((p) => p.name === initialProduct);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/quote`, {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Submission failed. Please try WhatsApp.");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  const GroupHead = ({ num, title }) => (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] text-kraft">{num}</span>
      <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em]">{title}</h3>
      <span className="h-px flex-1 bg-line" />
    </div>
  );

  return (
    <div data-testid="quote-form" className="bg-white border border-line rounded-sm p-6 sm:p-10 shadow-sm">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <QuoteSuccess onReset={() => setDone(false)} />
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.28 } }}
            initial={false}
            className="space-y-9"
          >
            <div className="space-y-5">
              <GroupHead num="01" title="Your Details" />
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="field-label" htmlFor="q-name">Name *</label><input id="q-name" name="name" required className="field" placeholder="Your name" data-testid="quote-field-name" /></div>
                <div><label className="field-label" htmlFor="q-company">Company Name *</label><input id="q-company" name="company" required className="field" placeholder="Your company" data-testid="quote-field-company" /></div>
                <div><label className="field-label" htmlFor="q-email">Email *</label><input id="q-email" name="email" type="email" required className="field" placeholder="you@company.ae" data-testid="quote-field-email" /></div>
                <div><label className="field-label" htmlFor="q-phone">Phone / WhatsApp *</label><input id="q-phone" name="phone" type="tel" required className="field" placeholder="+971 …" data-testid="quote-field-phone" /></div>
              </div>
            </div>

            <div className="space-y-5">
              <GroupHead num="02" title="What Do You Need?" />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="q-product">Product / Category</label>
                  <select id="q-product" name="product" className="field" defaultValue={initialProduct} data-testid="quote-field-product">
                    <option value="">Select a product or category…</option>
                    {extraOption && <option value={initialProduct}>{initialProduct}</option>}
                    {PRODUCTS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                    <option value="Other / Multiple products">Other / Multiple products</option>
                  </select>
                </div>
                <div><label className="field-label" htmlFor="q-qty">Quantity</label><input id="q-qty" name="quantity" className="field" placeholder="e.g. 500 pcs / 10 rolls" data-testid="quote-field-quantity" /></div>
                <div><label className="field-label" htmlFor="q-size">Required Size / Specification</label><input id="q-size" name="size_spec" className="field" placeholder="e.g. 40 × 30 × 25 cm" data-testid="quote-field-size" /></div>
                <div className="sm:col-span-2"><label className="field-label" htmlFor="q-delivery">Delivery Location</label><input id="q-delivery" name="delivery_location" className="field" placeholder="e.g. Dubai Investment Park" data-testid="quote-field-delivery" /></div>
              </div>
            </div>

            <div className="space-y-5">
              <GroupHead num="03" title="Additional Information" />
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="field-label" htmlFor="q-date">Required Date</label><input id="q-date" name="required_date" type="date" className="field" data-testid="quote-field-date" /></div>
                <div><label className="field-label" htmlFor="q-file">Upload File / Photo (optional)</label><input id="q-file" name="file" type="file" className="field bg-transparent py-1.5 file:mr-3 file:border-0 file:bg-paper file:px-3 file:py-1.5 file:font-mono file:text-[10px] file:uppercase file:tracking-widest" data-testid="quote-field-file" /></div>
                <div className="sm:col-span-2"><label className="field-label" htmlFor="q-notes">Additional Requirements</label><textarea id="q-notes" name="notes" rows="4" className="field resize-none" placeholder="Palletisation, print/branding, delivery notes…" data-testid="quote-field-notes" /></div>
              </div>
            </div>

            <div className="border-t border-line pt-7">
              <button type="submit" disabled={sending} data-testid="quote-form-submit-button"
                className="inline-flex w-full items-center justify-center gap-3 bg-kraft px-8 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:bg-kraft-dark disabled:opacity-60 sm:w-auto">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {sending ? "Sending…" : "Request Quotation"}
              </button>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">This is a quotation / enquiry request — not a confirmed purchase.</p>
              <p className="mt-2 text-sm text-slate-600">
                Prefer WhatsApp?{" "}
                <a href={WA_GENERAL} target="_blank" rel="noreferrer" data-testid="quote-form-whatsapp-alt" className="font-semibold text-[#1FA855] underline underline-offset-4">
                  Send your requirements directly <ArrowUpRight className="inline h-3.5 w-3.5" />
                </a>{" "}
                or call {COMPANY.phoneDisplay}.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
