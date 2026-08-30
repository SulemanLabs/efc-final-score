import { renderScoreCard } from './components/scoreCard.js';
import { getTemplate } from './templates.js';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'final-score';
}

/**
 * Renders the score card at its template's fixed HD dimensions off-screen
 * (same component used for the live preview, so the export always matches
 * what's shown), rasterizes it with html2canvas, and triggers a PNG download.
 */
export async function downloadScoreCardImage(scoreData, templateId, accentColor) {
  if (typeof html2canvas !== 'function') {
    throw new Error('Image export library failed to load.');
  }

  const template = getTemplate(templateId);
  const exportWidth = template.exportW;
  const exportHeight = template.exportH;

  const stage = document.createElement('div');
  stage.style.position = 'fixed';
  stage.style.top = '0';
  stage.style.left = '-10000px';
  stage.style.width = `${exportWidth}px`;
  stage.style.height = `${exportHeight}px`;
  stage.style.pointerEvents = 'none';
  stage.style.zIndex = '-1';

  const card = renderScoreCard(scoreData, { variant: 'export', templateId: template.id, accentColor });
  stage.appendChild(card);
  document.body.appendChild(stage);

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    // let layout settle before rasterizing
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const canvas = await html2canvas(card, {
      width: exportWidth,
      height: exportHeight,
      scale: 2,
      backgroundColor: '#070A12',
      useCORS: true,
      logging: false,
    });

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1));
    if (!blob) throw new Error('Could not generate image.');

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `efc-final-score-${slugify(scoreData.team1.name)}-vs-${slugify(scoreData.team2.name)}-${template.id}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } finally {
    stage.remove();
  }
}
