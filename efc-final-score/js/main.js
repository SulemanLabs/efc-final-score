import { crestMarkup } from './components/crest.js';
import { MatchStore, createSampleState } from './state.js';
import { createScorersSection } from './components/scorersSection.js';
import { createTemplatePicker } from './components/templatePicker.js';
import { createColorPicker } from './components/colorPicker.js';
import { validateMatch, hasErrors } from './validation.js';
import { generateScoreData } from './scoreGeneration.js';
import { renderScoreCard } from './components/scoreCard.js';
import { downloadScoreCardImage } from './imageExport.js';
import { getTemplate } from './templates.js';

/* ---------------------------------------------------------------------- */
/* Setup                                                                   */
/* ---------------------------------------------------------------------- */

const store = new MatchStore(createSampleState());
let currentScoreData = null;

document.getElementById('brandCrest').innerHTML = crestMarkup(36);

/* ---------------------------------------------------------------------- */
/* Toast                                                                   */
/* ---------------------------------------------------------------------- */

const toastEl = document.getElementById('toast');
let toastTimer = null;

function showToast(message, type = 'success') {
  toastEl.textContent = message;
  toastEl.classList.toggle('toast--error', type === 'error');
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3200);
}

/* ---------------------------------------------------------------------- */
/* Match details form (two-way bind to store)                             */
/* ---------------------------------------------------------------------- */

document.getElementById('matchForm').addEventListener('submit', (e) => e.preventDefault());

const fieldIds = ['team1Name', 'team1Score', 'team2Name', 'team2Score', 'mvpName'];

fieldIds.forEach((id) => {
  const input = document.getElementById(id);
  input.value = store.get()[id];
  input.addEventListener('input', () => {
    store.update({ [id]: input.value });
    clearFieldError(id);
    if (id === 'mvpName') updateMvpPreview(input.value);
  });
});

function clearFieldError(id) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}Error`);
  if (input) input.classList.remove('is-invalid');
  if (error) error.textContent = '';
}

function setFieldError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}Error`);
  if (input) input.classList.add('is-invalid');
  if (error) error.textContent = message;
}

function updateMvpPreview(name) {
  const preview = document.getElementById('mvpPreview');
  const previewName = document.getElementById('mvpPreviewName');
  const trimmed = name.trim();
  if (trimmed) {
    previewName.textContent = trimmed;
    preview.hidden = false;
  } else {
    preview.hidden = true;
  }
}
updateMvpPreview(store.get().mvpName);

/* ---------------------------------------------------------------------- */
/* Goal scorers section                                                   */
/* ---------------------------------------------------------------------- */

createScorersSection({
  container: document.getElementById('scorersRows'),
  store,
});

document.getElementById('addScorerBtn').addEventListener('click', () => {
  store.addScorer();
  const rows = document.getElementById('scorersRows');
  const lastRow = rows.lastElementChild;
  if (lastRow) {
    const nameInput = lastRow.querySelector('input[data-field="name"]');
    nameInput?.focus();
  }
});

/* ---------------------------------------------------------------------- */
/* Template picker                                                        */
/* ---------------------------------------------------------------------- */

const previewFrame = document.getElementById('previewFrame');
const placeholder = document.getElementById('scoreCardPlaceholder');
const mount = document.getElementById('scoreCardMount');
const downloadBtn = document.getElementById('downloadBtn');
const previewNote = document.getElementById('previewNote');
const formHint = document.getElementById('formHint');

function applyPreviewAspect(templateId) {
  previewFrame.style.aspectRatio = getTemplate(templateId).aspect;
}
applyPreviewAspect(store.get().templateId);

createTemplatePicker({
  container: document.getElementById('templateGrid'),
  store,
  onSelect: (template) => {
    applyPreviewAspect(template.id);
    if (currentScoreData) renderPreview();
  },
});

createColorPicker({
  container: document.getElementById('colorPicker'),
  store,
  onChange: () => {
    if (currentScoreData) renderPreview();
  },
});

/* ---------------------------------------------------------------------- */
/* Generate final score                                                   */
/* ---------------------------------------------------------------------- */

function runValidation() {
  fieldIds.slice(0, 4).forEach(clearFieldError);
  document.querySelectorAll('.scorer-row__input').forEach((el) => el.classList.remove('is-invalid'));

  const errors = validateMatch(store.get());

  Object.entries(errors).forEach(([key, message]) => {
    if (key.includes(':')) {
      const [scorerId, field] = key.split(':');
      const row = document.querySelector(`.scorer-row[data-id="${scorerId}"]`);
      row?.querySelector(`[data-field="${field}"]`)?.classList.add('is-invalid');
    } else {
      setFieldError(key, message);
    }
  });

  return errors;
}

function renderPreview() {
  const { templateId, accentColor } = store.get();
  const template = getTemplate(templateId);

  mount.innerHTML = '';
  const card = renderScoreCard(currentScoreData, { variant: 'preview', templateId, accentColor });
  mount.appendChild(card);
  placeholder.style.display = 'none';

  // force reflow so the reveal animation replays on every generation
  void card.offsetWidth;
  card.classList.add('is-visible');

  downloadBtn.disabled = false;
  previewNote.textContent = `Looking sharp. Export at ${template.exportW}×${template.exportH} for Instagram, X and WhatsApp.`;
}

document.getElementById('generateBtn').addEventListener('click', () => {
  const errors = runValidation();

  if (hasErrors(errors)) {
    formHint.textContent = 'Please fix the highlighted fields before generating.';
    formHint.style.color = 'var(--danger)';
    showToast('Some fields need your attention.', 'error');
    document.querySelector('.is-invalid')?.focus({ preventScroll: false });
    return;
  }

  formHint.textContent = 'Fill in both teams and scores to generate the graphic.';
  formHint.style.color = '';

  currentScoreData = generateScoreData(store.get());
  renderPreview();

  showToast('Final score graphic generated.');

  if (window.matchMedia('(max-width: 979px)').matches) {
    previewFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

/* ---------------------------------------------------------------------- */
/* Download HD image                                                      */
/* ---------------------------------------------------------------------- */

downloadBtn.addEventListener('click', async () => {
  if (!currentScoreData) return;

  const originalContent = downloadBtn.innerHTML;
  downloadBtn.disabled = true;
  downloadBtn.innerHTML = 'Preparing image…';

  try {
    const { templateId, accentColor } = store.get();
    await downloadScoreCardImage(currentScoreData, templateId, accentColor);
    showToast('HD image downloaded.');
  } catch (err) {
    console.error(err);
    showToast('Could not export image. Please try again.', 'error');
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = originalContent;
  }
});

/* ---------------------------------------------------------------------- */
/* Header scroll shadow                                                   */
/* ---------------------------------------------------------------------- */

const header = document.getElementById('siteHeader');
window.addEventListener(
  'scroll',
  () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  },
  { passive: true }
);

/* ---------------------------------------------------------------------- */
/* Subtle background particles                                            */
/* ---------------------------------------------------------------------- */

(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let width, height, particles;
  const COUNT = 42;

  function resize() {
    width = canvas.width = canvas.offsetWidth * devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function makeParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 1.4 + 0.4) * devicePixelRatio,
      vy: (Math.random() * 0.12 + 0.03) * devicePixelRatio,
      drift: (Math.random() - 0.5) * 0.05 * devicePixelRatio,
      alpha: Math.random() * 0.35 + 0.08,
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.y -= p.vy;
      p.x += p.drift;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 231, 178, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  window.addEventListener('resize', () => {
    resize();
    makeParticles();
  });

  if (!prefersReducedMotion) {
    requestAnimationFrame(tick);
  }
})();
