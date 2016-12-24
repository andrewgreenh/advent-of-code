const _ = require('lodash');
const grid = require('../getInput')('24', 2016).trim().split('\n').map(l => l.split(''));
const aStar = require('../aStar');
require('../permutate');
require('../loadSlide');

const numbers = {};
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] !== '.' && grid[y][x] !== '#') {
      numbers[grid[y][x]] = [x, y];
    }
  }
}

function getNeighbours([x, y]) {
  const neighbours = [];
  if (x > 0 && grid[y][x-1] !== '#') neighbours.push([x - 1, y]);
  if (x < grid[0].length - 1 && grid[y][x+1] !== '#') neighbours.push([x + 1, y]);
  if (y > 0 && grid[y - 1][x] !== '#') neighbours.push([x, y - 1]);
  if (y < grid.length - 1 && grid[y + 1][x] !== '#') neighbours.push([x, y + 1]);
  return neighbours;
}
// console.log(getNeighbour());

function fromTo(from, to) {
  const config = {
    getNeighbours,
    hashData: ([x, y]) => `${x}-${y}`,
    isEnd: ([x, y]) => x === numbers[to][0] && y === numbers[to][1],
    startNode: [numbers[from][0], numbers[from][1]],
  };
  const result = aStar(config);
  return +result.cost;
}

const maxNumber = +_.max(_.keys(numbers));
const distances = _.times(maxNumber + 1, i => []);
for (let i = 0; i <= maxNumber; i++) {
  for (let j = i; j <= maxNumber; j++) {
    const distance = fromTo(i, j);
    distances[i][j] = distance;
    distances[j][i] = distance;
  }
}

const result = _(_.range(maxNumber)).map(i => i + 1).permute().map(path =>
  _([0, ...path]).slide(2).map(([i, j]) => distances[i][j]).sum()
).value();
const result2 = _(_.range(maxNumber)).map(i => i + 1).permute().map(path =>
  _([0, ...path, 0]).slide(2).map(([i, j]) => distances[i][j]).sum()
).value();

console.log(_.min(result));
console.log(_.min(result2));
