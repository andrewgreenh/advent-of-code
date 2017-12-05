export function reduce<T, A>(reducer: (last: A, current: T) => A, initialValue: A) {
  return function(iter: Iterable<T>) {
    let last = initialValue
    for (const value of iter) last = reducer(last, value)
    return last
  }
}
