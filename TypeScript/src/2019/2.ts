import getInput from '../lib/getInput';
import { intCode, IntCodeInstructions } from '../lib/intCode';
import { cross } from '../lib/ts-it/cross';
import { numbers } from '../lib/ts-it/numbers';
import { range } from '../lib/ts-it/range';

const input = getInput(2, 2019);

let instructions: IntCodeInstructions = {
  1: (n, index) => {
    let a = n[index + 1];
    let b = n[index + 2];
    let c = n[index + 3];
    n[c] = n[a] + n[b];
    return index + 4;
  },
  2: (n, index) => {
    let a = n[index + 1];
    let b = n[index + 2];
    let c = n[index + 3];
    n[c] = n[a] * n[b];
    return index + 4;
  },
  99: () => -1,
};

let n = numbers(input);
n[1] = 12;
n[2] = 2;
console.log(intCode(n, instructions)[0]);

for (let [a, b] of cross(range(0, 100), range(0, 100))) {
  let n = numbers(input);
  n[1] = a;
  n[2] = b;
  if (intCode(n, instructions)[0] === 19690720) {
    console.log(100 * a + b);
    break;
  }
}
