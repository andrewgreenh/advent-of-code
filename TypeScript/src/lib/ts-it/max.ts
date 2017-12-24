export function max(iter: Iterable<number>) {
  let max = -Infinity
  for (let value of iter) if (value > max) max = value
  return max
}
