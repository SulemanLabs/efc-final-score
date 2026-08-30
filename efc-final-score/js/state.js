/**
 * Central, framework-free store for the match form.
 * Plain object + pub/sub — no rendering logic lives here.
 */

let idCounter = 0;
export function nextScorerId() {
  return `scorer-${++idCounter}`;
}

export function createSampleState() {
  return {
    team1Name: 'Enclave FC',
    team1Score: '3',
    team2Name: 'Riverside United',
    team2Score: '1',
    scorers: [
      { id: nextScorerId(), name: 'Marcus Bellwood', goals: '2', assists: '0' },
      { id: nextScorerId(), name: 'Théo Aránguiz', goals: '1', assists: '1' },
      { id: nextScorerId(), name: 'Kian Osei', goals: '0', assists: '2' },
    ],
    mvpName: 'Marcus Bellwood',
    templateId: 'classic',
    accentColor: '#C9A227',
  };
}

export class MatchStore {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = new Set();
  }

  get() {
    return this.state;
  }

  update(patch) {
    this.state = { ...this.state, ...patch };
    this.emit();
  }

  addScorer() {
    this.state = {
      ...this.state,
      scorers: [...this.state.scorers, { id: nextScorerId(), name: '', goals: '', assists: '' }],
    };
    this.emit();
  }

  removeScorer(id) {
    if (this.state.scorers.length <= 1) return;
    this.state = {
      ...this.state,
      scorers: this.state.scorers.filter((s) => s.id !== id),
    };
    this.emit();
  }

  updateScorer(id, field, value) {
    this.state = {
      ...this.state,
      scorers: this.state.scorers.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    };
    this.emit();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit() {
    this.listeners.forEach((fn) => fn(this.state));
  }
}
