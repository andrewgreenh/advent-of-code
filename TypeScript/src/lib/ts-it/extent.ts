export function extent(iter: Iterable<number>) {
  let min: number | undefined = undefined;
  let max: number | undefined = undefined;
  for (let item of iter) {
    if (min === undefined) min = item;
    if (max === undefined) max = item;
    if (item < min) min = item;
    if (item > max) max = item;
  }
  return [min, max] as const;
}
