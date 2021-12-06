import { DefaultArray } from '../lib/DefaultArray';
import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';
import { sum } from '../lib/ts-it/sum';

const input = getInput(6, 2021);
const fishes = numbers(input);

const fishesWithNumber = DefaultArray(() => 0);
for (const fish of fishes) fishesWithNumber[fish]++;

for (let n = 0; n < 256; n++) {
  let toAdd = 0;
  for (let i = 0; i <= 8; i++) {
    if (i === 0) toAdd = fishesWithNumber[i];
    if (i > 0) fishesWithNumber[i - 1] = fishesWithNumber[i];
  }
  fishesWithNumber[6] += toAdd;
  fishesWithNumber[8] = toAdd;
  if (n === 255 || n === 79) console.log(sum(fishesWithNumber));
}
