import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function ProductCard({ p }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-sm border border-line bg-white"
      data-testid={`product-card-${p.id}`}
    >
      <Link to={`/products/${p.id}`} className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-paper p-5" aria-label={`View ${p.name}`}>
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.08]"
        />
        <span className="absolute left-3 top-3 bg-charcoal/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-bone">
          {p.category}
        </span>
        <span
          aria-hidden="true"
          className="tape-strip right-[-14px] top-[18px] h-[18px] w-24 -rotate-45 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-bold leading-snug">{p.name}</h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{p.blurb}</p>
        <div className="flex items-center justify-between pt-3">
          <Link
            to={`/products/${p.id}`}
            data-testid={`product-view-${p.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-kraft hover:gap-1.5 transition-all"
          >
            View Product <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to={`/request-quote?product=${encodeURIComponent(p.name)}`}
            data-testid={`product-quote-${p.id}`}
            className="border border-charcoal/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-charcoal hover:text-bone"
          >
            Request Quote
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
