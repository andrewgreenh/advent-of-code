import { sumBy } from './sumBy';

export function countIf<T>(iteratee: (item: T) => boolean) {
  return sumBy<T>((item) => (iteratee(item) ? 1 : 0));
}
