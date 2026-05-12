import { CallTemplate, DailyCall } from '../types/calls.types';

export function generateDailyCalls(
  eligiblePool: CallTemplate[], 
  count: number, 
  seed: number
): DailyCall[] {
  if (eligiblePool.length === 0) return [];

  const shuffled = [...eligiblePool].sort(() => {
    // Simple pseudo-randomness based on seed
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x) - 0.5;
  });

  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((template, index) => ({
    ...template,
    instanceId: `call-${Date.now()}-${index}`,
    responded: false
  }));
}
