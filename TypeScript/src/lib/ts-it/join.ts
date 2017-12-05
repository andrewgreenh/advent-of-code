export function join<T>(string?: string) {
  return function joined(iter: Iterable<T>) {
    return [...iter].join(string)
  }
}
