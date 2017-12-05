import { enumerate } from './enumerate'

export function transpose<T>(iter: Iterable<Iterable<T>>) {
  const result: T[][] = []
  for (let [rowIndex, row] of enumerate(iter)) {
    for (let [cellIndex, cell] of enumerate(row)) {
      if (!result[cellIndex]) result[cellIndex] = []
      result[cellIndex][rowIndex] = cell
    }
  }
  return result
}
