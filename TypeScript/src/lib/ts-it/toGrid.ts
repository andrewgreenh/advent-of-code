import { enumerate } from './enumerate'
import { range } from './range'
import { printGrid } from './printGrid'
import { transpose } from './transpose2d'

export function toGrid<T>(xDim: number) {
  return function grid(iter: Iterable<T>) {
    const grid: T[][] = []
    for (let [index, item] of enumerate(iter)) {
      const row = Math.floor(index / xDim)
      const cell = index % xDim
      if (!grid[row]) grid[row] = []
      grid[row][cell] = item
    }
    return grid
  }
}
