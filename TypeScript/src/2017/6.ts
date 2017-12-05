import getInput from '../lib/getInput'
import { lines } from '../lib/ts-it/lines'

let result
for (let line of lines(getInput(5, 2017))) {
  console.log(line)
}

console.log(result)
