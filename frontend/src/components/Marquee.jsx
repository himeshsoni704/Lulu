export default function Marquee({ items }) {
  const Row = ({ hidden }) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={`${t}-${i}`} className="flex items-center whitespace-nowrap">
          <span className="px-7 font-mono text-[11px] md:text-xs tracking-[0.3em] uppercase">{t}</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-charcoal/40" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee overflow-hidden bg-tape py-3.5 border-y border-charcoal/15" data-testid="marquee-band">
      <div className="marquee-track flex w-max text-charcoal">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
