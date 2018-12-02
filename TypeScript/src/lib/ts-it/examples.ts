import { combinations } from './combinations';
import { iterable } from './iterable';
import { pipe } from './pipe';
import { range } from './range';
import { toArray } from './toArray';

const i = iterable(() => range(0, 16));
pipe(i)(combinations(2), toArray, a => console.log(a));
