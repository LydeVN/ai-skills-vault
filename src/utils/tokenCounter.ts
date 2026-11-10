/**
 * Estimates token count for standard LLM models (~4 characters per token average)
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Code and structured prompts tend to have slightly higher token density (~3.6 chars/token)
  return Math.ceil(text.length / 3.8);
}

/**
 * Calculates estimated cost based on standard modern LLM pricing
 * (e.g. $0.15 - $2.50 / 1M tokens)
 */
export function estimateCost(tokens: number, ratePerMillion: number = 0.50): string {
  const cost = (tokens / 1_000_000) * ratePerMillion;
  if (cost < 0.0001) return '< $0.0001';
  return `$${cost.toFixed(4)}`;
}

/**
 * Format date nicely
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}
