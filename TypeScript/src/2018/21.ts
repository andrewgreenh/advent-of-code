import getInput from '../lib/getInput';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';

const [first, ...instr] = [...stringToLines(getInput(21, 2018))];
const commands: {
  [key: string]: (args: number[]) => (regs: number[]) => void;
} = {
  addr: ([a, b, c]) => regs => (regs[c] = regs[a] + regs[b]),
  addi: ([a, b, c]) => regs => (regs[c] = regs[a] + b),
  mulr: ([a, b, c]) => regs => (regs[c] = regs[a] * regs[b]),
  muli: ([a, b, c]) => regs => (regs[c] = regs[a] * b),
  banr: ([a, b, c]) => regs => (regs[c] = regs[a] & regs[b]),
  bani: ([a, b, c]) => regs => (regs[c] = regs[a] & b),
  borr: ([a, b, c]) => regs => (regs[c] = regs[a] | regs[b]),
  bori: ([a, b, c]) => regs => (regs[c] = regs[a] | b),
  setr: ([a, b, c]) => regs => (regs[c] = regs[a]),
  seti: ([a, b, c]) => regs => (regs[c] = a),
  gtir: ([a, b, c]) => regs => (regs[c] = a > regs[b] ? 1 : 0),
  gtri: ([a, b, c]) => regs => (regs[c] = regs[a] > b ? 1 : 0),
  gtrr: ([a, b, c]) => regs => (regs[c] = regs[a] > regs[b] ? 1 : 0),
  eqir: ([a, b, c]) => regs => (regs[c] = a === regs[b] ? 1 : 0),
  eqri: ([a, b, c]) => regs => (regs[c] = regs[a] === b ? 1 : 0),
  eqrr: ([a, b, c]) => regs => (regs[c] = regs[a] === regs[b] ? 1 : 0),
};

const compiled = instr.map(line => {
  const [instruction, ...args] = line.split(' ');
  const numberArgs = args.map(Number);
  const command = commands[instruction];
  const arged = command(numberArgs);
  return () => arged(regs);
});
const index = numbers(first)[0];
let regs = [0, 0, 0, 0, 0, 0];

let results = new Set<number>();

let previous = 0;
while (true) {
  if (regs[index] === 28) {
    if (results.has(regs[3])) {
      console.log(previous);
      break;
    }
    results.add((previous = regs[3]));
  }
  compiled[regs[index]]();
  regs[index]++;
}
