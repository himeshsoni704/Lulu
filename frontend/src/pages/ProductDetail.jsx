import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { productById, PRODUCTS, waProduct, COMPANY } from "../data/site";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import TapeReveal from "../components/TapeReveal";

export default function ProductDetail() {
  const { id } = useParams();
  const product = productById(id);
  if (!product) return <Navigate to="/products" replace />;

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div data-testid="product-detail-page">
      <section className="bg-charcoal pt-28 pb-10 text-bone">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <Link to="/products" data-testid="pd-back-link" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/60 hover:text-bone transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> All products
          </Link>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-tape">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">{product.name}</h1>
        </div>
      </section>

      <section className="bg-bone py-12 lg:py-16">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <Reveal>
            <div className="dieline dieline-dark relative overflow-hidden rounded-sm border border-line bg-paper">
              <img src={product.image} alt={product.name} className="h-[360px] w-full object-cover sm:h-[480px]" />
              <span className="tape-strip -right-6 top-8 h-6 w-44 rotate-[24deg] opacity-90" aria-hidden="true" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-base leading-relaxed text-slate-700 sm:text-lg">{product.blurb}</p>
            </Reveal>

            {product.variants.length > 0 && (
              <Reveal delay={0.05}>
                <div className="mt-8">
                  <TapeReveal>Options</TapeReveal>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <span key={v} className="border border-charcoal/15 bg-white px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em]">{v}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <div className="mt-8">
                <TapeReveal>Typical applications</TapeReveal>
                <ul className="mt-3 space-y-2">
                  {product.applications.map((a) => (
                    <li key={a} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <Check className="h-4 w-4 shrink-0 text-kraft" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 border-t border-line pt-8">
                <h2 className="font-display text-lg font-extrabold uppercase tracking-tight">Interested in this product?</h2>
                <p className="mt-1.5 text-sm text-slate-600">Request a quotation — tell us the size and quantity and our team responds with a formal quote.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={`/request-quote?product=${encodeURIComponent(product.name)}`}
                    data-testid="pd-request-quote-button"
                    className="bg-kraft px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:bg-kraft-dark"
                  >
                    Request a Quote
                  </Link>
                  <a
                    href={waProduct(product.name)}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="pd-whatsapp-button"
                    className="inline-flex items-center gap-2 border border-[#1FA855] px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[#1FA855] transition-colors hover:bg-[#1FA855] hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp Us
                  </a>
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  Pre-filled message: “Hi, I&apos;m interested in {product.name}. I&apos;d like to request a quotation.” — or call {COMPANY.phoneDisplay}.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">More in {product.category}</h2>
              <Link to="/products" className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-kraft">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}><ProductCard p={p} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
