import { enumerate } from './enumerate';

export function take<T>(count: number) {
  return function* takenElements(iter: Iterable<T>) {
    for (const [index, item] of enumerate(iter)) {
      yield item
      if (index >= count - 1) break
    }
  }
}
