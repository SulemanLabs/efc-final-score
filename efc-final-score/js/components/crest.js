/**
 * Renders the Enclave FC crest as an inline SVG string.
 * Reused in the header and inside the score card (on-screen + export).
 */
let crestInstanceCount = 0;

export function crestMarkup(size = 36) {
  const gradientId = `crestFill-${crestInstanceCount++}`;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Enclave Football Club crest">
      <path d="M24 2 L44 9 V22 C44 34 36 43 24 46 C12 43 4 34 4 22 V9 Z"
            fill="url(#${gradientId})" stroke="#C9A227" stroke-width="1.2"/>
      <path d="M24 6 L40 11.5 V22 C40 32 33.5 39.5 24 42.2 C14.5 39.5 8 32 8 22 V11.5 Z"
            fill="none" stroke="#F4E7B2" stroke-width="0.6" opacity="0.5"/>
      <text x="24" y="27" text-anchor="middle" font-family="'Anton', sans-serif" font-size="14"
            fill="#F4E7B2" letter-spacing="0.5">EFC</text>
      <path d="M14 32 L24 36 L34 32" stroke="#C9A227" stroke-width="1" fill="none" opacity="0.7"/>
      <defs>
        <linearGradient id="${gradientId}" x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#151B2B"/>
          <stop offset="100%" stop-color="#070A12"/>
        </linearGradient>
      </defs>
    </svg>
  `;
}
