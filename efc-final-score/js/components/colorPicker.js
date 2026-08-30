import { isValidHex } from '../colorUtils.js';

export const ACCENT_PRESETS = [
  { id: 'gold', label: 'Gold', value: '#C9A227' },
  { id: 'emerald', label: 'Emerald', value: '#1FAE6B' },
  { id: 'royal', label: 'Royal Blue', value: '#3B6FE0' },
  { id: 'crimson', label: 'Crimson', value: '#D64545' },
  { id: 'silver', label: 'Silver', value: '#9AA4B8' },
  { id: 'violet', label: 'Violet', value: '#8B6FE0' },
  { id: 'rose', label: 'Rose', value: '#E0568C' },
];

/**
 * Renders the accent color swatches + a native custom color input.
 * The chosen color re-tints the score card's gold accent only — the rest
 * of the site chrome stays on-brand gold (see the `--gold*` custom
 * property scoping applied in components/scoreCard.js).
 */
export function createColorPicker({ container, store, onChange }) {
  const swatchButtons = new Map();

  const swatchRow = document.createElement('div');
  swatchRow.className = 'color-picker__row';

  ACCENT_PRESETS.forEach((preset) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-swatch';
    btn.style.setProperty('--swatch-color', preset.value);
    btn.title = preset.label;
    btn.setAttribute('aria-label', preset.label);
    btn.addEventListener('click', () => {
      store.update({ accentColor: preset.value });
      customInput.value = preset.value;
      applySelection();
      onChange?.(preset.value);
    });
    swatchButtons.set(preset.value.toLowerCase(), btn);
    swatchRow.appendChild(btn);
  });

  const customWrap = document.createElement('label');
  customWrap.className = 'color-swatch color-swatch--custom';
  customWrap.title = 'Custom color';

  const customInput = document.createElement('input');
  customInput.type = 'color';
  customInput.className = 'color-swatch__input';
  customInput.setAttribute('aria-label', 'Custom accent color');
  customInput.value = isValidHex(store.get().accentColor) ? store.get().accentColor : '#C9A227';

  customInput.addEventListener('input', () => {
    store.update({ accentColor: customInput.value });
    applySelection();
    onChange?.(customInput.value);
  });

  customWrap.appendChild(customInput);
  swatchRow.appendChild(customWrap);
  container.appendChild(swatchRow);

  function applySelection() {
    const current = (store.get().accentColor || '').toLowerCase();
    let matchedPreset = false;
    swatchButtons.forEach((btn, value) => {
      const isSelected = value === current;
      btn.classList.toggle('is-selected', isSelected);
      if (isSelected) matchedPreset = true;
    });
    customWrap.classList.toggle('is-selected', !matchedPreset);
    if (!matchedPreset && isValidHex(current)) {
      customInput.value = current;
    }
  }

  applySelection();
}
