import { iter } from './iter';

export function first<T>(iterable: Iterable<T>) {
  let iterator = iter(iterable);
  const next = iterator.next();
  if (next.done) return;
  return next.value;
}
