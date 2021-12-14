import { DefaultDict } from '../lib/DefaultDict';
import getInput from '../lib/getInput';
import { extent } from '../lib/ts-it/extent';
import { stringToLines } from '../lib/ts-it/lines';
import { toPairs } from '../lib/ts-it/pairs';
import { values } from '../lib/utils';

const input = getInput(14, 2021);
let [template, ...rules] = stringToLines(input);

const ruleMap = {} as ObjectOf<string>;
for (const rule of rules) {
  const [input, output] = rule.split(' -> ');
  ruleMap[input] = output;
}

let countsByPair = DefaultDict(() => 0);
for (let x = 1; x < template.length; x++)
  countsByPair[`${template[x - 1]}${template[x]}`]++;

for (let i = 1; i <= 40; i++) {
  for (const [pair, count] of toPairs(countsByPair)) {
    countsByPair[pair] -= count;
    countsByPair[`${pair[0]}${ruleMap[pair]}`] += count;
    countsByPair[`${ruleMap[pair]}${pair[1]}`] += count;
  }

  if (i === 10 || i === 40) {
    const counts = DefaultDict(() => 0);
    for (const [p, c] of toPairs(countsByPair)) counts[p[1]] += c;
    const [min, max] = extent(values(counts));
    console.log(max! - min!);
  }
}
