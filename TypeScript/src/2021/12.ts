import getInput from '../lib/getInput';
import { countIf } from '../lib/ts-it/countIf';
import { stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';
import { isTruthy } from '../lib/utils';

const input = getInput(12, 2021);
const lines = stringToLines(input);
const map = {} as ObjectOf<string[]>;

for (const line of lines) {
  const [from, to] = line.split('-');
  if (!map[from]) map[from] = [];
  map[from].push(to);
  if (!map[to]) map[to] = [];
  map[to].push(from);
}

function findPaths(
  node: string,
  path: string[],
  revisitAllowed: boolean,
): string[][] {
  if (node === 'end') return [path];
  const neighbours = map[node];

  return neighbours
    .map((n) => {
      const isUpperCase = n.match(/^[A-Z]+$/);
      const count = p(path)(countIf((s) => s === n));

      if (
        !isUpperCase &&
        n !== 'start' &&
        n !== 'end' &&
        count === 1 &&
        revisitAllowed
      ) {
        return findPaths(n, [...path, n], false);
      }

      if (!isUpperCase && count > 0) return null;

      return findPaths(n, [...path, n], revisitAllowed);
    })
    .filter(isTruthy)
    .flat();
}

console.log(findPaths('start', ['start'], false).length);

console.log(findPaths('start', ['start'], true).length);
