export type Entry<T> = [number, T]

export function* enumerate<T>(iter: Iterable<T>) {
  let i = 0
  for (let item of iter) {
    yield <Entry<T>>[i++, item]
  }
}
