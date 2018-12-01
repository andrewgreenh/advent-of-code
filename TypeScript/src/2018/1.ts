import getInput from '../lib/getInput';
import { cycle } from '../lib/ts-it/cycle';
import { lines } from '../lib/ts-it/lines';

const input = getInput(1, 2018);

let result = 0;
for (let line of lines(input)) {
  result += +line;
}
console.log(result);

let history = new Set([0]);
result = 0;
for (let line of cycle(lines(getInput(1, 2018)))) {
  result += +line;
  if (history.has(result)) {
    console.log(result);
    break;
  }
  history.add(result);
}
