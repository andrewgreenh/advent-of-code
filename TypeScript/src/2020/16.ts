import { range } from 'lodash';
import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(16, 2020);
const [ranges, yourTicketS, nearbyTicketsS] = input.split('\n\n');

const ticket = numbers(yourTicketS.split('\n')[1]);
const nearby = nearbyTicketsS.split('\n').map((l) => numbers(l));
nearby.shift();

let rules = ranges.split('\n').map((line) => {
  const [, from1, to1, from2, to2] = line.match(/(\d+)-(\d+) or (\d+)-(\d+)/)!;
  return (value: number) =>
    (value >= +from1 && value <= +to1) || (value >= +from2 && value <= +to2);
});

let s = 0;
let valids: number[][] = [];
for (let ticket of nearby) {
  const invalids = ticket.filter((n) => rules.every((r) => !r(n)));
  invalids.forEach((n) => (s += n));
  if (invalids.length === 0) valids.push(ticket);
}
console.log(s);

let ruleIndices: number[] = [];
while (ruleIndices.filter((n) => n !== undefined).length !== rules.length) {
  for (let ri = 0; ri < rules.length; ri++) {
    let validIs: number[] = [];
    for (let i of range(0, ticket.length)) {
      if (!ruleIndices.includes(i) && valids.every((t) => rules[ri](t[i])))
        validIs.push(i);
    }
    if (validIs.length === 1) ruleIndices[ri] = validIs[0];
  }
}

const result = rules
  .slice(0, 6)
  .map((r, i) => ticket[ruleIndices[i]])
  .reduce((a, b) => a * b);
console.log(result);
