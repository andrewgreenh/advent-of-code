import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';

const input = [...map(Number)(lines(getInput(5, 2017)))];

function answer(mutate, index = 0, step = 0) {
  const instructions = [...input];
  while (index >= 0 && index < instructions.length) {
    const num = instructions[index];
    instructions[index] = mutate(num);
    index += num;
    step++;
  }
  return step;
}

[x => x + 1, x => (x >= 3 ? x - 1 : x + 1)]
  .map(x => answer(x))
  .forEach(x => console.log(x));
