export function numbers(s: string): number[] {
  return (s.match(/-?\d+/g) || []).map(Number);
}
