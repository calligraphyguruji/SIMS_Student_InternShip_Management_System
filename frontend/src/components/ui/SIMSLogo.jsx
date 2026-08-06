import React from "react";

// SIMS brand logo — a verified shield for a trusted internship registry.
// Props:
//   size  – control the rendered height/width of the logo mark (default 36)
//   withText – show "SIMS" wordmark next to the mark (default false)
//   textClassName – extra classes for the wordmark text
const SIMSLogo = ({ size = 36, withText = false, textClassName = "" }) => {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
        aria-label="SIMS logo"
      >
        <defs>
          <linearGradient id="simsTrustGrad" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F766E" />
            <stop offset="0.55" stopColor="#2563EB" />
            <stop offset="1" stopColor="#1E3A8A" />
          </linearGradient>
          <filter id="simsTrustShadow" x="2" y="2" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.18" />
          </filter>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="10" fill="white" />
        <path
          d="M24 6.5L37.2 11.2V21.2C37.2 30.6 31.6 38 24 41.5C16.4 38 10.8 30.6 10.8 21.2V11.2L24 6.5Z"
          fill="url(#simsTrustGrad)"
          filter="url(#simsTrustShadow)"
        />
        <path
          d="M24 10.1L33.9 13.6V21.1C33.9 28.5 29.8 34.2 24 37.3C18.2 34.2 14.1 28.5 14.1 21.1V13.6L24 10.1Z"
          fill="white"
          fillOpacity="0.12"
        />
        <circle cx="19" cy="20.5" r="3.2" fill="white" fillOpacity="0.92" />
        <circle cx="29" cy="20.5" r="3.2" fill="white" fillOpacity="0.92" />
        <path
          d="M14.7 30C15.45 26.65 18.55 24.4 22.1 24.4H25.9C29.45 24.4 32.55 26.65 33.3 30"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.92"
        />
        <circle cx="35.5" cy="12.5" r="6.2" fill="#ECFDF5" stroke="#0F766E" strokeWidth="1.4" />
        <path
          d="M32.7 12.7L34.6 14.6L38.6 10.5"
          stroke="#0F766E"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span className={`font-display font-semibold text-ink-800 dark:text-ink-50 leading-none ${textClassName}`}>
          SIMS
        </span>
      )}
    </span>
  );
};

export default SIMSLogo;
