import _ from 'lodash';
import getInput from '../lib/getInput';
import { enumerate } from '../lib/ts-it/enumerate';
import { flatten } from '../lib/ts-it/flatten';
import { stringToLines } from '../lib/ts-it/lines';
import { sum } from '../lib/ts-it/sum';

type port = [number, number];
type bridge = port[];

let connections: { [key: string]: number[] } = {};
for (let line of stringToLines(getInput(24, 2017))) {
  let [a, b] = line.split('/').map(Number);
  if (!connections[a]) connections[a] = [];
  if (!connections[b]) connections[b] = [];
  connections[a].push(b);
  connections[b].push(a);
}

function* findBridges(path: bridge = [[0, 0]]): IterableIterator<bridge> {
  let last = _.last(path) as number[];
  let options = connections[last[1]];
  for (let nextNum of options) {
    let alreadyVisited =
      !!_.find(path, { 0: nextNum, 1: last[1] }) ||
      !!_.find(path, { 0: last[1], 1: nextNum });
    if (!alreadyVisited) yield* findBridges([...path, [last[1], nextNum]]);
  }
  yield path;
}

let max = 0;
let longest = [[0, 0]];
for (let [index, path] of enumerate(findBridges())) {
  if (index % 10000 === 0) console.log(index);
  let sum = _.sum(_.flatten(path));
  if (sum > max) max = sum;
  if (path.length > longest.length) longest = path;
  if (path.length === longest.length && sum > _.sum(_.flatten(longest)))
    longest = path;
}
console.log(max, sum(flatten(longest)));
