export function max(iter: Iterable<number>) {
  let max = -Infinity;
  for (let value of iter) if (value > max) max = value;
  return max;
}

export function maxWithProgress(iter: Iterable<number>) {
  let max = -Infinity;
  for (let value of iter) {
    if (value > max) {
      max = value;
      console.log('new max', max);
    }
  }
  return max;
}
