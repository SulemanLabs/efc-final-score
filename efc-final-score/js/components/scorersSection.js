/**
 * Manages the dynamic "Goal Scorers & Assists" rows.
 * Re-renders the row list only when scorers are added/removed (structural
 * changes) — plain field edits write straight to the store without
 * re-rendering, so focus/cursor position is never lost while typing.
 */

const ROW_REMOVE_ANIMATION_MS = 220;

function buildRow(scorer, store) {
  const row = document.createElement('div');
  row.className = 'scorer-row';
  row.dataset.id = scorer.id;
  row.setAttribute('role', 'row');

  row.innerHTML = `
    <input type="text" class="scorer-row__input" data-field="name" placeholder="Player name" maxlength="28" value="${escapeAttr(scorer.name)}" aria-label="Player name" />
    <input type="number" class="scorer-row__input scorer-row__input--num" data-field="goals" placeholder="0" min="0" max="20" step="1" inputmode="numeric" value="${escapeAttr(scorer.goals)}" aria-label="Goals" />
    <input type="number" class="scorer-row__input scorer-row__input--num" data-field="assists" placeholder="0" min="0" max="20" step="1" inputmode="numeric" value="${escapeAttr(scorer.assists)}" aria-label="Assists" />
    <button type="button" class="scorer-row__remove" aria-label="Remove player">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  `;

  row.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
      store.updateScorer(scorer.id, input.dataset.field, input.value);
    });
  });

  row.querySelector('.scorer-row__remove').addEventListener('click', () => {
    if (store.get().scorers.length <= 1) {
      row.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
        { duration: 200 }
      );
      return;
    }
    row.classList.add('is-removing');
    setTimeout(() => store.removeScorer(scorer.id), ROW_REMOVE_ANIMATION_MS);
  });

  return row;
}

function escapeAttr(value) {
  return String(value ?? '').replace(/"/g, '&quot;');
}

export function createScorersSection({ container, store }) {
  let lastIds = '';

  function render() {
    const scorers = store.get().scorers;
    const idsKey = scorers.map((s) => s.id).join(',');
    if (idsKey === lastIds) return;
    lastIds = idsKey;

    container.innerHTML = '';
    scorers.forEach((scorer) => {
      container.appendChild(buildRow(scorer, store));
    });
  }

  store.subscribe(render);
  render();
}
