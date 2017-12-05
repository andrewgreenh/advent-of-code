import getInput from '../lib/getInput'
import { enumerate } from '../lib/ts-it/enumerate'

const input = getInput(1, 2017).trim()

const result = (number: string, offset: number) => {
  let count = 0
  for (const [index, char] of enumerate(number.split(''))) {
    if (number[(index + offset) % number.length] === char) count += +char
  }
  return count
}

console.log(result(input, 1))
console.log(result(input, input.length / 2))
