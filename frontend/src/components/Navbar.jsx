import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { WA_GENERAL } from "../data/site";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/what-we-do", label: "What We Do" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Logo = ({ light }) => (
  <Link to="/" className="flex items-center gap-3" data-testid="nav-logo" aria-label="Al Lulu Packaging home">
    <img
      src={light ? "/logo-light.png" : "/logo.png"}
      alt="Al Lulu Packaging Logo"
      className="h-10 w-10 object-contain shrink-0"
    />
    <span className={`font-display text-sm font-extrabold uppercase leading-tight tracking-wide ${light ? "text-bone" : "text-charcoal"}`}>
      Al Lulu<span className="block text-[10px] font-bold tracking-[0.22em] opacity-70">Packaging</span>
    </span>
  </Link>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const overDark = pathname === "/" && !scrolled && !open;
  const textTone = overDark ? "text-bone" : "text-charcoal";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        overDark ? "bg-transparent" : "bg-bone/90 backdrop-blur-md border-b border-line"
      }`}
      data-testid="site-navbar"
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo light={overDark} />

        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${textTone} ${
                  isActive ? "text-kraft" : "opacity-80 hover:opacity-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WA_GENERAL}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with us on WhatsApp"
            data-testid="nav-whatsapp-link"
            className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
              overDark ? "border-bone/30 text-bone hover:bg-bone hover:text-charcoal" : "border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-bone"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <Link
            to="/request-quote"
            data-testid="nav-request-quote-button"
            className="hidden sm:inline-flex items-center gap-2 bg-kraft px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:bg-kraft-dark"
          >
            Request a Quote
          </Link>
          <button
            className={`lg:hidden grid h-10 w-10 place-items-center ${textTone}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            data-testid="nav-mobile-toggle"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-bone/10 bg-charcoal px-5 pb-8 pt-4 text-bone"
            aria-label="Mobile"
            data-testid="nav-mobile-menu"
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block border-b border-bone/10 py-4 font-display text-xl font-bold uppercase ${isActive ? "text-tape" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-6 flex gap-3">
              <Link to="/request-quote" data-testid="nav-mobile-quote-button" className="flex-1 bg-kraft px-4 py-3.5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-bone">
                Request a Quote
              </Link>
              <a href={WA_GENERAL} target="_blank" rel="noreferrer" data-testid="nav-mobile-whatsapp" className="grid h-12 w-12 place-items-center bg-[#1FA855] text-white" aria-label="WhatsApp">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
