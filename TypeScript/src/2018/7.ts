import { DefaultDict } from '../lib/DefaultDict';
import { Deque } from '../lib/Deque';
import getInput from '../lib/getInput';
import { iterable } from '../lib/ts-it/iterable';
import { stringToLines } from '../lib/ts-it/lines';
import { pipe } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';

const input = getInput(7, 2018);
const lines = iterable(() => pipe(input)(stringToLines));

let dependants = DefaultDict<string[]>(Array);
let deps = DefaultDict<string[]>(Array);
for (const line of lines) {
  const [, a, , , , , , b] = line.split(' ');
  dependants[a].push(b);
  deps[b].push(a);
}

const sortedStarts = Object.keys(dependants)
  .filter((k) => !deps[k].length)
  .sort();

let taken = '';
let todo = new Deque(...sortedStarts);
while (todo.length) {
  const next = todo.shift()!;
  taken += next;
  todo.push(
    ...dependants[next]
      .filter((d) => deps[d].every((c) => taken.includes(c)))
      .sort(),
  );
}
console.log(taken);

const idleWorkers = new Deque(...range(0, 5));
const tasks = DefaultDict<Function[]>(Array);
todo = new Deque(...sortedStarts);
let t = -1;
taken = '';
while (todo.length || idleWorkers.length < 5) {
  t++;
  tasks[t].forEach((w) => w());
  if (idleWorkers.length === 0) continue;
  while (idleWorkers.length > 0 && todo.length > 0) {
    const next = todo.shift()!;
    const w = idleWorkers.shift()!;
    const dt = next.charCodeAt(0) - 'A'.charCodeAt(0) + 61;
    if (!tasks[dt + t]) tasks[dt + t] = [];
    tasks[dt + t].push(() => {
      idleWorkers.push(w);
      taken += next;
      todo.push(
        ...dependants[next].filter((d) =>
          deps[d].every((c) => taken.includes(c)),
        ),
      );
    });
  }
}

console.log(t);
