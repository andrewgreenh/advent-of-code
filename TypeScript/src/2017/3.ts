import combinations from '../lib/combinations'
import * as _ from 'lodash'
import getInput from '../lib/getInput'

const input = +getInput(3, 2017).trim()

function* gridTerator<T>() {
  const grid: { [key: string]: T } = {}
  let stepSize = 1
  let step = -1
  let x = 0
  let y = -1
  const set = value => (grid[`${x}-${y}`] = value)
  const get = ([x, y]) => grid[`${x}-${y}`]
  const getNeighbours = () =>
    combinations([-1, 0, 1], 2, true).map(([dx, dy]) => get([x + dx, y + dy]))
  const moves = [() => y++, () => x++, () => y--, () => x--]
  while (true) {
    for (let move of moves) {
      for (let i = 0; i < stepSize; i++, move(), step++) {
        yield { position: [x, y], set, getNeighbours, index: step }
      }
      if (moves.indexOf(move) % 2 !== 0) stepSize++
    }
  }
}

for (let { index, position: [x, y], set } of gridTerator()) {
  if (index + 1 === input) {
    console.log(Math.abs(x) + Math.abs(y))
    break
  }
}

for (let { position: [x, y], set, getNeighbours } of gridTerator<number>()) {
  const nextValue = getNeighbours().reduce((a, b) => a + (b || 0), 0) || 1
  if (nextValue > input) {
    console.log(nextValue)
    break
  }
  set(nextValue)
}
