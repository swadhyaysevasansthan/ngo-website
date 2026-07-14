/**
 * Conflict detection for judge scores.
 * "Conflict" = disagreement spread between the highest and lowest
 * score a single entry received in Round 1 (0-5 scale, 5 judges).
 *
 *   spread >= 3  -> HIGH   (e.g. 5,5,5,1,1)
 *   spread >= 1.5 -> MEDIUM
 *   otherwise     -> LOW
 */
export const CONFLICT_THRESHOLDS = {
  HIGH: 3,
  MEDIUM: 1.5,
};

export const calculateConflictLevel = (scores = []) => {
  const numericScores = scores.filter((s) => typeof s === 'number' && !Number.isNaN(s));

  if (numericScores.length < 2) return 'LOW';

  const max = Math.max(...numericScores);
  const min = Math.min(...numericScores);
  const spread = max - min;

  if (spread >= CONFLICT_THRESHOLDS.HIGH) return 'HIGH';
  if (spread >= CONFLICT_THRESHOLDS.MEDIUM) return 'MEDIUM';
  return 'LOW';
};
