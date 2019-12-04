export default function slide<T>(n: number) {
  return function* slider(iter: Iterable<T>): IterableIterator<T[]> {
    const window: T[] = [];
    while (window.length < n)
      for (const value of iter) {
        if (window.length === n) {
          yield [...window];
          window.shift();
        }
        window.push(value);
      }
    if (window.length <= n) yield window;
  };
}
