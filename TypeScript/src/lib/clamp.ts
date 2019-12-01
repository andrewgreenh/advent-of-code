export function clamp(lowerBound: number, upperBound: number) {
  return function executeClamp(n: number) {
    if (n < lowerBound) return lowerBound;
    if (n > upperBound) return upperBound;
    return n;
  };
}
