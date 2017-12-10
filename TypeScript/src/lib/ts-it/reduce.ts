export function reduce<T, A>(reducer: (last: A | T, current: T) => A, initialValue?: A | T) {
  return function(iter: Iterable<T>) {
    let last = initialValue
    for (const value of iter) {
      if (!last) {
        last = value
        continue
      }
      last = reducer(<A | T>last, value)
    }
    return <A>last
  }
}
