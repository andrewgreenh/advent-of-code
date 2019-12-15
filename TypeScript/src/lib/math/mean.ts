import { sum } from '../ts-it/sum';

export function mean(ns: number[]): number {
  return sum(ns) / ns.length;
}
