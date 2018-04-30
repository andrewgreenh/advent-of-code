import { flatten } from './flatten';
import { toGrid } from './toGrid';

export function reshape<T>(xDim: number) {
  return function* reshaped(iter: Iterable<Iterable<T>>) {
    yield* toGrid(xDim)(flatten(iter))
  }
}
