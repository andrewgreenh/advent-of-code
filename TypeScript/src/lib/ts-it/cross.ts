export function* cross<Iterables extends Iterable<any>[]>(
  ...iterables: Iterables
): IterableIterator<
  {
    [key in keyof Iterables]: Iterables[key] extends Iterable<infer U>
      ? U
      : never;
  }
> {
  iterables = iterables.map(i => (Array.isArray(i) ? i : [...i])) as any;
  const [first, ...rest] = iterables;
  if (iterables.length === 1) {
    for (const i of first) yield [i] as any;
    return;
  }

  for (const i of first) {
    for (const result of cross(...rest)) {
      yield [i, ...result] as any;
    }
  }
}
