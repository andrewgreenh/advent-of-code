import getInput from '../lib/getInput';

let input = getInput(11, 2017);
let moves = input.trim().split(',');

let [x, y, z] = [0, 0, 0];
let maxDist = 0;
const dist = () => (Math.abs(x) + Math.abs(y) + Math.abs(z)) / 2;
let deltas = {
  n: [0, 1, -1],
  ne: [1, 0, -1],
  se: [1, -1, 0],
  s: [0, -1, 1],
  sw: [-1, 0, 1],
  nw: [-1, 1, 0],
};
for (let move of moves) {
  let [dx, dy, dz] = deltas[move];
  x += dx;
  y += dy;
  z += dz;
  if (dist() > maxDist) maxDist = dist();
}

console.log(dist());
console.log(maxDist);
