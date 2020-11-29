import getInput from '../lib/getInput';
import { chunk } from '../lib/ts-it/chunk';
import { filter } from '../lib/ts-it/filter';
import { map } from '../lib/ts-it/map';
import { numbers } from '../lib/ts-it/numbers';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { set } from '../lib/ts-it/set';

const instructions: {
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
const allIns = Object.values(instructions);
const lines = getInput(16, 2018).split('\n');
const opCodeOptions: Record<any, Set<typeof instructions['']>> = Array(16)
  .fill(1)
  .reduce((agg, _, i) => set(agg, i, new Set(allIns)), {});

const samplesWithMultipleOpCodes = [
  ...pipe(lines.slice(0, 3235))(
    filter((line) => line.trim() !== ''),
    chunk(3),
    filter((chunk) => chunk.length === 3),
    map(([before, instr, after]) => ({
      before: numbers(before),
      instr: numbers(instr),
      after: numbers(after),
    })),
    filter((s) => {
      const badCodes = allIns
        .map((ins) => {
          const regs = [...s.before];
          ins(s.instr.slice(1))(regs);
          return { ins, noMatch: regs.join('-') !== s.after.join('-') };
        })
        .filter((x) => x.noMatch);
      badCodes.forEach((x) => opCodeOptions[s.instr[0]].delete(x.ins));
      return badCodes.length < 14;
    }),
  ),
];
console.log(samplesWithMultipleOpCodes.length);
const opCodeEntries = Object.entries(opCodeOptions);
for (const i of range(0, 16)) {
  opCodeEntries.forEach(([k, s]) => {
    if (s.size !== 1) return;
    opCodeEntries.forEach(([ik, is]) => (ik !== k ? is.delete([...s][0]) : 0));
  });
}
const exampleInstructions = lines.slice(3238).map(numbers);
const regs = [0, 0, 0, 0];
exampleInstructions.forEach(([opCode, ...args]) => {
  [...opCodeOptions[opCode]][0](args)(regs);
});
console.log(regs[0]);
