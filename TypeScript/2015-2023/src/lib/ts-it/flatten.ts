export function* flatten<T>(iter: Iterable<Iterable<T>>): IterableIterator<T> {
  for (let outer of iter) {
    for (let inner of outer) yield inner;
  }
}
