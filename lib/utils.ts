/**
 * Shared formatting utilities — import from here, don't redefine per file.
 */

/** "499,99 €" — French decimal format */
export function formatEUR(n: number): string {
  return n % 1 === 0
    ? n.toFixed(0) + " €"
    : n.toFixed(2).replace(".", ",") + " €"
}

/** "499.99 €" — keeps period, used in data/display contexts */
export function formatEURSmart(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) + " €" : n.toFixed(2) + " €"
}

/** Format a savings percentage */
export function formatPct(n: number): string {
  return "−" + Math.round(n) + " %"
}
