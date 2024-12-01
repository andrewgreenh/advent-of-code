import { reduce } from './reduce';

export function sum(iter: Iterable<any>): number {
  return reduce((a: number, b: any) => {
    const number = Number(b);
    if (Number.isNaN(number)) return a;
    return a + number;
  }, 0)(iter);
}
