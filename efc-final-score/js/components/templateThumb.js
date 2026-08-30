/**
 * Small illustrative preview for each template card in the picker grid.
 * These are simplified mock-ups (not the real component) — just enough
 * shape/composition cues for the user to tell templates apart at a glance.
 */
export function templateThumbMarkup(template) {
  switch (template.group) {
    case 'story':
      return `
        <div class="tpl-mock tpl-mock--story">
          <span class="tpl-mock__half tpl-mock__half--a"></span>
          <span class="tpl-mock__strip"></span>
          <span class="tpl-mock__half tpl-mock__half--b"></span>
        </div>`;
    case 'square':
      return `
        <div class="tpl-mock tpl-mock--square">
          <span class="tpl-mock__dot"></span>
          <span class="tpl-mock__row">
            <span class="tpl-mock__chip"></span><span class="tpl-mock__chip"></span><span class="tpl-mock__chip"></span>
          </span>
        </div>`;
    case 'landscape':
      return `
        <div class="tpl-mock tpl-mock--landscape">
          <span class="tpl-mock__col"></span>
          <span class="tpl-mock__center"></span>
          <span class="tpl-mock__col"></span>
        </div>`;
    case 'bold':
      return `
        <div class="tpl-mock tpl-mock--bold">
          <span class="tpl-mock__diagonal-a"></span>
          <span class="tpl-mock__diagonal-b"></span>
        </div>`;
    case 'ticket':
      return `
        <div class="tpl-mock tpl-mock--ticket">
          <span class="tpl-mock__notch tpl-mock__notch--l"></span>
          <span class="tpl-mock__notch tpl-mock__notch--r"></span>
          <span class="tpl-mock__tear"></span>
        </div>`;
    default: {
      // scoreboard family — distinguish by skin
      const skin = template.skin || 'classic';
      return `<div class="tpl-mock tpl-mock--scoreboard tpl-mock--skin-${skin}">
          <span class="tpl-mock__crest-dot"></span>
          <span class="tpl-mock__vs-line"></span>
          <span class="tpl-mock__foot"></span>
        </div>`;
    }
  }
}
