import { CSSProperties } from "react";

const LINCOLN = "'Lincoln', 'Cinzel Decorative', 'Rye', 'Cinzel', Georgia, serif";
const ALGERIAN = "Algerian, 'Cinzel Decorative', 'Rye', 'Cinzel', Georgia, serif";

interface Props {
  line1?: string;
  line2?: string;
  color?: string;
  /** Responsive base size for the 42px letters (CSS length / clamp). */
  size?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Brand wordmark with per-letter typography:
 *  S (start of Shrivinayak) - Lincoln, capital, 42px base
 *  hrivinayak               - Algerian, 42px base
 *  I (start of Industries)  - Algerian, 48px base (1.143em)
 *  ndustrie                 - Algerian, 42px base
 *  s (end of Industries)    - Lincoln, capital, 42px base
 * Sizes scale responsively from the `size` base.
 */
const BrandName = ({
  line1 = "Shrivinayak",
  line2 = "Industries",
  color,
  size = "clamp(0.95rem, 2.2vw, 2.625rem)",
  className = "",
  style,
}: Props) => {
  const l1 = (line1 || "").trim();
  const l2 = (line2 || "").trim();
  const s1 = l1.slice(0, 1).toUpperCase();
  const rest1 = l1.slice(1);
  const i2 = l2.slice(0, 1).toUpperCase();
  const mid2 = l2.slice(1, Math.max(1, l2.length - 1));
  const last2 = l2.slice(-1).toUpperCase();

  return (
    <span
      className={`inline-flex items-baseline leading-none whitespace-pre ${className}`}
      style={{ fontSize: size, color, fontFamily: ALGERIAN, letterSpacing: "0.04em", ...style }}
    >
      <span style={{ fontFamily: LINCOLN, fontSize: "1em" }}>{s1}</span>
      <span>{rest1}</span>
      <span>{" "}</span>
      {l2 && (
        <>
          <span style={{ fontSize: "1.143em" }}>{i2}</span>
          <span>{mid2}</span>
          {l2.length > 1 && <span style={{ fontFamily: LINCOLN, fontSize: "1em" }}>{last2}</span>}
        </>
      )}
    </span>
  );
};

export default BrandName;
