import { iter } from './iter';

export function dropWhile<T>(iteratee: (value: T) => boolean | undefined) {
  return function* remainingValues(iterable: Iterable<T>) {
    const iterator = iter(iterable)
    while (true) {
      const value = iterator.next().value
      const continueDropping = iteratee(value)
      if (!continueDropping) {
        yield value
        break
      }
    }
    yield* iterator
  }
}
