import { gcd } from './gcd';

export const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
