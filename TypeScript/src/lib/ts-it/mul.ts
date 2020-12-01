import { reduce } from './reduce';

export function mul(iter: Iterable<any>): number {
  return reduce((a: number, b: any) => {
    const number = Number(b);
    if (Number.isNaN(number)) return a;
    return a * number;
  })(iter);
}
