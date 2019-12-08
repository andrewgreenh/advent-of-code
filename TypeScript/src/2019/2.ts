import getInput from '../lib/getInput';
import { IntCodeComputer } from '../lib/intCode';
import { cross } from '../lib/ts-it/cross';
import { numbers } from '../lib/ts-it/numbers';
import { range } from '../lib/ts-it/range';

const input = getInput(2, 2019);

let n = numbers(input);
n[1] = 12;
n[2] = 2;
let a = new IntCodeComputer([...n]);
a.run();
console.log(a.instructions[0]);

for (let [a, b] of cross(range(0, 100), range(0, 100))) {
  let n = numbers(input);
  n[1] = a;
  n[2] = b;
  if (new IntCodeComputer([...n]).run().instructions[0] === 19690720) {
    console.log(100 * a + b);
    break;
  }
}
