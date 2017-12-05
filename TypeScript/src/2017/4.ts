import getInput from '../lib/getInput'
import { filter } from '../lib/ts-it/filter'
import { lines } from '../lib/ts-it/lines'
import { map } from '../lib/ts-it/map'
import { pipe } from '../lib/ts-it/pipe'
import { toArray } from '../lib/ts-it/toArray'
import { words } from '../lib/ts-it/words'

const input = getInput(4, 2017).trim()

const hasNoDuplicates = row => new Set(row).size === row.length
const sortWord = word => [...word].sort().join('')

function result(rowMapper) {
  return pipe(input)(lines, map(words), map(rowMapper), filter(hasNoDuplicates), toArray).length
}

console.log([row => [...row], row => [...row].map(sortWord)].map(result))
