export function* iter<T>(iter: Iterable<T>) {
  for (let item of iter) yield item;
}
