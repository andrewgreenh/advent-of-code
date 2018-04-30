import { flip } from './flip';
import { transpose } from './transpose';

export function rotate<T>(direction: 'clockwise' | 'counterclockwise' = 'clockwise') {
  return function(iter: Iterable<Iterable<T>>): Iterable<Iterable<T>> {
    if (direction === 'clockwise') {
      return flip<T>('horizontal')(transpose(iter));
    }
    return transpose(flip<T>('horizontal')(iter));
  };
}
