import { reduce } from './reduce';

export function sum(iter: Iterable<number | string>): number {
  return reduce((a: number, b: number | string) => {
    const number = Number(b)
    if (Number.isNaN(number)) return a
    return a + number
  }, 0)(iter)
}
