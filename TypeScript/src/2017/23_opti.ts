import { isPrime } from '../lib/isPrime';
import { len } from '../lib/ts-it/len';
import { range } from '../lib/ts-it/range';
import { reject } from '../lib/ts-it/reject';

let start = 105700;
let end = 122700;
let result = len(reject<number>(isPrime)(range(start, end + 1, 17)));
console.log(result);
