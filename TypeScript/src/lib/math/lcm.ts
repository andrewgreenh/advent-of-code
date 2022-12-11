import { gcd } from './gcd';

export const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

export const arrayLcm = (input: number[]) => input.reduce((a, b) => lcm(a, b));
