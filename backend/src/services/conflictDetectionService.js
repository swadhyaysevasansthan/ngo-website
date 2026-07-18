/**
 * Conflict detection for judge scores.
 * "Conflict" = disagreement spread between the highest and lowest
 * score a single entry received in Round 1.
 *
 * Thresholds are expressed as a FRACTION of the competition's max
 * score, not a fixed absolute number — a spread of 3 means very
 * different things on a 0-5 scale vs a 0-10 or 0-100 scale. The
 * original tuning (spread >= 3 = HIGH, >= 1.5 = MEDIUM on a 0-5
 * scale) is preserved exactly when maxScore=5, since 3/5 = 0.6 and
 * 1.5/5 = 0.3.
 */
export const CONFLICT_THRESHOLD_RATIOS = {
  HIGH: 0.6,
  MEDIUM: 0.3,
};

export const calculateConflictLevel = (scores = [], maxScore = 5) => {
  const numericScores = scores.filter((s) => typeof s === 'number' && !Number.isNaN(s));

  if (numericScores.length < 2) return 'LOW';

  const max = Math.max(...numericScores);
  const min = Math.min(...numericScores);
  const spread = max - min;
  const safeMax = maxScore > 0 ? maxScore : 5;

  if (spread >= CONFLICT_THRESHOLD_RATIOS.HIGH * safeMax) return 'HIGH';
  if (spread >= CONFLICT_THRESHOLD_RATIOS.MEDIUM * safeMax) return 'MEDIUM';
  return 'LOW';
};