import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "../data/site";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";

const slug = (c) => c.toLowerCase().replace(/[^a-z]+/g, "-");

export default function Products() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "All";
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!needle || `${p.name} ${p.blurb} ${p.category}`.toLowerCase().includes(needle))
    );
  }, [category, q]);

  const setCategory = (c) => setParams(c === "All" ? {} : { category: c });

  return (
    <div data-testid="products-page">
      <section className="grain bg-charcoal pt-32 pb-14 text-bone">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-tape" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-tape">Product Catalogue</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight leading-[1.02] sm:text-5xl lg:text-6xl">Everything for the dispatch floor.</h1>
          <p className="mt-4 max-w-xl text-bone/70">
            The Al Lulu catalogue — corrugated products, boxes, tapes, protective films and accessories, supplied by quotation.
          </p>
        </div>
      </section>

      <section className="bg-bone py-10 lg:py-14">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Product categories" data-testid="product-category-tabs">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={category === c}
                  onClick={() => setCategory(c)}
                  data-testid={`product-category-tab-${slug(c)}`}
                  className={`px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] border transition-colors ${
                    category === c ? "border-charcoal bg-charcoal text-bone" : "border-line bg-white text-charcoal/70 hover:border-charcoal/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative lg:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                data-testid="product-search-input"
                className="field pl-10"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Clear search" data-testid="product-search-clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-charcoal">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400" data-testid="product-count">
            {filtered.length} product{filtered.length === 1 ? "" : "s"} · {category}
          </p>

          {filtered.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="product-grid">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06} y={18}>
                  <ProductCard p={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-14 flex flex-col items-center gap-4 py-16 text-center" data-testid="product-empty-state">
              <p className="font-display text-xl font-bold uppercase">No products match your search</p>
              <p className="max-w-sm text-sm text-slate-500">Try a different term, or clear the filters to see the full catalogue.</p>
              <button
                onClick={() => { setQ(""); setCategory("All"); }}
                data-testid="product-search-reset"
                className="border border-charcoal px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-charcoal hover:text-bone"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
