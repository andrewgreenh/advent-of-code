import getInput from '../lib/getInput';
import { parsel, Parser } from '../lib/parser/parser';

const input = getInput(19, 2020);

const [rules, messages] = input.split('\n\n').map((part) => part.split('\n'));
let rulesByNum = {} as ObjectOf<Parser<any>>;

function ruleToParser(rule: string) {
  return parsel.oneOf(
    ...rule.split(' | ').map((seq) =>
      parsel.seqOf(
        ...seq.split(' ').map((c) => {
          if (c[0] === '"') return parsel.startsWith(c[1]);
          return parsel.lazy(() => rulesByNum[c]);
        }),
      ),
    ),
  );
}

for (const [num, rule] of rules.map((r) => r.split(': ')))
  rulesByNum[num] = ruleToParser(rule);

let c = 0;
for (let msg of messages) {
  if (parsel.parse(rulesByNum[0], msg) !== 'FAILURE') c++;
}
console.log(c);

rulesByNum[8] = ruleToParser('42 | 42 8');
rulesByNum[11] = ruleToParser('42 31 | 42 11 31');

c = 0;
for (let msg of messages)
  if (parsel.parse(rulesByNum[0], msg) !== 'FAILURE') c++;

console.log(c);
