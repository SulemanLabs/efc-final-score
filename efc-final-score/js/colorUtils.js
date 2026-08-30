/**
 * Small hex-color helpers used by the accent color picker.
 * No dependencies, pure functions.
 */

export function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

/** Blends a hex color toward white by `amount` (0-1) — used to derive the "soft" tint. */
export function mixWithWhite(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: r + (255 - r) * amount,
    g: g + (255 - g) * amount,
    b: b + (255 - b) * amount,
  });
}

/** "r, g, b" string, suitable for a CSS custom property consumed as rgba(var(--x), alpha). */
export function rgbTriplet(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
}

export function isValidHex(value) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}
