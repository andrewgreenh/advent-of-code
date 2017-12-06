import getInput from '../lib/getInput'
import { map } from '../lib/ts-it/map'
import { max } from '../lib/ts-it/max'
import { range } from '../lib/ts-it/range'
import { words } from '../lib/ts-it/words'

let banks = [...map(Number)(words(getInput(6, 2017)))]
// let banks = [...map(Number)(words('0 2 7 0'))]

let history: string[] = []
let hash = (list: number[]) => list.join(' - ')
while (!history.includes(hash(banks))) {
  history.push(hash(banks))
  let index = banks.indexOf(max(banks))
  let count = banks[index]
  banks[index] = 0
  for (let i of range(1, count + 1)) banks[(index + i) % banks.length]++
}
console.log(history.length)
console.log(history.length - history.indexOf(hash(banks)))
