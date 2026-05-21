// EuroPrix — shared atoms: icons, flags, formatters
// Exports onto window so other Babel scripts can use them.

const formatEUR = (n, frac = 0) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
  }).format(n).replace(/\u00A0/g, " ");
};

const formatEURSmart = (n) => {
  // 0 decimals if integer, otherwise 2
  return Number.isInteger(n) ? formatEUR(n, 0) : formatEUR(n, 2);
};

// --- Flag SVGs (correct national palettes, no copyrighted emblems) ---
const FlagFR = ({ className = "flag" }) => (
  <svg className={className} viewBox="0 0 24 16" preserveAspectRatio="none" aria-label="France">
    <rect width="8" height="16" fill="#002654" />
    <rect x="8" width="8" height="16" fill="#ffffff" />
    <rect x="16" width="8" height="16" fill="#ED2939" />
  </svg>
);
const FlagDE = ({ className = "flag" }) => (
  <svg className={className} viewBox="0 0 24 16" preserveAspectRatio="none" aria-label="Allemagne">
    <rect width="24" height="5.33" fill="#000000" />
    <rect y="5.33" width="24" height="5.34" fill="#DD0000" />
    <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
  </svg>
);
const FlagES = ({ className = "flag" }) => (
  <svg className={className} viewBox="0 0 24 16" preserveAspectRatio="none" aria-label="Espagne">
    <rect width="24" height="4" fill="#AA151B" />
    <rect y="4" width="24" height="8" fill="#F1BF00" />
    <rect y="12" width="24" height="4" fill="#AA151B" />
  </svg>
);

const Flag = ({ country, className = "flag" }) => {
  if (country === "FR") return <FlagFR className={className} />;
  if (country === "DE") return <FlagDE className={className} />;
  if (country === "ES") return <FlagES className={className} />;
  return null;
};

const COUNTRY_LABEL = { FR: "France", DE: "Allemagne", ES: "Espagne" };
const COUNTRY_AMAZON = { FR: "Amazon.fr", DE: "Amazon.de", ES: "Amazon.es" };

// --- Icons (Lucide-style strokes) ---
const Icon = {
  ArrowRight: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  ),
  ArrowUpRight: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17 17 7" /><path d="M7 7h10v10" />
    </svg>
  ),
  Search: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  ),
  Globe: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  Shield: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  ),
  Truck: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 17H4V6h11v11Z" /><path d="M14 9h4l3 3v5h-7" /><circle cx="8" cy="17.5" r="1.6" /><circle cx="18" cy="17.5" r="1.6" />
    </svg>
  ),
  Bolt: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  ),
  Refresh: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" />
    </svg>
  ),
  Compare: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M8 3v18" /><path d="M16 3v18" /><path d="M4 8h4" /><path d="M16 14h4" /><path d="M16 6h4" /><path d="M4 16h4" />
    </svg>
  ),
  Down: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
    </svg>
  ),
};

// --- helpers exposed ---
const priceMin = (prices) => Math.min(...Object.values(prices));
const priceMax = (prices) => Math.max(...Object.values(prices));
const savings  = (prices) => priceMax(prices) - priceMin(prices);
const bestCountry = (prices) =>
  Object.entries(prices).reduce((b, [c, p]) => p < b[1] ? [c, p] : b, ["FR", Infinity])[0];

Object.assign(window, {
  formatEUR, formatEURSmart,
  FlagFR, FlagDE, FlagES, Flag,
  COUNTRY_LABEL, COUNTRY_AMAZON,
  Icon,
  priceMin, priceMax, savings, bestCountry,
});
