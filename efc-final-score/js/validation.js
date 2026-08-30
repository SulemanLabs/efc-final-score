/**
 * Pure validation helpers for the match form.
 * Returns a map of fieldKey -> error message (empty map = valid).
 */

function isBlank(value) {
  return !value || !String(value).trim();
}

function isValidScore(value) {
  if (isBlank(value)) return false;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 99;
}

function isValidCount(value) {
  if (isBlank(value)) return true; // optional, blank treated as 0
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 20;
}

export function validateMatch(state) {
  const errors = {};

  if (isBlank(state.team1Name)) errors.team1Name = 'Enter a team name.';
  if (isBlank(state.team2Name)) errors.team2Name = 'Enter a team name.';
  if (
    !isBlank(state.team1Name) &&
    !isBlank(state.team2Name) &&
    state.team1Name.trim().toLowerCase() === state.team2Name.trim().toLowerCase()
  ) {
    errors.team2Name = 'Team names must be different.';
  }

  if (!isValidScore(state.team1Score)) errors.team1Score = 'Enter a valid score (0-99).';
  if (!isValidScore(state.team2Score)) errors.team2Score = 'Enter a valid score (0-99).';

  state.scorers.forEach((scorer) => {
    if (isBlank(scorer.name)) return; // empty rows are ignored, not errors
    if (!isValidCount(scorer.goals)) errors[`${scorer.id}:goals`] = 'Invalid';
    if (!isValidCount(scorer.assists)) errors[`${scorer.id}:assists`] = 'Invalid';
  });

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
