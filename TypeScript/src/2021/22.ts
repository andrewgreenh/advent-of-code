import getInput from '../lib/getInput';
import { enumerate } from '../lib/ts-it/enumerate';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { isTruthy } from '../lib/utils';

const input = getInput(22, 2021);
const lines = stringToLines(input).map((l) => {
  const [xFrom, xTo, yFrom, yTo, zFrom, zTo] = numbers(l);
  return {
    state: l.split(' ')[0] as 'on' | 'off',
    x: { from: xFrom, to: xTo },
    y: { from: yFrom, to: yTo },
    z: { from: zFrom, to: zTo },
  };
});

type Step = typeof lines[number];
type Cube = Omit<Step, 'state'>;
type Range = Cube['x'];

let count1 = 0;
let count2 = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].state === 'off') continue;
  count1 += sizeWhileIgnoringOthers(lines[i], lines.slice(Math.min(i + 1, 20)));
  count2 += sizeWhileIgnoringOthers(lines[i], lines.slice(i + 1));
}
console.log(count1, count2);

function sizeWhileIgnoringOthers(a: Cube, rest: Cube[]): number {
  let total = len(a.x) * len(a.y) * len(a.z);

  const conflicts = rest
    .map((b) => [join(a.x, b.x), join(a.y, b.y), join(a.z, b.z)] as const)
    .map(([x, z, y]) => x && y && z && { x, y, z })
    .filter(isTruthy);

  for (const [index, item] of enumerate(conflicts)) {
    total -= sizeWhileIgnoringOthers(item, conflicts.slice(index + 1));
  }

  return total;
}

function join(a: Range, b: Range): Range | null {
  const overlapStart = Math.max(a.from, b.from);
  const overlapEnd = Math.min(a.to, b.to);
  if (overlapEnd < overlapStart) return null;
  return { from: overlapStart, to: overlapEnd };
}

function len(range: Range) {
  return Math.abs(range.to - range.from) + 1;
}
