import getInput from '../lib/getInput';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { max } from '../lib/ts-it/max';
import { numbers } from '../lib/ts-it/numbers';
import { range } from '../lib/ts-it/range';

const [first, ...instructions] = stringToLines(getInput(19, 2018));
const commands: {
  [key: string]: (args: number[]) => (regs: number[]) => void;
} = {
  addr: ([a, b, c]) => (regs) => (regs[c] = regs[a] + regs[b]),
  addi: ([a, b, c]) => (regs) => (regs[c] = regs[a] + b),
  mulr: ([a, b, c]) => (regs) => (regs[c] = regs[a] * regs[b]),
  muli: ([a, b, c]) => (regs) => (regs[c] = regs[a] * b),
  banr: ([a, b, c]) => (regs) => (regs[c] = regs[a] & regs[b]),
  bani: ([a, b, c]) => (regs) => (regs[c] = regs[a] & b),
  borr: ([a, b, c]) => (regs) => (regs[c] = regs[a] | regs[b]),
  bori: ([a, b, c]) => (regs) => (regs[c] = regs[a] | b),
  setr: ([a, b, c]) => (regs) => (regs[c] = regs[a]),
  seti: ([a, b, c]) => (regs) => (regs[c] = a),
  gtir: ([a, b, c]) => (regs) => (regs[c] = a > regs[b] ? 1 : 0),
  gtri: ([a, b, c]) => (regs) => (regs[c] = regs[a] > b ? 1 : 0),
  gtrr: ([a, b, c]) => (regs) => (regs[c] = regs[a] > regs[b] ? 1 : 0),
  eqir: ([a, b, c]) => (regs) => (regs[c] = a === regs[b] ? 1 : 0),
  eqri: ([a, b, c]) => (regs) => (regs[c] = regs[a] === b ? 1 : 0),
  eqrr: ([a, b, c]) => (regs) => (regs[c] = regs[a] === regs[b] ? 1 : 0),
};

for (const x of range(0, 2)) {
  let [result, pointer, i, regs] = [x, numbers(first)[0], 100, [x, 0, 0, 0, 0]];
  while (i--) {
    const [name, ...args] = instructions[regs[pointer]].split(' ');
    commands[name](args.map(Number))(regs);
    regs[pointer]++;
  }
  const target = max(regs);
  for (let x of range(0, target + 1)) if (target % x === 0) result += x;
  console.log(result);
}
