export function makeChoices(pool, targetId, round) {
  const target = pool.find(item => item.id === targetId);
  if (!target) throw new Error(`Unknown command: ${targetId}`);
  const distractors = pool.filter(item => item.id !== targetId);
  const selected = [target, ...Array.from({ length: Math.min(2, distractors.length) }, (_, i) => distractors[(round + i) % distractors.length])];
  const rotation = round % selected.length;
  return [...selected.slice(rotation), ...selected.slice(0, rotation)];
}
