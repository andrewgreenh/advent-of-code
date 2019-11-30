import { LoopedList } from '../lib/LoopedList';
import { words } from '../lib/ts-it/words';
import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';
import { range } from '../lib/ts-it/range';

let ms = new LoopedList<(pos: [any, any]) => [any, any]>([
  ([x, y]) => [x, y - 1],
  ([x, y]) => [x + 1, y],
  ([x, y]) => [x, y + 1],
  ([x, y]) => [x - 1, y],
]);
let m = 0;
let pos: [any, any] = [0, 0];
let history: string[] = [];
let done = false;
for (let [dir, ...steps] of words(getInput(1, 2016))) {
  m = dir === 'R' ? m + 1 : m - 1;
  let stepCount = +steps.join('').replace(',', '');
  for (let x of range(0, stepCount)) {
    pos = ms.get(m)(pos);
    let s = `${pos[0]}-${pos[1]}`;
    if (!done && history.includes(s)) {
      console.log('FIRST', Math.abs(pos[0] + Math.abs(pos[1])));
      done = true;
    }
    history.push(s);
  }
}
console.log(Math.abs(pos[0] + Math.abs(pos[1])));
