import { intersection, pull, sortBy } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';
import { values } from '../lib/utils';

const input = getInput(21, 2020);
const lines = stringToLines(input);

const foodMap = {} as ObjectOf<string[]>;
for (const line of lines) {
  const [ings, alls] = line.split(' (contains ').map((x) => x.match(/(\w+)/g)!);
  for (const allergene of alls) {
    if (!foodMap[allergene]) foodMap[allergene] = ings;
    foodMap[allergene] = intersection(foodMap[allergene], ings);
  }
}

let changed = true;
while (changed) {
  changed = false;
  for (const a of Object.keys(foodMap)) {
    if (foodMap[a].length === 1) {
      for (const otherA of Object.keys(foodMap)) {
        if (a === otherA) continue;
        if (foodMap[otherA].includes(foodMap[a][0])) {
          changed = true;
          pull(foodMap[otherA], foodMap[a][0]);
        }
      }
    }
  }
}
const foodContainingAllergenes = values(foodMap).reduce((a, b) => a.concat(b));
let c = 0;
for (const line of lines) {
  const [ings, alls] = line.split(' (contains ').map((x) => x.match(/(\w+)/g)!);
  for (const food of ings) if (!foodContainingAllergenes.includes(food)) c++;
}
console.log(c);
console.log(
  sortBy(Object.keys(foodMap))
    .map((key) => foodMap[key][0])
    .join(','),
);
