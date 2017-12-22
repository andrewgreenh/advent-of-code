import getInput from '../lib/getInput'
import { lines } from '../lib/ts-it/lines'
import { InfiniteGrid } from '../lib/InfiniteGrid'
import { enumerate } from '../lib/ts-it/enumerate'
import { range } from '../lib/ts-it/range'

let grid = new InfiniteGrid()
let input = getInput(22, 2017)
let baseSize = input.trim().split('\n').length
for (let [rowIndex, line] of enumerate(lines(input))) {
  for (let [charIndex, char] of enumerate(line)) {
    let x = charIndex - Math.floor(baseSize / 2)
    let y = rowIndex - Math.floor(baseSize / 2)
    grid.set([x, y], char)
  }
}

let dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]]
let dir = dirs[0]
let pos: [number, number] = [0, 0]
let count = 0

for (let i of range(0, 10000000)) {
  let dirIndex = dirs.indexOf(dir)
  let char = grid.get(pos)
  let turnOffset = char === '#' ? 1 : char === 'F' ? 2 : char === 'W' ? 0 : 3
  dir = dirs[(dirIndex + turnOffset) % 4]
  if (char === '#') grid.set(pos, 'F')
  if (char === 'F') grid.set(pos, '.')
  if (char === '.' || char === undefined) grid.set(pos, 'W')
  if (char === 'W') {
    grid.set(pos, '#')
    count++
  }
  pos = [pos[0] + dir[0], pos[1] + dir[1]]
}

console.log(count)
