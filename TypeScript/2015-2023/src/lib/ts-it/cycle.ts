import { toArray } from './toArray';

export function* cycle<T>(iter: Iterable<T>) {
  const values = toArray(iter);
  while (true) yield* values;
}
