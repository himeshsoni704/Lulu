import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export default function TapeReveal({ children, tone = "kraft", className = "" }) {
  const reduce = useReducedMotion();
  const color = tone === "tape" ? "text-tape" : "text-kraft";
  return (
    <span className={`relative inline-block ${className}`}>
      <span className={`font-mono text-[11px] tracking-[0.28em] uppercase ${color}`}>{children}</span>
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="tape-amber h-[9px] -top-[5px] left-[-8px] w-[calc(100%+16px)] -rotate-1 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
        />
      )}
    </span>
  );
}
