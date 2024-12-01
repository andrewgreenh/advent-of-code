import { asyncGetInput } from '../lib/getInputAsync';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';

const input = await asyncGetInput(4, 2023);
const nums = numbers(input);
const lines = stringToLines(input);

let result = 0;
for (const line of lines) {
  const [, winners, picked] = line.match(/: (.*) \| (.*)/)!;
  const winnersNums = numbers(winners);
  const pickedNums = numbers(picked);
  const correctPicks = pickedNums.filter((x) => winnersNums.includes(x)).length;
  if (correctPicks === 0) continue;
  result += 2 ** (correctPicks - 1);
  console.log(line.slice(0, 10), 2 ** (correctPicks - 1));
}
console.log(result);
