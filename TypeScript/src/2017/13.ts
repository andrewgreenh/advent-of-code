import getInput from '../lib/getInput'
import { any } from '../lib/ts-it/any'
import { first } from '../lib/ts-it/first'
import { lines } from '../lib/ts-it/lines'
import { map } from '../lib/ts-it/map'
import { range } from '../lib/ts-it/range'
import { reduce } from '../lib/ts-it/reduce'
import { reject } from '../lib/ts-it/reject'

let input = [...map<string, number[]>(x => x.split(': ').map(Number))(lines(getInput(13, 2017)))]
let getSev = reduce<number[], number>((s, [d, r]) => (d % ((r - 1) * 2) === 0 ? s + d * r : s), 0)
console.log(getSev(input))

let willGetCaught = offset => any<number[]>(([d, r]) => (d + offset) % ((r - 1) * 2) === 0)(input)
let uncaught = reject(willGetCaught)(range(0))
console.log(first(uncaught))
