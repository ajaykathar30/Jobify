export const normalizeScores = (items, getScore) => {
  const scores = items.map(getScore);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min;
  return items.map((item, i) => {
    const score = scores[i];
    return range === 0 ? (score > 0 ? 100 : 0) : Math.round(((score - min) / range) * 100);
  });
};
