import getInput from '../lib/getInput';
import { cross } from '../lib/ts-it/cross';
import { extent } from '../lib/ts-it/extent';
import { stringToLines } from '../lib/ts-it/lines';
import { range } from '../lib/ts-it/range';

const input = getInput(24, 2020);
const lines = stringToLines(input);
let flipped = new Set<string>();

function getNewCord(
  [x, y]: [x: number, y: number],
  dir: string,
): [number, number] {
  if (dir === 'e') return [x + 1, y];
  if (dir === 'se') return [x + 1, y + 1];
  if (dir === 'sw') return [x, y + 1];
  if (dir === 'w') return [x - 1, y];
  if (dir === 'nw') return [x - 1, y - 1];
  if (dir === 'ne') return [x, y - 1];
  throw new Error('WTF');
}

for (let line of lines) {
  let pos: [number, number] = [0, 0];
  let m = line.match(/(e|se|sw|w|nw|ne)/g)!;
  for (const command of m) pos = getNewCord(pos, command);
  let key = pos.join(' ');
  if (flipped.has(key)) flipped.delete(key);
  else flipped.add(key);
}
console.log([...flipped].filter((c) => !!c).length);

for (let i of range(0, 100)) {
  let newFlipped = new Set<string>();
  const coords = [...flipped].map((s) => s.split(' ').map(Number));
  let [minX = 0, maxX = 0] = extent(coords.map((x) => x[0]));
  let [minY = 0, maxY = 0] = extent(coords.map((x) => x[1]));
  for (let pos of cross(range(minX - 2, maxX + 2), range(minY - 2, maxY + 2))) {
    const n = 'nw,ne,e,se,sw,w'
      .split(',')
      .map((c) => getNewCord(pos, c).join(' '))
      .map((k) => flipped.has(k))
      .filter((v) => !!v).length;
    if (flipped.has(pos.join(' '))) {
      if ([1, 2].includes(n)) newFlipped.add(pos.join(' '));
    } else if (n === 2) newFlipped.add(pos.join(' '));
  }
  flipped = newFlipped;
}
console.log([...flipped].filter((c) => !!c).length);
