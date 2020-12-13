import getInput from '../lib/getInput';
import { ceil } from '../lib/math/ceil';
import { stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { minBy } from '../lib/ts-it/minBy';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import { isTruthy } from '../lib/utils';

const input = getInput(13, 2020);
const lines = stringToLines(input);
const arrival = Number(lines[0]);
const busses = numbers(lines[1]);

const bestBus = p(busses)(
  map((b) => [b, ceil(arrival / b) * b - arrival]),
  minBy(([a, b]) => b),
)!;
console.log(bestBus[0] * bestBus[1]);

function findCycles(
  firstCycle: bigint,
  firstOffset: bigint,
  secondCycle: bigint,
  secondOffset: bigint,
) {
  for (let x = 1n; x <= secondCycle; x++) {
    if ((firstCycle * x + firstOffset + secondOffset) % secondCycle === 0n)
      return [firstCycle * secondCycle, x * firstCycle + firstOffset];
  }
  throw new Error('Should never happen');
}

const reqs = lines[1]
  .split(',')
  .map((x, i) => (x === 'x' ? null : [BigInt(+x), BigInt(i)]))
  .filter(isTruthy);
const result = reqs.reduce((a, b) => findCycles(a[0], a[1], b[0], b[1]));

console.log(result[1].toString());
