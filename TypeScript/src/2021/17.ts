import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(17, 2021);
const [xFrom, xTo, yFrom, yTo] = numbers(input);

let maxHeight = 0;
const velocities = new Set<string>();

for (let x = 1; x < 200; x++) {
  for (let y = -yFrom; y > -200; y--) {
    const height = checkAngle([x, y]);
    if (height !== null) velocities.add(`${x},${y}`);
    if (height && height > maxHeight) maxHeight = height;
  }
}
console.log(maxHeight);
console.log(velocities.size);

function checkAngle([vx, vy]: [number, number]): number | null {
  let [x, y] = [0, 0];
  let maxY = 0;
  while (x <= xTo && y >= yFrom) {
    if (y > maxY) maxY = y;
    if (x >= xFrom && x <= xTo && y >= yFrom && y <= yTo) return maxY;
    x += vx;
    y += vy;
    vx -= Math.sign(vx);
    vy--;
  }
  return null;
}
