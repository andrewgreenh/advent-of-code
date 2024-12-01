import getInput from '../lib/getInput';
import { run } from '../lib/run';

const [p1, p2] = getInput(22, 2020)
  .split('\n\n')
  .map((p) => p.split('\n').slice(1).map(Number));

function play(p1: number[], p2: number[], rec = false): [number[], number[]] {
  const [h1, h2] = [new Set<string>(), new Set<string>()];
  while (p1.length > 0 && p2.length > 0) {
    const [k1, k2] = [p1, p2].map((s) => s.join('-'));
    if (h1.size === h1.add(k1).size || h2.size === h2.add(k2).size)
      return [[1], []];
    const [n1, n2] = [p1, p2].map((p) => p.shift()!);

    let w = n1 > n2 ? p1 : p2;
    if (rec && n1 <= p1.length && n2 <= p2.length)
      w = play(p1.slice(0, n1), p2.slice(0, n2), rec)[0].length ? p1 : p2;

    w.push(...(w === p1 ? [n1, n2] : [n2, n1]));
  }
  return [p1, p2];
}

function score(p1: number[], p2: number[]) {
  const w = p1.length > 0 ? p1 : p2;
  return w.reverse().reduce((a, b, i) => (a += b * (i + 1)), 0);
}

run('part 1', () => score(...play([...p1], [...p2])));
run('part 2', () => score(...play([...p1], [...p2], true)));
