import getInput from '../lib/getInput'
import { lines, range, toGrid } from '../lib/ts-it'

let k1 = toGrid(3)(range(1, 10))
let k2 = `  1
 234
56789
 ABC
  D`.split('\n')

let moves = { U: [0, -1], D: [0, 1], R: [1, 0], L: [-1, 0] }

function solve(keypad, x, y, result = '') {
  for (let line of lines(getInput(2, 2016))) {
    for (let char of line.split('')) {
      let nx = x + moves[char][0]
      let ny = y + moves[char][1]
      if (!keypad[ny] || keypad[ny][nx] === ' ' || !keypad[ny][nx]) continue
      x = nx
      y = ny
    }
    result += keypad[y][x]
  }
  return result
}

console.log(solve(k1, 1, 1), solve(k2, 0, 2))
