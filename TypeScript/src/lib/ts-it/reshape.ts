import { toGrid } from './toGrid'
import { flatten } from './flatten'

export function reshape<T>(xDim: number) {
  return function* reshaped(iter: Iterable<Iterable<T>>) {
    yield* toGrid(xDim)(flatten(iter))
  }
}
