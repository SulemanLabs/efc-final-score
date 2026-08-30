import { TEMPLATES } from '../templates.js';
import { templateThumbMarkup } from './templateThumb.js';

/**
 * Renders the template picker grid and keeps the "selected" state in sync
 * with the store. Calls `onSelect` whenever the user picks a new template
 * so the caller can decide whether to re-render an already-generated preview.
 */
export function createTemplatePicker({ container, store, onSelect }) {
  const cards = new Map();

  TEMPLATES.forEach((template) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'template-card';
    card.dataset.id = template.id;
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', String(store.get().templateId === template.id));

    const [, ratioW, ratioH] = template.aspect.match(/(\d+)\s*\/\s*(\d+)/);

    card.innerHTML = `
      <div class="template-card__preview" style="aspect-ratio:${ratioW}/${ratioH}">
        ${templateThumbMarkup(template)}
      </div>
      <span class="template-card__name">${template.name}</span>
      <span class="template-card__blurb">${template.blurb}</span>
    `;

    card.addEventListener('click', () => {
      if (store.get().templateId === template.id) return;
      store.update({ templateId: template.id });
      applySelection();
      onSelect?.(template);
    });

    cards.set(template.id, card);
    container.appendChild(card);
  });

  function applySelection() {
    const activeId = store.get().templateId;
    cards.forEach((card, id) => {
      const isSelected = id === activeId;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-checked', String(isSelected));
    });
  }

  applySelection();
}
