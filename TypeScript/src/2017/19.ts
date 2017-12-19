import getInput from '../lib/getInput'

let input = getInput(19, 2017)
let grid = input.split('\n').map(line => line.split(''))
let ds = [[0, -1], [1, 0], [0, 1], [-1, 0]]
let d: any = ds[2]
let [abc, steps, p] = ['', 1, [grid[0].indexOf('|'), 0]]
let m = (pos, dir) => (dir ? [pos[0] + dir[0], pos[1] + dir[1]] : pos)
let g = pos => grid[pos[1]][pos[0]]
while (((p = m(p, d)), d && steps++)) {
  d = [d, ds[(ds.indexOf(d) + 1) % 4], ds[(ds.indexOf(d) + 3) % 4]].find(d => g(m(p, d)) !== ' ')
  if (!['|', '-', '+', ' '].includes(g(p))) abc += g(p)
}
console.log(abc, steps)
