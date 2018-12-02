export function countBy<T>(
  iteratee: (item: T) => string = item => String(item),
) {
  return function applyOn(iterable: Iterable<T>) {
    const aggregator: Record<string, number> = {};
    for (const item of iterable) {
      const key = iteratee(item);
      if (!aggregator[key]) aggregator[key] = 0;
      aggregator[key]++;
    }
    return aggregator;
  };
}
