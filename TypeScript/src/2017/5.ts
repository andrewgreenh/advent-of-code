import { lines, map } from '../lib/ts-it';
import * as _ from 'lodash';
import getInput from '../lib/getInput';

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

[x => x+1, x => (x >= 3 ? x - 1 : x + 1)].map(x => answer(x)).forEach(x => console.log(x));
