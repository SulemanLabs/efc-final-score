import { crestMarkup } from './crest.js';
import { getTemplate } from '../templates.js';
import { mixWithWhite, rgbTriplet, isValidHex } from '../colorUtils.js';

const STAR_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="score-card__mvp-star"><path d="M12 2l2.6 6.2 6.7.5-5.1 4.4 1.6 6.5L12 16.2l-5.8 3.4 1.6-6.5-5.1-4.4 6.7-.5L12 2z" fill="currentColor"/></svg>`;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------------------------------------------------------------- */
/* Shared fragments, reused across template groups                        */
/* ---------------------------------------------------------------------- */

function brandHeaderMarkup(size) {
  return `
    <div class="score-card__brand">
      <span class="score-card__crest">${crestMarkup(size)}</span>
      <div class="score-card__brand-text">
        <span class="score-card__brand-code">EFC</span>
        <span class="score-card__brand-sub">Enclave Football Club</span>
      </div>
    </div>
  `;
}

function scorerRowMarkup(scorer) {
  return `
    <div class="score-card__scorer-row">
      <span class="score-card__scorer-name">${escapeHtml(scorer.name)}</span>
      <span class="score-card__scorer-stats">
        <span class="g">${scorer.goals}⚽</span>
        ${scorer.assists > 0 ? `<span>${scorer.assists} AST</span>` : ''}
      </span>
    </div>
  `;
}

function scorerListMarkup(scorers, { limit } = {}) {
  if (!scorers.length) {
    return `<p style="color:var(--muted);font-size:12px;margin:0;">No goal contributions logged.</p>`;
  }
  const shown = limit ? scorers.slice(0, limit) : scorers;
  const rows = shown.map(scorerRowMarkup).join('');
  const remainder = limit && scorers.length > limit
    ? `<p class="score-card__scorer-more">+${scorers.length - limit} more contributor${scorers.length - limit === 1 ? '' : 's'}</p>`
    : '';
  return rows + remainder;
}

function scorerChipsMarkup(scorers, { limit = 4 } = {}) {
  if (!scorers.length) {
    return `<p style="color:var(--muted);font-size:12px;margin:0;">No goal contributions logged.</p>`;
  }
  return scorers
    .slice(0, limit)
    .map(
      (s) => `
      <span class="score-card__chip">
        <span class="score-card__chip-name">${escapeHtml(s.name)}</span>
        <span class="score-card__chip-stat">${s.goals}⚽${s.assists > 0 ? ` ${s.assists}A` : ''}</span>
      </span>`
    )
    .join('');
}

function mvpBlockMarkup(mvpName, { variant = 'default' } = {}) {
  if (!mvpName) return '';
  return `
    <div class="score-card__mvp score-card__mvp--${variant}">
      <div>
        <div class="score-card__mvp-label">Match MVP</div>
        <div class="score-card__mvp-name">${escapeHtml(mvpName)}</div>
      </div>
      ${STAR_ICON}
    </div>
  `;
}

function sectionLabelMarkup(text) {
  return `<p class="score-card__section-label">${text}</p>`;
}

/* ---------------------------------------------------------------------- */
/* Template group builders — each returns the card's inner HTML           */
/* ---------------------------------------------------------------------- */

function buildScoreboardCard(data, template, crestSize) {
  const mvpMarkup = mvpBlockMarkup(data.mvpName, { variant: template.skin });
  const scorersMarkup = scorerListMarkup(data.scorers, { limit: template.scorerLimit });
  const scorersBlock = `
    ${sectionLabelMarkup('Goals &amp; Assists')}
    <div class="score-card__scorers">${scorersMarkup}</div>
  `;

  const matchupBlock = `
    <div class="score-card__matchup">
      <div class="score-card__team">
        <div class="score-card__team-badge score-card__team-badge--home">${escapeHtml(data.team1.initials)}</div>
        <div class="score-card__team-name">${escapeHtml(data.team1.name)}</div>
        <div class="score-card__team-score">${data.team1.score}</div>
      </div>
      <div class="score-card__vs-col">
        <div class="score-card__divider"></div>
        <span class="score-card__vs">VS</span>
        <div class="score-card__divider"></div>
      </div>
      <div class="score-card__team">
        <div class="score-card__team-badge score-card__team-badge--away">${escapeHtml(data.team2.initials)}</div>
        <div class="score-card__team-name">${escapeHtml(data.team2.name)}</div>
        <div class="score-card__team-score">${data.team2.score}</div>
      </div>
    </div>
  `;

  const heading = `
    <div class="score-card__heading">
      <h2 class="score-card__title">FINAL SCORE</h2>
      <p class="score-card__club">ENCLAVE FOOTBALL CLUB</p>
    </div>
  `;

  const body =
    template.mvpPosition === 'top'
      ? `${mvpMarkup}${matchupBlock}${scorersBlock}`
      : `${matchupBlock}${scorersBlock}${mvpMarkup}`;

  return `
    <div class="score-card__texture"></div>
    <div class="score-card__inner">
      ${brandHeaderMarkup(crestSize)}
      ${heading}
      ${body}
      <p class="score-card__footer">Enclave FC &middot; Match Center</p>
    </div>
  `;
}

function buildSquareCard(data, template, crestSize) {
  return `
    <div class="score-card__texture"></div>
    <div class="score-card__inner">
      ${brandHeaderMarkup(crestSize)}
      <div class="score-card__heading">
        <h2 class="score-card__title">FINAL SCORE</h2>
      </div>
      <div class="score-card__matchup score-card__matchup--tight">
        <div class="score-card__team">
          <div class="score-card__team-badge score-card__team-badge--home">${escapeHtml(data.team1.initials)}</div>
          <div class="score-card__team-name">${escapeHtml(data.team1.name)}</div>
          <div class="score-card__team-score">${data.team1.score}</div>
        </div>
        <span class="score-card__vs">VS</span>
        <div class="score-card__team">
          <div class="score-card__team-badge score-card__team-badge--away">${escapeHtml(data.team2.initials)}</div>
          <div class="score-card__team-name">${escapeHtml(data.team2.name)}</div>
          <div class="score-card__team-score">${data.team2.score}</div>
        </div>
      </div>
      ${sectionLabelMarkup('Top Contributors')}
      <div class="score-card__chips">${scorerChipsMarkup(data.scorers)}</div>
      ${mvpBlockMarkup(data.mvpName, { variant: 'compact' })}
    </div>
  `;
}

function buildStoryCard(data, template, crestSize) {
  return `
    <div class="score-card__story-half score-card__story-half--a">
      <div class="score-card__story-team">
        <div class="score-card__team-badge score-card__team-badge--home">${escapeHtml(data.team1.initials)}</div>
        <div class="score-card__team-name">${escapeHtml(data.team1.name)}</div>
      </div>
      <div class="score-card__story-score">${data.team1.score}</div>
    </div>
    <div class="score-card__story-strip">
      ${brandHeaderMarkup(crestSize)}
      <span class="score-card__vs score-card__vs--story">FINAL SCORE</span>
    </div>
    <div class="score-card__story-half score-card__story-half--b">
      <div class="score-card__story-score">${data.team2.score}</div>
      <div class="score-card__story-team">
        <div class="score-card__team-badge score-card__team-badge--away">${escapeHtml(data.team2.initials)}</div>
        <div class="score-card__team-name">${escapeHtml(data.team2.name)}</div>
      </div>
    </div>
    <div class="score-card__story-footer">
      ${sectionLabelMarkup('Goals &amp; Assists')}
      <div class="score-card__scorers">${scorerListMarkup(data.scorers, { limit: 4 })}</div>
      ${mvpBlockMarkup(data.mvpName, { variant: 'default' })}
    </div>
  `;
}

function buildLandscapeCard(data, template, crestSize) {
  return `
    <div class="score-card__ticker-top">${brandHeaderMarkup(crestSize)}<span class="score-card__ticker-title">FINAL SCORE</span></div>
    <div class="score-card__ticker-main">
      <div class="score-card__team score-card__team--wide">
        <div class="score-card__team-badge score-card__team-badge--home">${escapeHtml(data.team1.initials)}</div>
        <div class="score-card__team-name">${escapeHtml(data.team1.name)}</div>
      </div>
      <div class="score-card__ticker-score">
        <span>${data.team1.score}</span>
        <span class="score-card__vs">VS</span>
        <span>${data.team2.score}</span>
      </div>
      <div class="score-card__team score-card__team--wide">
        <div class="score-card__team-badge score-card__team-badge--away">${escapeHtml(data.team2.initials)}</div>
        <div class="score-card__team-name">${escapeHtml(data.team2.name)}</div>
      </div>
    </div>
    <div class="score-card__ticker-bottom">
      <div class="score-card__chips score-card__chips--row">${scorerChipsMarkup(data.scorers, { limit: 5 })}</div>
      ${mvpBlockMarkup(data.mvpName, { variant: 'compact' })}
    </div>
  `;
}

function buildBoldCard(data, template, crestSize) {
  return `
    <span class="score-card__diagonal score-card__diagonal--a"></span>
    <span class="score-card__diagonal score-card__diagonal--b"></span>
    <div class="score-card__inner score-card__inner--bold">
      ${brandHeaderMarkup(crestSize)}
      <div class="score-card__bold-matchup">
        <div class="score-card__bold-team">
          <span class="score-card__team-name">${escapeHtml(data.team1.name)}</span>
          <span class="score-card__bold-score">${data.team1.score}</span>
        </div>
        <span class="score-card__vs">VS</span>
        <div class="score-card__bold-team score-card__bold-team--right">
          <span class="score-card__bold-score">${data.team2.score}</span>
          <span class="score-card__team-name">${escapeHtml(data.team2.name)}</span>
        </div>
      </div>
      <div class="score-card__bold-panel">
        ${sectionLabelMarkup('Goals &amp; Assists')}
        <div class="score-card__scorers">${scorerListMarkup(data.scorers, { limit: 4 })}</div>
        ${mvpBlockMarkup(data.mvpName, { variant: 'compact' })}
      </div>
    </div>
  `;
}

function buildTicketCard(data, template, crestSize) {
  return `
    <div class="score-card__inner score-card__inner--ticket">
      ${brandHeaderMarkup(crestSize)}
      <div class="score-card__heading">
        <h2 class="score-card__title">FINAL SCORE</h2>
        <p class="score-card__club">ADMIT ONE &middot; MATCH CENTER</p>
      </div>
      <div class="score-card__ticket-row">
        <span class="score-card__ticket-label">Home</span>
        <span class="score-card__ticket-value">${escapeHtml(data.team1.name)}</span>
        <span class="score-card__ticket-score">${data.team1.score}</span>
      </div>
      <div class="score-card__ticket-row">
        <span class="score-card__ticket-label">Away</span>
        <span class="score-card__ticket-value">${escapeHtml(data.team2.name)}</span>
        <span class="score-card__ticket-score">${data.team2.score}</span>
      </div>
    </div>
    <div class="score-card__tear">
      <span class="score-card__notch score-card__notch--l"></span>
      <span class="score-card__notch score-card__notch--r"></span>
    </div>
    <div class="score-card__inner score-card__inner--ticket score-card__inner--stub">
      ${sectionLabelMarkup('Goals &amp; Assists')}
      <div class="score-card__scorers">${scorerListMarkup(data.scorers, { limit: 4 })}</div>
      ${mvpBlockMarkup(data.mvpName, { variant: 'default' })}
    </div>
  `;
}

const BUILDERS = {
  scoreboard: buildScoreboardCard,
  square: buildSquareCard,
  story: buildStoryCard,
  landscape: buildLandscapeCard,
  bold: buildBoldCard,
  ticket: buildTicketCard,
};

/**
 * Builds a final score card as a detached DOM element for the given template.
 * Used identically for the on-screen preview and the off-screen export
 * render, so the exported image always matches what the user saw.
 *
 * @param {ReturnType<typeof import('../scoreGeneration.js').generateScoreData>} data
 * @param {{ variant?: 'preview' | 'export', templateId?: string, accentColor?: string }} [options]
 */
export function renderScoreCard(data, { variant = 'preview', templateId = 'classic', accentColor } = {}) {
  const template = getTemplate(templateId);
  const crestSize = variant === 'export' ? 44 : 26;

  const wrapper = document.createElement('div');
  wrapper.className = [
    'score-card',
    `score-card--group-${template.group}`,
    template.skin ? `score-card--skin-${template.skin}` : '',
    variant === 'export' ? 'score-card--export' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Re-tints just this card's accent (badges, dividers, MVP panel, title) via
  // scoped custom properties — the site chrome outside this element keeps
  // reading the root --gold* values, so only the card itself changes color.
  if (accentColor && isValidHex(accentColor)) {
    wrapper.style.setProperty('--gold', accentColor);
    wrapper.style.setProperty('--gold-soft', mixWithWhite(accentColor, 0.55));
    wrapper.style.setProperty('--gold-rgb', rgbTriplet(accentColor));
  }

  const build = BUILDERS[template.group] || buildScoreboardCard;
  wrapper.innerHTML = build(data, template, crestSize);

  return wrapper;
}
