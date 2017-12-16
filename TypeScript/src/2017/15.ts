import { seqOf } from '../lib/ts-it/seqOf'
import { pipe } from '../lib/ts-it'
import { filter } from '../lib/ts-it/filter'
import { size } from '../lib/ts-it/size'
import { take } from '../lib/ts-it/take'
import { zip } from '../lib/ts-it/zip'

let [factorA, factorB] = [16807, 48271]
let [a, b] = [703, 516]

let getGen = (num: number, factor: number) => seqOf(() => (num = (num * factor) % (2 ** 31 - 1)))

let count = 40000000
let pairs = zip<number, number>(getGen(a, factorA), getGen(b, factorB))

// let count = 5000000
// let pairs = zip<number, number>(
//   filter<number>(x => x % 4 === 0)(getGen(a, factorA)),
//   filter<number>(x => x % 8 === 0)(getGen(b, factorB)),
// )

let result = pipe(pairs)(
  take<[number, number]>(count),
  filter<[number, number]>(([a, b]) => (a & 0xffff) === (b & 0xffff)),
  size,
)
console.log(result)
