import { any } from '../lib/ts-it/any'
import { range } from '../lib/ts-it/range'
import { reject } from '../lib/ts-it/reject'
import { size } from '../lib/ts-it/size'
import { isPrime } from '../lib/isPrime'

let start = 105700
let end = 122700
let result = size(reject<number>(isPrime)(range(start, end + 1, 17)))
console.log(result)
