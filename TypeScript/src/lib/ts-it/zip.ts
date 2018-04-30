import { iter } from './iter';

export function* zip<A, B>(iterable1: Iterable<A>, iterable2: Iterable<B>) {
  let iter1 = iter(iterable1)
  let iter2 = iter(iterable2)
  while (true) {
    let { done: d1, value: v1 } = iter1.next()
    let { done: d2, value: v2 } = iter2.next()
    if (d1 || d2) break
    yield [v1, v2] as [A, B]
  }
}
