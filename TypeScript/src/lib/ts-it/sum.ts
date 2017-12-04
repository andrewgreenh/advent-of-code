import { reduce } from './reduce';

export function sum(iter: Iterable<number>) {
  return reduce((a: number, b: number) => a + b, 0)(iter);
}
