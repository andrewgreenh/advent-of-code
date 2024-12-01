export const gcd = (a: number, b: number) => (a ? gcd(b % a, a) : b);
