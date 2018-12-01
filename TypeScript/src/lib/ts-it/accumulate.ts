export function* accumulate(iter: Iterable<any>): IterableIterator<number> {
  let currentSum = 0;
  for (const item of iter) {
    const number = Number(item);
    if (!Number.isNaN(number)) currentSum += number;
    yield currentSum;
  }
}
