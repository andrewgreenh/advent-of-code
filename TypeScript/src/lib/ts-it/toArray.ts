export function toArray<T>(iter: Iterable<T>) {
  if (iter instanceof Array) return iter;
  const result: T[] = [];
  for (let x of iter) result.push(x);
  return result;
}
