import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { COMPANY, WA_GENERAL } from "../data/site";

export const WhatsAppFloat = () => (
  <div className="fixed bottom-6 left-6 z-40 hidden flex-col gap-2 sm:flex">
    <a
      href={`mailto:${COMPANY.emailPrimary}`}
      aria-label="Send us an email"
      data-testid="floating-email-button"
      title={COMPANY.emailPrimary}
      className="flex items-center gap-2.5 rounded-full bg-charcoal py-3 pl-4 pr-5 text-white shadow-xl transition-all hover:scale-[1.03] hover:bg-kraft"
    >
      <Mail className="h-5 w-5" />
      <span className="text-sm font-semibold">Email us</span>
    </a>
    <a
      href={WA_GENERAL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      data-testid="floating-whatsapp-button"
      className="flex items-center gap-2.5 rounded-full bg-[#1FA855] py-3 pl-4 pr-5 text-white shadow-xl transition-transform hover:scale-[1.03]"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-semibold">Chat on WhatsApp</span>
    </a>
  </div>
);

export const MobileActionBar = () => (
  <div
    className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 sm:hidden"
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    data-testid="mobile-action-bar"
  >
    <a
      href={`mailto:${COMPANY.emailPrimary}`}
      data-testid="mobile-email-button"
      className="flex items-center justify-center gap-1.5 bg-charcoal py-3.5 text-sm font-semibold text-white"
    >
      <Mail className="h-4 w-4" /> Email
    </a>
    <a
      href={WA_GENERAL}
      target="_blank"
      rel="noreferrer"
      data-testid="mobile-whatsapp-button"
      className="flex items-center justify-center gap-1.5 bg-[#1FA855] py-3.5 text-sm font-semibold text-white"
    >
      <MessageCircle className="h-4 w-4" /> WhatsApp
    </a>
    <Link
      to="/request-quote"
      data-testid="mobile-quote-button"
      className="flex items-center justify-center gap-1.5 bg-kraft py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-bone"
    >
      Quote
    </Link>
  </div>
);
