import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(7, 2020);
const lines = stringToLines(input);

const tree = {} as { [key: string]: { [key: string]: number } };

for (const line of lines) {
  const [, outer, inners] = line.match(/(\w+ \w+) bags contain (.*)/)!;
  tree[outer] = {};
  const innerBags = inners.match(/(\d+ \w+ \w+ bags?)/g);
  if (!innerBags) continue;
  for (const inner of innerBags) {
    const [, count, color] = inner.match(/(\d+) (\w+ \w+)/)!;
    tree[outer][color] = +count;
  }
}

function findGold(color: string): boolean {
  if (tree[color]['shiny gold']) return true;
  return Object.keys(tree[color]).some((color) => findGold(color));
}

let sum = 0;
for (const color of Object.keys(tree)) {
  if (findGold(color)) sum++;
}
console.log(sum);

function countColor(color: string): number {
  let sum = 0;
  for (const c of Object.keys(tree[color])) {
    sum += (countColor(c) + 1) * +tree[color][c];
  }
  return sum;
}

console.log(countColor('shiny gold'));
