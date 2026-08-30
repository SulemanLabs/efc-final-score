/**
 * Pure transform: raw form state -> the shape the score card renderer needs.
 * No DOM access here, so it's independently testable.
 */

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toInt(value, fallback = 0) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function generateScoreData(state) {
  const scorers = state.scorers
    .filter((s) => s.name && s.name.trim())
    .map((s) => ({
      id: s.id,
      name: s.name.trim(),
      goals: toInt(s.goals, 0),
      assists: toInt(s.assists, 0),
    }))
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists);

  const team1Score = toInt(state.team1Score, 0);
  const team2Score = toInt(state.team2Score, 0);

  let result = 'draw';
  if (team1Score > team2Score) result = 'team1';
  else if (team2Score > team1Score) result = 'team2';

  return {
    team1: {
      name: state.team1Name.trim(),
      score: team1Score,
      initials: initials(state.team1Name),
    },
    team2: {
      name: state.team2Name.trim(),
      score: team2Score,
      initials: initials(state.team2Name),
    },
    result,
    scorers,
    mvpName: state.mvpName && state.mvpName.trim() ? state.mvpName.trim() : null,
    generatedAt: new Date(),
  };
}
