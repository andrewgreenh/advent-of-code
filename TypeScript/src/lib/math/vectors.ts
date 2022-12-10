export type Vector2D = [number, number];

export function vectorAddM<T extends number[]>(a: T, b: T) {
  for (let i = 0; i < b.length; i++) a[i] += b[i];
}

export function vectorAdd<T extends number[]>(a: T, b: T) {
  return a.map((c, i) => c + b[i]) as T;
}

export function vectorDifference<T extends number[]>(a: T, b: T) {
  return a.map((c, i) => c - b[i]) as T;
}

export function vectorScale<T extends number[]>(a: T, b: number) {
  return a.map((c) => c + b) as T;
}

export function vectorScaleM<T extends number[]>(a: T, b: number) {
  for (let i = 0; i < a.length; i++) a[i] *= b;
}

export function euclidDist<T extends number[]>(a: T, b: T): number {
  return Math.hypot(...a.map((c, i) => c - b[i]));
}
