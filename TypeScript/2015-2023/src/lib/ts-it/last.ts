export function last<T>(iter: Iterable<T>): T | undefined {
  if (Array.isArray(iter)) return iter[iter.length - 1];
  let result: T | undefined = undefined;
  for (const x of iter) {
    result = x;
  }
  return result;
}

export function lastOrFail<T>(iterableWithAtLeastOneElement: Iterable<T>): T {
  if (Array.isArray(iterableWithAtLeastOneElement))
    return iterableWithAtLeastOneElement[
      iterableWithAtLeastOneElement.length - 1
    ];
  let result: T | undefined = undefined;
  let hadOne = false;
  for (const x of iterableWithAtLeastOneElement) {
    result = x;
    hadOne = true;
  }
  if (!hadOne) {
    throw new Error('Iterable should have at least one element');
  }
  return result!;
}
