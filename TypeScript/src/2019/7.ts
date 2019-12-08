import getInput from '../lib/getInput';
import { IntCodeComputer } from '../lib/intCode';
import permutations from '../lib/permutations';
import { last } from '../lib/ts-it/last';
import { max } from '../lib/ts-it/max';
import { numbers } from '../lib/ts-it/numbers';
import { range } from '../lib/ts-it/range';

const input = getInput(7, 2019);
const ins = numbers(input);

const perms = permutations([...range(0, 5)]);
let maxOut = 0;
for (const perm of perms) {
  const computers = perm.map(phase =>
    new IntCodeComputer([...ins]).addInput(phase),
  );
  computers[0].addInput(0);
  computers.forEach((c, i) => {
    const next = computers[i + 1];
    c.onOutput = n => {
      if (next) next.addInput(n).run();
    };
  });
  computers[0].run();
  const result = last(computers)!.outputs[0];
  if (result > maxOut) maxOut = result;
}
console.log(maxOut);

const perms2 = permutations([...range(5, 10)]);
maxOut = 0;
for (const perm of perms2) {
  const computers = perm.map(phase =>
    new IntCodeComputer([...ins]).addInput(phase),
  );
  computers[0].addInput(0);
  computers.forEach((c, i) => {
    const next = computers[(i + 1) % computers.length];
    c.onOutput = n => {
      if (next) next.addInput(n).run();
    };
  });
  computers[0].run();
  const result = max(last(computers)!.outputs);
  if (result > maxOut) maxOut = result;
}
console.log(maxOut);
