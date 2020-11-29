import { map } from './map';
import { reverse } from './reverse';

export function flip<T>(direction: 'horizontal' | 'vertical' = 'horizontal') {
  return function (iter: Iterable<Iterable<T>>): Iterable<Iterable<T>> {
    if (direction === 'horizontal') {
      return map((row: Iterable<T>) => reverse<T>()(row))(iter);
    }
    return reverse<Iterable<T>>()(iter);
  };
}
