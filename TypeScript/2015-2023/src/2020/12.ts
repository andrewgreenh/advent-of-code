import getInput from '../lib/getInput';
import { abs } from '../lib/math/abs';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';
import { range } from '../lib/ts-it/range';

const input = getInput(12, 2020);
const lines = stringToLines(input);

type Point = [number, number];
let s = {
  p: [0, 0] as Point,
  d: [1, 0] as Point,
};

function drive(toMove: keyof typeof s) {
  for (const line of lines) {
    const c = line[0];
    let n = numbers(line)[0];
    if (c === 'R' || c === 'L') n = n / 90;
    for (let i of range(0, n)) {
      if (c === 'E') s[toMove][0]++;
      if (c === 'S') s[toMove][1]++;
      if (c === 'W') s[toMove][0]--;
      if (c === 'N') s[toMove][1]--;

      if (c === 'L') s.d = [s.d[1], -s.d[0]];
      if (c === 'R') s.d = [-s.d[1], s.d[0]];
      if (c === 'F') s.p = [s.p[0] + s.d[0], s.p[1] + s.d[1]];
    }
  }
}
drive('p');
console.log(abs(s.p[0]) + abs(s.p[1]));

s.p = [0, 0];
s.d = [10, -1];
drive('d');
console.log(abs(s.p[0]) + abs(s.p[1]));
