import { iter } from './iter'
import { range } from './range'

export function drop<T>(count: number) {
  return function* remainingValues(iterable: Iterable<T>) {
    const iterator = iter(iterable)
    for (const i of range(0, count)) {
      const value = iterator.next()
    }
    yield* iterator
  }
}
