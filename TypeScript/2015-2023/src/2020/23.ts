import { max } from 'lodash';
import getInput from '../lib/getInput';
import { range } from '../lib/ts-it/range';

const input = getInput(23, 2020).split('').map(Number);

type Node = { v: number; n: Node };

function play(q: number[], rounds: number) {
  const m = max(q)!;

  const lookup = new Map<number, Node>();
  for (let i = q.length - 1; i >= 0; i--)
    lookup.set(q[i], { v: q[i], n: lookup.get(q[i + 1])! });
  lookup.get(q[q.length - 1])!.n = lookup.get(q[0])!;

  let c = lookup.get(q[0])!;

  for (let i of range(0, rounds)) {
    const list = [c.n, c.n.n, c.n.n.n];
    let dest = c.v - 1;
    while (list.some((n) => n.v === dest) || dest < 1)
      dest = dest < 2 ? m : dest - 1;
    let target = lookup.get(dest)!;
    c.n = list[2].n;
    list[2].n = target.n;
    target.n = list[0];
    c = c.n;
  }

  return lookup;
}

let r = '';
for (let c = play([...input], 100).get(1)!.n; c.v !== 1; c = c.n) r += c.v;
console.log(r);

let lookup = play([...input, ...range(10, 1_000_001)], 10_000_000);
console.log(lookup.get(1)!.n.v * lookup.get(1)!.n.n.v);
