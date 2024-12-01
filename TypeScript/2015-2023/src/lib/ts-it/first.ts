import { iter } from './iter';

export function first<T>(iterable: Iterable<T>) {
  let iterator = iter(iterable);
  const next = iterator.next();
  if (next.done) return;
  return next.value;
}

export function firstOrFail<T>(iterableWithAtLeastOneElement: Iterable<T>) {
  let iterator = iter(iterableWithAtLeastOneElement);
  const next = iterator.next();
  if (next.done) throw new Error('No elements in iterable');
  return next.value;
}
