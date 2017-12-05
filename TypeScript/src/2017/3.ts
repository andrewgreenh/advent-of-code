import { InfiniteGrid } from '../lib/InfiniteGrid'
import combinations from '../lib/combinations'
import * as _ from 'lodash'
import getInput from '../lib/getInput'
import { enumerate } from '../lib/ts-it/enumerate'
import { sum } from '../lib/ts-it/sum'

const input = +getInput(3, 2017).trim()
const grid = new InfiniteGrid<number>()

for (let [index, [x, y]] of enumerate(grid.spiralAround([0, 0]))) {
  if (index + 1 === input) {
    console.log(Math.abs(x) + Math.abs(y))
    break
  }
}

grid.set([0, 0], 1)
for (let [x, y] of grid.spiralAround([0, 0])) {
  const neighbours = [...grid.neighbours([x, y])]
  const nextValue = sum(neighbours) || 1
  if (nextValue > input) {
    console.log(nextValue)
    break
  }
  grid.set([x, y], nextValue)
}
