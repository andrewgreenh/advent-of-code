import getInput from '../lib/getInput'
import { iter } from '../lib/ts-it'

let input = getInput(9, 2017).trim()
function doIt(input: string, score = 0, level = 1, garbageCount = 0, inGarbage = false) {
  let iterator = iter(input)
  for (let c of iterator) {
    if (c === '!') iterator.next()
    else if (c === '>') inGarbage = false
    else if (inGarbage) garbageCount++
    else if (c === '<') inGarbage = true
    else if (c === '{') (score += level), level++
    else if (c === '}') level--
  }

  return [score, garbageCount]
}

console.log(doIt(input))
