export interface Entry<T> {
  [0]: number
  [1]: T
  [Symbol.iterator](): IterableIterator<any>
}

export function* enumerate<T>(iter: Iterable<T>) {
  let i = 0;
  for (let item of iter) {
    yield <Entry<T>>[i++, item]
  }
}
