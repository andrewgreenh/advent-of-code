import _ from 'lodash';
import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';

let registers = {};
let max = -Infinity;
let maxs = [0];
for (let line of lines(getInput(8, 2017))) {
  let [a, op, b, iff, reg, cond, numb] = line.split(' ');
  if (!registers[a]) registers[a] = 0;
  if (!registers[reg]) registers[reg] = 0;
  eval(
    `if (registers.${reg} ${cond} ${numb}) registers.${a} ${
      op === 'inc' ? '+' : '-'
    }= ${b}`,
  );
  maxs.push(<number>_.max(<number[]>_.values(registers)));
}

console.log(_.max(<number[]>_.values(registers)));
console.log(_.max(maxs));
