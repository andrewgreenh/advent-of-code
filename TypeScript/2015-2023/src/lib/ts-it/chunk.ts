import { uncurry } from './uncurry';

export function chunk<T>(size: number) {
  return function* chunked(iter: Iterable<T>) {
    let currentChunk: T[] = [];
    for (let value of iter) {
      currentChunk.push(value);
      if (currentChunk.length === size) {
        yield currentChunk;
        currentChunk = [];
      }
    }
    if (currentChunk.length < size) yield currentChunk;
  };
}

export const dchunk = uncurry(chunk);
