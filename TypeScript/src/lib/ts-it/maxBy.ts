export function maxBy<T>(iteratee: (value: T) => number) {
  return function max(iter: Iterable<T>) {
    let max = -Infinity
    let maxValue: T | undefined = undefined
    for (let value of iter) {
      let num = iteratee(value)
      if (num > max) (max = num), (maxValue = value)
    }
    return maxValue
  }
}
