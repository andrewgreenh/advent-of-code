export function toArray<T>(iter: Iterable<T>) {
  const result: T[] = []
  for (let x of iter) result.push(x)
  return result
}
