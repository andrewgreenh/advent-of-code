import 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(18, 2020);
const lines = stringToLines(input);

const lex = (s: string) => s.split('').filter((c) => c !== ' ');

type DeepString = string | Array<DeepString>;

function parse(tokens: string[]): DeepString {
  const thisExpression: DeepString = [];
  let next: string | undefined;
  while ((next = tokens.shift())) {
    if (next === undefined) break;
    if (next === '(') thisExpression.push(parse(tokens));
    else if (next === ')') break;
    else thisExpression.push(next);
  }
  return thisExpression;
}

const add = (a: number, b: number) => a + b;
const mul = (a: number, b: number) => a * b;
function exec(s: DeepString, getOpIndex: (s: DeepString[]) => number): number {
  if (typeof s === 'string') return +s;
  let index = 0;
  while ((index = getOpIndex(s)) !== -1) {
    const func = s[index] === '+' ? add : mul;
    const agg = func(
      exec(s[index - 1], getOpIndex),
      exec(s[index + 1], getOpIndex),
    );
    s.splice(index - 1, 3, String(agg));
  }
  return +s[0];
}

let acc1 = 0;
let acc2 = 0;
for (let l of lines) {
  acc1 += exec(parse(lex(l)), (s) => (s[1] === '*' || s[1] === '+' ? 1 : -1));
  acc2 += exec(parse(lex(l)), (s) =>
    s.includes('+') ? s.indexOf('+') : s.includes('*') ? s.indexOf('*') : -1,
  );
}
console.log(acc1);
console.log(acc2);
