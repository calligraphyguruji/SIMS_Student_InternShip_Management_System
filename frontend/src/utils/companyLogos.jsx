// Company logo helper: returns brand-color initials avatars for company names,
// with a favicon-image fallback for well-known companies (Google, Microsoft, etc.).
// No external logo assets are bundled — we use Google's favicon service + brand colors.

const BRAND_COLORS = {
  google: { bg: "#4285F4", fg: "#ffffff" },
  microsoft: { bg: "#00A4EF", fg: "#ffffff" },
  amazon: { bg: "#FF9900", fg: "#232f3e" },
  apple: { bg: "#000000", fg: "#ffffff" },
  meta: { bg: "#0668E1", fg: "#ffffff" },
  facebook: { bg: "#0866FF", fg: "#ffffff" },
  netflix: { bg: "#E50914", fg: "#ffffff" },
  tesla: { bg: "#CC0000", fg: "#ffffff" },
  ibm: { bg: "#054ADA", fg: "#ffffff" },
  oracle: { bg: "#C74634", fg: "#ffffff" },
  salesforce: { bg: "#00A1E0", fg: "#ffffff" },
  adobe: { bg: "#DA1F26", fg: "#ffffff" },
  intel: { bg: "#0071C5", fg: "#ffffff" },
  nvidia: { bg: "#76B900", fg: "#000000" },
  linkedin: { bg: "#0A66C2", fg: "#ffffff" },
  twitter: { bg: "#1DA1F2", fg: "#ffffff" },
  x: { bg: "#000000", fg: "#ffffff" },
  infosys: { bg: "#1B75BB", fg: "#ffffff" },
  tcs: { bg: "#2F5B96", fg: "#ffffff" },
  wipro: { bg: "#4A8B3F", fg: "#ffffff" },
  accenture: { bg: "#A100FF", fg: "#ffffff" },
  deloitte: { bg: "#86BC25", fg: "#000000" },
  flipkart: { bg: "#2874F0", fg: "#ffffff" },
  "techcorp solutions": { bg: "#2563EB", fg: "#ffffff" },
  techcorp: { bg: "#2563EB", fg: "#ffffff" },
  "insightgrid labs": { bg: "#0F766E", fg: "#ffffff" },
  "pixelbloom studio": { bg: "#DB2777", fg: "#ffffff" },
  "cloudnest systems": { bg: "#0369A1", fg: "#ffffff" },
  "astraai research": { bg: "#7C3AED", fg: "#ffffff" },
  "shieldbyte security": { bg: "#B91C1C", fg: "#ffffff" },
  "appforge labs": { bg: "#EA580C", fg: "#ffffff" },
  "deploymate technologies": { bg: "#15803D", fg: "#ffffff" },
  "growthlane media": { bg: "#CA8A04", fg: "#111827" },
  "testpilot software": { bg: "#4F46E5", fg: "#ffffff" },
};

const DEMO_MARKS = {
  "techcorp solutions": "TC",
  "insightgrid labs": "IG",
  "pixelbloom studio": "PB",
  "cloudnest systems": "CN",
  "astraai research": "AI",
  "shieldbyte security": "SB",
  "appforge labs": "AF",
  "deploymate technologies": "DM",
  "growthlane media": "GL",
  "testpilot software": "TP",
};

const GENERIC_COLORS = [
  "#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#F97316", "#6366F1", "#14B8A6",
];

// Deterministic hash so the same company always gets the same generic color
const hashString = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

// Known companies → favicon image URL (via Google's favicon service, no key needed)
const getFaviconUrl = (company) => {
  const known = [
    "google", "microsoft", "amazon", "apple", "meta", "facebook", "netflix", "tesla",
    "ibm", "oracle", "salesforce", "adobe", "intel", "nvidia", "linkedin", "twitter",
    "flipkart", "infosys", "wipro", "accenture", "deloitte", "spotify", "uber", "airbnb",
  ];
  const key = company.toLowerCase().replace(/[^a-z]/g, "");
  if (known.some((k) => key.includes(k))) {
    return `https://www.google.com/s2/favicons?domain=${key}.com&sz=64`;
  }
  return "";
};

export const getCompanyBrand = (companyName = "") => {
  const name = (companyName || "").trim();
  const key = name.toLowerCase();

  const colorKey = Object.keys(BRAND_COLORS).find((k) => key.includes(k));
  const { bg, fg } = colorKey ? BRAND_COLORS[colorKey] : { bg: GENERIC_COLORS[hashString(key) % GENERIC_COLORS.length], fg: "#ffffff" };
  const demoMarkKey = Object.keys(DEMO_MARKS).find((k) => key.includes(k));

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

  return {
    initials: demoMarkKey ? DEMO_MARKS[demoMarkKey] : initials,
    bg,
    fg,
    favicon: getFaviconUrl(name),
    isDemo: Boolean(demoMarkKey),
  };
};

// Shared <CompanyLogo /> component for use across cards/detail/profile
export const CompanyLogo = ({ name = "", size = 44, className = "", rounded = "rounded-xl" }) => {
  const brand = getCompanyBrand(name);

  return (
    <div
      className={`${rounded} relative overflow-hidden flex items-center justify-center font-display font-semibold shrink-0 shadow-sm ring-1 ring-black/5 ${className}`}
      style={{ width: size, height: size, backgroundColor: brand.bg, color: brand.fg, fontSize: size * 0.38 }}
      aria-label={name}
    >
      {brand.favicon ? (
        <img
          src={brand.favicon}
          alt={name}
          width={size * 0.55}
          height={size * 0.55}
          className="rounded object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <>
          {brand.isDemo && (
            <>
              <span className="absolute -right-2 -top-2 h-1/2 w-1/2 rounded-full bg-white/25" />
              <span className="absolute -bottom-3 -left-3 h-2/3 w-2/3 rounded-full bg-black/10" />
            </>
          )}
          <span className="relative z-10 tracking-normal">{brand.initials}</span>
        </>
      )}
    </div>
  );
};

export default CompanyLogo;
