export function chunk<T>(size) {
  return function* chunked(iter: Iterable<T>) {
    let currentChunk: T[] = []
    for (let value of iter) {
      currentChunk.push(value)
      if (currentChunk.length === size) {
        yield currentChunk
        currentChunk = []
      }
    }
  }
}
