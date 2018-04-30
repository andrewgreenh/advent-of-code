import { iter } from './iter';

export function first<T>(iterable: Iterable<T>) {
  let iterator = iter(iterable)
  return iterator.next().value
}
