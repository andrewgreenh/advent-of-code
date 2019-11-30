export function reverse<T>() {
  return function* reversed(iter: Iterable<T>) {
    yield* [...iter].reverse();
  };
}
