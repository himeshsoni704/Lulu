import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { WA_GENERAL } from "../data/site";

export const WhatsAppFloat = () => (
  <a
    href={WA_GENERAL}
    target="_blank"
    rel="noreferrer"
    aria-label="Chat with us on WhatsApp"
    data-testid="floating-whatsapp-button"
    className="fixed bottom-6 left-6 z-40 hidden items-center gap-2.5 rounded-full bg-[#1FA855] py-3 pl-4 pr-5 text-white shadow-xl transition-transform hover:scale-[1.03] sm:flex"
  >
    <MessageCircle className="h-5 w-5" />
    <span className="text-sm font-semibold">Chat with us on WhatsApp</span>
  </a>
);

export const MobileActionBar = () => (
  <div
    className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 sm:hidden"
    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    data-testid="mobile-action-bar"
  >
    <a
      href={WA_GENERAL}
      target="_blank"
      rel="noreferrer"
      data-testid="mobile-whatsapp-button"
      className="flex items-center justify-center gap-2 bg-[#1FA855] py-3.5 text-sm font-semibold text-white"
    >
      <MessageCircle className="h-4 w-4" /> WhatsApp
    </a>
    <Link
      to="/request-quote"
      data-testid="mobile-quote-button"
      className="flex items-center justify-center gap-2 bg-kraft py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-bone"
    >
      Request a Quote
    </Link>
  </div>
);
