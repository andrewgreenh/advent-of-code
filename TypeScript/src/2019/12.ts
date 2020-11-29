import _ from 'lodash';
import combinations from '../lib/combinations';
import { DefaultDict } from '../lib/DefaultDict';
import getInput from '../lib/getInput';
import { abs } from '../lib/math/abs';
import { lcm } from '../lib/math/lcm';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { map } from '../lib/ts-it/map';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sum } from '../lib/ts-it/sum';
import { toArray } from '../lib/ts-it/toArray';
import { values } from '../lib/utils';

const input = getInput(12, 2019);
const moons = p(input)(
  stringToLines,
  map((x) => numbers(x) as [number, number, number]),
  map(([x, y, z]) => ({ x, y, z, vx: 0, vy: 0, vz: 0 })),
  toArray,
);

const update = () => {
  for (const [a, b] of moonCombos) {
    a.vx += a.x === b.x ? 0 : a.x < b.x ? 1 : -1;
    b.vx += a.x === b.x ? 0 : a.x > b.x ? 1 : -1;
    a.vy += a.y === b.y ? 0 : a.y < b.y ? 1 : -1;
    b.vy += a.y === b.y ? 0 : a.y > b.y ? 1 : -1;
    a.vz += a.z === b.z ? 0 : a.z < b.z ? 1 : -1;
    b.vz += a.z === b.z ? 0 : a.z > b.z ? 1 : -1;
  }
  for (const moon of moons) {
    moon.x += moon.vx;
    moon.y += moon.vy;
    moon.z += moon.vz;
  }
};
const moonCombos = combinations(moons, 2, false);
for (let i of range(0, 1000)) update();

const a = p(moons)(
  map(
    (m) =>
      (abs(m.x) + abs(m.y) + abs(m.z)) * (abs(m.vx) + abs(m.vy) + abs(m.vz)),
  ),
  sum,
);
console.log(a);

const dataByDim = DefaultDict(() => ({
  done: false,
  history: new Set<string>(),
}));
dataByDim.x, dataByDim.y, dataByDim.z;

while (!values(dataByDim).every((x) => x.done)) {
  for (let dim of 'xyz') {
    const data = dataByDim[dim];
    if (data.done) continue;
    const key = _.flatMap(moons, (m) => [m[dim], m['v' + dim]]).join('%');
    if (data.history.has(key)) data.done = true;
    else data.history.add(key);
  }
  update();
}
console.log(
  values(dataByDim)
    .map((d) => d.history.size)
    .reduce(lcm),
);
